let todoList = require('../modules/todo.model.js')
const express = require('express')
var router = express.Router()
let todos = new todoList()

// GET all todos
router.get('/', function (req, res) {
    res.type('application/json');
    res.send(todos.getAllTodos());
})

//...

module.exports = router;