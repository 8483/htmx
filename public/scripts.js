console.log("HTMX");

function focusFieldAfterFieldOnEnter(from, to) {
    from.addEventListener("keyup", (e) => {
        if (event.key === "Enter" || event.keyCode === 13) {
            to.focus();
        }
    });
}
