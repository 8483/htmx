function focusFieldAfterEnterKeypress(event, elementId) {
    if (event.key !== "Enter") return;

    document.getElementById(elementId).focus();
}

function clearInput(elementId) {
    document.getElementById(elementId).value = "";
}
