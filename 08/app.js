const express = require('express');
const app = express();
const todos = require('./routes/todos.routes');
const port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});
app.use('/todos', todos);