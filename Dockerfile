FROM node:lts-alpine

WORKDIR /src
COPY package.json .
RUN npm install
RUN npm run build
COPY . .

CMD [ "npm", "start" ]
