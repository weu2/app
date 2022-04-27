@echo off

REM if not exist hostlocal.pem (
openssl req -new -x509 -keyout local.key -out local.pem -days 365 -nodes
REM )
REM pushd ..\frontend\build
REM python ..\..\test\https-server.py
REM popd