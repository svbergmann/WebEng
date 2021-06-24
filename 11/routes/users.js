const express = require('express')
const path = require("path");
const {QueryTypes} = require("sequelize");
const {Sequelize} = require("sequelize");
const router = express.Router();

router.use(express.urlencoded({extended: true}))

router.post('/check_login', async (req, res) => {

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', 'db', 'webengDB.db')
    });

    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    let result = await sequelize.query(
        'SELECT passwort FROM users WHERE benutzername = :userName ',
        {
            replacements: {userName: req.body.user},
            type: QueryTypes.SELECT
        }
    );

    let userinfos = [];

    result.forEach(user => {
        userinfos.push({name: req.body.user, password: user.passwort})
    });

    let userAndPwCorrect = false;

    for (let user in userinfos) {
        console.log(user);
        if (user.password === req.body.pw) {
            userAndPwCorrect = true;
        }
    }

    if (userAndPwCorrect) {
        res.send("Successfully logged in!")
    } else {
        res.status(403).send("Wrong login information!")
    }

    try {
        await sequelize.close();
        console.log('Connection has been closed successfully.');
    } catch (error) {
        console.error('Unable to close connection to the database:', error);
    }
})

module.exports = router;