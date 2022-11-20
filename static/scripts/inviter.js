const ids_list = [
    "chat_to_invite", "invite_at_time", "sleep_before_thread",
    "delay_between", "delay_to", "account_change", "invite_length", 'flood_wait_limit'
]
if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.inviter) {
        for (let id of ids_list) {
            document.getElementsByName(id)[0].value = cookie_setting['inviter'][id]
        }
        document.getElementById('save_unused_audiences').checked = cookie_setting.inviter.save_unused_audiences
    }
}
document.getElementById("inviter").addEventListener("submit", (event) => {
    if (!document.querySelector("#audience").value) {
        (new bootstrap.Toast(document.getElementById('forgot_users'))).show()
        event.preventDefault()
    }
    if (!document.querySelector("#accounts").value.replace(' ', '')) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts'))).show()
        event.preventDefault()
    }
    if (!document.querySelector("#chat_to_invite").value) {
        (new bootstrap.Toast(document.getElementById('forgot_chat'))).show()
        event.preventDefault()
    }
    if (!workWithoutProxy && [...document.querySelector("#main_table").children[2].children].some(element => element.classList.contains('table-secondary') && !element.children[6].textContent)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        event.preventDefault()
    }

    let cookie_setting = {}

    if (!document.cookie) {cookie_setting = {inviter: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.inviter) {cookie_setting.inviter = {}}

    for (let id of ids_list) {
        cookie_setting.inviter[id] = document.getElementsByName(id)[0].value
    }
    cookie_setting.inviter.save_unused_audiences = document.getElementById('save_unused_audiences').checked

    document.cookie = JSON.stringify(cookie_setting)
})

setInterval(() => {
    document.getElementById('save_unused_audiences').value = document.getElementById('save_unused_audiences').checked
    document.getElementById("audience_number").textContent = document.getElementById("audience").value.split('\n').filter(item => item).length
}, 500)