#!/usr/bin/env bash

cd testbed-viz/ 
mvn package
echo 'Copying war to docker container...'
docker cp dist/taco.war taco-web-1:/usr/local/tomcat/webapps
cd ../

cd front-end/
npm run $1
echo 'Copying frontend to docker container...'
docker cp dist/front-end/. taco-web-1:/usr/local/tomcat/webapps/taco/
cd ../

echo 'All done!'
