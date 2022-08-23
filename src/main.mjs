'use strict';

// Imports

// External
import { default as express } from 'express';
import { default as clog } from 'ee-log';

// eslint-disable-next-line node/no-unpublished-import
import { default as why } from 'why-is-node-running';

// Our libs
import { TrexWrapper } from './lib/serverWrapper.mjs';
import { logo } from './lib/utils.mjs';

// Check if firstrun
// - Prompt for accept / instruct user on how to accept t-rex license with envvars
// - Download t-rex v2.99 & untar it
// - Prompt user to either provide t-rex-64 config or run interactively to create config
// - [Docker] Save it to a volume mount
// - [Docker] Save/Load config from a different volume mount

/*

/v1/trex-control/start?mode=astf&cores=4&config=trex-layer2.yaml

/v1/astf/get_profile_list GET -> {
  // profiles
}

// Enable stats streaming websocket
/v1/stats/get_global_stats?poll=100 (ms) POST 
ws://v1/stats/get_global_stats -> {
  // global stats
}

*/

//
// Of vital importance
console.log(logo);

//
// Setup express
var expressApp = express();
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
const expressServer = expressApp.listen(3000);

//
// Setup T-Rex wrapper and associated endpoints
const trexWrapper = new TrexWrapper({
  expressApp: expressApp,
});

//
// Handle signals
// The trexWrapper class catches sigterm/int for us and cleans itself up
process.once('SIGTERM', () => {
  console.error('SIGTERM');
  expressServer.close();
  setTimeout(() => {
    why(); // For debugging
  }, 10000).unref();
});
process.once('SIGINT', () => {
  console.error('SIGINT');
  expressServer.close();
  setTimeout(() => {
    why(); // For debugging
  }, 10000).unref();
});
