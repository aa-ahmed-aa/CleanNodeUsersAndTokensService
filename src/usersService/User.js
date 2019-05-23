'use strict';

const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const Schema = mongoose.Schema;

const acceptedExtensions = require('../../config/images').acceptedExtensions;

const User = new Schema({
    first_name: {
        type: String,
        required: 'blank', 
    },

    last_name: {
        type: String,
        required: 'blank', 
    },

    country_code: {
        type: String,
        required: 'blank', 
    },

    phone_number: {
        type: String,
        validate: [
            {
                validator: phone => /^\+?[1-9]\d{1,14}$/.test(phone),
                message: 'not_a_valid_phone_number',
            },
        ],
        minlength: [10, 'too_short'],
        maxlength: [15, 'too_long'],
        required: 'blank',
        unique: 'taken',
    },

    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'other'],
            message: 'inclusion',
        },
    },

    birthdate: {
        type: Date,
        max: [Date.now, 'in_the_future'],
        required: 'blank',
    },

    avatar: {
        type: String,
        validate: {
            validator: fileName => {
                if(_.indexOf(acceptedExtensions, path.extname(fileName)) >= 0)
                    return true;
                
                fs.unlinkSync(`./public/images/users/${fileName}`);
                return false;   
            },
            message: 'invalid_content_type',
        },
        required: 'blank',
    },

    email: {
        type: String,
        unique: 'taken',
        validate: [
            {
                validator: email => 
                    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email),
                message: 'invalid',
            },
        ],
    },

    created_at: {
        type: Date,
        default: Date.now,
    },

    updated_at: {
        type: Date,
    },
});

User.plugin(uniqueValidator);

module.exports = User;
