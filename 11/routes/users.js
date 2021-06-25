const express = require('express')
const path = require("path");
const {QueryTypes} = require("sequelize");
const {Sequelize} = require("sequelize");
const router = express.Router();

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

router.post('/check_login', async (req, res) => {

    let sequelize = await connectToDatabase();

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
        if (user.password === req.body.pw) {
            userAndPwCorrect = true;
        }
    }

    if (userAndPwCorrect) {
        res.send("Successfully logged in!")
    } else {
        res.status(403).send("Wrong login information!")
    }

    await disconnectFromDatabase(sequelize);
});

router.post('/register', async (req, res) => {

    let name = req.body.user;
    let pw = req.body.pw;
    let note = req.body.note;

    if (name === null || pw === null || note === null) res.status(403).send("Empty field!");

    let sequelize = await connectToDatabase();

    await sequelize.query(
        'INSERT INTO users (benutzername, passwort, note) VALUES (:benutzername, :passwort, :dbnote)',
        {
            replacements: {benutzername: name, passwort: pw, dbnote: note},
            type: QueryTypes.INSERT
        }
    );

    await disconnectFromDatabase(sequelize);
});

module.exports = router;