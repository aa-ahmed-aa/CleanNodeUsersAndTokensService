'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const config = require('./config/database');

mongoose.connect(config.database, { useNewUrlParser: true });
const db = mongoose.connection;

//Check connection & any db errors
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', err => console.log(err));

//Init App on port 3000
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
const routes = require('./src/routes/UsersRoutes');
routes(app);

app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` });
});

//Start Server
app.listen(port, () => {
    console.log(`Server started on port ${port}.....`);
});
