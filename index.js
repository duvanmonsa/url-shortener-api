'use strict'

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();

const shortener = require('./src/api/index');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/shortener', shortener);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`App listening on http://localhost:${port}`);
});
