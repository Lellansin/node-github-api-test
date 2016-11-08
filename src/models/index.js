'use strict';

const mongoose = require('mongoose');
const mongo = require('config').mongo;

const port = (mongo.port.length > 0) ? ":" + mongo.port : '';
const login = (mongo.user.length > 0) ? mongo.user + ":" + mongo.pwd + "@" : '';
const uri =  process.env.MONGOLAB_URI || process.env.MONGOHQ_URL ||  "mongodb://" + login + mongo.host + port + "/" + mongo.db;
const mongoOptions = mongo.authSource ? {} : { authSource: mongo.authSource };

mongoose.Promise = require('promise');
mongoose.connect(uri, mongoOptions);

module.exports = {
  Post: require('./post')
};
