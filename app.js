'use strict';

const portNumber = require('./config/appConfig').port;
const connection = require('./connection');
const express = require('express');
const api = require('./src/api');

connection();

//Init App on port 3000
const app = express();
const port = process.env.PORT || portNumber;

//Router list
api(app);

//Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}.....`);
});

module.exports = app;
