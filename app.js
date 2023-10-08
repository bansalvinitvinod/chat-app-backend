require("dotenv").config();
const express = require('express');
const sequelize = require('./config/db');
const authenticationRouter = require('./api/v1/routes/authentication');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/v1', authenticationRouter);

app.listen(port, () => {
  console.log(`Chat application has started listening on port ${port}`);
})