'use strict';

const multer = require('multer');
const path = require('path');
const UserController = require('./UsersController');
const userController = new UserController();

/**
 * Image Helper Milldeware
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/users');
    },

    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({ storage });

/**
 * Users Routes
 */
module.exports = app => {
    app.route('/users')
        .get((req, res) => userController.listAllUsers(req, res))
        .post(upload.single('avatar'), (req, res) => {
            userController.createAUser(req, res);
        });

    app.route('/status').post(upload.array(), (req, res) => {
        userController.assignUserStatue(req, res);
    });
};
