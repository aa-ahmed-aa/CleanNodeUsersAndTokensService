'use strict';

const express = require('express');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const config = require('./config/database');

mongoose.connect(config.database);
const db = mongoose.connection;

//Check connection
db.once('open', () => console.log('Connected to MongoDB'));

//Check for db errors
db.on('error', err => console.log(err));

//Init App on port 3000
const app = express();
const port = process.env.PORT || 3000;

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: (param, msg, value) => {
        const namespace = param.split('.');
        const root = namespace.shift();
        let formParam = root;

        while(namespace.length) {
            formParam += `[${namespace.shift()}]`;
        }
        return {
            param: formParam,
            msg,
            value, 
        };
    },
}));

//Router list
app.get('/', (req, res) =>  res.send('Hello, World'));

//Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}.....`);
});
