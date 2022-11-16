const ids = [
    "links", "video", "photo",
    "files", "_usernames", "text",
]

let accounts_elements = document.querySelector("#clients_table").children[0].children
let post_from_channels_elements = document.querySelector("#from_channels_table").children[0].children

let keywordsInputs = document.querySelectorAll("#keyword_from")
let replyKeywordsInputs = document.querySelectorAll("#keyword_to")

const createElementFromHTML = (htmlString) => {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild;
}

const updateButtons = () => {
    for (let button of document.querySelectorAll("#remove")) {
        button.onclick = () => {
            let cookie_setting = {}

            if (!document.cookie) {cookie_setting = {channel_clonner: {}}}
            else {cookie_setting = JSON.parse(document.cookie)}
    
            if (!cookie_setting.channel_clonner) {cookie_setting.channel_clonner = {}}

            if (button.parentElement.parentElement.classList.contains("start-button")) {
                if (button.parentElement.parentElement.parentElement.parentElement.id == "clients_table") {
                    $("#to_channels_table tbody").empty()
                    $("#from_channels_table tbody").empty()
                    cookie_setting.channel_clonner.clients = []
                    cookie_setting.channel_clonner.to_channels = []
                    cookie_setting.channel_clonner.from_channels = []
                }
            }
            if (button.parentElement.parentElement.parentElement.parentElement.id == "from_channels_table") {
                cookie_setting.channel_clonner.from_channels = cookie_setting.channel_clonner.from_channels.filter(
                    channel => channel.username !== button.parentElement.parentElement.children[1].children[1].textContent
                )
            }

            if (button.parentElement.parentElement.parentElement.parentElement.id == "clients_table") {
                cookie_setting.channel_clonner.clients = cookie_setting.channel_clonner.clients.filter(
                    accounts => accounts.phone !== button.parentElement.parentElement.children[1].children[1].textContent
                )
            }

            document.cookie = JSON.stringify(cookie_setting)
            button.parentElement.parentElement.remove()
        }
    }
}

const onSelectClient = (element) => {
    return async () => {
        let cookie_setting = {}

        if (!document.cookie) {cookie_setting = {channel_clonner: {}}}
        else {cookie_setting = JSON.parse(document.cookie)}

        if (!cookie_setting.channel_clonner) {cookie_setting.channel_clonner = {}}

        if (!element.classList.contains("start-button")) {
            let phone_number = element.children[1].children[1].textContent

            for(let item of document.querySelectorAll("#clients_table > tbody > tr")) {
                if (element != item) {
                    item.classList.remove("start-button")
                }
            }

            element.classList = ["start-button"]

            $("#to_channels_table tbody").empty()
            document.getElementById("selected_account").value = phone_number

            for (let account of cookie_setting.channel_clonner.clients) {
                if (account.phone === phone_number) {
                    account.selected = true
                }
            }
            
            await fetch(`/api/get_channels_where_client_admin?account=${phone_number}`)
            .then((response) => {return response.json()}).then((channels) => {
                if (channels.length === 0) {
                    (new bootstrap.Toast(document.getElementById('problem_with_client'))).show()
                    return
                }

                cookie_setting.channel_clonner.to_channels = []

                for (let channel of channels) {
                    let link = channel.username ? channel.username : channel.id

                    $("#to_channels_table tbody").append(`
                    <tr>
                        <td style="border-right: none"><img class="big-avatar" src="${channel.photo}"/></td>
                        <td style="border-left: none;">
                            <h6 class="card-title">${channel.title}</h6>
                            <h6 class="card-subtitle mb-2">${link}</h6>
                        </td>
                    </tr>`)

                    cookie_setting.channel_clonner.to_channels.push({
                        photo: channel.photo,
                        title: channel.title,
                        link: link,
                        selected: false
                    })
                }
            })
        } else {
            element.classList.remove("start-button")
            $("#to_channels_table tbody").empty()
            document.getElementById("selected_account").value = ""
            document.querySelector("#selected_to_channels").value = ""

            for (let account of cookie_setting.channel_clonner.clients) {
                if (account.phone === phone_number) {
                    account.selected = false
                }
            }
            cookie_setting.channel_clonner.to_channels = []
        }
        document.cookie = JSON.stringify(cookie_setting)
    }
}

