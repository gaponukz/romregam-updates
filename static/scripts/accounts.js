const dead_account_image = "https://img.icons8.com/fluency-systems-filled/48/fa314a/bad-banana.png"
const not_connected_image = "https://img.icons8.com/fluency-systems-filled/48/fa314a/cellular-network.png"
const spam_block_account_image = "https://img.icons8.com/fluency-systems-filled/48/fa314a/spam-can.png"
const busy_account_image = "https://img.icons8.com/fluency-systems-filled/48/F25081/hotel-door-hanger.png"

let select_all_button = document.querySelector("#select_all")
let new_button = document.createElement("button")

new_button.setAttribute("type", "button")
new_button.setAttribute("class", "btn btn-primary btn-sm")
new_button.setAttribute("style", "border: none !important;height: 28px; padding: 2px; background-color:  #2d76cc")
new_button.setAttribute("id", "remove_all")
new_button.innerHTML = `&nbsp ${removeSecectionText} &nbsp`

new_button.onclick = () => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }
    for (let element of document.querySelectorAll("#main_table > tbody > tr")) {
        element.classList = []

        acc_elements = acc_elements.filter((elem) => {
            return elem != element
        })

        document.querySelector("#selected_accounts").value = document.querySelector("#selected_accounts")
            .value.replace(element.childNodes[1].textContent, "")
    }
    new_button.replaceWith(select_all_button)
}

let ACTIONS_STATE = false

const createElementFromHTML = (htmlString) => {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild;
}

let acc_elements = []
let URL = document.URL.split("/")[document.URL.split("/").length - 1]

const clearTable = () => {
    for (const account of acc_elements) {
        account.classList = []
    }
    document.getElementById("accounts_stat_button").style.display = "none"
    document.getElementById("close_account_stat_modal").click()
}

