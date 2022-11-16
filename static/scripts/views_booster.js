const ids_list = [
    "number_of_threads", "sleep_before_thread",
    "delay_between_views", "delay_to_views",
    "delay_between_ent", "delay_to_ent",
    "see_posts"
]

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.views_booster) {

        for (let id of ids_list) {
            document.querySelector(`#${id}`).value = "1" ?  cookie_setting.views_booster[id] : "0"
        }
        document.getElementById("leave").checked = cookie_setting.views_booster.leave
        document.getElementById("real_time").checked = cookie_setting.views_booster.real_time
    }
}

document.getElementById("views_booster").addEventListener("submit", (event) => {
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
    if (document.getElementById('number_of_threads').value >= document.querySelector("#accounts").value.split(" ").length) {
        (new bootstrap.Toast(document.getElementById('threading_problem'))).show()
        event.preventDefault()
        return
    }
    if (!workWithoutProxy && [...document.querySelector("#main_table").children[2].children].some(element => element.classList.contains('table-secondary') && !element.children[6].textContent)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        event.preventDefault()
        return
    }

    let cookie_setting = {}

    if (!document.cookie) {cookie_setting = {views_booster: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.views_booster) {cookie_setting.views_booster = {}}

    for (let id of ids_list) {
        cookie_setting.views_booster[id] = document.getElementsByName(id)[0].value
    }
    cookie_setting.views_booster.leave = document.getElementById("leave").checked
    cookie_setting.views_booster.real_time = document.getElementById("real_time").checked

    document.cookie = JSON.stringify(cookie_setting)
})
setInterval(() => {
    let leaveElement = document.getElementById("leave")
    let realTimeElement = document.getElementById("real_time")
    
    realTimeElement.value = realTimeElement.checked
    leaveElement.value = leaveElement.checked
    
    if (realTimeElement.checked) {
        document.getElementById('posts_to_see_element').style.display = 'none'
        document.getElementById('sleep_seconds_before_threads_element').style.display = 'none'
        document.getElementById('number_threads_element').style.display = 'none'
        document.getElementById('leave_group_element').style.display = 'none'

        document.getElementById('groups').style.height = "200px"
        document.getElementById('real_time_element').style['margin-top'] = "-29px"
    } else {
        document.getElementById('sleep_seconds_before_threads_element').style.removeProperty('display')
        document.getElementById('posts_to_see_element').style.removeProperty('display')
        document.getElementById('number_threads_element').style.removeProperty('display')
        document.getElementById('leave_group_element').style.removeProperty('display')
        
        document.getElementById('groups').style.height = "407px"
        document.getElementById('real_time_element').style.removeProperty('margin-top')
    }

    document.getElementById("groups_number").textContent = document.getElementById("groups").value.split('\n').filter(item => item).length
}, 200)