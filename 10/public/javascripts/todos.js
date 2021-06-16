document.addEventListener('DOMContentLoaded', async function () {

    const listNode = document.getElementById('list'); // id der unordered list im HTML

    document.getElementById('newTodo')
        .addEventListener('click', async function () {
            let response = await fetch('/todos',
                {
                    method: "POST",
                    headers: {'Content-Type': 'text/plain'},
                    body: document.getElementById('input_todo').value
                }
            );
            await addTodo(await response.json());
        });

    function getDeleteClickHandler(itemNode) {
        return async function () {
            await fetch('/todos/' + itemNode.id,
                {
                    method: "DELETE",
                    headers: {'Content-Type': 'text/plain'},
                    body: document.getElementById('input_todo').value
                }
            );
            let index;
            for (let i = 0; i < document.getElementById("list").childNodes.length; i++) {
                if (parseInt(document.getElementById("list").children[i].id)
                    === parseInt(itemNode.id)) {
                    index = i;
                    break;
                }
            }
            if (index != null) {
                document.getElementById("list").children[index].remove();
            }
        };
    }

    function getDoneClickHandler(itemNode) {
        return async function () {
            let response = fetch('/todos/' + itemNode.id,
                {
                    method: "GET",
                    headers: {'Content-Type': 'application/json'}
                })
            // TODO: That does not work
            let todo = (await response).json();
            console.log(todo);
            let value;
            let title = itemNode.title;
            console.log(todo.done);
            if (todo.done === true) {
                value = "false";
                itemNode.title = title.substring(4, title.length - 7);
                console.log(itemNode.title);
            } else {
                value = "true";
                itemNode.title = "<del>" + title + "</del>";
            }
            console.log(title);
            console.log(value);
            let fetchBody = {
                op: "replace",
                path: "/done",
                value: value
            };
            await fetch('/todos/' + itemNode.id,
                {
                    method: "PATCH",
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(fetchBody)
                })
        }
    }


    async function addTodo(item) {
        let response = await fetch('/templates/todos_tpl.html');
        let template = await response.text();
        let rendered = Mustache.render(template, item);
        listNode.insertAdjacentHTML('beforeend', rendered);
        listNode.lastChild.lastChild.previousSibling
            .addEventListener('click', getDeleteClickHandler(item));
        listNode.children[listNode.children.length - 1]
            .getElementsByClassName("todo_item")[0]
            .addEventListener('click', getDoneClickHandler(item));
    }

// Alle ToDos laden (Route /todos sollte ein Array mit JSON-Objekten zurückgeben) &
// auf der Website anzeigen (Iteriere über alle JSON-Objekte und rufe addTodo auf)
    async function loadAll() {
        let response = await fetch('/todos',
            {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            }
        )
        listNode.innerHTML = '';
        let todos = await response.json();
        for (let todo in todos) {
            await addTodo(todo);
            console.log(todo);
        }
    }

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
            if (todos !== null) {
                for (let todo in todos) {
                    await addTodo(todo);
                }
            }
        });

    await loadAll();
});