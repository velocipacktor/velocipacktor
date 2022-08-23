FROM docker.io/node:16-alpine

COPY /src /opt/velocipacktor

ENV NODE_ENV=development

RUN set -exu \
  && cd /opt/velocipacktor \
  && npm install

WORKDIR /opt/velocipacktor
ENTRYPOINT ["node", "--trace-warnings", "main.mjs"]
