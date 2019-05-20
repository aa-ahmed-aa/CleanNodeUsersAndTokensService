'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const User = require('../models/UserSchema');

class UsersRepository {
    
    constructor() {
        this.model = mongoose.model('User', User);
    }

    listAll() {
        return this.model.find({});
    }

    create(user) {
        if(!_.isPlainObject(user)) {
            throw new Error('missing user object');
        }
        
        return this.model.create(user);
    }
    
}

module.exports = UsersRepository;
