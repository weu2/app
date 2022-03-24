# Welcome to WeU

**Make sure you're on the [most recent version](https://github.com/weu2/app/tree/main) of this repository before making any changes.**
<br>
**If you think your code is going to conflict, please open a [pull request](https://github.com/weu2/app/pulls) first.**

## Things to install
- [GitHub Desktop](https://desktop.github.com/), for downloading or uploading changes here.
- [Node version >16](https://nodejs.org/en/download/), for running the servers.

## To start the development servers
**Do not use this as the production server**

### Windows
1. Navigate to the `app/` folder.
2. To set up the environment, run via Command Prompt or open `install`.
3. To start the frontend and backend, run via Command Prompt or open `start-dev`.

### Mac
1. Navigate to the `app/` folder.
2. To set up the environment, run `sudo chmod u+x install.command` in a terminal then open `install.command`.
3. To start the frontend and backend, run `sudo chmod u+x start-dev.command` in a terminal then open `start-dev.command`.

### Manually (Not Recommended)
1. Navigate to the `app/`.
2. Run `npm install` in both the `frontend/` and `backend/` folders.
3. Run `npm install -g nodemon`.
4. Run `npm start` in the `frontend/` folder.
5. Run `nodemon start` in the `backend/` folder.
