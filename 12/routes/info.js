const express = require('express');
const Student = require("../modules/student");
const Database = require("../modules/database");
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('../views/info_tpl', {
        benutzer: req.session.loggedInUser,
        note: Student.getNotenBewertung((await (await Database.getInstance()).getStudent(req.session.loggedInUser)).getNote())
    });
});

module.exports = router;