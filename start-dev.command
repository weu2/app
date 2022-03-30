osascript -e "tell app \"Terminal\"
	do script \"cd "$(dirname "$0")/frontend" && npm start\"
	do script \"cd "$(dirname "$0")/backend" && nodemon --ignore data/ start\"
end tell"