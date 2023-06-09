const express = require('express');
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const app = express();
const bodyParser = require('body-parser');

const usersRoute = require('./routes/usersRoute');
const projectRoute = require('./routes/projectRoute');
const taskRoute = require('./routes/tasksRoute');
const notificationRoute = require('./routes/notificationRoutes');

app.use(express.json());

app.use('/api/users', usersRoute);
app.use('/api/projects', projectRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/notifications', notificationRoute);

// deployment config
const path = require('path');
__dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Node server listening on port ${port}`));