const onAddChannelsFrom = async  () => {
    let in_channel = document.getElementById("channels_from_input").value
    let account = document.getElementById("selected_account").value

    let cookie_setting = {}

    if (!document.cookie) {cookie_setting = {channel_clonner: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.channel_clonner) {cookie_setting.channel_clonner = {}}

    if (!cookie_setting.channel_clonner.from_channels) {
        cookie_setting.channel_clonner.from_channels = []
    }

    if (in_channel && account) {
        await fetch(`/api/get_channel_data?account=${account}&channel=${in_channel}`)
        .then((response) => {return response.json()}).then((channel) => {
            if (!(channel && channel.title)) {
                (new bootstrap.Toast(document.getElementById('problem_with_client'))).show()
                return
            }

            $("#from_channels_table tbody").append(`
                <tr>
                    <td style="border-right: none" ><img class="big-avatar" src="${channel.photo}"/></td>
                    <td style="border-left: none;border-right: none">
                        <h6 class="card-title">${channel.title}</h6>
                        <h6 class="card-subtitle mb-2">${channel.username}</h6>
                    </td>
                    <td style="border-left: none"><button type="button" id="remove" class="btn-close" aria-label="Close"></button></td>
                </tr>`)
            
            cookie_setting.channel_clonner.from_channels.push({
                photo: channel.photo,
                title: channel.title,
                username: channel.username,
                selected: false
            })
        })
    }
    document.cookie = JSON.stringify(cookie_setting)
}

const onSelectFromChannel = (element) => {
    return async () => {
        let cookie_setting = {}

        if (!document.cookie) {cookie_setting = {channel_clonner: {}}}
        else {cookie_setting = JSON.parse(document.cookie)}
    
        if (!cookie_setting.channel_clonner) {cookie_setting.channel_clonner = {}}
    
        if (element.classList.contains("start-button")) {
            element.classList.remove("start-button")
            document.querySelector("#selected_from_channels").value = document.querySelector("#selected_from_channels")
                .value.replace(element.children[1].children[1].textContent, "")
            
            for (let channel of cookie_setting.channel_clonner.from_channels) {
                if (channel.username === element.children[1].children[1].textContent) {
                    channel.selected = false;
                }
            }
        
        }  else {
            element.classList = ["start-button"]

            if (!document.querySelector("#selected_from_channels").value) {
                document.querySelector("#selected_from_channels").value = 
                    element.children[1].children[1].textContent
            } else {
                document.querySelector("#selected_from_channels").value += 
                    ` ${element.children[1].children[1].textContent}`
            }

            for (let channel of cookie_setting.channel_clonner.from_channels) {
                if (channel.username === element.children[1].children[1].textContent) {
                    channel.selected = true;
                }
            }
        }
        document.cookie = JSON.stringify(cookie_setting)
    }
}

const onAddKeywords = async () => {
    let element = `<input id="keyword_from" name="keyword_from" class="form-control">`

    document.getElementById("keyword_from_body").append(createElementFromHTML(element))
    document.getElementById("keyword_from_body").append(createElementFromHTML('<br>'))

    element = `<input id="keyword_to" name="keyword_to" class="form-control">`

    document.getElementById("keyword_to_body").append(createElementFromHTML(element))
    document.getElementById("keyword_to_body").append(createElementFromHTML('<br>'))
}

setInterval(() => {    
    for (id of ids) {
        let element = document.getElementById(id)
        element.value = element.checked ? "1" : "0"
    }

    let keywords_value = document.querySelector("#keywords").value
    let list_selected = blacklist_element.classList.contains("pulse-blacklist") 
        || whitelist_element.classList.contains("pulse-whitelist")

    if (keywords_value && (!list_selected)) {
        whitelist_element.classList.add("pulse-whitelist")
        selected_list_element.value = "whitelist"
    }


    keywordsInputs = document.querySelectorAll("#keyword_from")
    replyKeywordsInputs = document.querySelectorAll("#keyword_to")
}, 100)

let whitelist_element = document.getElementById("whitelist")
let blacklist_element = document.getElementById("blacklist")
let selected_list_element = document.getElementById("selected_list")

let keylist_values = {
    whitelist: "",
    blacklist: ""
}

document.querySelector("#keywords").onchange = (event) => {
    keylist_values[selected_list.value] = event.target.value
}
whitelist_element.onclick = () => {
    document.querySelector("#keywords").value = keylist_values['whitelist']

    if (blacklist_element.classList.contains("pulse-blacklist")) {
        blacklist_element.classList.remove("pulse-blacklist")
    }
    whitelist_element.classList.add("pulse-whitelist")
    selected_list_element.value = "whitelist"
}

blacklist_element.onclick = () => {
    document.querySelector("#keywords").value = keylist_values['blacklist']

    if (whitelist_element.classList.contains("pulse-whitelist")) {
        whitelist_element.classList.remove("pulse-whitelist")
    }
        blacklist_element.classList.add("pulse-blacklist")
        selected_list_element.value = "blacklist"
}

document.getElementById("add_channels_from").onclick = onAddChannelsFrom
document.getElementById("add_keyword").onclick = onAddKeywords

$("#from_channels_table").bind("DOMSubtreeModified", () => {
    for(let element of document.querySelectorAll("#from_channels_table > tbody > tr")) {
        element.querySelector("td:nth-child(2)").onclick = onSelectFromChannel(element)
    }
    updateButtons()
})

$("#clients_table").bind("DOMSubtreeModified", () => {
    for(let element of document.querySelectorAll("#clients_table > tbody > tr")) {
        element.querySelector("td:nth-child(2)").onclick = onSelectClient(element)
    }

    $("#to_channels_table").bind("DOMSubtreeModified", () => {
        for(let element of document.querySelectorAll("#to_channels_table > tbody > tr")) {
            element.querySelector("td:nth-child(2)").onclick = () => {
                let cookie_setting = {}

                if (!document.cookie) {cookie_setting = {channel_clonner: {}}}
                else {cookie_setting = JSON.parse(document.cookie)}
        
                if (!cookie_setting.channel_clonner) {cookie_setting.channel_clonner = {}}

                if (element.classList.contains("start-button")) {
                    element.classList.remove("start-button")
                    document.querySelector("#selected_to_channels").value = document.querySelector("#selected_to_channels")
                        .value.replace(element.children[1].children[1].textContent, "")
                    
                    for (let channel of cookie_setting.channel_clonner.to_channels) {
                        if (channel.link === element.children[1].children[1].textContent) {
                            channel.selected = false;
                        }
                    }
                
                }  else {
                    element.classList = ["start-button"]
        
                    if (!document.querySelector("#selected_to_channels").value) {
                        document.querySelector("#selected_to_channels").value = 
                            element.children[1].children[1].textContent
                    } else {
                        document.querySelector("#selected_to_channels").value += 
                            ` ${element.children[1].children[1].textContent}`
                    }

                    for (let channel of cookie_setting.channel_clonner.to_channels) {
                        if (channel.link === element.children[1].children[1].textContent) {
                            channel.selected = true;
                        }
                    }
                }
                document.cookie = JSON.stringify(cookie_setting)
            }
        }
    })
    updateButtons()
})

document.querySelector("#channel_clonner").addEventListener("submit", (event) => {
    if (!document.querySelector("#accounts").value.replace(' ', '')) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts'))).show()
        event.preventDefault()
    }
    
    if (!workWithoutProxy && [...document.querySelector("#main_table").children[2].children].some(element => element.classList.contains('table-secondary') && !element.children[6].textContent)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        event.preventDefault()
    }

    let cookie_setting = {}

    if (!document.cookie) {cookie_setting = {channel_clonner: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.channel_clonner) {cookie_setting.channel_clonner = {}}

    for (let id of ids) {
        cookie_setting.channel_clonner[id] = document.querySelector(`#${id}`).value
    }

    let keywords = []
    let replyKeywords = []

    for (let i = 0; i < keywordsInputs.length; i++) {
        keywords.push(keywordsInputs[i].value)
        replyKeywords.push(replyKeywordsInputs[i].value)
    }

    cookie_setting.channel_clonner.keywords = keywords
    cookie_setting.channel_clonner.replyKeywords = replyKeywords

    document.cookie = JSON.stringify(cookie_setting)

});

(async function () {
    if (document.cookie) {
        let cookie_setting = JSON.parse(document.cookie)
    
        if (cookie_setting.channel_clonner) {
            for (let id of ids) {
                document.querySelector(`#${id}`).value = cookie_setting.channel_clonner[id] ? "1" : "0"
                document.querySelector(`#${id}`).checked = cookie_setting.channel_clonner[id] == "1"
            }

            if (!cookie_setting.channel_clonner.keywords) {
                cookie_setting.channel_clonner.keywords = []
            }

            if (!cookie_setting.channel_clonner.clients) {
                cookie_setting.channel_clonner.clients = []
            }

            if (!cookie_setting.channel_clonner.to_channels) {
                cookie_setting.channel_clonner.to_channels = []
            }

            if (!cookie_setting.channel_clonner.from_channels) {
                cookie_setting.channel_clonner.from_channels = []
            }
    
            for (let i = 0; i < cookie_setting.channel_clonner.keywords.length; i++) {
                if (keywordsInputs.length <= i) {
                    await onAddKeywords()
                }
                
                setTimeout(() => {
                    keywordsInputs[i].value = cookie_setting.channel_clonner.keywords[i]
                    replyKeywordsInputs[i].value = cookie_setting.channel_clonner.replyKeywords[i]
                }, 100)
            }

            for (let client of cookie_setting.channel_clonner.clients) {
                if (client && client.phone) {
                    if (client.selected) {
                        document.getElementById("selected_account").value = client.phone
                        document.getElementById("accounts").value = client.phone
                    }
                    $("#clients_table tbody").append(`
                        <tr ${client.selected ? 'class="start-button"' : ""}>
                            <td style="border-right: none" ><img class="big-avatar" src="${client.photo}"/></td>
                            <td style="border-left: none;border-right: none">
                                <h6 class="card-title">${client.name}</h6>
                                <h6 class="card-subtitle mb-2">${client.phone}</h6>
                            </td>
                            <td style="border-left: none"><button type="button" id="remove" class="btn-close" aria-label="Close"></button></td>
                        </tr>
                    `)
                }
            }

            for (let channel of cookie_setting.channel_clonner.to_channels) {
                if (channel && channel.link) {
                    if (channel.selected) {
                        if (!document.querySelector("#selected_to_channels").value) {
                            document.querySelector("#selected_to_channels").value = channel.link
                        } else {
                            document.querySelector("#selected_to_channels").value += ` ${channel.link}`
                        }
                    }
                    $("#to_channels_table tbody").append(`
                        <tr ${channel.selected ? 'class="start-button"' : ""}>
                            <td style="border-right: none"><img class="big-avatar" src="${channel.photo}"/></td>
                            <td style="border-left: none;">
                                <h6 class="card-title">${channel.title}</h6>
                                <h6 class="card-subtitle mb-2">${channel.link}</h6>
                            </td>
                        </tr>
                    `)
                }
            }

            for (let channel of cookie_setting.channel_clonner.from_channels) {
                if (channel && channel.username) {
                    if (channel.selected) {
                        if (!document.querySelector("#selected_from_channels").value) {
                            document.querySelector("#selected_from_channels").value = channel.username
                        } else {
                            document.querySelector("#selected_from_channels").value += ` ${channel.username}`
                        }
                    }
                    $("#from_channels_table tbody").append(`
                        <tr ${channel.selected ? 'class="start-button"' : ""}>
                            <td style="border-right: none" ><img class="big-avatar" src="${channel.photo}"/></td>
                            <td style="border-left: none;border-right: none">
                                <h6 class="card-title">${channel.title}</h6>
                                <h6 class="card-subtitle mb-2">${channel.username}</h6>
                            </td>
                            <td style="border-left: none"><button type="button" id="remove" class="btn-close" aria-label="Close"></button></td>
                        </tr>
                    `)
                }
            }

        }
    }
    
})()
