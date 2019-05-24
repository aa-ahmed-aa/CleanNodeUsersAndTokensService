'use strict';

const TokenRepository = require('../tokensService/TokensRepository');
const UserRepository = require('./UsersRepository');
const tokenRepository = new TokenRepository();
const userRepository = new UserRepository();
const _ = require('lodash');

/**
 * Create response and handling error parsing if there is any validation errors
 * @param res Response object 
 * @param code the status code to set in the response header
 * @param data the data to be parsed in the response
 */
const respond = (res, code, data) => {
    if(data.name === 'ValidationError') {
        // return res.status(code).send(data.message);
        data = _.mapValues(data.errors, object => {
            return { error: object.message };
        });
        const errorsObj = { status: code, errors: data };
        return res.status(code).send(errorsObj);
    }

    const response = { status: code, response: data };
    return res.status(code).send(response);
};

class UserController {

    listAllUsers(req, res) {
        const promise = userRepository.listAll();
        promise.then(response => respond(res, 200, response));
    }

    createAUser(req, res) {
        const promise = userRepository.create(this.getUserObjectFromRequest(req));
        
        promise.then(data => respond(res, 201, data))
            .catch(err => respond(res, 400, err));
    }

    assignUserStatue(req, res) {
        /**
         * ToDo
         * - Search for auth_token in tokens
         *      + if not found return "unauthorized access"
         * - Search for email in users
         *      + if not found return "bad request"
         * - Link status object to users and return user object
         */
        
        if(_.isEmpty(req.body.status))
            return respond(res, 400, 'Bad Request');

        const tokenPromise = tokenRepository.findOneByToken(req.body.auth_token);
        tokenPromise.then(token => {
            if(_.isNil(token))
                return respond(res, 401, 'Unauthorized access');

            const userPromise = userRepository.findOneByPhoneNumber(req.body.phone_number);
            userPromise.then(user => {
                if(_.isNil(user))
                    return respond(res, 400, 'Bad Request');
    
                const userAfterStatus = userRepository.assignStatusToUser(req.body.status, user._id);
                userAfterStatus.then(statusUser => respond(res, 400, statusUser));
            });
        });
    }

    getUserObjectFromRequest(req) {
        return {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            country_code: req.body.country_code,
            phone_number: req.body.phone_number,
            gender: req.body.gender,
            birthdate: req.body.birthdate,
            avatar: _.has(req.file, 'filename') ? req.file.filename : '',
            email: req.body.email,
        };
    }
    
}

module.exports = UserController;
