@echo off

pushd frontend
    call npm run build
popd

pushd backend
    mkdir certs
popd

pushd backend\certs
    openssl req -nodes -new -x509 -keyout selfsigned.pem -out selfsigned.cert
popd
