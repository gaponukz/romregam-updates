const ids_list = [
    "messages_from_account", 
    "sleep_before_thread","delay_between", 
    "delay_to","threads_count", "random_persent"
]

const checkers = [
    'randimise_symbols', 'send_via_channel',
    'blacklist', 'change_accounts', 'randomise_bot',
    'randomise_reposter', 'randomise_images', 'save_unused_audiences'
]

const insertPosition = (string, position, item) => {
    return [string.slice(0, position), item, string.slice(position)].join('');
}

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.spammer) {
        for (let id of ids_list) {
            document.getElementsByName(id)[0].value = cookie_setting.spammer[id]
        }

        for (let id of checkers) {
            document.getElementById(id).checked = cookie_setting.spammer[id]
        }
        
        if (cookie_setting.spammer.send_via_channel) {
            document.getElementById("channel_name").style.removeProperty("display")
            document.getElementById("text_send_via_channel").style.display = "none"
            document.getElementById('channel_name').value  = cookie_setting.spammer.channel_name
        }
    }
}

let selected_photos = document.getElementById("selected_photos")

document.getElementById("add_photos").onclick = () => {
    selected_photos.click()
}

selected_photos.onchange = () => {
    images_list.value += `\nstatic/imgs/${[...selected_photos.files].map(item => item.name).join('\nstatic/imgs/')}`
}

document.getElementById('send_via_channel').onclick = () => {
    let checker = document.getElementById('send_via_channel')

    if (checker.checked) {
        document.getElementById("channel_name").style.removeProperty("display")
        document.getElementById("text_send_via_channel").style.display = "none"
    } else {
        document.getElementById("channel_name").style.display = "none"
        document.getElementById("text_send_via_channel").style.removeProperty("display")
    }
}

document.getElementById("spammer").addEventListener("submit", (event) => {
    if (!document.querySelector("#message_input").value) {
        (new bootstrap.Toast(document.getElementById('forgot_message'))).show()
        event.preventDefault()
    }
    if (!document.querySelector("#audience").value) {
        (new bootstrap.Toast(document.getElementById('forgot_audience'))).show()
        event.preventDefault()
    }
    if (!document.querySelector("#accounts").value.replace(' ', '')) {
        (new bootstrap.Toast(document.getElementById('no_selected_accounts'))).show()
        event.preventDefault()
    }
    if (!workWithoutProxy && [...document.querySelector("#main_table").children[2].children].some(element => element.classList.contains('table-secondary') && !element.children[6].textContent)) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        event.preventDefault()
    }
    
    let cookie_setting = {}

    if (!document.cookie) { cookie_setting = { spammer: {} } } else { cookie_setting = JSON.parse(document.cookie) }

    if (!cookie_setting.spammer) { cookie_setting.spammer = {} }

    for (let id of ids_list) {
        cookie_setting.spammer[id] = document.getElementsByName(id)[0].value
    }

    for (let id of checkers) {
        cookie_setting.spammer[id] = document.getElementById(`${id}`).checked
    }

    cookie_setting.spammer.channel_name = document.getElementById('channel_name').value

    document.cookie = JSON.stringify(cookie_setting)
})

document.getElementById("apply_bot").onclick = () => {
    if (document.getElementById("bot_messages").value) {
        document.getElementById("message_input").disabled = true
        document.getElementById("message_input").value = "Disabled. You send a messages from the PostBote."
    }
}

document.getElementById("apply_reposter").onclick = () => {
    if (document.getElementById("reposter_messages").value) {
        if (!document.getElementById("message_input").value.includes("[repost]")) {
            document.getElementById("message_input").value += "[repost]\n"
        }
    }
}

document.getElementById("apply_images").onclick = () => {
    let images = document.getElementById("images_list").value.split("\n").filter(item => item)
    if (images) {
        let image = images[0]

        if (image.includes('static/imgs') && document.getElementById("selected_photos").files) {
            document.getElementById("image").src = URL.createObjectURL(document.getElementById("selected_photos").files[0])
        } else {
            document.getElementById("image").src = images[0]
        }

        if (!document.getElementById("message_input").value.includes("[image(s)]")) {
            document.getElementById("message_input").value += "[image(s)]\n"
        }
    }
}

document.getElementById("last_message").onclick = async() => {
    if (!document.getElementById("message_input").value.includes("Disabled. You send a messages")) {
        await fetch(`/api/get_last_spam`).then(async response => await response.json()).then(async response => {
            document.getElementById("message_input").value = response.result
        })
    }
}

document.getElementById("clear").onclick = () => {
    if (!document.getElementById("message_input").value.includes("Disabled. You send a messages")) {
        document.getElementById("message_input").value = ""
    }
}

