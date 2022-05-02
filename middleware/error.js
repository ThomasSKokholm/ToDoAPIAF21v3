const debug = require('debug')('app:http');

module.exports = function (err, req, res, next) {
  debug(err.stack);
  res.status(500).send('Der opstod en fejl');
};