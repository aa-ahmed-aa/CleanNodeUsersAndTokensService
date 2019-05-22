'use strict';

const mongoose = require('mongoose');
const Token = require('./Token');
const tokenSchema = mongoose.model('Token', Token);

class TokensRepository {

    listAll() {
        return tokenSchema.find({});
    }

    create(token) {
        const newToken = tokenSchema(token);
        return tokenSchema.create(newToken);
    }
    
}

module.exports = TokensRepository;
