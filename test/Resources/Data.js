'use strict';

const mongoose = require('mongoose');
const Token = require('../../src/tokensService/Token');
const tokenSchema = mongoose.model('Token', Token);

module.exports = {
    user: {
        first_name: 'Ahmed',
        last_name: 'Khaled',
        country_code: 'EG',
        phone_number: '+201119501276',
        gender: 'male',
        birthdate: '1995-9-16',
        avatar: 'avatar.png',
        email: 'ahmedkhaled36@hotmail.com',
        create_at: Date.now(),
    },
    
    token: {
        auth_token: tokenSchema.generateUniqueToken,
        email: 'ahmedkhaled36@hotmail.com',
        create_at: Date.now(),
    },

    status: '{ "name": "active", "description":"user is active now" }',
};
