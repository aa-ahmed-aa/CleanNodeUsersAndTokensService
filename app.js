'use strict';

const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/database');
const api = require('./src/api');

mongoose.connect(config.database, { useNewUrlParser: true });
const db = mongoose.connection;

//Check connection & any db errors
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', err => console.log(err));

//Init App on port 3000
const app = express();
const port = process.env.PORT || 3000;

//Router list
api(app);

//Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}.....`);
});
