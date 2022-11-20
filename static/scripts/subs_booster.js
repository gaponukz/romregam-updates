const ids_list = [
    "number_of_threads", "sleep_before_thread",
    "delay_between_sub", "delay_to_sub",
    "delay_between_ent", "delay_to_ent",
    "max_per_account"
]

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.subs_booster) {

        for (let id of ids_list) {
            document.querySelector(`#${id}`).value = "1" ?  cookie_setting.subs_booster[id] : "0"
        }

        document.getElementById("randomize_groups").checked = cookie_setting.subs_booster.randomize_groups
    }
}

document.getElementById("subs_booster").addEventListener("submit", (event) => {
    try {
        if (!document.querySelector("#groups").value) {
            (new bootstrap.Toast(document.getElementById('forgot_chats'))).show()
            event.preventDefault()
        }
        if (!document.querySelector("#accounts").value.replace(' ', '')) {
            (new bootstrap.Toast(document.getElementById('no_selected_accounts'))).show()
            event.preventDefault()
        }
        if (document.getElementById('number_of_threads').value > document.querySelector("#accounts").value.split().length) {
            (new bootstrap.Toast(document.getElementById('threading_problem'))).show()
            event.preventDefault()
        }
        if (!workWithoutProxy && [...document.querySelector("#main_table").children[2].children].some(element => element.classList.contains('table-secondary') && !element.children[6].textContent)) {
            (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
            event.preventDefault()
        }
    
    } catch (e) {}
    
    let cookie_setting = {}

    if (!document.cookie) {cookie_setting = {subs_booster: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.subs_booster) {cookie_setting.subs_booster = {}}

    for (let id of ids_list) {
        cookie_setting.subs_booster[id] = document.getElementsByName(id)[0].value
    }

    cookie_setting.subs_booster.randomize_groups = document.getElementById(`randomize_groups`).checked

    document.cookie = JSON.stringify(cookie_setting)

})

setInterval(() => {
    let element = document.getElementById("randomize_groups")
    element.value = element.checked

    document.getElementById("groups_number").textContent = document.getElementById("groups").value.split('\n').filter(item => item).length
}, 500)