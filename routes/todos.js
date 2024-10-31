let express = require("express");
let router = express.Router();

const { renderPage } = require("../utils/utils");

let todos = [
    // {
    //     id: 1,
    //     description: "Do something",
    //     amount: 5,
    // },
    // {
    //     id: 2,
    //     description: "Do another thing",
    //     amount: 10,
    // },
    // {
    //     id: 3,
    //     description: "Additional thing",
    //     amount: 7,
    // },
];

for (let i = 0; i < 10; i++) {
    todos.push({
        id: i + 1,
        description: `todo ${i + 1}`,
        amount: Math.round(Math.random() * 10000),
    });
}

function renderTodo(todo) {
    return `
        <div
            class="todo"
            id="todo${todo.id}"
            tabindex="0"
            hx-on:keydown="if (event.key=='Enter') document.querySelector('#todo${todo.id} .edit').click();"
        >
            <div>${todo.id || ""}</div>
            <div>${todo.description || ""}</div>
            <div>${todo.amount || 0}</div>
            <div
                class="edit"
                hx-get="/api/todos/${todo.id}/edit"
                hx-target="#dialog-content"
                hx-on::after-request="document.getElementById('dialog').showModal()"
            >
            ✏️
            </div>
        </div>
    `;
}

function renderTodos() {
    let html = `
        <div id="todos" class="todos">
            <div class="headers" tabindex="-1">
                <div><b>ID</b></div>
                <div><b>Description</b></div>
                <div><b>Amount</b></div>
            </div>
            ${todos
                .map((todo) => {
                    return renderTodo(todo);
                })
                .join("")}
        </div>

        <div class="total">
            <b>Total:</b>
            <span>${todos.reduce((acc, item) => acc + parseFloat(item.amount), 0) || 0}</span>
        </div>
    `;

    return html;
}

router.get("/todos", (req, res) => {
    let title = "Todos";

    let content = `
        <h1>
            TODO

            <button
                hx-trigger="click, keyup[key=='+'] from:body"
                hx-get="/api/todos/new"
                hx-target="#dialog-content"
                hx-on::after-request="document.getElementById('dialog').showModal()"
            >
            ➕
            </button>
        </h1>

        <div
            id="todos-container"
            class="todos-container"
            hx-on::after-swap="
                // document.getElementById('todos').scrollIntoView({ behavior: 'smooth', block: 'end' });

                const todos = document.getElementById('todos');
                todos.scrollTop = todos.scrollHeight;
            "
        >
            ${renderTodos()}
        </div>
    `;

    let html = renderPage(title, content);

    res.send(html);
});

router.get("/api/todos/new", (req, res) => {
    let html = `
        <div id="form" class="form">
            <div class="input-group">
                <span>Description</span>
                <input 
                    type="text" 
                    name="description"
                    id="field-description"
                    placeholder="task" 
                    hx-on:keydown="if (event.key=='Enter') document.getElementById('field-amount').focus();"
                >
            </div>

            <div class="input-group">
                <span>Amount</span>
                <input 
                    type="number" 
                    name="amount"
                    id="field-amount"
                    placeholder="number" 
                    hx-on:keydown="if (event.key=='Enter') document.getElementById('button').focus();"
                >
            </div>

            <button 
                id="button"
                hx-post="/api/todos" 
                hx-include="#field-description, #field-amount"
                hx-target="#todos-container" 
                hx-swap="innerHTML"
                hx-on:click="
                    document.getElementById('field-description').value = '';
                    document.getElementById('field-amount').value = '';
                    document.getElementById('field-description').focus();
                "
                tabindex="-1"
            >
                Add
            </button>

            <input class="form-control" type="search" 
                list="search-results"
                name="search" placeholder="Search..." 
                hx-get="/api/search" 
                hx-trigger="input changed delay:500ms, search" 
                hx-target="#search-results" 
                hx-indicator=".htmx-indicator"
            >
            <datalist id="search-results">
            </datalist>
            
        </div>
    `;

    // document.getElementById('dialog').close();
    //

    res.send(html);
});

router.post("/api/todos", (req, res) => {
    let todo = req.body;

    todos.push({
        id: todos.length + 1,
        description: todo.description,
        amount: parseFloat(todo.amount) || 0,
    });

    res.send(renderTodos());
});

router.get("/api/todos/:todoId", (req, res) => {
    let { todoId } = req.params;

    todo = todos.filter((todo) => todo.id == todoId)[0];

    res.send(renderTodo(todo));
});

router.get("/api/todos/:todoId/edit", (req, res) => {
    let { todoId } = req.params;

    let todo = todos.filter((todo) => todo.id == todoId)[0];

    let html = `
        <div>${todo.id || ""}</div>
        <input 
            type="text"
            id="todo-edit-description" 
            name="description" 
            value="${todo.description || ""}"
            hx-on:keydown="if (event.key=='Enter') document.getElementById('todo-edit-amount').focus();"
        />
        <input 
            type="number" 
            id="todo-edit-amount" 
            name="amount" 
            value="${todo.amount || 0}"
            hx-on:keydown="if (event.key=='Enter') document.getElementById('edit-save').focus();"
        />
        <button
            id="edit-save"
            hx-patch="/api/todos/${todoId}" 
            hx-include="#todo-edit-description, #todo-edit-amount"
            hx-target="#todo${todo.id}"
            hx-swap="outerHTML"
            hx-on::after-request="document.getElementById('dialog').close()"
        >✔️</button>
        <button
            hx-on:click="document.getElementById('dialog').close()"
        >❌</button>
        <button
            hx-delete="/api/todos/${todo.id}" 
            hx-target="#todos-container" 
            hx-swap="innerHTML"
            hx-on::after-request="document.getElementById('dialog').close()"
            tabindex="-1"
        >
        🗑️
        </button>
    `;

    res.send(html);
});

router.patch("/api/todos/:todoId", (req, res) => {
    let { todoId } = req.params;

    let data = req.body;

    console.log("data", data);

    let todo = todos.filter((todo) => todo.id == todoId)[0];

    console.log("todo before", todo);

    todo.description = data.description;
    todo.amount = data.amount;

    console.log("todo after", todo);

    res.send(renderTodo(todo));
});

router.get("/api/todos/:todoId/details", (req, res) => {
    let { todoId } = req.params;

    let details = `
        <div>
            Details for ${todoId}
        </div>
    `;

    res.send(details);
});

router.delete("/api/todos/:todoId", (req, res) => {
    let { todoId } = req.params;

    todos = todos.filter((todo) => todo.id != todoId);

    res.send(renderTodos());
});

router.get("/api/search", (req, res) => {
    let html = "";

    todos.forEach((todo) => {
        html += `
            <option data-value="${todo.id}" value="${todo.description}">
        `;
    });

    console.log(html);

    res.send(html);
});

module.exports = router;
