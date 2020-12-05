FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json  ./

RUN npm install -y

COPY .  .

EXPOSE 4200 

CMD [ "npm" , "start" ]