document.getElementById("bolt").onclick = () => {
    let message_input = document.getElementById("message_input")
    let cursorPosition = message_input.selectionStart

    message_input.value = insertPosition(message_input.value, cursorPosition, "** **")
    message_input.setSelectionRange(cursorPosition + 2, cursorPosition + 3)
    message_input.focus()
}

document.getElementById("italic").onclick = () => {
    let message_input = document.getElementById("message_input")
    let cursorPosition = message_input.selectionStart

    message_input.value = insertPosition(message_input.value, cursorPosition, "__ __")
    message_input.setSelectionRange(cursorPosition + 2, cursorPosition + 3)
    message_input.focus()
}

document.getElementById("code").onclick = () => {
    let message_input = document.getElementById("message_input")
    let cursorPosition = message_input.selectionStart

    message_input.value = insertPosition(message_input.value, cursorPosition, "` `")
    message_input.setSelectionRange(cursorPosition + 1, cursorPosition + 2)
    message_input.focus()
}

document.getElementById("url").onclick = () => {
    let message_input = document.getElementById("message_input")
    let cursorPosition = message_input.selectionStart

    message_input.value = insertPosition(message_input.value, cursorPosition, "[ ](https://example.com)")
    message_input.setSelectionRange(cursorPosition + 1, cursorPosition + 2)
    message_input.focus()
}

document.getElementById("spoiler").onclick = () => {
    let message_input = document.getElementById("message_input")
    let cursorPosition = message_input.selectionStart

    message_input.value = insertPosition(message_input.value, cursorPosition, "|| ||")
    message_input.setSelectionRange(cursorPosition + 2, cursorPosition + 3)
    message_input.focus()
}

setInterval(() => {
    const url_regex = /\[[^\]]*]\([^)]*\)/mg
    let url_match_result

    let regex = {
        bolt: { pattern: /\*\*(.*?)\*\*/gi, markdown: "**", html: ["<strong>", "</strong>"] },
        italic: { pattern: /\__(.*?)\__/gi, markdown: "__", html: ["<i>", "</i>"] },
        code: { pattern: /\`(.*?)\`/gi, markdown: "`", html: ["<code>", "</code>"] },
        strike: { pattern: /\~~(.*?)\~~/gi, markdown: "~~", html: ["<strike>", "</strike>"] },
        spoiler: { pattern: /\||(.*?)\||/gi, markdown: "||", html: [`<span class="spoiler">`, "</span>"] },
    }

    let message_input = document.getElementById("message_input").value
    let new_message_input = message_input

    for (let index in regex) {
        let item = regex[index]

        while ((item.match_result = item.pattern.exec(message_input)) !== null) {
            if (item.match_result.index === item.pattern.lastIndex) {
                item.pattern.lastIndex++;
            }

            item.match_result.forEach((match) => {
                new_message_input = new_message_input.replaceAll(
                    item.markdown + match + item.markdown, item.html[0] + match + item.html[1]
                )
            });
        }
    }

    while ((url_match_result = url_regex.exec(message_input)) !== null) {
        if (url_match_result.index === url_regex.lastIndex) {
            reurl_regexgex.lastIndex++;
        }

        url_match_result.forEach((match) => {
            let text = match.split("](")[0].slice(1)
            let url = match.split("](")[1].slice(0, -1)

            new_message_input = new_message_input.replaceAll(match, `<a href="${url}">${text}</a>`)

        })
    }

    const names_regex = /\{(.*?)\}/gi
    let names_match_result

    while ((names_match_result = names_regex.exec(message_input)) !== null) {
        if (names_match_result.index === names_regex.lastIndex) {
            names_regex.lastIndex++;
        }

        names_match_result.forEach((match) => {
            if (!match.includes("%") && match.includes("|") && match.includes("{")) {
                string = match.replaceAll("{", "").replaceAll("}", "")
                new_message_input = new_message_input.replaceAll(match, string.split("|")[0])
            }
        });
    }
    new_message_input = new_message_input.replaceAll("[repost]", "").replaceAll("[image(s)]", "")
    document.getElementById("message").innerHTML = new_message_input.replaceAll("\n", "<br>")
    document.getElementById("audience_number").textContent = document.getElementById("audience").value.split('\n').filter(item => item).length

    for (let id of checkers) {
        let element = document.getElementById(id)
        element.value = element.checked
    }
}, 100);

setInterval(() => {
    const randomiseChecker = document.getElementById("randimise_symbols")
    const randomiseTextBlock = document.getElementById("randomise_text_symbols_block")
    const randomPersentBlock = document.getElementById("random_persent_block")
    const randomPersentRange = document.getElementById("random_persent")

    if (randomiseChecker.checked) {
        randomiseTextBlock.style.display = "none"
        randomPersentBlock.style.removeProperty("display")
    } else {
        randomiseTextBlock.style.removeProperty("display")
        randomPersentBlock.style.display = "none"
    }

    document.getElementById("random_persent_number").textContent = randomPersentRange.value + "%"
}, 100)