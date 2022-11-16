const languages = ["en", "ru", "es"]
const ids_list = [
    'marketing', 'crypto', 
    'education', 'darknet',
    'adult', 'movies', 'humor'
].concat(languages)

document.getElementById("ai_worker").addEventListener("submit", (event) => {
    if (!ids_list.some(item => document.getElementById(item).checked)) {
        (new bootstrap.Toast(document.getElementById('error_message'))).show()
        event.preventDefault()
    }
    let cookie_setting = {}

    if (!document.cookie) {cookie_setting = {ai_worker: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.ai_worker) {cookie_setting.ai_worker = {}}

    for (let id of ids_list) {
        cookie_setting.ai_worker[id] = document.getElementsByName(id)[0].value
    }

    document.cookie = JSON.stringify(cookie_setting)

})  

for (let element of languages) {
    document.getElementById(element).onchange = () => {
        let other = languages.filter(item => (item != element) && document.getElementById(item).checked)
        
        if (other.length == 1) {
            document.getElementById(element).checked = true
            document.getElementById(other[0]).checked = false
        }
    }
}

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.ai_worker) {
        for (let id of ids_list) {
            document.querySelector(`#${id}`).value = cookie_setting.ai_worker[id]
            document.querySelector(`#${id}`).checked = cookie_setting.ai_worker[id] == "on"
        }
    }
} 