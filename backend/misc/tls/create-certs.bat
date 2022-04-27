@echo off

REM you shouldnt have to run this file, this is here just in case

openssl req -new -x509 -keyout local.key -out local.pem -days 365 -nodes