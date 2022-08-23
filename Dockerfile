FROM docker.io/node:16-alpine

COPY /src /dist

ENV NODE_ENV=development

RUN set -exu \
  && cd /dist \
  && npm install

WORKDIR /dist
ENTRYPOINT ["node", "--trace-warnings", "main.mjs"]
