const config = require('config');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Schema for bruger
const brugerSchema = new mongoose.Schema({
    navn: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});

// Metode for generinger af en token
brugerSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
    return token;
}

const Bruger = mongoose.model('Bruger', brugerSchema);
// Validering af bruger
function validateBruger(bruger) {
    const schema = {
        navn: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return schema.validate(bruger);
}

module.exports.Bruger = Bruger;
module.exports.validate = validateBruger;