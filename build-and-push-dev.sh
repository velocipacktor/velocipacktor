#!/usr/bin/env bash

set -exu

docker build . --file Dockerfile --tag ghcr.io/velocipacktor/velocipacktor:latest-dev
docker push ghcr.io/velocipacktor/velocipacktor:latest-dev
