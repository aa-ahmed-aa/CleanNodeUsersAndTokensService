'use strict';

const multer = require('multer');
const path = require('path');
const _ = require('lodash');
const UserController = require('../controllers/UsersController');
const userController = new UserController();

const acceptedExtensions = require('../../config/images').acceptedExtensions;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/users');
    },

    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

//Images filter according to the allowed image extensions
const fileFilter = (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if(!_.includes(acceptedExtensions, ext)) {
        return callback();
    }
    callback(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = app => {
    app.route('/users')
        .get((req, res) => userController.listAllUsers(req, res))
        .post(upload.single('avatar'), (req, res) => {
            userController.createAUser(req, res);
        });
};
