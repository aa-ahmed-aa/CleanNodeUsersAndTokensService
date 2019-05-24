'use strict';

const express = require('express');
const connection = require('./connection');
const api = require('./src/api');

connection();

//Init App on port 3000
const app = express();
const port = process.env.PORT || 3000;

//Router list
api(app);

//Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}.....`);
});
