FROM node:lts-alpine

RUN apk update
RUN apk add docker

WORKDIR /app

EXPOSE 3000

COPY package.json package.json

COPY dist ./dist

ENTRYPOINT [ "node", "." ]