const express = require('express');
const Joi = require('joi');
const {Huskeliste, validate} = require('../Model/huskeliste');
const {Element, validate: validateElement} = require('../Model/element');
const route = express.Router();

// se alle elementer i en huskeliste
route.get('/:id', async (req, res) => {
    const huskeliste = await Huskeliste.findById(req.params.id);
    if (!huskeliste) return res.status(404).send('Huskeliste findes ikke');
    res.send(huskeliste.elementer);
});

// se element i huskelisten
route.get('/:id', async (req, res) => {
    const element = await Element.find({ huskelisteid: req.params.id });
    res.send(element);
});
// opret element i huskelisten
route.post('/opret/:id', async (req, res) => {
    const { error } = validateElement(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let element = await Element.findOne({ navn: req.body.navn });
    if (element) return res.status(400).send('Element findes allerede');

    element = new Element({
        ...req.body,
        huskelisteid: req.params.id
    });

    try {
        await element.save();
        res.send(element);
    } catch (error) {
        debug(error.message);
    }
});
// opdater element i huskelisten
route.put('/opdater/:id', async (req, res) => {
    const { error } = validateElement(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const element = await Element.findByIdAndUpdate(req.params.id, {
        ...req.body,
    }, { new: true });

    if (!element) return res.status(404).send('Element findes ikke');

    res.send(element);
});
// slet element i huskelisten
route.delete('/slet/:id', async (req, res) => {
    const element = await Element.findByIdAndRemove(req.params.id);

    if (!element) return res.status(404).send('Element findes ikke');

    res.send(element);
});

module.exports = route;