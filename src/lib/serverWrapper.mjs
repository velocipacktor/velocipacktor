'use strict';

// Imports
// Built-Ins
import { default as Stream } from 'stream';
import { default as child_process } from 'child_process';
import { URL } from 'url';

// External
import { default as clog } from 'ee-log';
import { default as ps } from 'ps-node';

// eslint-disable-next-line node/no-missing-import
import { tinyws } from 'tinyws';
// eslint-disable-next-line node/no-unpublished-import
import { default as why } from 'why-is-node-running';

// Our libs
import { parseBool } from './utils.mjs';

const __filename = new URL('', import.meta.url).pathname;
const __dirname = new URL('.', import.meta.url).pathname; // Will contain trailing slash

export class TrexWrapper {
  constructor(options = {}) {
    this.expressApp = options.expressApp || null;
    this.listen = options.listen || '127.0.0.1'; // Listen address for t-rex ZMQ - most of the time you'll leave this as it is

    this.stdin = new Stream.Readable();
    this.stdin._read = () => {};
    this.stdout = new Stream.Readable();
    this.stdout._read = () => {};

    this.child = null;

    //
    // Handle signals
    process.once('SIGTERM', () => {
      this.stop(); // Stop t-rex server
      setTimeout(() => {
        why(); // For debugging
      }, 10000).unref();
    });
    process.once('SIGINT', () => {
      this.stop(); // Stop t-rex server
      setTimeout(() => {
        why(); // For debugging
      }, 10000).unref();
    });

    //
    // Setup express endpoints
    //
    // Query t-rex status (pid, cpu, mem, uptime, etc (for now just pid))
    this.expressApp.get('/v1/trex-process/status', async (req, res) => {
      res.type('json');
      if (this.child != null) {
        const status = await this.status();
        res.send(JSON.stringify(status, null, 2));
      } else {
        res.send('{ "pid": "null", "status": "stopped" }');
      }
    });

    //
    // Start t-rex
    this.expressApp.post('/v1/trex-process/start', async (req, res) => {
      res.type('json');
      const startParams = {
        tRexPath: req.body.tRexPath,
        args: req.body.args,
        configFile: req.body.configFile,
        mode: req.body.mode,
      };
      let result = await this.start(startParams);
      res.send(JSON.stringify(result));
    });

    //
    // Stop t-rex
    this.expressApp.post('/v1/trex-process/stop', async (req, res) => {
      res.type('json');
      let result = await this.stop();
      res.send(JSON.stringify(result));
    });

    //
    // End of express endpoint setup
  }
  // End constructor
  //

  //
  // Start t-rex
  async start({
    trexVersion = 'v2.99',
    args = [],
    configFile = 'default.yaml',
    mode = 'astf', // Default to astf mode
  } = {}) {
    // Add server mode argument
    switch (mode) {
      case 'astf':
        args.push('--astf');
        break;
      case 'stl':
        args.push('--stl --no-scapy-server');
        break;
      default:
        throw new Error('Unknown t-rex server mode: ' + mode);
    }

    // Add config file argument
    // --iom 0 = silent
    args.push(`--iom 2 -i --cfg /opt/trex/config/${configFile}`);

    // Start process
    this.child = child_process.spawn(`/opt/trex/${trexVersion}/t-rex-64`, args, {
      cwd: `/opt/trex/${trexVersion}/`,
      stdio: 'inherit',
    });

    this.childStatus = 'running';
    this.mode = mode;

    return {
      pid: this.child.pid,
      stdin: this.child.stdin,
      stdout: this.child.stdout,
    };
  }

  // Stop t-rex
  // This call can take quite a while
  // Adjust timeouts accordingly
  async stop() {
    ps.lookup(
      {
        command: '_t-rex-64',
      },
      (err, pids) => {
        if (err) {
          return {
            error: err,
          };
        }
        if (pids.length === 1) {
          console.log(pids);
          process.kill(pids[0].pid, 'SIGTERM');
        } else if (pids.length > 1) {
          return {
            error: 'multiple _t-rex-64 processes found',
            pids: pids,
          };
        } else if (pids.length === 0) {
          return {
            error: 'no _t-rex-64 processes found',
            pids: pids,
          };
        } else {
          return {
            error: 'unknown error',
            pids: pids,
          };
        }
      },
    );
  }

  // Get t-rex status
  async status() {
    if (this.child != null) {
      return {
        pid: this.child.pid,
        status: this.childStatus,
      };
    }
    return {
      pid: null,
      status: this.childStatus,
    };
  }
}
