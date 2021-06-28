const {Sequelize, QueryTypes} = require('sequelize');
const bcrypt = require('bcryptjs');
const path = require('path');
const Student = require('./student');

class Database {

    constructor(database) {
        if (typeof database === 'undefined') {
            throw new Error('Cannot be called directly');
        }
        this._database = database;
    }

    /**
     * Connects to the sqlite database and returns the sequelize object.
     * @returns {Promise<Sequelize>} the database connection
     */
    static async _init() {
        const database = new Sequelize({
            dialect: 'sqlite',
            storage: path.join(__dirname, '..', 'db', 'webengDB.db')
        });

        try {
            await database.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }

        return database;
    }

    static async getInstance() {
        // check if Database instance already exists
        if (!Database._instance) {
            Database._instance = new Database(this._init());
        }
        return Database._instance;
    }

    async validateUser(user, passwd) {
        let result = (await this._database).query(
            'SELECT passwort FROM users WHERE benutzername = :userName ',
            {
                replacements: {userName: user},
                type: QueryTypes.SELECT
            }
        );

        for (let user of await result) {
            if (await bcrypt.compare(passwd, user.passwort)) {
                return true;
            }
        }

        return false;
    }

    async userExists(user) {
        let result = (await this._database).query(
            'SELECT passwort FROM users WHERE benutzername = :userName ',
            {
                replacements: {userName: user},
                type: QueryTypes.SELECT
            }
        );

        return (await result).length !== 0;
    }

    /**
     * Registers a user in the database with the password being hashed.
     * @param user the user
     * @param passwd the password as clear text
     * @param note the grade
     * @returns {Promise<void>}
     */
    async registerUser(user, passwd, note) {
        let hashedPW = bcrypt.hashSync(passwd, 8);

        let result = (await this._database).query(
            'INSERT INTO users (benutzername, passwort, note) VALUES (:benutzername, :passwort, :dbnote)',
            {
                replacements: {benutzername: user, passwort: await hashedPW, dbnote: note},
                type: QueryTypes.INSERT
            }
        );

        return await result;
    }

    async getStudent(user) {
        let result = (await this._database).query(
            'SELECT note FROM users WHERE benutzername = :userName ',
            {
                replacements: {userName: user},
                type: QueryTypes.SELECT
            }
        );

        for (let user of await result) {
            if (user) {
                const student = new Student(user);
                student.setNote(user.note);
                return student;
            }
        }
    }

    /**
     * Disconnects from the database connection.
     */
    async disconnectFromDatabase() {
        try {
            await this._database.close();
            console.log('Connection has been closed successfully.');
        } catch (error) {
            console.error('Unable to close connection to the database:', error);
        }
    }
}

module.exports = Database;