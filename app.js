require("dotenv").config();
const express = require('express');
const sequelize = require('./config/db');
const authenticationRouter = require('./api/v1/routes/authentication');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your Angular app's URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  // credentials: true, // Set to true if you're handling cookies or sessions
};

// Use cors with options
app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/v1', authenticationRouter);

app.listen(port, () => {
  console.log(`Chat application has started listening on port ${port}`);
})