let todoList = require('../modules/todo.model.js')
const express = require('express')
const router = express.Router();
let todos = new todoList();

router.use(express.json());
router.use(express.text());

// GET all todos
router.get('/', function (req, res) {
    res.type('application/json');
    res.send(todos.getAllTodos());
});

router.post('/', function (req, res) {
    res.type('application/json');
    res.send(todos.getTodo(todos.addTodo(req.body)));
});

router.get('/:id', function (req, res) {
    res.type('application/json');
    console.log(req.params.id);
    console.log(todos.getTodo(req.params.id));
    res.send(todos.getTodo(req.params.id));
});

router.delete('/:id', function (req, res) {
    res.type('application/json');
    // Ausgabe zum testen
    if (todos.removeTodo(req.query.id)) {
        res.send('Todo with id ' + req.query.id + ' removed.');
    } else {
        res.send('Could not remove Todo with id ' + req.query.id + '.');
    }
});

router.delete('/:done', function (req, res) {
    if (req.query.done === 'true') {
        todos.clearDone();
        res.type('application/json');
        res.send(todos.getAllTodos());
    }
});

router.delete('/', function () {
    todos.clear();
});

router.patch('/:id', function (req, res) {
    res.type('application/json');
    if (req.body[0].op === 'replace') {
        if (req.body[0].path === '/done') {
            if (req.body[0].value === true) {
                todos.setDone(req.params.id, true);
                res.send(todos.getTodo(req.params.id));
            } else {
                todos.setDone(req.params.id, false);
                res.send(todos.getTodo(req.params.id));
            }
        }
    }
});

module.exports = router;