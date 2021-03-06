const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const bruger = require('../routes/bruger');
const login = require('../routes/login');
const todo = require('../routes/todo');
const postit = require('../routes/postit');

module.exports = function (app) {

    const corsOptions = {
      exposedHeaders: 'Authorization',
    };

    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(compression());
    app.use(express.json());

    app.get('/', (req, res) => {
        res.send('Todo APIet er oppe og kører!');
    });

    app.use('/api/bruger', bruger);
    app.use('/api/login', login);
    app.use('/api/todo', todo);
    app.use('/api/postit', postit);

};