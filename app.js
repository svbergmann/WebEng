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

// Configuration

const express = require('express');
const app = express();

let path = require('path');

const {check, validationResult} = require('express-validator');
const cookieParser = require('cookie-parser');

const port = 3000;
const router = express.Router();

const consolidate = require('consolidate')

// const fetch = require("node-fetch");

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(router);

app.engine('html', consolidate.mustache);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'))

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});

router.get('/',
    (req, res) => {
        let cookie_data = 'Erster Besuch!';
        if (req.cookies.date != null) {
            cookie_data = req.cookies.date;
        }
        res.render('index_tpl', {cookie_data: cookie_data});
        res.cookie('date', new Date().toUTCString(), {overwrite: true});
    });

router.get('/student',
    (req, res) => {
        let messageArray = [];
        studentenArray.forEach(s => {
            messageArray.push(s.toString());
            messageArray.push("\n");
        });
        res.send(messageArray.join(""));
    });

router.get('/studentFactory',
    (req, res) => {
        let studentFactory = createStudentFactory(5);

        let studentMax = studentFactory('Max');

        res.send(studentMax.toString());
    });

function validationError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        next();
    }

}

router.all('/print', [
        check('note')
            .isIn(["sehr gut", "gut", "befriedigend", "ausreichend", "mangelhaft", "ungenügend"]),
        check('name')
            .escape()
            .trim(),
        validationError],
    (req, res) => {
        res.send(req.body);
        console.log('Cookies: ', req.cookies)
        console.log('Signed Cookies: ', req.signedCookies)
    });



