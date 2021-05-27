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
    res.send(todos.getTodo(parseInt(req.params.id)));
});

router.delete('/:id', function (req, res) {
    res.type('application/json');
    todos.removeTodo(parseInt(req.params.id));
    res.send();
});

router.delete('/', function (req, res) {
    if (req.query.done !== 'true') {
        todos.clear();
        res.send();
    } else {
        todos.clearDone();
        res.type('application/json');
        res.send(todos.getAllTodos());
    }
});

router.patch('/:id', function (req, res) {
    res.type('application/json');
    if (req.body[0].op === 'replace') {
        if (req.body[0].path === '/done') {
            if (req.body[0].value === true) {
                todos.setDone(parseInt(req.params.id), true);
                res.send(todos.getTodo(parseInt(req.params.id)));
            } else {
                todos.setDone(parseInt(req.params.id), false);
                res.send(todos.getTodo(parseInt(req.params.id)));
            }
        }
    }
});

module.exports = router;