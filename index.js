const express = require('express');
const app = express();
const ip = require('ip');

const error = require('./middleware/error');

require("./startup/db")();
require("./startup/routes")(app);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Lytter på port ${ip.address()}:${port}...`));