for (let index = 1; index <= 14; index++) {
    document.querySelector("#navbarText > ul > li.nav-item.dropdown > div").children[index].onclick = () => {
        if (acc_elements.length == 0) {
            (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        } else {
            document.querySelector("#button_with_arrow").click()
        }
    }
}

document.getElementById("accounts").onchange = () => {
    document.getElementById("accounts_form").submit()
}

// align the main field relative to the "4 icons"
document.getElementById("main_content").style["margin"] = "0px"
document.getElementById("main_content").style["margin-right"] = "1px"

for (let element of document.querySelectorAll("#main_table tbody > tr")) {
    element.onclick = () => {
        if (element.classList.length != 0) {
            document.querySelector("#selected_accounts").value = document.querySelector("#selected_accounts")
                .value.replace(element.childNodes[1].textContent, "")

            element.classList = []
            acc_elements = acc_elements.filter((elem) => {
                return elem != element
            })

        } else {
            if (!element.children[7].innerHTML.includes(busy_account_image)) {
                document.querySelector("#selected_accounts").value += ` ${element.childNodes[1].textContent}`
                element.classList = ["table-secondary"]
                acc_elements.push(element)
            }
        }

        if (acc_elements.length == 1) {
            if (select_all_button) {
                select_all_button.replaceWith(new_button)
            }
        } else if (acc_elements.length == 0) {
            new_button.replaceWith(select_all_button)
        }
    }
}

for (let element of document.querySelectorAll("#archive_table tbody > tr")) {
    element.onclick = () => {
        if (element.classList.length != 0) {
            document.querySelector("#archive_accounts").value = document.querySelector("#archive_accounts")
                .value.replace(element.childNodes[1].textContent, "")

            element.classList = []

        } else {
            element.classList = ["table-secondary"]
            document.querySelector("#archive_accounts").value += ` ${element.childNodes[1].textContent}`
        }
    }
}

select_all_button.onclick = () => {
    // button to select all accounts from the table (show in the table and append to acc_elements)
    for (let element of document.querySelectorAll("#main_table > tbody > tr")) {
        if (!(element.classList.contains("table-secondary"))) {
            if (element.cells[4].textContent && element.style.display !== "none") {
                if (!element.children[7].innerHTML.includes(busy_account_image)) {
                    element.classList = ["table-secondary"]
                    acc_elements.push(element)
    
                    document.querySelector("#selected_accounts").value += ` ${element.childNodes[1].textContent}`
                }
            }
        }
    }
    select_all_button.replaceWith(new_button)
}

let select_archive_button = document.querySelector("#select_all_archive")

select_archive_button.onclick = () => {
    for (let element of document.querySelectorAll("#archive_table > tbody > tr")) {
        if (!(element.classList.contains("table-secondary"))) {
            if (element.cells[4].textContent && element.style.display !== "none") {
                element.classList = ["table-secondary"]
                document.querySelector("#archive_accounts").value += ` ${element.childNodes[1].textContent}`
            }
        }
    }
    let new_button = document.createElement("button")
    new_button.setAttribute("type", "button")
    new_button.setAttribute("class", "btn btn-primary btn-sm")
    new_button.setAttribute("style", "border: none !important;height: 28px; padding: 2px; background-color:  #2d76cc")
    new_button.setAttribute("id", "remove_all_archive")
    new_button.innerHTML = `&nbsp ${removeSecectionText} &nbsp`

    new_button.onclick = () => {
        for (let element of document.querySelectorAll("#archive_table > tbody > tr")) {
            if ((element.classList.contains("table-secondary"))) {
                element.classList.remove("table-secondary")

                document.querySelector("#selected_accounts").value = ""
            }
        }
        new_button.replaceWith(select_archive_button)
    }

    select_archive_button.replaceWith(new_button)
}

document.getElementById("check_accounts").onclick = async() => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }

    if (accounts.some(acc => acc.phone && !(Boolean(acc.future_proxy) || Boolean(acc.proxy)))) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        return
    }

    ACTIONS_STATE = true
    document.querySelector("#button_with_arrow").click()
    document.getElementById("checkerHeader").firstChild.nodeValue = "Account check result";
    try {document.getElementById("spam_blocked_accounts_block").style.display = "none";} catch {}
    (new bootstrap.Toast(document.getElementById('checker_start'))).show()

    clearTable()
    let blocked = []
    let ready_to_work = []
    let not_connected = []

    for (let i = 0; i < acc_elements.length; i++) {
        let item = acc_elements[i]
        let account = item.children[4].textContent
        let this_account = accounts.filter(_account => _account.phone == account)[0]
        let proxy = this_account.future_proxy ? this_account.future_proxy : this_account.proxy[0]
        
        if (proxy?.proxy) {
            item.children[6].textContent = proxy.proxy.split(":")[0] + ":" + proxy.proxy.split(":")[1]
        } else if (!item.children[6].textContent) {
            (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
            ACTIONS_STATE = false
            return
        }
        // async or speed
        fetch(`/api/check_account?account=${this_account.phone}&proxy=${proxy.proxy}&pr_type=${proxy.type}`)
            .then(response => response.json()).then(response => {
                if (response.status == "no_limits") {
                    ready_to_work.push(item)
                    item.classList = ["table-success"]

                    for (let j = 0; j < item.children[7].children.length; j++) {
                        let htmlText = item.children[7].children[j].outerHTML

                        if (
                            htmlText.includes(not_connected_image) ||
                            htmlText.includes(dead_account_image)
                        ) {
                            item.children[7].children[j].remove()
                        }
                    }
                } else if (response.status == "dead") {
                    blocked.push(item)
                    item.classList = ["table-danger"]
                    if (!item.children[7].outerHTML.includes(dead_account_image)) {
                        item.children[7].prepend(createElementFromHTML(
                            `<img width="20" height="20" src="${dead_account_image}">`
                        ))
                    }

                    for (let j = 0; j < item.children[7].children.length; j++) {
                        let htmlText = item.children[7].children[j].outerHTML

                        if (htmlText.includes(not_connected_image) || htmlText.includes(spam_block_account_image)) {
                            item.children[7].children[j].remove()
                        }
                    }

                } else if (response.status == "not_connected") {
                    not_connected.push(item)
                    item.classList = ["table-warning"]

                    if (!item.children[7].outerHTML.includes(not_connected_image)) {
                        item.children[7].prepend(createElementFromHTML(
                            `<img width="20" height="20" src="${not_connected_image}">`
                        ))
                    }

                    for (let j = 0; j < item.children[7].children.length; j++) {
                        let htmlText = item.children[7].children[j].outerHTML

                        if (htmlText.includes(dead_account_image) || htmlText.includes(spam_block_account_image)) {
                            item.children[7].children[j].remove()
                        }
                    }
                }
            }).then(async() => {
                document.getElementById("check_accounts_len").textContent = blocked.length + ready_to_work.length + not_connected.length
                document.getElementById("banned_accounts_len").textContent = blocked.length
                document.getElementById("ready_to_work_accounts_len").textContent = ready_to_work.length
                document.getElementById("not_connected_accounts_len").textContent = not_connected.length

                if (blocked.length + ready_to_work.length + not_connected.length == acc_elements.length) {
                    (new bootstrap.Toast(document.getElementById('checker_ended'))).show()
                    ACTIONS_STATE = false
                }
            }).catch(error => {
                ready_to_work.push(item)
                item.classList = ["table-success"]

                for (let j = 0; j < item.children[7].children.length; j++) {
                    let htmlText = item.children[7].children[j].outerHTML

                    if (
                        htmlText.includes(not_connected_image) ||
                        htmlText.includes(dead_account_image)
                    ) {
                        item.children[7].children[j].remove()
                    }
                }
            })
    }


    document.getElementById("accounts_stat_button").style.removeProperty("display")


    document.getElementById("submit_accounts_action").onclick = async() => {
        if (ACTIONS_STATE) {
            (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
            ACTIONS_STATE = true
            return
        }

        ACTIONS_STATE = true

        let banned_accounts_action = document.getElementById("banned_accounts_action").value

        switch (banned_accounts_action) {
            case "move_to_archive":
                for (let i = 0; i < blocked.length; i++) {
                    let item = blocked[i]
                    let account = item.children[4].textContent

                    fetch(`/api/move_account_to_archive?account=${account}`)
                        .then(async response => await response.json()).then(response => {
                            if (response.success) {
                                acc_elements = acc_elements.filter(elem => item != elem)
                                blocked = blocked.filter(elem => item != elem)

                                item.remove()
                                prettyTableCounter()
                            }
                            if (blocked.length == 0) {
                                (new bootstrap.Toast(document.getElementById('accounts_archived'))).show()
                                setTimeout(() => { document.getElementById("remove_all")?.click(); }, 1000)
                                setTimeout(() => { window.location.reload(true) }, 5000)
                                ACTIONS_STATE = false
                            }
                        })
                }

            case "delete":
                for (let i = 0; i < blocked.length; i++) {
                    let item = blocked[i]
                    let account = item.children[4].textContent

                    fetch(`/api/delete_account?account=${account}`)
                        .then(async response => await response.json()).then(response => {
                            if (response.success) {
                                acc_elements = acc_elements.filter(elem => item != elem)
                                blocked = blocked.filter(elem => item != elem)
                                item.remove()
                                prettyTableCounter()
                            }
                        })
                    if (blocked.length == 0) {
                        (new bootstrap.Toast(document.getElementById('accounts_deleted'))).show()
                        setTimeout(() => { document.getElementById("remove_all")?.click(); }, 1000)
                        setTimeout(() => { window.location.reload(true) }, 5000)
                        ACTIONS_STATE = false
                    }
                }
        }

        document.getElementById("close_account_stat_modal").click()
        document.getElementById("accounts_stat_button").style.display = "none"
        ACTIONS_STATE = false

    }
}

document.getElementById("spam_check_accounts").onclick = async() => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }

    if (accounts.some(acc => acc.phone && !(Boolean(acc.future_proxy) || Boolean(acc.proxy)))) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        return
    }

    ACTIONS_STATE = true

    document.querySelector("#button_with_arrow").click()
    document.getElementById("checkerHeader").firstChild.nodeValue = "Spam block check results";
    try {document.getElementById("spam_blocked_accounts_block").style.removeProperty("display")} catch {}
    (new bootstrap.Toast(document.getElementById('checker_start'))).show()
    clearTable()
    let blocked = []
    let spam_block_accounts = []
    let ready_to_work = []
    let not_connected = []

    for (let i = 0; i < acc_elements.length; i++) {
        let item = acc_elements[i]
        let account = item.children[4].textContent
        let this_account = accounts.filter(_account => _account.phone == account)[0]
        let proxy = this_account.future_proxy ? this_account.future_proxy : this_account.proxy[0]

        if (proxy?.proxy) {
            item.children[6].textContent = proxy.proxy.split(":")[0] + ":" + proxy.proxy.split(":")[1]
        } else if (!item.children[6].textContent) {
            (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
            ACTIONS_STATE = false
            return
        }
        // async or speed
        fetch(`/api/spam_check_account?account=${account}&proxy=${proxy.proxy}&pr_type=${proxy.type}`)
            .then(async response => await response.json()).then(response => {
                if (response.status == "dead") {
                    blocked.push(item)
                    item.classList = ["table-danger"]

                    if (!item.children[7].outerHTML.includes(dead_account_image)) {
                        item.children[7].prepend(createElementFromHTML(
                            `<img width="20" height="20" src="${dead_account_image}">`
                        ))
                    }

                    for (let j = 0; j < item.children[7].children.length; j++) {
                        let htmlText = item.children[7].children[j].outerHTML

                        if (htmlText.includes(not_connected_image) || htmlText.includes(spam_block_account_image)) {
                            item.children[7].children[j].remove()
                        }
                    }

                } else if (response.status == "spam_block") {
                    spam_block_accounts.push(item)
                    item.classList = ["table-danger"]

                    if (!item.children[7].outerHTML.includes(spam_block_account_image)) {
                        item.children[7].prepend(createElementFromHTML(
                            `<img width="20" height="20" src="${spam_block_account_image}">`
                        ))
                    }

                    for (let j = 0; j < item.children[7].children.length; j++) {
                        let htmlText = item.children[7].children[j].outerHTML

                        if (htmlText.includes(dead_account_image) || htmlText.includes(not_connected_image)) {
                            item.children[7].children[j].remove()
                        }
                    }

                } else if (response.status == "no_limits") {
                    ready_to_work.push(item)
                    item.classList = ["table-success"]
                    for (let j = 0; j < item.children[7].children.length; j++) {
                        let htmlText = item.children[7].children[j].outerHTML

                        if (
                            htmlText.includes(not_connected_image) ||
                            htmlText.includes(spam_block_account_image) ||
                            htmlText.includes(dead_account_image)
                        ) {
                            item.children[7].children[j].remove()
                        }
                    }

                } else if (response.status == "not_connected") {
                    not_connected.push(item)
                    item.classList = ["table-warning"]

                    if (!item.children[7].outerHTML.includes(not_connected_image)) {
                        item.children[7].prepend(createElementFromHTML(
                            `<img width="20" height="20" src="${not_connected_image}">`
                        ))
                    }

                    for (let j = 0; j < item.children[7].children.length; j++) {
                        let htmlText = item.children[7].children[j].outerHTML

                        if (htmlText.includes(dead_account_image) || htmlText.includes(spam_block_account_image)) {
                            item.children[7].children[j].remove()
                        }
                    }
                }
            }).then(async() => {
                document.getElementById("check_accounts_len").textContent =
                    blocked.length + spam_block_accounts.length + ready_to_work.length + not_connected.length

                document.getElementById("banned_accounts_len").textContent = blocked.length
                document.getElementById("spam_blocked_accounts_len").textContent = spam_block_accounts.length
                document.getElementById("ready_to_work_accounts_len").textContent = ready_to_work.length
                document.getElementById("not_connected_accounts_len").textContent = not_connected.length

                if (blocked.length + ready_to_work.length + not_connected.length + spam_block_accounts.length == acc_elements.length) {
                    (new bootstrap.Toast(document.getElementById('checker_ended'))).show()
                    ACTIONS_STATE = false
                }
            }).catch(error => {
                ready_to_work.push(item)
                item.classList = ["table-success"]
                for (let j = 0; j < item.children[7].children.length; j++) {
                    let htmlText = item.children[7].children[j].outerHTML

                    if (
                        htmlText.includes(not_connected_image) ||
                        htmlText.includes(spam_block_account_image) ||
                        htmlText.includes(dead_account_image)
                    ) {
                        item.children[7].children[j].remove()
                    }
                }
            })
    }

    document.getElementById("accounts_stat_button").style.removeProperty("display")


    document.getElementById("submit_accounts_action").onclick = async() => {
        ACTIONS_STATE = true

        let banned_accounts_action = document.getElementById("banned_accounts_action").value
        let spam_blocked_accounts_action = document.getElementById("spam_blocked_accounts_action").value

        switch (banned_accounts_action) {
            case "move_to_archive":
                for (let i = 0; i < blocked.length; i++) {
                    let item = blocked[i]
                    let account = item.children[4].textContent

                    fetch(`/api/move_account_to_archive?account=${account}`)
                        .then(async response => await response.json()).then(response => {
                            if (response.success) {
                                acc_elements = acc_elements.filter(elem => item != elem)
                                blocked = blocked.filter(elem => item != elem)
                                item.remove()
                                prettyTableCounter()
                            }
                            if (blocked.length == 0) {
                                (new bootstrap.Toast(document.getElementById('accounts_archived'))).show()
                                ACTIONS_STATE = false
                                setTimeout(() => { document.getElementById("remove_all")?.click(); }, 1000)
                                setTimeout(() => { window.location.reload(true) }, 5000)
                            }
                        })
                }
                break

            case "delete":
                for (let i = 0; i < blocked.length; i++) {
                    let item = blocked[i]
                    let account = item.children[4].textContent

                    fetch(`/api/delete_account?account=${account}`)
                        .then(async response => await response.json()).then(response => {
                            if (response.success) {
                                acc_elements = acc_elements.filter(elem => item != elem)
                                blocked = blocked.filter(elem => item != elem)
                                item.remove()
                                prettyTableCounter()
                            }
                            if (blocked.length == 0) {
                                (new bootstrap.Toast(document.getElementById('accounts_deleted'))).show()
                                ACTIONS_STATE = false
                                setTimeout(() => { document.getElementById("remove_all")?.click(); }, 1000)
                                setTimeout(() => { window.location.reload(true) }, 5000)
                            }
                        })
                }
                break
        }

        switch (spam_blocked_accounts_action) {
            case "move_to_archive":
                for (let i = 0; i < spam_block_accounts.length; i++) {
                    let item = spam_block_accounts[i]
                    let account = item.children[4].textContent

                    fetch(`/api/move_account_to_archive?account=${account}`)
                        .then(async response => await response.json()).then(response => {
                            if (response.success) {
                                acc_elements = acc_elements.filter(elem => item != elem)
                                spam_block_accounts = spam_block_accounts.filter(elem => item != elem)
                                item.remove()
                                prettyTableCounter()
                            }
                            if (spam_block_accounts.length == 0) {
                                (new bootstrap.Toast(document.getElementById('accounts_archived'))).show()
                                ACTIONS_STATE = false
                                setTimeout(() => { document.getElementById("remove_all")?.click(); }, 1000)
                                setTimeout(() => { window.location.reload(true) }, 5000)
                            }
                        })
                    item.remove()
                }
                break

            case "delete":
                for (let i = 0; i < spam_block_accounts.length; i++) {
                    let item = spam_block_accounts[i]
                    let account = item.children[4].textContent

                    fetch(`/api/delete_account?account=${account}`)
                        .then(async response => await response.json()).then(response => {
                            if (response.success) {
                                acc_elements = acc_elements.filter(elem => item != elem)
                                spam_block_accounts = spam_block_accounts.filter(elem => item != elem)
                                item.remove()
                                prettyTableCounter()
                            }
                            if (spam_block_accounts.length == 0) {
                                (new bootstrap.Toast(document.getElementById('accounts_deleted'))).show()
                                setTimeout(() => { document.getElementById("remove_all")?.click(); }, 1000)
                                setTimeout(() => { window.location.reload(true) }, 5000)
                                ACTIONS_STATE = false
                            }
                        })
                }
                break

            default:
                ACTIONS_STATE = false
        }
        document.getElementById("close_account_stat_modal").click()
        document.getElementById("accounts_stat_button").style.display = "none"
    }
}

