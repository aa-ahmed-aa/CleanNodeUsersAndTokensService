'use strict';

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const _ = require('lodash');
const expressValidator = require('express-validator');
const config = require('./config/database');

const acceptedExtensions = require('./config/images').acceptedExtensions;

mongoose.connect(config.database, { useNewUrlParser: true });
const db = mongoose.connection;

//Check connection & any db errors
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', err => console.log(err));

//Init App on port 3000
const app = express();
const port = process.env.PORT || 3000;

//Express Validator Middleware
app.use(expressValidator({
    errorFormatter: (param, msg) => {
        return {
            [param]: {
                error: msg,
            },
        };
    },
    customValidators: {
        isImage: (value, filename) => {
            const extension = (path.extname(filename)).toLowerCase();
            if(_.includes(acceptedExtensions, extension)) {
                return extension;
            }
            return false;
        },
    },
    
}));

//Router list
const routes = require('./src/routes/UsersRoutes');
routes(app);

app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` });
});

//Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}.....`);
});
