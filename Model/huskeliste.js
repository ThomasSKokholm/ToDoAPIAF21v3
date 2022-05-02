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
    const schema = {
        navn: Joi.string().min(2).max(100).required(),
        brugerid: Joi.string().required(),
    };

    return schema.validate(huskeliste, schema);
}

module.exports.Huskeliste = Huskeliste;
module.exports.validate = validateHuskeliste;
