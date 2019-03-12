FROM node:10.13.0-alpine
RUN apk update && apk add bash curl tzdata
ENV TZ=Asia/Hong_Kong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app  
COPY package.json yarn.lock ./
RUN yarn 
COPY . .
RUN yarn test --silent 
EXPOSE 6020 
CMD [ "yarn", "start" ]

