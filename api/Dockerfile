FROM node:16-alpine as build

WORKDIR /product-service

COPY /product-service/package*.json ./

RUN npm install 

COPY /product-service/. .

CMD [ "npm", "start" ]