for (let pair of [{ proxy: "set_up_photo_proxy_button", button: "set_avatar_button" }, { proxy: "set_usernames_proxy_button", button: "update_usernames_button" }, { proxy: "set_names_proxy_button", button: "update_names_button" }, { proxy: "set_bio_proxy_button", button: "update_bio_button" }]) {
    document.getElementById(pair.proxy).onclick = () => {
        if (acc_elements.length == 0) {
            (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        } else {
            document.querySelector("#button_with_arrow").click()
            if (!ACTIONS_STATE) {
                document.getElementById(pair.button).click()
            } else {
                (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
            }
        }
    }
}

let set_photo_content = document.getElementById("set_photo_content")
let selected_photos = document.getElementById("selected_photos")


document.getElementById("add_photos").onclick = () => {
    selected_photos.click()
}

document.getElementById("reset_photos").onclick = () => {
    selected_photos.value = ""
}

document.getElementById("submit_set_photo").onclick = async() => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }

    if (!workWithoutProxy && acc_elements.every(acc => acc.children[6].textContents)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        return
    }

    if (selected_photos.files.length < acc_elements.length) {
        return
    }

    ACTIONS_STATE = true

    document.getElementById("close_set_avatar_modal").click()
    clearTable()

    for (let i = 0; i < acc_elements.length; i++) {
        let account = acc_elements[i].children[4].textContent
        let data = new FormData()
        data.append("photo", selected_photos.files[i])

        fetch(`/api/update_photo?account=${account}`, { method: 'POST', body: data })
            .then(async response => await response.json()).then((result) => {
                if (result.success) {
                    acc_elements[i].children[1].children[0].src = `/static/imgs/${selected_photos.files[i].name}`
                    acc_elements[i].classList = ["table-success"]
                } else {
                    acc_elements[i].classList = ["table-danger"]
                }
                if (acc_elements.every(account => account.classList.contains("table-danger") || account.classList.contains("table-success"))) {
                    (new bootstrap.Toast(document.getElementById('photo_were_setup'))).show()
                    ACTIONS_STATE = false
                }
            })
    }
}

