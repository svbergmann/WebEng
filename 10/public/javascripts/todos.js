document.addEventListener('DOMContentLoaded', async function () {

    const listNode = document.getElementById('list') // id der unordered list im HTML

    document.getElementById('newTodo')
        .addEventListener('click', async function () {
            let response = await fetch('/todos',
                {
                    method: "POST",
                    headers: {'Content-Type': 'text/plain'},
                    body: document.getElementById('input_todo').value
                }
            )
            await addTodo(await response.json());
        });

    function getDeleteClickHandler(itemNode) {
        return async function () {
            // Löschen eines ToDos im Backend und auf der Website
            // ToDo: Write your Code here
        }
    }

    function getDoneClickHandler(itemNode) {
        return async function () {
            // Ändern (done/undone) eines ToDos im Backend und auf der Website
            // ToDo: Write your Code here
        }
    }

    async function addTodo(item) {
        let response = await fetch('/templates/todos_tpl.html');
        let template = await response.text();
        let rendered = Mustache.render(template, item);
        listNode.insertAdjacentHTML('beforeend', rendered);
    }

    // Alle ToDos laden (Route /todos sollte ein Array mit JSON-Objekten zurückgeben) &
    // auf der Website anzeigen (Iteriere über alle JSON-Objekte und rufe addTodo auf)
    async function loadAll() {
        // ToDo: Write your Code here
    }


    // Alle erledigten ToDos löschen &
    // auf der Website entfernen
    document.getElementById('deleteChecked')
        .addEventListener('click', async function (event) {
            let response = await fetch('/todos?done=true',
                {
                    method: "DELETE",
                    headers: {'Content-Type': 'text/plain'},
                    body: 'true'
                }
            )
            listNode.innerHTML = '';
            let todos = await response.json();
            console.log(todos);
            if (todos !== null) {
                for (let todo in todos) {
                    await addTodo(todo);
                }
            }
            // ToDo: Write your Code here
        })

    async function renderAllTodos() {
        let todos = await fetch('/todos',
            {
                method: "GET",
                headers: {'Content-Type': 'text/plain'}
            }
        )
        await addTodo(await todos.json());

    }

    // Bei Beginn alle Einträge laden
    await loadAll();
})