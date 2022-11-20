const ids_list = [
    "number_of_threads", "sleep_before_thread",
    "delay_between_reaction", "delay_to_reaction",
    "delay_between_ent", "delay_to_ent",
    "see_posts"
]

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.reaction_booster) {

        for (let id of ids_list) {
            document.querySelector(`#${id}`).value =  cookie_setting.reaction_booster[id]
        }

        document.getElementById("leave").checked = cookie_setting.reaction_booster.leave
        document.getElementById("real_time").checked = cookie_setting.reaction_booster.real_time
    }
}

document.getElementById("reaction_booster").addEventListener("submit", (event) => {
    if (!document.querySelector("#groups").value) {
        (new bootstrap.Toast(document.getElementById('forgot_chats'))).show()
        event.preventDefault()
        return
    }
    if (!document.querySelector("#accounts").value.replace(' ', '')) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts'))).show()
        event.preventDefault()
        return
    }
    if (!workWithoutProxy && [...document.querySelector("#main_table").children[2].children].some(element => element.classList.contains('table-secondary') && !element.children[6].textContent)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        event.preventDefault()
        return
    }

    let cookie_setting = {}

    if (!document.cookie) {cookie_setting = {reaction_booster: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.reaction_booster) {cookie_setting.reaction_booster = {}}

    for (let id of ids_list) {
        cookie_setting.reaction_booster[id] = document.getElementsByName(id)[0].value
    }

    cookie_setting.reaction_booster.leave = document.getElementById(`leave`).checked
    cookie_setting.reaction_booster.real_time = document.getElementById("real_time").checked

    document.cookie = JSON.stringify(cookie_setting)

})

setInterval(() => {
    let leaveElement = document.getElementById("leave")
    let realTimeElement = document.getElementById("real_time")

    if (realTimeElement.checked) {
        document.getElementById('posts_to_react_element').style.display = 'none'
        document.getElementById('sleep_seconds_before_threads_element').style.display = 'none'
        document.getElementById('number_threads_element').style.display = 'none'
        document.getElementById('leave_group_element').style.display = 'none'

        document.getElementById('groups').style.height = "260px"
        document.getElementById('real_time_element').style['margin-top'] = "-22px"
    } else {
        document.getElementById('sleep_seconds_before_threads_element').style.removeProperty('display')
        document.getElementById('posts_to_react_element').style.removeProperty('display')
        document.getElementById('number_threads_element').style.removeProperty('display')
        document.getElementById('leave_group_element').style.removeProperty('display')
        
        document.getElementById('groups').style.height = "460px"
        document.getElementById('real_time_element').style.removeProperty('margin-top')
    }

    realTimeElement.value = realTimeElement.checked
    leaveElement.value = leaveElement.checked
    

    document.getElementById('select_reactions_input').value = $('#selected_reactions').val().join(" ")
    document.getElementById("groups_number").textContent = document.getElementById("groups").value.split('\n').filter(item => item).length
}, 1000)