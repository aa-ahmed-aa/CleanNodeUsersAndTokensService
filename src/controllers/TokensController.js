'use strict';

const TokensRepository = require('../repositories/TokensRepository');
const tokenRepository = new TokensRepository();

class TokenController {

    listAllTokens(req, res) {
        tokenRepository.listAll(req, res).then(response => this.respond(res, 200, response));
    }

    createAToken(req, res) {
        const newToken = this.getTokenObject(req);

        const errors = this.validateFields(req);

        if(errors) {
            this.respond(res, 200, errors, true);
        }
        
        tokenRepository.create(newToken).then(response => {
            const tokenObject = {
                _id: response._id,
                auth_token: response.auth_token,
                email: response.email,
                create_at: response.created_at,
            };

            this.respond(res, 200, tokenObject);
        });     
    }

    getTokenObject(req) {
        return {
            email: req.body.email,
            password: req.body.password,
        };
    }

    respond(res, code, data, err = false) {
        if(err) {
            const errorsObj = { status: 400, errors: data };
            res.status(code).send(errorsObj);
        } else {
            const response = { status: 201, response: data };
            res.status(201).send(response);
        }
    }

    validateFields(req) {
        req.checkBody('email', 'blank').notEmpty();
        req.checkBody('password', 'blank').notEmpty();

        return req.validationErrors();
    }
    
}

module.exports = TokenController;
