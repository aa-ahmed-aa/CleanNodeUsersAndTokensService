'use strict';

const _ = require('lodash');
const UserRepository = require('../repositories/UsersRepository');
const userRepository = new UserRepository();

const mongoose = require('mongoose');
const User = require('../models/User');
const userSchema = mongoose.model('User', User);

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
        let errors;

        if('UserNotFound' === err.name) {
            errors = HTTP_ERRORS.NOT_EXISTING;
        } else if('ValidationError' === err.name) {
            errors = HTTP_ERRORS.INVALID_DATA;
        } else {
            errors = HTTP_ERRORS.internal(code);
        }

        const response = { status: code, errors };
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
        // - extract the user from the request

        const newUser = this.getUserObjectFromRequest(req);

        // - validate the user before insert it
        const errors = this.validateFields(req, newUser);

        errors.then(errs => {
            if(errs) {
                this.respond(res, 400, errs, true);
            } else {
                userRepository.create(newUser).then(data => {
                    this.respond(res, 201, data);
                });
            }
        });
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

    /**
     * Validation
     */
    validateFields(req, newUser) {
        return userSchema.find({ email: req.body.email }).then(user => {
            req.checkBody('first_name', 'blank').notEmpty();
            req.checkBody('last_name', 'blank').notEmpty();
            req.checkBody('country_code', 'blank').notEmpty();
            
            //phone number must be between 10 - 15 and matches the phone number format E.164
            req.checkBody('phone_number', 'not_a_valid_phone_number').matches(/^\+?[1-9]\d{1,14}$/, 'i');
            req.checkBody('phone_number', 'too_short').isLength({ min: 10 });
            req.checkBody('phone_number', 'too_long').isLength({ max: 15 });
            
            req.checkBody('gender', 'blank').notEmpty();
            req.checkBody('gender', 'inclusion').isIn(['male', 'female', 'other']);

            //Date not empty and before today
            req.checkBody('birthdate', 'blank').notEmpty();
            req.checkBody('birthdate', 'in_the_future').isBefore(Date().toString());

            req.body.avatar = newUser.avatar;
            //avatar matches extensions
            req.checkBody('avatar', 'blank').notEmpty();
            req.checkBody('avatar', 'invalid_content_type').isImage(newUser.avatar);
            
            // //email not ampty and valid email
            req.checkBody('email', 'blank').notEmpty();
            req.checkBody('email', 'invalid').isEmail();
            
            if(!_.isEmpty(user))
                req.checkBody('email', 'taken').isUniqueEmail();
            else
                req.checkBody('email', 'taken').isNotUniqueEmail();

            return req.validationErrors();
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
