let express = require("express");
let router = express.Router();

let todos = [
    {
        id: 1,
        description: "Do something",
        amount: 5,
    },
    {
        id: 2,
        description: "Do another thing",
        amount: 10,
    },
    {
        id: 3,
        description: "Additional thing",
        amount: 7,
    },
];

function renderTodos() {
    let html = `
        <div class="todos">
            <div class="headers">
                <div><b>ID</b></div>
                <div><b>Description</b></div>
                <div><b>Amount</b></div>
            </div>
            ${todos
                .map((todo) => {
                    return `
                        <div class="todo">
                            <div>${todo.id || ""}</div>
                            <div>${todo.description || ""}</div>
                            <div>${todo.amount || ""}</div>
                        </div>
                    `;
                })
                .join("")}
        </div>

        <div class="total">
            <b>Total:</b>
            <span>${todos.reduce((acc, item) => acc + item.amount, 0) || 0}</span>
        </div>
    `;

    return html;
}

router.get("/", (req, res) => {
    let html = /*html*/ `
        <!DOCTYPE html>
        <html>
            <head>
                <title>HTML -TODO</title>

                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />

                <link rel="stylesheet" type="text/css" href="style.css" />
                <script src="https://unpkg.com/htmx.org@1.9.6"></script>

                <style>
                    body {
                        padding: 10px;
                        display: grid;
                        grid-template-rows: 50px 50px 300px;
                    }

                    .form {
                        display: flex;
                        align-items: flex-end;
                        gap: 10px;
                        margin-bottom: 10px;
                    }

                    .input-group {
                        display: flex;
                        flex-direction: column;
                    }

                    .todos-container {
                        display: grid;
                        grid-template-rows: 4fr 1fr;
                    }

                    .todos {
                        display: flex;
                        flex-direction: column;
                        overflow: auto;
                    }

                    .headers {
                        display: grid;
                        grid-template-columns: 50px 300px 100px;
                        padding: 3px;

                        position: sticky;
                        top: 0px;
                        background: white;
                    }

                    .todo {
                        display: grid;
                        grid-template-columns: 50px 300px 100px;
                        border: 1px solid rgba(0, 0, 0, 0.1);
                        padding: 3px;
                    }

                    .total {
                        padding-top: 10px;
                    }
                </style>              
            </head>

            <body>
                <h1>TODO</h1>

                <div class="form">
                    <div class="input-group">
                        <span>Description</span>
                        <input 
                            type="text" 
                            name="description" 
                            placeholder="task" 
                            id="field-description"
                            hx-on:keyup="focusFieldAfterEnterKeypress(event, 'field-amount');"
                        >
                    </div>

                    <div class="input-group">
                        <span>Amount</span>
                        <input 
                            type="number" 
                            name="amount" 
                            placeholder="number" 
                            id="field-amount"
                            hx-on:keyup="focusFieldAfterEnterKeypress(event, 'button')"
                        >
                    </div>

                    <button 
                        id="button"
                        hx-post="/api/todos" 
                        hx-include="#field-description, #field-amount"
                        hx-target="#todos-container" 
                        hx-swap="innerHTML"
                        hx-on:keyup="
                            focusFieldAfterEnterKeypress(event, 'field-description'); 
                            clearInput('field-description'); 
                            clearInput('field-amount');
                        "
                    >
                        Add
                    </button>
                </div>

                <div id="todos-container" class="todos-container">
                    ${renderTodos()}
                </div>
            </body>

            <script src="/scripts.js"></script>
            <script>
                document.getElementById("field-description").focus()
            </script>
        </html>
    `;

    res.send(html);
});

router.post("/api/todos", (req, res) => {
    let todo = req.body;

    todos.push({
        id: todos.length + 1,
        description: todo.description,
        amount: parseFloat(todo.amount),
    });

    res.send(renderTodos());
});

module.exports = router;
