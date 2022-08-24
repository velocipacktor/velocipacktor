'use strict';

import { writeFileSync } from 'fs';

export function parseBool(string) {
  if (string) {
    switch (string.toLowerCase().trim()) {
      case 'true':
      case 'yes':
      case '1':
        return true;

      case 'false':
      case 'no':
      case '0':
      case '':
      case null:
        return false;

      default:
        return Boolean(string);
    }
  } else {
    return false;
  }
}

export function writeDefaultTrexConfig(location) {
  const defaultConfig = `
  
  - version: 2
  interfaces: ["--vdev=net_memif0,socket=/run/vpp/memif.sock,role=slave,id=0",
               "--vdev=net_memif1,socket=/run/vpp/memif.sock,role=slave,id=1"]
  port_info:
      - dest_mac: a0:36:9f:8c:9e:9a # MAC OF LOOPBACK TO IT'S DUAL INTERFACE
        src_mac:  a0:36:9f:8c:9e:98
      - dest_mac: a0:36:9f:8c:9e:98 # MAC OF LOOPBACK TO IT'S DUAL INTERFACE
        src_mac:  a0:36:9f:8c:9e:9a

  platform:
      master_thread_id: 2
      latency_thread_id: 3
      dual_if:
        - socket: 0
          threads: [0,1]

  `;

  writeFileSync(location, defaultConfig);
}

export const logo = `
_  _ ____ _    ____ ____ _ ___  ____ ____ _  _ ___ ____ ____ 
|  | |___ |    |  | |    | |__] |__| |    |_/   |  |  | |__/ 
 \\/  |___ |___ |__| |___ | |    |  | |___ | \\_  |  |__| |  \\ 
                                                             
`;
