module.exports.renderPage = (title, html, script) => {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <title>${title || ""}</title>

                <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet" />

                <link rel="stylesheet" type="text/css" href="style.css" />
                <script src="https://unpkg.com/htmx.org@2.0.3"></script>       
            </head>
            <body>
                <div class="navigation">
                    <a href="/">Home</a>
                    <a href="/todos">Todos</a>
                </div>

                <div class="container">

                    <dialog id="dialog">
                        <div class="dialog-header">
                            <span>Details</span>
                            <span 
                                onclick="this.closest('dialog').close()"
                                class="dialog-close-btn"
                            >
                                ✖
                            </span>
                        </div>
                        <div id="dialog-content" class="dialog-content">
                            <!-- Content will be loaded here -->
                        </div>
                    </dialog>

                    ${html || ""}
                </div>

                <script>
                    htmx.logAll();
                    ${script || ""}
                </script>
            </body>
        </html>
    `;
};
