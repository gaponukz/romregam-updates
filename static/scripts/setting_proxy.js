String.prototype.format = function () {
    return this.replace(/{([0-9]+)}/g, function(match, index) {
        return typeof arguments[index] == 'undefined' ? match : arguments[index]
    })
}

const prettyTableCounter = () => {
    let table = document.getElementById("proxies_table")
    let accounts = table.getElementsByTagName("tr")
    let index = 1;
    for (let i = 1; i < accounts.length; i++) {
        let element = accounts[i]

        if (element.style.display != "none") {
            element.children[0].innerText = ` ${index} `
            index += 1
        }
    }
}

let table = document.querySelector("#proxies_table")
let _proxies = table.children[2].children
let proxies = []

for (let i = 0; i < _proxies.length; i++) {
    if (_proxies[i].children[1].textContent) {
        proxies.push(_proxies[i])
    }
}

document.getElementById("check_all_proxies").onclick = () => {
    let blocked = []
    let ready_to_work = []

    let table = document.querySelector("#proxies_table")
    let _proxies = table.children[2].children
    let proxies = []

    for (let i = 0; i < _proxies.length; i++) {
        if (_proxies[i].children[1].textContent) {
            proxies.push(_proxies[i])
        }
    }

    new Promise(async (resolve, reject) => {
        for (let i = 0; i < proxies.length; i++) {
            let item = proxies[i].children
            let ip = item[1].textContent
            let port = item[2].textContent
            let type = item[3].textContent
            let username = item[4].textContent
            let password = item[5].textContent

            let proxy = `${ip}:${port}:${username}:${password}`

            fetch(`/api/check_proxy?proxy=${proxy}&type=${type}`)
            .then(async response => await response.json()).then(async response => {
                if (response.is_banned) {
                    blocked.push(proxies[i])
                    proxies[i].classList = ["table-warning"]
                } else {
                    ready_to_work.push(item)
                    proxies[i].classList = ["table-success"]
                }
                console.log(ready_to_work.length, blocked.length, proxies.length)
                if (ready_to_work.length + blocked.length === proxies.length) {
                    document.getElementById("proxies_stat_button").click()
                    return
                }
            }).then(() => {
                document.getElementById("check_proxies_len").textContent = blocked.length + ready_to_work.length 
                document.getElementById("not_connected_proxies_len").textContent = blocked.length
                document.getElementById("ready_to_work_proxies_len").textContent = ready_to_work.length
            })

        }
    })

    document.getElementById("submit_proxies_action").onclick = async () => {
        document.getElementById("close_proxies_stat_modal").click()
        let banned_accounts_action = document.getElementById("remove_proxies_action").value

        if (banned_accounts_action == "true") {
            for (let i = 0; i < blocked.length; i++) {
                let item = blocked[i].children
                let ip = item[1].textContent
                let port = item[2].textContent
                let username = item[4].textContent
                let password = item[5].textContent

                let proxy = `${ip}:${port}:${username}:${password}`

                await fetch(`/api/delete_proxy?proxy=${proxy}`)
                .then(async response => await response.json()).then(response => {
                    if (response.success) {
                        blocked[i].remove()
                        prettyTableCounter()
                    }
                })
                
            }
        }
    }
}

document.getElementById("delete_all_proxies").onclick = () => {
    let table = document.querySelector("#proxies_table")
    let _proxies = table.children[2].children
    let proxies = []

    for (let i = 0; i < _proxies.length; i++) {
        if (_proxies[i].children[1].textContent) {
            proxies.push(_proxies[i])
        }
    }

    fetch(`/api/delete_all_proxies`)
    .then(response => response.json()).then(response => {
        if (response.success) {
            let proxies_to_delete = []

            for (proxy of proxies) {
                if (proxy.children[1].textContent) {
                    proxies_to_delete.push(proxy)
                }
            }

            for (proxy of proxies_to_delete) {
                proxy.remove()
                prettyTableCounter()
            }
        }
    })
}

document.getElementById("add_proxies").onclick = async () => {
    let future_proxies = document.getElementById("proxies").value.split("\n")
    let proxies_type = document.getElementById("proxy_type").value

    for (let i = 0; i < future_proxies.length; i++) {
        let proxy = future_proxies[i]

        await fetch(`/api/add_proxy?proxy=${proxy}&type=${proxies_type}`)
        .then(async response => await response.json()).then(response => {
            if (response.success) {
                $(table.children[2]).prepend(`
                    <tr>
                        <td>${future_proxies.length - i}</td>
                        <td>${proxy.split(':')[0]}</td>
                        <td>${proxy.split(':')[1]}</td>
                        <td>${proxies_type.toUpperCase()}</td>
                        <td>${proxy.split(':')[2]}</td>
                        <td>${proxy.split(':')[3]}</td>
                        <td>
                            <button style="border: none; background: none; margin-right: -7px;" type="button" id="check_this_proxy">
                                <img width="20" height="20" src="https://img.icons8.com/fluency-systems-filled/100/000000/cellular-network.png"/>
                            </button>
                            <button style="border: none; background: none;" type="button" id="delete_this_proxy">
                                <img width="20" height="20" src="https://img.icons8.com/fluency-systems-filled/100/000000/delete-forever.png"/>
                            </button>
                        </td>
                    </tr>
                `)
                prettyTableCounter()
            }
        })
        if (i + 1 == future_proxies.length) {
            (new bootstrap.Toast(document.getElementById('proxies_added'))).show()
        }
    }
}

document.getElementById("clear_input").onclick = () => {
    document.getElementById("proxies").value = ""
}

setInterval(async () => {
    let check_buttons = document.querySelectorAll("#check_this_proxy")
    let delete_buttons = document.querySelectorAll("#delete_this_proxy")

    for (let i = 0; i < check_buttons.length; i++) {
        check_buttons[i].onclick = async () => {
            let parent = check_buttons[i].parentElement.parentElement
            let ip = parent.children[1].textContent
            let port = parent.children[2].textContent
            let type = parent.children[3].textContent
            let username = parent.children[4].textContent
            let password = parent.children[5].textContent

            let proxy = `${ip}:${port}:${username}:${password}`
    
            await fetch(`/api/check_proxy?proxy=${proxy}&type=${type}`)
            .then(async response => await response.json()).then(async response => {
                if (response.is_banned) {
                    parent.classList = ["table-warning"]
                } else {
                    parent.classList = ["table-success"]
                }
            })
        }
    }
    
    for (let i = 0; i < delete_buttons.length; i++) {
        delete_buttons[i].onclick = async () => {
            let parent = delete_buttons[i].parentElement.parentElement
            let ip = parent.children[1].textContent
            let port = parent.children[2].textContent
            let username = parent.children[4].textContent
            let password = parent.children[5].textContent

            let proxy = `${ip}:${port}:${username}:${password}`

            await fetch(`/api/delete_proxy?proxy=${proxy}`)
            .then(async response => await response.json()).then(response => {
                if (response.success) {
                    parent.remove()
                    prettyTableCounter()
                }
            })
        }
    }
}, 200)

setInterval(() => {
    let length = [...proxies].filter(item => item.children[1].textContent).length
    
    document.getElementById("proxies_len").textContent = length
}, 200)