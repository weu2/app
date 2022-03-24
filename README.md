# Welcome to WeU

**Make sure you're on the [most recent version](https://github.com/weu2/app/tree/main) of the repository before making any changes.**
<br>
**If you think your code is going to conflict, please open a [pull request](https://github.com/weu2/app/pulls) first.**

Make sure [node version >16](https://nodejs.org/en/download/) is installed before trying the steps below.

## To start the development servers
**Do not use this as the production server**

### Windows
1. To set up the environment, open `install.bat`.
2. To start the frontend and backend, open `start-dev.bat`.

### Mac
1. Navigate to the `app/` folder using `cd`.
2. To set up the environment, run `sudo chmod u+x install.command` then open `install.command`.
3. To start the frontend and backend, run `sudo chmod u+x start-dev.command` then open `start-dev.command`.

### Manually (Not Recommended)
1. Navigate to the `app/` folder using `cd`.
2. Run `npm install` in both the `frontend/` and `backend/` folders.
3. Run `npm install -g nodemon`.
4. Run `npm start` in the `frontend/` folder.
5. Run `nodemon start` in the `backend/` folder.
