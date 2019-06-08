'use strict';

const UsersRepository = require('../../src/usersService/UsersRepository');
const TokensRepository = require('../../src/tokensService/TokensRepository');
const tokenRepository = new TokensRepository(); 
const expect = require('../resources/chai').expect;
const database = require('../../config/database');
const userRepository = new UsersRepository();
const data = require('../resources/Data');
// const assert = require('chai').assert;
const request = require('supertest');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = require('../../app');
// const fs = require('fs');

const sampleUser = data.user;
const sampleToken = data.token;

// const acceptedExtensions = require('../../config/images').acceptedExtensions;
// const imagesUploadPath = require('../../config/images').image_upload_path;

describe('usersService', () => {
    const dropDatabase = () => mongoose.connect(database.url + database.testDatabaseName, {
        useNewUrlParser: true, 
        useFindAndModify: false, 
        useCreateIndex: true,
    }, () => 
        mongoose.connection.db.dropDatabase()
    );

    before(() => dropDatabase());

    after(() => dropDatabase());

    describe('userRepository', () => {
        it('listAll() -> should return all users', () => 
            userRepository.listAll().then(users => 
                expect(users).to.be.an('array').and.have.lengthOf(0)
            )
        );
          
        it('create() -> should create a user with empty status', () => 
            userRepository.create(sampleUser).then(response => {
                const createdUser = response;
                expect(createdUser.toObject()).to.have.key(['_id', 'first_name', 'last_name', 'country_code', 
                    'phone_number', 'gender', 'birthdate', 'avatar', 'email', 'created_at', '__v', 'status']);

                expect(createdUser.first_name).to.be.a('string');
                expect(createdUser.last_name).to.be.a('string');
                expect(createdUser.country_code).to.be.a('string');

                expect(createdUser.status).to.be.an('array').and.empty;
                expect(createdUser.gender).to.have.oneOf(['male', 'female', 'other']);
            })
        );

        it('findOneByEmail() -> should find user by email address', () => 
            userRepository.findOneByEmail(sampleUser.email).then(createdUser =>
                expect(createdUser.toObject()).to.have.key(['_id', 'first_name', 'last_name', 'country_code', 
                    'phone_number', 'gender', 'birthdate', 'avatar', 'email', 'created_at', '__v', 'status'])
            )
        );
      
        it('findOneByPhoneNumber() -> should find user by phone_number', () => 
            userRepository.findOneByPhoneNumber(sampleUser.phone_number).then(createdUser =>
                expect(createdUser.toObject()).to.have.key(['_id', 'first_name', 'last_name', 'country_code', 
                    'phone_number', 'gender', 'birthdate', 'avatar', 'email', 'created_at', '__v', 'status'])
            )
        );
        
        it('assignStatusToUser() -> should assign status to user', () =>
            userRepository.findOneByPhoneNumber(sampleUser.phone_number).then(user => {
                const status = data.status;
                return userRepository.assignStatusToUser(status, user._id).then(userWithStatus => 
                    expect(userWithStatus.toObject().status[0]).to.have.key(['_id', 'name', 'description']));
            })
        );
    });

    describe('Schema Validation', () => {
        it('should throw validation error (first_name is blank)', () => {
            const user = _.clone(sampleUser);
            user.email = 'test@test.com';
            user.phone_number = '+20124412345'; 

            const promise = userRepository.create(_.omit(user, ['first_name']));
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('User validation failed: first_name: blank');
        });
    
        it('should throw validation error (last_name is blank)', () => {
            const user = _.clone(sampleUser);
            user.email = 'test@test.com';
            user.phone_number = '+20124412345'; 

            const promise = userRepository.create(_.omit(user, ['last_name']));
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('User validation failed: last_name: blank');
        });
    
        it('should throw validation error (country_code is blank)', () => {
            const user = _.clone(sampleUser);
            user.email = 'test@test.com';
            user.phone_number = '+20124412345'; 
            
            const promise = userRepository.create(_.omit(user, ['country_code']));
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('User validation failed: country_code: blank');
        });
    
        it('should throw validation error (phone_number is blank)', () => {
            const user = _.clone(sampleUser);
            user.email = 'test@test.com';
            user.phone_number = '+20124412345'; 

            const promise = userRepository.create(_.omit(user, ['phone_number']));
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('User validation failed: phone_number: blank');
        });
    
        it('should throw validation error (phone_number: not_a_valid_phone_number)', () => {
            const user = _.clone(sampleUser);
            user.phone_number = 'ahkaj';
            user.email = 'test@test.com';

            const promise = userRepository.create(user);
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('User validation failed: phone_number: not_a_valid_phone_number');
        });

        it('should throw validation error (gender inclusion)', () => {
            const user = _.clone(sampleUser);
            user.email = 'test@test.com';
            user.phone_number = '+20124412345';
            user.gender = '';

            const promise = userRepository.create(user);
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('User validation failed: gender: inclusion');
        });

        it('should throw validation error (birthdate blank)', () => {
            const user = _.clone(sampleUser);
            user.email = 'test@test.com';
            user.phone_number = '+20124412345';
            
            const promise = userRepository.create(_.omit(user, ['birthdate']));
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('User validation failed: birthdate: blank');
        });

        it('should throw validation error (birthdate blank)', () => {
            const user = _.clone(sampleUser);
            user.email = 'test@test.com';
            user.phone_number = '+20124412345';
            user.birthdate = '2020-9-7';
            
            const promise = userRepository.create(user);
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('User validation failed: birthdate: in_the_future');
        });

        it('should throw validation error (avatar blank)', () => {
            const user = _.clone(sampleUser);
            user.email = 'test@test.com';
            user.phone_number = '+20124412345';
            
            const promise = userRepository.create(_.omit(user, ['avatar']));
            return expect(promise).to.be.eventually.rejectedWith(Error)
                .that.have.property('message')
                .that.is.equal('User validation failed: avatar: blank');
        });
    });

    describe('UserRoutes', () => {
        it('GET /asdasd -> should return 404 status', () => request(app)
            .get('/asdasd')
            .then(response => {
                // assert.equal(response.status, 200);
                expect(response.status).to.be.equals(404);
            })
        );

        it('GET /users -> should return OK status', () => request(app)
            .get('/users')
            .then(response => {
                // assert.equal(response.status, 200);
                expect(response.status).to.be.equals(200);
            })
        );

        it('POST /users -> should return 400 invalid_content_type', () => {
            const user = _.cloneDeep(sampleUser); 
            user.email = 'test@test.com';
            user.phone_number = '+20124412345';

            user.avatar = 'invalid_image.jpg';
            return request(app)
                .post('/users')
                .field(user)
                .attach('avatar', `test/resources/${user.avatar}`)
                .then(response => {
                    const res = JSON.parse(response.text);
                    expect(response.status).to.be.equals(400);
                    return expect(res.errors.avatar.error).to.be.equals('invalid_content_type');
                });
        });

        it('POST /status -> should return 201 with updated user with status', () => {
            const user = _.cloneDeep(sampleUser);
            const token = _.cloneDeep(sampleToken);
            
            user.email = 'test@test.com';
            user.phone_number = '+20233123512';
            token.email = user.email;

            return userRepository.create(user).then(createdUser => 
                tokenRepository.create(token).then(createdToken => {
                    const status = _.cloneDeep(data.status);
                    
                    const statusBody = {
                        phone_number: createdUser.phone_number,
                        auth_token: createdToken.auth_token,
                        status,
                    };

                    return request(app)
                        .post('/status')
                        .field(statusBody)
                        .then(response => {
                            expect(response.status).to.be.equals(201);
                        });
                }));
        });

        it('POST /status -> should return 400 Bad Request', () => {
            const user = _.cloneDeep(sampleUser);
            const token = _.cloneDeep(sampleToken);
            
            user.email = 'ali@ali.com';
            user.phone_number = '+202331235127';
            token.email = user.email;

            return userRepository.create(user).then(() => 
                tokenRepository.create(token).then(createdToken => {
                    const status = _.cloneDeep(data.status);
                    
                    const statusBody = {
                        phone_number: '',
                        auth_token: createdToken.auth_token,
                        status,
                    };

                    return request(app)
                        .post('/status')
                        .field(statusBody)
                        .then(response => {
                            expect(response.status).to.be.equals(400);
                        });
                }));
        });

        it('POST /status -> should return  401 Unauthorized access', () => {
            const user = _.cloneDeep(sampleUser);
            const token = _.cloneDeep(sampleToken);
            
            user.email = 'samy@samy.com';
            user.phone_number = '+202323123512';
            token.email = user.email;

            return userRepository.create(user).then(createdUser => 
                tokenRepository.create(token).then(() => {
                    const status = _.cloneDeep(data.status);
                    
                    const statusBody = {
                        phone_number: createdUser.phone_number,
                        auth_token: '',
                        status,
                    };

                    return request(app)
                        .post('/status')
                        .field(statusBody)
                        .then(response => {
                            expect(response.status).to.be.equals(401);
                        });
                }));
        });
    });
});
