'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;

const Token = new Schema({

    email: {
        type: String,
        validate: {
            validator: email => 
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email),
            message: 'invalid',
        },
        required: 'blank',
    },

    password: {
        type: String,
        required: 'blank', 
    },

    auth_token: {
        type: String,
        default: () => generateUniqueToken(),
    },

    created_at: {
        type: Date,
        default: Date.now,
    },

    updated_at: {
        type: Date,
    },
});

const generateUniqueToken = () => crypto.randomBytes(20).toString('hex');

Token.pre('save', function(next) {
    const token = this;
    
    if(!token.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => bcrypt.hash(token.password, salt))
        .then(hash => {
            token.password = hash;

            return next();
        });
});

Token.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

Token.methods.generateUniqueToken = generateUniqueToken();

Token.plugin(uniqueValidator);

module.exports = Token;
