const ids = [
    "chat_address", "timeout_from", "timeout_to", "history_file"
]

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.chat_posting) {
        for (let id of ids) {
            document.querySelector(`#${id}`).value = cookie_setting.chat_posting[id]
        }
    }
}

document.querySelector("#chat_posting").addEventListener("submit", (event) => {
    if (!document.querySelector("#chat_address").value) {
        (new bootstrap.Toast(document.getElementById('error_message'))).show()
        event.preventDefault()
    }
    let cookie_setting = {}

    if (!document.cookie) {cookie_setting = {chat_posting: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.chat_posting) {cookie_setting.chat_posting = {}}

    for (let id of ids) {
        cookie_setting.chat_posting[id] = document.getElementById(id).value
    }

    document.cookie = JSON.stringify(cookie_setting)
})
