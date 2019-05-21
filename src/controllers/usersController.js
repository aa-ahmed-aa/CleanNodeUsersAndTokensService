'use strict';

const _ = require('lodash');
const UserRepository = require('../repositories/UsersRepository');
const userRepository = new UserRepository();

const HTTP_ERRORS = {
    INVALID_DATA: 'users.invalid_data',
    NOT_EXISTING: 'users.not_existing',
    missingId: id => `users.missing_${id}`,
    internal: code => `users.internal_server_error:${code}`,
};

const respond = (promise, code) => 
    promise.then(response => {
        if(!_.isArray(response)) {
            response = [response];
        }

        return { status: code, response };
    }).catch(err => {
        let error;

        if('UserNotFound' === err.name) {
            error = HTTP_ERRORS.NOT_EXISTING;
        } else if('ValidationError' === err.name) {
            error = HTTP_ERRORS.INVALID_DATA;
        } else {
            error = HTTP_ERRORS.internal(code);
        }

        const response = { status: false, error };
        if(!_.isNil(err.errors)) {
            response.details = err.errors;
        }

        return response;
    });

class UserController {

    listAllUsers(req, res) {
        const promise = userRepository.listAll(req, res);

        respond(promise, 200).then(response => res.send(response));
    }

    createAUser(req, res) {
        /** 
         * ToDo
         *  -extract the user from the request
         *  -validate the user before insert it 
         *  -insert the user & return the inserted object data as required in the doc file
        */
        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            country_code: req.body.country_code,
            phone_number: req.body.phone_number,
            gender: req.body.gender,
            birthdate: req.body.birthdate,
            avatar: _.has(req.file, 'filename') ? req.file.filename : '',
            email: req.body.email,
        };
        
        const promise = userRepository.create(req, res, newUser);
        respond(promise, 201).then(response => res.send(response));
    }
    
}

module.exports = UserController;
