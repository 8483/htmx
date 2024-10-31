let express = require("express");
let router = express.Router();

const { renderPage } = require("../utils/utils");

router.get("/", (req, res) => {
    let title = "Home";

    let content = `
        <h1>HOME</h1>
    `;

    let html = renderPage(title, content);

    res.send(html);
});

module.exports = router;