let file_list_usernames = document.getElementById("file_list_usernames")

file_list_usernames.addEventListener('change', () => {
    let file = new FileReader()
    file.onload = () => {
        document.querySelector("#usernames_list").value = file.result
    }

    file.readAsText(file_list_usernames.files[0])
})

let set_random_usernames = document.getElementById("set_random_usernames")
let set_usernames_content = document.getElementById("set_usernames_content")
let usernames_ellement = document.getElementById("usernames_list")

set_random_usernames.addEventListener('change', () => {
    if (set_random_usernames.checked) {
        set_usernames_content.style.display = "none"
    } else {
        set_usernames_content.style.removeProperty("display")
    }
})

document.getElementById("submit_update_usernames").onclick = async() => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }

    if (!workWithoutProxy && acc_elements.every(acc => acc.children[6].textContents)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        return
    }

    let usernames = usernames_ellement.value.split("\n").filter(item => item)

    if (!set_random_usernames.checked && usernames.length < acc_elements.length) {
        return
    }

    ACTIONS_STATE = true

    document.getElementById("close_update_usernames_modal").click()
    clearTable()

    if (!set_random_usernames.checked) {
        for (let i = 0; i < acc_elements.length; i++) {
            let account = acc_elements[i].children[4].textContent

            fetch(`/api/update_username?account=${account}&username=${usernames[i]}`)
                .then(async response => await response.json()).then(response => {
                    if (response.success) {
                        acc_elements[i].children[2].textContent = usernames[i]
                        acc_elements[i].classList = ["table-success"]

                        for (let j = 0; j < acc_elements[i].children[7].children.length; j++) {
                            let htmlText = acc_elements[i].children[7].children[j].outerHTML

                            if (
                                htmlText.includes(not_connected_image) ||
                                htmlText.includes(spam_block_account_image) ||
                                htmlText.includes(dead_account_image)
                            ) {
                                acc_elements[i].children[7].children[j].remove()
                            }
                        }
                    } else {
                        acc_elements[i].classList = ["table-danger"]
                    }
                    if (acc_elements.every(account => account.classList.contains("table-danger") || account.classList.contains("table-success"))) {
                        (new bootstrap.Toast(document.getElementById('usernames_were_setup'))).show()

                        if (acc_elements.some(account => account.classList.contains("table-danger"))) {
                            setTimeout(() => {
                                (new bootstrap.Toast(document.getElementById('usernames_were_setup_warning'))).show()
                            }, 2500)
                        }
                        ACTIONS_STATE = false
                    }
                })
        }
    } else {
        for (let i = 0; i < acc_elements.length; i++) {
            let account = acc_elements[i].children[4].textContent

            fetch(`/api/update_username?account=${account}`)
                .then(async api_response => await api_response.json()).then(api_response => {
                    if (api_response.success) {
                        acc_elements[i].children[2].textContent = api_response.username
                        acc_elements[i].classList = ["table-success"]
                        for (let j = 0; j < acc_elements[i].children[7].children.length; j++) {
                            let htmlText = acc_elements[i].children[7].children[j].outerHTML

                            if (
                                htmlText.includes(not_connected_image) ||
                                htmlText.includes(spam_block_account_image) ||
                                htmlText.includes(dead_account_image)
                            ) {
                                acc_elements[i].children[7].children[j].remove()
                            }
                        }

                    } else {
                        acc_elements[i].classList = ["table-danger"]
                    }
                    if (acc_elements.every(account => account.classList.contains("table-danger") || account.classList.contains("table-success"))) {
                        (new bootstrap.Toast(document.getElementById('usernames_were_setup'))).show()
                        if (acc_elements.some(account => account.classList.contains("table-danger"))) {
                            setTimeout(() => {
                                (new bootstrap.Toast(document.getElementById('usernames_were_setup_warning'))).show()
                            }, 2500)
                        }
                        ACTIONS_STATE = false
                    }
                })
        }
    }
}

