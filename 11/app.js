const express = require('express');
const app = express();
const path = require('path')
const port = 3000;
const users = require('./routes/users')

app.listen(port, function () {
    console.log('Database app listening on port ' + port + '!');
});

app.use('/', express.static(path.join(__dirname, 'public'), {index: 'login.html'}));

app.use('/scripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache')));

app.use('/users', users);