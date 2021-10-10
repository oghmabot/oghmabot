FROM node:lts-alpine

ARG NODE_AUTH_TOKEN

WORKDIR /oghmabot
COPY . .
ENV GPR_TOKEN=${NODE_AUTH_TOKEN}
EXPOSE 80
EXPOSE 443
RUN apk add --no-cache git
RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
