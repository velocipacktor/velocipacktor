# velocipacktor

Cisco T-Rex Sidecar Process

[![Docker Image CI - Push](https://github.com/velocipacktor/velocipacktor/actions/workflows/docker-image-push-autobuild.yml/badge.svg?branch=main)](https://github.com/velocipacktor/velocipacktor/actions/workflows/docker-image-push-autobuild.yml)

## What is this?

```none
- http/ws api gateway to t-rex
  - takes http calls, forwards them to t-rex as zmq
  - streams stats over websocket connection
```

## What is this not?

Ready to use.

## Why did you build this?

```none
- native t-rex zmq api doesn't have any authentication
  - neither does this, but it'd be easy to add at the proxy level
- browsers can't zmq (well, they can, but the server needs to be compiled with websocket enabled)
- Existing documentation/examples/etc for t-rex python api are convoluted and confusing
```

## How do I use this?

```none
- Setup a box with:
  - 3 interfaces ( 2 of which supported by t-rex/dpdk )
  - 4 cores (unknown as to if clocks vs cores is better, experiment to find the best results on your setup)
  - 8 gb of ram
  - Docker
  - Kernel headers (t-rex needs to build and inject a module)
```

We like using a minimal debian buster netinst, but anything modern should work.

For now you need to manually download t-rex. In the future this will be automated.

Download it to `/opt/trex/v2.99/`

Run `dpdk_setup_ports.py` directly on the host and put the output in `/opt/trex/config`

Clone this repo to `/opt/velocipacktor`

Run `docker compose build && docker compose up -d && docker compose logs -f`
