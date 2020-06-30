
FROM node:lts-alpine as builder
ARG env=prod
ENV BUILD_DIR /workspace
WORKDIR $BUILD_DIR
COPY package.json yarn.lock $BUILD_DIR/
RUN yarn 
COPY . $BUILD_DIR/
RUN yarn run build:${env}


FROM node:lts-alpine
RUN npm install -g serve
COPY --from=builder /workspace/build /workspace
EXPOSE 8081/tcp
ENTRYPOINT ["serve", "-s", "/workspace", "-l"]
CMD [ "8081" ]
