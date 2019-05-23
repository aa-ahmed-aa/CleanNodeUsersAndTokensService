'use strict';

const UserRepository = require('./UsersRepository');
const userRepository = new UserRepository();
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

class UserController {

    listAllUsers(req, res) {
        const promise = userRepository.listAll(req, res);
        promise.then(response => respond(res, 200, response));
    }

    createAUser(req, res) {
        const promise = userRepository.create(this.getUserObjectFromRequest(req));
        
        promise.then(data => respond(res, 201, data))
            .catch(err => respond(res, 400, err));
    }

    assignUserStatue(req, res) {
        respond(res, 200, req.body);
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
