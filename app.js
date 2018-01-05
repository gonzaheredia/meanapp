// Requested modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// DB connection
mongoose.connect(config.database, { useMongoClient: true });

// Is connected
mongoose.connection.on('connected', () => {
    console.log('Database connected '+config.database);
});

// Is any error
mongoose.connection.on('error', (err) => {
    console.log('Database error: '+err);
});

// Init Express app
const app = express();

// Users routes
const users = require('./routes/users');

// Set port
const port = process.env.PORT || 8080;

// Cors Middleware
app.use(cors());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Bodyparser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Users route
app.use('/users', users);

// Index route
app.get('/', (req, res) => {
    res.send('Invalid endpoint');
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname), 'public/index.html');
})

// Start server
app.listen(port, () => {
    console.log('Server started on port '+port);
});