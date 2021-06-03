// document.addEventListener("DOMContentLoaded", function (event) {
//     alert(document.getElementById('submit').textContent)
// });

// Added a default color which turns the TextBox grey if the grade is out of reach.
function getColorCode(note) {
    if (typeof note === "number") {
        switch (note) {
            case 1:
            case 2:
                return "#5cb85c"
            case 3:
            case 4:
                return "#f0ad4e"
            case 5:
            case 6:
                return "#d9534f"
            default:
                return "#808080"
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("inputNote").addEventListener('change', () => {
        document.getElementById("submit").style.backgroundColor =
            getColorCode(parseInt(document.getElementById("inputNote").value));
    });
    document.addEventListener('submit', (evt) => {
        if (document.getElementById("inputName").value === "" ||
            document.getElementById("inputPasswort").value === "") {
            document.getElementById("output").innerHTML = "<b> Name oder Passwort nicht gesetzt! </b>";
            evt.preventDefault();
        }
    });
    document.getElementById("outputValues").addEventListener('click', () => {
        const table = document.createElement('table');
        table.setAttribute('border', '1');

        const r1 = table.insertRow();
        const r2 = table.insertRow();
        const r3 = table.insertRow();

        let nameCell = r1.insertCell();
        nameCell.innerHTML = "Name: ";
        let nameValueCell = r1.insertCell();
        nameValueCell.innerHTML = document.getElementById("inputName").value;

        let passwortCell = r2.insertCell();
        passwortCell.innerHTML = "Passwort: ";
        let passwortValueCell = r2.insertCell();
        passwortValueCell.innerHTML = document.getElementById("inputPasswort").value;

        let noteCell = r3.insertCell();
        noteCell.innerHTML = "Note: ";
        let noteValueCell = r3.insertCell();
        noteValueCell.innerHTML = document.getElementById("inputNote").value;

        document.getElementById("output").appendChild(table);
    });
});




