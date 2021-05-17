const Student = require('./modules/student.js');

// Aufgabe 4

const studentenArray = [new Student("Student1"), new Student("Student2"), new Student("Student3")];

for (let i = 0; i < studentenArray.length; i++) {
    studentenArray[i].setNote(studentenArray.length - i);
}

/*for (let i = 0; i < studentenArray.length; i++) {
    console.log(studentenArray[i].toString());
}*/

studentenArray.sort(function (a, b) {
    if (a.getNote() < b.getNote()) {
        return -1;
    }
    if (a.getNote() > b.getNote()) {
        return 1;
    }
    return 0;
});

/*for (let i = 0; i < studentenArray.length; i++) {
    console.log(studentenArray[i].toString());
}*/

function createStudentFactory(note) {
    this._note = note;
    return function (name) {
        var s = new Student(name);
        s.setNote(this._note);
        return s;
    }
}

// Erzeugt eine neue Studenten-Factory
// Alle Studenten, die mit studentFactory
// erzeugt werden, erhalten standardmaessig die Note 5
let studentFactory = createStudentFactory(5);

// Erzeugt einen Benutzer mit dem Namen 'Max' und der Note 5
let studentMax = studentFactory('Max');

const studentenArray2 = [studentFactory('FactoryStudent1'), studentFactory('FactoryStudent2'), studentFactory('FactoryStudent3')];

/*for (let index = 0; index < studentenArray2.length; index++) {
    console.log(studentenArray2[index].toString());
}*/


// Aufgabe 6

const express = require('express');
const app = express();

// port
const port = 3000;
const router = express.Router();

router.get('/student', function (req, res) {
    let messageArray = [];
    studentenArray.forEach(s => {
        messageArray.push(s.toString());
        messageArray.push("\n");
    });
    res.send(messageArray.join(""));
});

app.listen(port, function () {
    console.log('Example app listening on port 3000!');
});

router.get('/studentFactory', function (req, res) {
    let studentFactory = createStudentFactory(5);

    let studentMax = studentFactory('Max');

    res.send(studentMax.toString());
});

let path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const {check, validationResult} = require('express-validator');

const cookieParser = require('cookie-parser');

function validationError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        next();
    }
}

router.get('/print',
    [
        check('note')
            .isIn(["sehr gut", "gut", "befriedigend", "ausreichend", "mangelhaft", "ungenügend"]),
        check('name')
            .escape()
            .trim(),
        validationError
    ],
    (req, res) => {
        res.send(req.query);
    });

app.use(express.urlencoded({extended: true}));

router.post('/print', [
        check('note')
            .isIn(["sehr gut", "gut", "befriedigend", "ausreichend", "mangelhaft", "ungenügend"]),
        check('name')
            .escape()
            .trim(),
        validationError],
    (req, res) => {
        res.send(req.body);
        console.log(req.cookies);
    });

app.use('/', router);

app.use(cookieParser());

router.get('/',
    function (req, res, next) {
        res.cookie('Date', Date.now().toString());
        res.send(' ');
    });



