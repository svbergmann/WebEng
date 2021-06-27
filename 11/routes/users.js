const express = require('express')
const path = require('path');
const {QueryTypes} = require('sequelize');
const {Sequelize} = require('sequelize');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

router.use(express.urlencoded({extended: true}))

/**
 * Connects to the sqlite database and returns the sequelize object.
 * @returns {Promise<Sequelize>} the database connection
 */
async function connectToDatabase() {
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

    return sequelize;
}

/**
 * Disconnects from the given database connection.
 * @param sequelize the database connection
 */
async function disconnectFromDatabase(sequelize) {
    try {
        await sequelize.close();
        console.log('Connection has been closed successfully.');
    } catch (error) {
        console.error('Unable to close connection to the database:', error);
    }
}

router.post('/check_login',
    async (req, res) => {

        let sequelize = await connectToDatabase();

        let result = await sequelize.query(
            'SELECT passwort FROM users WHERE benutzername = :userName ',
            {
                replacements: {userName: req.body.user},
                type: QueryTypes.SELECT
            }
        );

        let userInfos = [];

        result.forEach(user => {
            userInfos.push({name: req.body.user, password: user.passwort})
        });

        let userAndPwCorrect = false;

        for (let user of userInfos) {
            if (bcrypt.compareSync(req.body.pw, user.password)) {
                userAndPwCorrect = true;
                break;
            }
        }

        if (userAndPwCorrect) {
            res.send("Successfully logged in!")
        } else {
            res.status(403).send("Wrong login information!")
        }

        await disconnectFromDatabase(sequelize);
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

            let sequelize = await connectToDatabase();

            let hashedPW = bcrypt.hashSync(pw, 8);

            await sequelize.query(
                'INSERT INTO users (benutzername, passwort, note) VALUES (:benutzername, :passwort, :dbnote)',
                {
                    replacements: {benutzername: name, passwort: hashedPW, dbnote: note},
                    type: QueryTypes.INSERT
                }
            );

            await disconnectFromDatabase(sequelize);

            res.render('register_tpl', {error_message: 'Successfully registered.'});
        }
    });

router.get('/register', async (req, res) => {
    res.render('register_tpl');
});

module.exports = router;