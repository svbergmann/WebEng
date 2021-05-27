let todoList = require('../modules/todo.model.js')
const express = require('express')
const router = express.Router();
let todos = new todoList();

// GET all todos
router.get('/', function (req, res) {
    res.type('application/json');
    res.send(todos.getAllTodos());
});

router.post('/', function (req, res) {
    res.type('text/plain');
    res.send(todos.addTodo(req));
});

router.get('/:id', function (req, res) {
    res.send(todos.getTodo(req.query.id));
});

router.delete('/:id', function (req, res) {
    res.send(todos.removeTodo(req.query.id));
});

router.patch('/:id', function (req, res) {
    todos.setDone(req.query.id, true)
    res.send('Todo with id ' + req.query.id + ' marked as done.');
});

router.delete('/:done', function (req, res) {

});

//...

module.exports = router;