let file_list_names = document.getElementById("file_list_names")

file_list_names.addEventListener('change', () => {
    let file = new FileReader()
    file.onload = () => {
        document.querySelector("#names_list").value = file.result
    }

    file.readAsText(file_list_names.files[0])
})

let set_random_names = document.getElementById("set_random_names")
let set_names_content = document.getElementById("set_names_content")
let names_ellement = document.getElementById("names_list")

set_random_names.addEventListener('change', () => {
    if (set_random_names.checked) {
        set_names_content.style.display = "none"
    } else {
        set_names_content.style.removeProperty("display")
    }
})

document.getElementById("submit_update_names").onclick = async(event) => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }

    if (!workWithoutProxy && acc_elements.every(acc => acc.children[6].textContents)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        return
    }

    let names = names_ellement.value.split("\n").filter(item => item)

    if (!set_random_names.checked && names.length < acc_elements.length) {
        return
    }

    ACTIONS_STATE = true

    document.getElementById("close_update_names_modal").click()
    clearTable()

    if (!set_random_names.checked) {
        for (let i = 0; i < acc_elements.length; i++) {
            let account = acc_elements[i].children[4].textContent
            let first_name = names[i].split(" ")[0]
            let last_name = names[i].split(" ").length >= 2 ? names[i].split(" ")[1] : ""

            fetch(`/api/update_names?account=${account}&first_name=${first_name}&last_name=${last_name}`)
                .then(async api_response => await api_response.json()).then(response => {
                    if (response.success) {
                        acc_elements[i].children[3].textContent = `${first_name} ${last_name}`
                        acc_elements[i].classList = ["table-success"]

                        for (let j = 0; j < acc_elements[i].children[7].children.length; j++) {
                            let htmlText = acc_elements[i].children[7].children[j].outerHTML

                            if (
                                htmlText.includes(not_connected_image) ||
                                htmlText.includes(spam_block_account_image) ||
                                htmlText.includes(dead_account_image)
                            ) {
                                acc_elements[i].children[7].children[j].remove()
                            }
                        }
                    } else {
                        acc_elements[i].classList = ["table-danger"]
                    }
                    if (acc_elements.every(account => account.classList.contains("table-danger") || account.classList.contains("table-success"))) {
                        (new bootstrap.Toast(document.getElementById('names_were_setup'))).show()
                        ACTIONS_STATE = false
                    }
                })
        }
    } else {
        for (let i = 0; i < acc_elements.length; i++) {
            let account = acc_elements[i].children[4].textContent

            fetch(`/api/update_names?account=${account}`)
                .then(async api_response => await api_response.json()).then(api_response => {
                    if (api_response.success) {
                        acc_elements[i].children[3].textContent = `${api_response.first_name} ${api_response.last_name}`
                        acc_elements[i].classList = ["table-success"]

                        for (let j = 0; j < acc_elements[i].children[7].children.length; j++) {
                            let htmlText = acc_elements[i].children[7].children[j].outerHTML

                            if (
                                htmlText.includes(not_connected_image) ||
                                htmlText.includes(spam_block_account_image) ||
                                htmlText.includes(dead_account_image)
                            ) {
                                acc_elements[i].children[7].children[j].remove()
                            }
                        }
                    } else {
                        acc_elements[i].classList = ["table-danger"]
                    }
                    if (acc_elements.every(account => account.classList.contains("table-danger") || account.classList.contains("table-success"))) {
                        (new bootstrap.Toast(document.getElementById('names_were_setup'))).show()
                        ACTIONS_STATE = false
                    }
                })
        }
    }
}

