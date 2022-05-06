cd "$(dirname "$0")/frontend"
npm run build
cd ..

cd "$(dirname "$0")/backend"
mkdir certs

cd "certs"
openssl req -nodes -new -x509 -keyout selfsigned.pem -out selfsigned.cert