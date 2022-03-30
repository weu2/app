@echo off

REM if exist backend/certs/selfsigned.cert (
REM     if exist backend/certs/selfsigned.pem (
REM         REM set HTTPS=true
REM         rem set SSL_CRT_FILE=./backend/certs/selfsigned.cert 
REM         rem set SSL_KEY_FILE=./backend/certs/selfsigned.pem
REM     )
REM )

start cmd /k "pushd frontend & npm start & exit"
start cmd /k "pushd backend & nodemon --ignore data/ start & exit"