let bio_ellement = document.getElementById("bio_list")

document.getElementById("submit_update_bio").onclick = async() => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }
    
    if (!workWithoutProxy && acc_elements.every(acc => acc.children[6].textContents)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        return
    }

    let bios = bio_ellement.value.split("\n").filter(item => item)

    if (bios.length < acc_elements.length) {
        return
    }

    ACTIONS_STATE = true

    document.getElementById("close_update_bio_modal").click()
    clearTable()

    const success_image = "https://img.icons8.com/fluency-systems-filled/48/4a90e2/magical-scroll.png"

    for (let i = 0; i < acc_elements.length; i++) {
        let account = acc_elements[i].children[4].textContent
        let bio = bios[i]

        fetch(`/api/update_bio?account=${account}&bio=${bio}`)
            .then(async api_response => await api_response.json()).then(response => {
                if (response.success) {
                    if (!acc_elements[i].children[7].outerHTML.includes(success_image)) {
                        acc_elements[i].children[7].append(createElementFromHTML(
                            `<img width="20" height="20" src="${success_image}">`
                        ))
                    }
                    acc_elements[i].classList = ["table-success"]

                    for (let j = 0; j < acc_elements[i].children[7].children.length; j++) {
                        let htmlText = acc_elements[i].children[7].children[j].outerHTML

                        if (
                            htmlText.includes(not_connected_image) ||
                            htmlText.includes(spam_block_account_image) ||
                            htmlText.includes(dead_account_image)
                        ) {
                            acc_elements[i].children[7].children[j].remove()
                        }
                    }
                } else {
                    acc_elements[i].classList = ["table-danger"]
                }
                if (acc_elements.every(account => account.classList.contains("table-danger") || account.classList.contains("table-success"))) {
                    (new bootstrap.Toast(document.getElementById('bios_were_setup'))).show()
                    ACTIONS_STATE = false
                }
            })
    }
}

