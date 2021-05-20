module.exports = class Student {
    constructor(name) {
        this._name = name;
    }

    getName() {
        return this._name;
    }

    setName(name) {
        this._name = name;
    }

    setNote(note) {
        if (typeof (note) == 'number') {
            this._note = note;
        }
    }

    getNote() {
        return this._note;
    }

    static getNotenBewertung(zahl) {
        if (typeof (zahl) != 'number') {
            return `${zahl} is not a number!`
        }
        switch (zahl) {
            case 1:
                return "sehr gut";
            case 2:
                return "gut";
            case 3:
                return "befriedigend";
            case 4:
                return "ausreichend";
            case 5:
                return "magelhaft";
            case 6:
                return "ungenügend"
            default:
                return `${zahl} ist außerhalb der Notenskala!`
        }
    }

    toString() {
        return `${this._name} hat die Note ${Student.getNotenBewertung(this._note)} erreicht.`
    }
}