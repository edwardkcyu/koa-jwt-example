## --- Single stage --- ##
FROM node:10.13.0-alpine
RUN apk update && apk add bash curl tzdata
ENV TZ=Asia/Hong_Kong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app  
COPY . .
RUN yarn 
RUN yarn test --silent 
EXPOSE 6010 
CMD [ "yarn", "start" ]

## --- Multi-stage --- ##
# FROM node:10.13.0-alpine as builder
# WORKDIR /app  
# COPY . .
# RUN yarn 
# RUN yarn test --silent 

# FROM node:10.13.0-alpine
# RUN apk update && apk add bash curl tzdata
# ENV TZ=Asia/Hong_Kong
# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
# WORKDIR /app
# COPY --from=builder /app /app
# EXPOSE 6010 
# CMD [ "yarn", "start" ]

