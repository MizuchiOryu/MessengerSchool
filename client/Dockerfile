FROM node

WORKDIR /usr/src/app/client

COPY package*.json ./

RUN npm install && chown node:node node_modules

EXPOSE 3000

CMD ["npm", "run", "dev"]
