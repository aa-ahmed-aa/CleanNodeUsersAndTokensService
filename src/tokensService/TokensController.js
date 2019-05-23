'use strict';

const TokensRepository = require('./TokensRepository');
const tokenRepository = new TokensRepository();
const _ = require('lodash');

const respond = (res, code, data) => {
    if(data.name === 'ValidationError') {
        data = _.mapValues(data.errors, object => {
            return { error: object.message };
        });
        const errorsObj = { status: code, errors: data };
        return res.status(code).send(errorsObj);
    }

    const response = { status: code, response: data };
    return res.status(code).send(response);
};

class TokenController {

    listAllTokens(req, res) {
        tokenRepository.listAll(req, res).then(response => respond(res, 200, response));
    }

    createAToken(req, res) {
        const promise = tokenRepository.create(this.getTokenObject(req));
        
        promise.then(response => {
            const tokenObject = {
                _id: response._id,
                auth_token: response.auth_token,
                email: response.email,
                create_at: response.created_at,
            };
            respond(res, 201, tokenObject);
        }).catch(err => respond(res, 400, err));     
    }

    getTokenObject(req) {
        return {
            email: req.body.email,
            password: req.body.password,
        };
    }

}

module.exports = TokenController;
