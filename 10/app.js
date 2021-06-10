const express = require('express');
const app = express();
const path = require('path')
const port = 3000;
const todos = require('./routes/todos.routes')
app.listen(port, function () {
    console.log('Todos app listening on port ' + port + '!');
});
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/scripts/mustache', express.static(path.join(__dirname, 'node_modules/mustache')))
app.use('/todos', todos);