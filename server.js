const express = require("express");
const path = require("path");

let app = express();
const server = require("http").createServer(app);

let index = require("./routes/todos");
let todos = require("./routes/index");

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")))
    .use(express.json())

    .use(index)
    .use(todos);

let port = 7777;

server.listen(port, () => {
    console.log(`listening on port: ${port}`);
});

module.exports = app;
