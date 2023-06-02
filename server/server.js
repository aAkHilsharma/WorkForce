const express = require('express');
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const app = express();
const bodyParser = require('body-parser');
const usersRoute = require('./routes/usersRoute');

app.use(express.json());

app.use('/api/users', usersRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Node server listening on port ${port}`));
