osascript -e "tell app \"Terminal\"
	do script \"cd $(dirname "$0")/frontend && npm start\"
	do script \"cd $(dirname "$0")/backend && nodemon start\"
end tell"