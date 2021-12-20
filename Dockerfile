FROM node:16-alpine as base

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/appWORKDIR /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm config set unsafe-perm true

RUN npm install -g yarn
RUN npm install -g typescript

USER node
RUN yarn

COPY --chown=node:node . .
RUN yarn build


FROM node:16-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN yarn
COPY --from=builder /home/node/app/build ./build
COPY --chown=node:node .env .
COPY --chown=node:node  /config ./config
COPY --chown=node:node  /public ./public

EXPOSE 3000
CMD [ "yarn", "start:dev" ]
