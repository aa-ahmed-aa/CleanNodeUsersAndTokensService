'use strict';

const fs = require('fs');
const _ = require('lodash');
const mongoose = require('mongoose');
const User = require('../models/User');
const userSchema = mongoose.model('User', User);

class UsersRepository {

    listAll() {
        return userSchema.find({});
    }

    create(req, res, user) {
        const newUser = userSchema(user);

        req.checkBody('first_name', 'blank').notEmpty();
        req.checkBody('last_name', 'blank').notEmpty();
        req.checkBody('country_code', 'blank').notEmpty();
        
        //phone number must bee between 10 - 15 and matches the phone number format E.164
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
        req.checkBody('email', 'not_a_valid_email').isEmail();

        const errors = req.validationErrors();

        if(errors) {
            const errorsObj = { errors };
            res.send(errorsObj);
        } else {
            return userSchema.create(newUser);
        }
    }
    
}

module.exports = UsersRepository;
