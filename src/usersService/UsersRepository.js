'use strict';

const mongoose = require('mongoose');
const User = require('./User');
const userSchema = mongoose.model('User', User);

class UsersRepository {

    listAll() {
        return userSchema.find({});
    }

    create(user) {
        const newUser = userSchema(user);
        return userSchema.create(newUser);
    }
    
    findOneByEmail(userEmail) {
        return userSchema.findOne({ email: userEmail });
    }

    findOneByPhoneNumber(phoneNumber) {
        return userSchema.findOne({ phone_number: phoneNumber });
    }

    assignStatusToUser(status, userId) {
        status = JSON.parse(status);
        return userSchema.findByIdAndUpdate(userId, { status }, { new: true });
    }

}

module.exports = UsersRepository;
