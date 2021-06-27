const express = require('express');
const app = express();
const path = require('path')
const port = 3000;
const users = require('./routes/users')
const consolidate = require("consolidate");

app.listen(port, function () {
    console.log('Database app listening on port ' + port + '!');
});

app.use('/', express.static(path.join(__dirname, 'public'), {index: 'login.html'}));

app.use('/scripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache')));

app.use('/users', users);

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))