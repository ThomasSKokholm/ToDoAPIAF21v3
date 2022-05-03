const express = require('express');
const Joi = require('joi');
const {Huskeliste, validate} = require('../Model/huskeliste');

const route = express.Router();

// se huskelisten
route.get('/', async (req, res) => {
    const huskeliste = await Huskeliste.find().sort('navn');
    res.send(huskeliste);
});
// opret huskeliste
route.post('/opret/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let huskeliste = await Huskeliste.findOne({ navn: req.body.navn });
    if (huskeliste) return res.status(400).send('Huskeliste findes allerede');

    huskeliste = new Huskeliste({
        ...req.body,
    });

    try{
        await huskeliste.save();

        res.send(huskeliste);
    } catch(error){
        debug(error.message);
    }
});
// opdater huskeliste
route.put('/opdater/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const huskeliste = await Huskeliste.findByIdAndUpdate(req.params.id, {
        ...req.body,
    }, { new: true });

    if (!huskeliste) return res.status(404).send('Huskeliste findes ikke');

    res.send(huskeliste);
});
// slet huskeliste
route.delete('/slet/:id', async (req, res) => {
    const huskeliste = await Huskeliste.findByIdAndRemove(req.params.id);

    if (!huskeliste) return res.status(404).send('Huskeliste findes ikke');

    res.send(huskeliste);
});

module.exports = route;
