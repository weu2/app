sudo npm install -g nodemon

cd $(dirname "$0")/backend
sudo npm install
cd ..

cd $(dirname "$0")/frontend
sudo npm install