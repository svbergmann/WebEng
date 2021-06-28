const express = require('express');
const app = express();
const path = require('path')
const port = 3000;
const users = require('./routes/users')
const consolidate = require('consolidate');
const session = require('express-session');

app.listen(port, function () {
    console.log('Database app listening on port ' + port + '!');
});

app.use('/scripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache')));

app.use('/users', users);

app.use('/', (req, res) => {
    res.redirect('/users/login');
})

app.use(session({
    secret: 'database session secret',
    name: 'database_cookie_name',
    resave: true,
    loggedInUser: '',
    saveUninitialized: true,
    cookie: {secure: true}
}));

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))

module.exports = session;