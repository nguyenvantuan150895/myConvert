docker build -t convert:dev .
DATE=`date +%Y-%m-%d-%H-%M-%S`
GIT_COMMIT=`git rev-parse --short HEAD`
echo $GIT_COMMIT
SHORT_VER="sokujob/core:convert-doc-service-dev"
FULL_VER="sokujob/core:convert-doc-service-dev$GIT_COMMIT-$DATE"
docker tag convert:dev $SHORT_VER
echo "Pushing:  $SHORT_VER"
docker push $SHORT_VER
docker tag convert:dev $FULL_VER
echo "Pushing:  $FULL_VER"
docker push $FULL_VER