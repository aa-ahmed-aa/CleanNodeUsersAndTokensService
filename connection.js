'user strict';

const database = require('./config/database');
const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect(database.url + database.databaseName, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });
    
    const db = mongoose.connection;
    
    //Check connection & any db errors
    db.once('open', () => console.log('Connected to MongoDB'));
    db.on('error', err => console.log(err));

    return mongoose;
};
