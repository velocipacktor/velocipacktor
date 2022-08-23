# velocipacktor
Cisco T-Rex Sidecar Process

[![Docker Image CI - Push](https://github.com/velocipacktor/velocipacktor/actions/workflows/docker-image-push-autobuild.yml/badge.svg?branch=main)](https://github.com/velocipacktor/velocipacktor/actions/workflows/docker-image-push-autobuild.yml)

## What is this?
```
- http/ws api gateway to t-rex
  - takes http calls, forwards them to t-rex as zmq
  - streams stats over websocket connection
```

## What is this not?
Ready to use.

## Why did you build this?
```
- native t-rex zmq api doesn't have any authentication
  - neither does this, but it'd be easy to add at the proxy level
- browsers can't zmq (well, they can, but the server needs to be compiled with websocket enabled)
- Existing documentation/examples/etc for t-rex python api are convoluted and confusing
```
