FROM node:lts-alpine

WORKDIR /oghmabot
COPY . .
RUN apk add --no-cache git 
RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
