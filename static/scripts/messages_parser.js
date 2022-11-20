const ids = [
    "chat_address", "history_name", 
    "messages_count", "file_size_limit",
    "timeout_from", "timeout_to",
    "parser_type", "late_block",
    "select_late"
]

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.messages_parser) {
        for (let id of ids) {
            document.querySelector(`#${id}`).value = cookie_setting.messages_parser[id]
        }
    }

    let late_block = document.querySelector("#late_block")
    let bool_select = document.querySelector("#select_late")

    if (document.querySelector("#parser_type").value == "late") {
        late_block.style.removeProperty("display")
        bool_select.value = "1"
    } else {
        late_block.style.display = "none"
        bool_select.value = "0"
    }
}

document.querySelector("#messages_parser").addEventListener("submit", (event) => {
    if (!document.querySelector("#accounts").value.replace(' ', '')) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts'))).show()
        event.preventDefault()
    }
    if (!workWithoutProxy && [...document.querySelector("#main_table").children[2].children].some(element => element.classList.contains('table-secondary') && !element.children[6].textContent)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        event.preventDefault()
    }

    let cookie_setting = {}
    
    if (!document.cookie) {cookie_setting = {messages_parser: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.messages_parser) {cookie_setting.messages_parser = {}}


    for (id of ids) {
        cookie_setting.messages_parser[id] = document.querySelector(`#${id}`).value
    }
    document.cookie = JSON.stringify(cookie_setting)
})

document.querySelector("#parser_type").onchange = (event) => {
    let late_block = document.querySelector("#late_block")
    let bool_select = document.querySelector("#select_late")

    if (event.target.value == "late") {
        late_block.style.removeProperty("display")
        bool_select.value = "1"
    } else {
        late_block.style.display = "none"
        bool_select.value = "0"
    }
}