document.getElementById("move_account_to_archive").onclick = async() => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }

    ACTIONS_STATE = true
    document.querySelector("#button_with_arrow").click()

    for (let i = 0; i < acc_elements.length; i++) {
        let item = acc_elements[i]
        let account = item.children[4].textContent

        fetch(`/api/move_account_to_archive?account=${account}`)
            .then(async response => await response.json()).then(response => {
                if (response.success) {
                    item.remove()
                    acc_elements = acc_elements.filter((elem) => {
                        return elem != item
                    })
                    prettyTableCounter()
                }
                if (acc_elements.length == 0) {
                    (new bootstrap.Toast(document.getElementById('accounts_archived'))).show()
                    setTimeout(() => { document.getElementById("remove_all")?.click(); }, 1000)
                    setTimeout(() => { window.location.reload(true) }, 5000)
                    ACTIONS_STATE = false
                }
            })
    }
}

document.getElementById("delete_account").onclick = async() => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }

    ACTIONS_STATE = true
    document.querySelector("#button_with_arrow").click()

    for (let i = 0; i < acc_elements.length; i++) {
        let item = acc_elements[i]
        let account = item.children[4].textContent

        fetch(`/api/delete_account?account=${account}`)
            .then(async response => await response.json()).then(response => {
                if (response.success) {
                    item.remove()
                    acc_elements = acc_elements.filter((elem) => {
                        return elem != item
                    })
                    prettyTableCounter()
                }
                if (acc_elements.length == 0) {
                    (new bootstrap.Toast(document.getElementById('accounts_deleted'))).show()
                    setTimeout(() => { document.getElementById("remove_all")?.click(); }, 1000)
                    setTimeout(() => { window.location.reload(true) }, 5000)
                    ACTIONS_STATE = false
                }
            })
    }
}

