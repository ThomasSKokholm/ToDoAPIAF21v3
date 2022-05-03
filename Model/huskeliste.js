const Joi = require('joi');
const mongoose = require('mongoose');
const {elementSchema} = require("./element");

// Schema for huskeliste
const huskelisteSchema = new mongoose.Schema({
    navn: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100
    },
    brugerid: {
        type: String,
        required: true
    },
    elementer: [elementSchema],
});

const Huskeliste = mongoose.model('Huskeliste', huskelisteSchema);

function validateHuskeliste(huskeliste) {
    const schema = Joi.object({
        navn: Joi.string().min(2).max(100).required(),
        brugerid: Joi.string().required(),
        elementer: Joi.allow(),
    });

    return schema.validate(huskeliste);
}

module.exports.Huskeliste = Huskeliste;
module.exports.validate = validateHuskeliste;
