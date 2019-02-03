FROM node:10.13.0-alpine
RUN apk update && apk add bash curl tzdata
ENV TZ=Asia/Hong_Kong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app  
COPY package.json .
RUN yarn 
COPY . .  
EXPOSE 3000 
CMD [ "yarn", "start" ]