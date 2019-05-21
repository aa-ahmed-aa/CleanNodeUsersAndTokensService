'use strict';

const mongoose = require('mongoose');
const User = require('../models/User');
const userSchema = mongoose.model('User', User);

class UsersRepository {

    listAll() {
        return userSchema.find({});
    }

    create(user) {
        const newUser = userSchema(user);
        return userSchema.create(newUser);
    }
    
}

module.exports = UsersRepository;
