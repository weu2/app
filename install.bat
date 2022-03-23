@echo off

pushd backend
call npm install
popd

pushd frontend
call npm install
popd