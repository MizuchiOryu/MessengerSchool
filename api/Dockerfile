FROM node

WORKDIR /usr/src/app/api

COPY package*.json ./

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "dev"]
