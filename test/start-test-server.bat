@echo off

if not exist hostlocal.pem (
    openssl req -new -x509 -keyout server.pem -out server.pem -days 365 -nodes
)
pushd ..\frontend\build
python ..\..\test\https-server.py
popd