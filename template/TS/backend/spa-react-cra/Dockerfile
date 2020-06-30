
FROM node:lts-alpine as builder
ENV BUILD_DIR /workspace
WORKDIR $BUILD_DIR
COPY . $BUILD_DIR/
RUN  yarn && yarn run build 


FROM node:lts-alpine
RUN npm install -g serve
COPY --from=builder /workspace/build /workspace
EXPOSE 8081/tcp
ENTRYPOINT ["serve", "-s", "/workspace", "-l"]
CMD [ "8081" ]


