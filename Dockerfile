FROM docker.io/node:16-bullseye-slim

RUN mkdir -p /opt/velocipacktor

RUN set -exu \
  && apt update \
  && apt install -yq \
    linux-headers-amd64 \
    bash \
    grep \
    pciutils \
    python3 \
    python3-distutils \
    iproute2 \
    procps \
    librte-net-memif21 \
    dpdk \
    dpdk-dev \
    libdpdk-dev \
    gcc \
    g++ \
    git \
    zlib1g-dev \
    kmod \
    strace \
    wget \
    make \
    build-essential

COPY /src /opt/velocipacktor

ENV NODE_ENV=development

RUN set -exu \
  && cd /opt/velocipacktor \
  && npm install

WORKDIR /opt/velocipacktor
ENTRYPOINT ["node", "--trace-warnings", "main.mjs"]
