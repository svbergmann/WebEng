const express = require('express')
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Database = require('../modules/database');
const Student = require('../modules/student');

router.use(express.urlencoded({extended: true}))

router.post('/check_login',
    async (req, res) => {
        let userAndPwCorrect;
        Database.getInstance()
            .then(database => {
                database.validateUser(req.body.user, req.body.pw);
            }).then(result => {
            userAndPwCorrect = result;
        })
        // let userAndPwCorrect = await Database.getInstance().validateUser(req.body.user, req.body.pw)
        //     .catch(res.status(403).send("Could not validate user!"));

        if (userAndPwCorrect) {
            req.session.loggedInUser = req.body.user;
            res.render('/info_tpl', {
                benutzer: req.body.user,
                note: Student.getNotenBewertung(Database.getInstance().getStudent(req.body.user).getNote())
            });
        } else {
            res.status(403).send("Wrong login information!")
        }
    });

router.post('/register',
    [
        check('note').isIn(["1", "2", "3", "4", "5", "6"]),
        check('name').escape().trim()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('register_tpl', {error_message: 'Keine Note zwischen 1 und 6 eingegeben'});
        } else {
            let name = req.body.user;
            let pw = req.body.pw;
            let note = req.body.note;

            if (name === null || pw === null || note === null) res.status(403).send("Empty field!");

            await Database.getInstance().registerUser(name, pw, note);

            res.render('register_tpl', {error_message: 'Successfully registered.'});
        }
    });

router.get('/register', (req, res) => {
    res.render('register_tpl');
});

router.get('/login', (req, res) => {
    res.render('login_tpl');
})

module.exports = router;