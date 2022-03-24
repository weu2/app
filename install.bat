@echo off

call npm install -g nodemon

pushd backend
call npm install
popd

pushd frontend
call npm install
popd