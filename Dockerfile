FROM node:lts-alpine

WORKDIR /oghmabot
COPY . .
EXPOSE 80
EXPOSE 443
RUN apk add --no-cache git 
RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
