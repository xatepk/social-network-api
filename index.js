const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload")

const usersRoutes = require('./routes/users');
const newsRoutes = require('./routes/news');
const config = require('./config/index.js');

const { PORT, MONGO_URL } = config;

console.log(process.env.MONGO_URL);

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", process.env.ORIGIN],
  })
);

app.use(bodyParser.json());
app.use(fileUpload({}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

mongoose.connect(MONGO_URL)
  .then(x => console.log(`Connected the Database: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));

app.use('/', usersRoutes);
app.use('/', newsRoutes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}}`)
})