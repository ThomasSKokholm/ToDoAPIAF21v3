const config = require('config');
const mongoose = require('mongoose');
const debug = require('debug')('app:db');

module.exports = function(){
    mongoose
        .connect(config.get('db'))
        .then(() => debug('Connected to MongoDB...'))
        .catch(err => debug('Could not connect to MongoDB...', err));
};
