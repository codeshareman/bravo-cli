#!/bin/bash

# $1 is to specify the docker image tagversion,

# Set docker image tag version
tagversion=$1

echo "0. build begin..."
# login harbor:
docker login harbor.tianrang.com -u admin -p Harbor12345

# generate docker image
img_exists=`docker images |grep harbor.tianrang.com/chengdu/lava-ui| awk '{print $2}' |grep $tagversion`
if [ "X$img_exists" != "X" ]; then
  echo "1. will delete old docker image"
	docker rmi harbor.tianrang.com/chengdu/lava-ui:$tagversion
fi

echo "2. build new image..."
docker build -t harbor.tianrang.com/chengdu/lava-ui:$tagversion .

# push image to harbor
echo "3. push image to harbor..."
docker push harbor.tianrang.com/chengdu/lava-ui:$tagversion

# delete image locally
echo "4. delete image locally..."
docker rmi harbor.tianrang.com/chengdu/lava-ui:$tagversion

echo "5. delete dangling images locally..."
docker image prune -f
