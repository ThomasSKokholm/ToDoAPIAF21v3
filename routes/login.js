const express = require('express');
const route = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Bruger } = require('../Model/bruger');

route.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let bruger = await Bruger.findOne({ email: req.body.email });
    if (!bruger) return res.status(400).send('Ugyldig bruger og/eller kodeord.');

    const validPassword = await bcrypt.compare(req.body.password, bruger.password);
    if (!validPassword) return res.status(400).send('Ugyldig bruger og/eller kodeord.');

    const token = bruger.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(req);
}

module.exports = route;