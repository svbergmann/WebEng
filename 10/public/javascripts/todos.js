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

    /**
     * Creates a delete click handler which sends the delete request
     * and also deletes the html element inside the DOM-tree.
     * @param itemNode the given item
     * @returns {(function(): Promise<void>)|*}
     */
    function getDeleteClickHandler(itemNode) {
        return async function () {
            await fetch('/todos/' + itemNode.id,
                {
                    method: "DELETE",
                    headers: {'Content-Type': 'text/plain'}
                }
            );
            let index = getTODOListIndexByID(itemNode.id);
            if (index != null) {
                document.getElementById("list").children[index].remove();
            }
        };
    }

    /**
     * Function for retrieving the current index of the given element.
     * @param id the item id
     * @returns {number} the index in the list on the html page
     */
    function getTODOListIndexByID(id) {
        for (let i = 0; i < document.getElementById("list").childNodes.length; i++) {
            if (parseInt(document.getElementById("list").children[i].id)
                === parseInt(id)) {
                return i;
            }
        }
    }

    /**
     * Creates a done click handler which sends the delete request
     * and wraps the text inside "<del>...</del>" tags.
     * @param itemNode the given item
     * @returns {(function(): Promise<void>)|*}
     */
    function getDoneClickHandler(itemNode) {
        return async function () {
            fetch('/todos/' + itemNode.id, {
                method: "GET",
                headers: {'Content-Type': 'text/plain'}
            }).then(response => {
                return response.json();
            }).then(async todo => {
                let index = getTODOListIndexByID(itemNode.id);
                if (index != null) {
                    let value;
                    let title = itemNode.title
                    if (todo.done === true) {
                        value = "false";
                        document.getElementById("list").children[index]
                            .children[0].innerHTML = todo.title;
                    } else {
                        value = "true";
                        document.getElementById("list").children[index]
                            .children[0].innerHTML = "<del>" + title + "</del>";
                    }
                    let fetchBody = {
                        op: "replace",
                        path: "/done",
                        value: value
                    };
                    await fetch('/todos/' + itemNode.id, {
                        method: "PATCH",
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(fetchBody)
                    }).then(result => {
                        result.json();
                    })
                }
            });
        }
    }


    /**
     * Renders an item with mustache and adds it to the list inside the DOM-tree.
     * @param item the item
     * @returns {Promise<void>}
     */
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


    /**
     * Loads all stored items and renders them on
     * the html page with the function {@link addTodo}.
     * @returns {Promise<void>}
     */
    async function loadAll() {
        let response = await fetch('/todos',
            {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            }
        )
        listNode.innerHTML = '';
        let todos = await response.json();
        for (let todo of todos) {
            await addTodo(todo);
        }
    }

    document.getElementById('deleteChecked')
        .addEventListener('click', async () => {
            let response = await fetch('/todos?done=true',
                {
                    method: "DELETE",
                    headers: {'Content-Type': 'application/json'}
                }
            )
            listNode.innerHTML = '';
            let todos = await response.json();
            for (let todo of todos) {
                await addTodo(todo);
            }
        });

    await loadAll();
});