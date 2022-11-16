const ids = ['history_file', 'threads_number']

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.prepare_chat_accounts) {

        for (let id of ids) {
            document.querySelector(`#${id}`).value = cookie_setting.prepare_chat_accounts[id]
        }
    }
}

document.querySelector("#prepare_chat_accounts").addEventListener("submit", (event) => {
    if (!document.querySelector("#accounts").value.replace(' ', '')) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts'))).show()
        event.preventDefault()
    }
    if (!workWithoutProxy && [...document.querySelector("#main_table").children[2].children].some(element => element.classList.contains('table-secondary') && !element.children[6].textContent)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        event.preventDefault()
    }

    let cookie_setting = {}

    if (!document.cookie) {cookie_setting = {prepare_chat_accounts: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.prepare_chat_accounts) {cookie_setting.prepare_chat_accounts = {}}

    for (let id of ids) {
        cookie_setting.prepare_chat_accounts[id] = document.getElementById(id).value
    }

    document.cookie = JSON.stringify(cookie_setting)
})