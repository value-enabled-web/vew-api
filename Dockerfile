FROM node:18

LABEL org.opencontainers.image.source=https://github.com/seetee-io/vew-api
LABEL org.opencontainers.image.description="VEW API"

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "src/app.js" ]
