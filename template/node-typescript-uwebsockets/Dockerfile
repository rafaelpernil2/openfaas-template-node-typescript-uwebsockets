FROM --platform=${TARGETPLATFORM:-linux/amd64} ghcr.io/openfaas/of-watchdog:0.8.4 as watchdog
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:18-alpine as ship

ARG TARGETPLATFORM
ARG BUILDPLATFORM

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

RUN apk --no-cache add curl ca-certificates \
    && addgroup -S app && adduser -S -g app app

# Fix uWebSockets.js compatibility with Alpine Linux
RUN apk add --no-cache gcompat

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

RUN chmod 777 /tmp

USER app

RUN mkdir -p /home/app/function

# Wrapper/boot-strapper
WORKDIR /home/app
COPY --chown=app:app package*.json .
COPY --chown=app:app package.json ./
COPY --chown=app:app tsconfig.json ./

# This ordering means the npm installation is cached for the outer function handler.
RUN npm i

# Copy outer function handler
COPY --chown=app:app index.ts ./
RUN npm run build


WORKDIR /home/app/function
COPY --chown=app:app function/*.json ../dist/
WORKDIR /home/app/dist
RUN npm i --omit=dev



# COPY function node packages and install, adding this as a separate
# entry allows caching of npm install

# COPY function files and folders
WORKDIR /home/app/function
COPY --chown=app:app function/ ./
COPY --chown=app:app function/*.json ./

RUN npm i
RUN npm run build
# Run any tests that may be available
RUN npm test

# Set correct permissions to use non root user
WORKDIR /home/app/

ENV cgi_headers="true"
ENV fprocess="node ./dist/index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"

ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"

ENV prefix_logs="false"

HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

CMD ["fwatchdog"]
