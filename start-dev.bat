@echo off

start cmd /k "pushd frontend&&npm start&&exit"
start cmd /k "pushd backend&&nodemon --ignore data/ start&&exit"