document.getElementById("set_account_2_fa").onclick = async() => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }
    if (!workWithoutProxy && acc_elements.every(acc => acc.children[6].textContents)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        return
    }

    ACTIONS_STATE = true

    document.querySelector("#button_with_arrow").click()
    clearTable()

    const success_image = "https://img.icons8.com/fluency-systems-filled/48/4a90e2/key.png"

    for (let i = 0; i < acc_elements.length; i++) {
        let item = acc_elements[i]
        let account = item.children[4].textContent
        let password = Math.random().toString(36).slice(-8) +
            Math.random().toString(36).slice(-8);

        fetch(`/api/set_password?account=${account}&password=${password}`)
            .then(async response => await response.json()).then(response => {
                if (response.success) {
                    if (!item.children[7].outerHTML.includes(success_image)) {
                        item.children[7].append(createElementFromHTML(
                            `<img width="20" height="20" src="${success_image}">`
                        ))
                    }

                    acc_elements[i].classList = ["table-success"]

                    for (let j = 0; j < acc_elements[i].children[7].children.length; j++) {
                        let htmlText = acc_elements[i].children[7].children[j].outerHTML

                        if (
                            htmlText.includes(not_connected_image) ||
                            htmlText.includes(spam_block_account_image) ||
                            htmlText.includes(dead_account_image)
                        ) {
                            acc_elements[i].children[7].children[j].remove()
                        }
                    }
                } else {
                    acc_elements[i].classList = ["table-danger"]
                }
                if (acc_elements.every(account => account.classList.contains("table-danger") || account.classList.contains("table-success"))) {
                    (new bootstrap.Toast(document.getElementById('passoword_were_setup'))).show()
                    ACTIONS_STATE = false
                }
            })
    }
}

document.getElementById('clear_proxy').onclick = async () => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }

    ACTIONS_STATE = true
    document.querySelector("#button_with_arrow").click()

    for (let i = 0; i < acc_elements.length; i++) {
        let item = acc_elements[i]
        let account = item.children[4].textContent

        fetch(`/api/clear_account_proxy?account=${account}`)
            .then(async response => await response.json()).then(response => {
                if (response.success) {
                    item.children[6].textContent = ""
                }
                if (acc_elements.every(acc => acc.children[6].textContent === "")) {
                    (new bootstrap.Toast(document.getElementById('account_proxy_cleared'))).show()
                    ACTIONS_STATE = false
                }
            })
    }
}

document.getElementById('update_lifetime').onclick = async () => {
    if (ACTIONS_STATE) {
        (new bootstrap.Toast(document.getElementById('accounts_busy_message'))).show()
        return
    }

    if (!acc_elements.length) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts_error_message'))).show()
        return
    }

    ACTIONS_STATE = true
    document.querySelector("#button_with_arrow").click()

    for (let i = 0; i < acc_elements.length; i++) {
        let item = acc_elements[i]
        let account = item.children[4].textContent

        fetch(`/api/update_lifetime?account=${account}`)
            .then(async response => await response.json()).then(response => {
                if (response.success) {
                    item.children[5].textContent = "1 days"
                }
                if (acc_elements.every(acc => acc.children[5].textContent === "1 days")) {
                    (new bootstrap.Toast(document.getElementById('account_lifetime_updated'))).show()
                    ACTIONS_STATE = false
                }
            })
    }
}

setInterval(() => {
    let selected_accounts_length = acc_elements.length ? acc_elements.length : 0
    let accounts_required_elements = document.querySelectorAll("#accounts_required")
    let accounts_choosen_elements = document.querySelectorAll("#accounts_choosen")

    document.getElementById("required_photo_len").innerText = selected_photos.files.length
    document.getElementById("required_usernames_len").innerText = usernames_ellement
        .value.split("\n").filter(item => item).length

    document.getElementById("required_names_len").innerText = names_ellement
        .value.split("\n").filter(item => item).length

    document.getElementById("required_bio_len").innerText = bio_ellement
        .value.split("\n").filter(item => item).length

    for (let i = 0; i < accounts_required_elements.length; i++) {
        accounts_required_elements[i].innerText = selected_accounts_length
    }

    for (let i = 0; i < accounts_choosen_elements.length; i++) {
        accounts_choosen_elements[i].innerText = `${selected_accounts_length} accounts chosen`
    }
}, 400)
