// to close when pressing fields for /setting_general
for (let value of ["one", "second"]) {
    document.querySelector(`#hide_${value}`).onclick = () => {
        $(`#hidden_${value}`).toggle()
    }
}

setInterval(() => {
    for (let id of ['check_proxies', 'bind_proxy', 'working_without_proxy', 'sms_man', 'smshub', 'sms_activate', "activation", "grizzlysms", "tigersms"]) {
        let checker = document.querySelector(`#${id}`)

        checker.onclick = () => {
            checker.value = checker.checked ? 1 : 0
        }
    }
}, 500)