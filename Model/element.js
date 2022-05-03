const Joi = require('joi');
const mongoose = require('mongoose');

const elementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    udført: {
        type: Boolean,
        required: true
    }
});

const Element = mongoose.model('Element', elementSchema);

function validateElement(element) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        udført: Joi.boolean().required()
    });

    return schema.validate(element);
}

module.exports.Element = Element;
module.exports.validate = validateElement;
module.exports.elementSchema = elementSchema;