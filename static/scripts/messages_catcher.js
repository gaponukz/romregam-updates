const ids = ['reply', 'forward_to_chat']
let keywordInputs = document.getElementsByName('triger_keyword')
let replyToKeywordInputs = document.getElementsByName('message_to_reply')

setInterval(() => {
    let checkbox = document.querySelector("#reply")

    keywordInputs = document.getElementsByName('triger_keyword')
    replyToKeywordInputs = document.getElementsByName('message_to_reply')

    checkbox.value = checkbox.checked
}, 100)

document.querySelector("#add_to_first_col").onclick = () => {
    $("#first_col_body").append(`<input name="triger_keyword" class="form-control"> <br>`)
}

document.querySelector("#add_to_second_col").onclick = () => {
    $("#second_col_body").append(`<input name="message_to_reply" class="form-control"> <br>`)
}

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.messages_catcher) {
        for (const id of ids) {
            document.getElementById(id).value = cookie_setting.messages_catcher[id]
        }
        
        for (let i = 0; i < cookie_setting.messages_catcher.keywords.length; i++) {
            if (keywordInputs.length <= i) {
                document.getElementById('add_to_first_col').click()
            }
            keywordInputs[i].value = cookie_setting.messages_catcher.keywords[i]
        }

        for (let i = 0; i < cookie_setting.messages_catcher.replyToKeywords.length; i++) {
            if (replyToKeywordInputs.length <= i) {
                document.getElementById('add_to_second_col').click()
            }
            replyToKeywordInputs[i].value = cookie_setting.messages_catcher.replyToKeywords[i]
        }
    }
}

document.getElementById('messages_catcher').onsubmit = (event) => {
    if (!document.querySelector("#forward_from_chats").value) {
        (new bootstrap.Toast(document.getElementById('forgot_chats'))).show()
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

    if (!document.cookie) {cookie_setting = {messages_catcher: {}}}
    else {cookie_setting = JSON.parse(document.cookie)}

    if (!cookie_setting.messages_catcher) {cookie_setting.messages_catcher = {}}

    for (const id of ids) {
        cookie_setting.messages_catcher[id] = document.getElementById(id).value
    }

    let keywords = []
    let replyToKeywords = []

    for (let i = 0; i < keywordInputs.length; i++) {
        keywords.push(keywordInputs[i].value)
    }

    for (let i = 0; i < replyToKeywordInputs.length; i++) {
        replyToKeywords.push(replyToKeywordInputs[i].value)
    }

    cookie_setting.messages_catcher.keywords = keywords
    cookie_setting.messages_catcher.replyToKeywords = replyToKeywords

    document.cookie = JSON.stringify(cookie_setting)
}
