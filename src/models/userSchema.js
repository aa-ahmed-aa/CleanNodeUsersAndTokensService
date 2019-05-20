'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: 'Please enter your first name', 
    },

    last_name: {
        type: String,
        required: 'Please enter your last name', 
    },

    country_code: {
        type: String,
        required: 'Please enter your country code', 
    },

    phone_number: {
        type: String,
        // unique: true,
        validate: {
            validator: phone => /^\+?[1-9]\d{1,14}$/.test(phone),
        },
        required: true,
    },

    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
    },

    birthdate: {
        type: Date,
    },

    avatar: {
        type: String,
    },

    email: {
        type: String,
        // unique: true,
        validate: {
            validator: email =>
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email),
        },
        required: [true, 'Please enter your phone number '],
    },

    created_at: {
        type: Date,
        default: Date.now,
    },

    updated_at: {
        type: Date,
    },
});

module.exports = UserSchema;
