FROM node:12

WORKDIR /api

COPY package*.json .

RUN npm install

COPY . .

CMD ["npm", "run", "devStart"]