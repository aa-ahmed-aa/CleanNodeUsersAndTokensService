'use strict';

process.env.PORT = require('../../config/appConfig').test_env_port;
const TokensRepository = require('../../src/tokensService/TokensRepository');
const expect = require('../resources/chai').expect;
const database = require('../../config/database');
const tokenRepository = new TokensRepository();
const data = require('../resources/Data');
// const assert = require('chai').assert;
const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = require('../../app');
// const fs = require('fs');

const sampleToken = data.token;

// const acceptedExtensions = require('../../config/images').acceptedExtensions;
// const imagesUploadPath = require('../../config/images').image_upload_path;

describe('tokensService', () => {
    const dropDatabase = () => mongoose.connect(database.url + database.testDatabaseName, {
        useNewUrlParser: true, 
        useFindAndModify: false, 
        useCreateIndex: true,
    }, () => 
        mongoose.connection.db.dropDatabase()
    );

    before(() => dropDatabase());

    after(() => dropDatabase());

    describe('tokenRepository', () => {
        it('listAll() -> should return all tokens', () => 
            tokenRepository.listAll().then(tokens => 
                expect(tokens).to.be.an('array').and.have.lengthOf(0)
            )
        );
          
        it('create() -> should create a token', () => 
            tokenRepository.create(sampleToken).then(response => {
                const createdToken = response;
                expect(createdToken.toObject()).to.have.key(['_id', 'email', 'auth_token', 
                    'password', 'created_at', '__v']);

                expect(createdToken.email).to.be.a('string');
                expect(createdToken.password).to.be.a('string');
                expect(createdToken.password).to.be.a('string');
            })
        );

        it('findOneByToken() -> should create a token', () => 
            tokenRepository.create(sampleToken).then(createdToken => 
                tokenRepository.findOneByToken(createdToken.auth_token).then(response =>
                    expect(response.toObject()).to.have.key(['_id', 'email', 'auth_token', 
                        'password', 'created_at', '__v'])
                )
            )
        );
    });
    
    describe('Schema Validation', () => {
        it('should throw validation error (email is blank)', () => {
            const token = _.clone(sampleToken);
            
            const promise = tokenRepository.create(_.omit(token, ['email']));
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('Token validation failed: email: blank');
        });

        it('should throw validation error (password is blank)', () => {
            const token = _.clone(sampleToken);
            
            const promise = tokenRepository.create(_.omit(token, ['password']));
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('Token validation failed: password: blank');
        });
    });

    describe('UserRoutes', () => {
        it('GET /tokens -> should return OK status', () => request(app)
            .get('/tokens')
            .then(response => {
                expect(response.status).to.be.equals(200);
            })
        );

        it('POST /tokens -> should return 400', () => {
            const token = sampleToken;

            return request(app)
                .post('/tokens')
                .field(token)
                .then(response => {
                    expect(response.status).to.be.equals(201);
                });
        });
    });
});
