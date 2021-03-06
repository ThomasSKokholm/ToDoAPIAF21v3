const express = require('express');
const debug = require('debug')('app:http');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { Bruger, validate } = require('../Model/bruger');

const route = express.Router();

// GET /bruger
route.get('/', async (req, res) => {
  const bruger = await Bruger.find().sort('navn');
  res.send(bruger);
});
// Opret bruger
route.post('/opret/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let bruger = await Bruger.findOne({ navn: req.body.navn });
  if (bruger) return res.status(400).send('Bruger findes allerede');

  bruger = new Bruger({
      ...req.body,
  });

  try{
      const salt = await bcrypt.genSalt(10);
      bruger.password = await bcrypt.hash(bruger.password, salt);

      await bruger.save();

      const token = jwt.sign(
          { _id: bruger._id },
          config.get('jwtPrivateKey'),
          { expiresIn: '24h' }
      );

      res
          .header('x-auth-token', token)
          .send({navn: bruger.navn, email: bruger.email});
  } catch(error){
      debug(error.message);
  }
});
// Slet bruger
route.delete('/slet/:id', async (req, res) => {
  const bruger = await Bruger.findByIdAndRemove(req.params.id);

  if (!bruger) return res.status(404).send('Bruger findes ikke');

  res.send(bruger);
});
// Opdater bruger
route.put('/opdater/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const bruger = await Bruger.findByIdAndUpdate(req.params.id, {
      ...req.body,
  }, { new: true });

  if (!bruger) return res.status(404).send('Bruger findes ikke');
  // opdater password salt
  const salt = await bcrypt.genSalt(10);
  bruger.password = await bcrypt.hash(bruger.password, salt);
  // gem opdateret bruger
  await bruger.save();

  res.send({navn: bruger.navn, email: bruger.email});
});


module.exports = route;