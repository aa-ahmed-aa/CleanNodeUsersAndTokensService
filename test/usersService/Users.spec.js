'use strict';

const expect = require('../Resources/chai').expect;
const mongoose = require('mongoose');
const UsersRepository = require('../../src/usersService/UsersRepository');
const userRepository = new UsersRepository();
const data = require('../Resources/Data');
const database = require('../../config/database');

const sampleUser = data.user;

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

    describe('listAll', () => {
        it('should return all users', () => 
            userRepository.listAll().then(users => 
                expect(users).to.be.an('array').and.have.lengthOf(0)
            )
        );
    });

    describe('create', () => {
        it('should create a user with empty status', () => 
            userRepository.create(sampleUser).then(response => {
                const createdUser = response;
                expect(createdUser.toObject()).to.have.key(['_id', 'first_name', 'last_name', 'country_code', 
                    'phone_number', 'gender', 'birthdate', 'avatar', 'email', 'created_at', '__v', 'status']);

                expect(createdUser.first_name).to.be.a('string');
                expect(createdUser.last_name).to.be.a('string');
                expect(createdUser.country_code).to.be.a('string');

                expect(createdUser.status).to.be.an('array').and.empty;
                expect(createdUser.gender).to.have.oneOf(['male', 'female', 'other']);
                // return true;
            })
        );
    });
});
