# Clean node project

## Stack 
mongodb and nodejs

## setup
- install Node & mongodb.
- you need to Open & Modify the database url in `./config/database.js` url param by default url for mongodb is `mongodb://localhost:27017/`.
- run npm install to install the packages
- see the commands description to check more fun stuff about this task 

```
./config/database.js
module.exports = {
    url: 'mongodb://localhost:27017/',
    databaseName: 'database_name',
    testDatabaseName: 'database_Test_name',
    secret: 'yoursecret',
};

```

## Commands

> npm install 
to install the packages

> npm run start
to start the server

> npm run lint
if you dont have eslint integrated with your editor then use this command to run eslint-rules

> npm run test
to run the Units

> npm run coverage
to run istanbul-nyc code coverage and see how much the testcases covers the code.

## Requests
you DO NOT need to write the requests body over and over again here is the json postman requests (titled by functionality) 
https://www.getpostman.com/collections/d5a5df68b233ed4eddf6
