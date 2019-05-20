'use strict';

const UserController = require('../controllers/UsersController');
const userController = new UserController();

module.exports = app => {
    app.route('/users')
        .get((req, res) => userController.listAllUsers(req, res))
        .post((req, res) => userController.createAUser(req, res));
};
