'use strict';

const multerHelper = require('multer');
const TokenController = require('./TokensController');
const tokenController = new TokenController();

const multer = multerHelper();

/**
 * Tokens Routes
 */
module.exports = app => {
    app.route('/tokens')
        .get((req, res) => tokenController.listAllTokens(req, res))
        .post(multer.array(), (req, res) => {
            tokenController.createAToken(req, res);
        });
};
