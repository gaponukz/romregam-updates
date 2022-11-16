const ids_list = [
    "simple_users", "admins", "all_users", "hours",
    "online_recently", "online_last_week", "days",
    "online_last_month", "online_long_time", "leave_chat"//, "nonbots"
]

document.getElementById("pills-status-tab").onclick = () => {
    document.getElementById("text_list").style.height = "427px"
}

document.getElementById("pills-activity-tab").onclick = () => {
    document.getElementById("text_list").style.height = "404px"
}

document.getElementById("pills-channel-tab").onclick = () => {
    document.getElementById("text_list").style.height = "254px"
}

for (let id of ids_list) {
    document.querySelector(`#${id}`).addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            event.currentTarget.value = "1"
        } else {
            event.currentTarget.value = "0"
        }
    })
}
if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.audience_parser) {
        document.querySelector(`#pills-${cookie_setting.audience_parser.page || "status"}-tab`).click()

        document.getElementById('messages_count').value = cookie_setting.audience_parser.messages_count || 0
        document.getElementById('posts_count').value = cookie_setting.audience_parser.posts_count || 0
        document.getElementById('posts_timeout').value = cookie_setting.audience_parser.posts_timeout || 0
        document.getElementById('online_time').value = cookie_setting.audience_parser.online_time || 13

        for (let id of ids_list) {
            document.querySelector(`#${id}`).value = "1" ? cookie_setting.audience_parser[id] : "0"
            document.querySelector(`#${id}`).checked = cookie_setting.audience_parser[id] == "1"
        }
    }
}

document.querySelector("#audience_parser").addEventListener("submit", (event) => {
    if (!document.querySelector("#text_list").value) {
        (new bootstrap.Toast(document.getElementById('error_message'))).show()
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

    if (!document.cookie) {
        cookie_setting = { audience_parser: {} } 
    } else {
        cookie_setting = JSON.parse(document.cookie)
        cookie_setting.audience_parser = {}
    }
    // add nonbots
    for (let id of ['messages_count', "posts_count", "posts_timeout", 'simple_users', 'admins', 'all_users', 'online_recently', 'online_last_week',
        'online_last_month', 'online_long_time', 'hours', 'days', 'leave_chat', 'online_time']) {
        cookie_setting.audience_parser[id] = document.querySelector(`#${id}`).value
    }

    if (document.querySelector('#pills-status-tab').classList.contains('active')) {
        cookie_setting.audience_parser.page = "status"
    } else if (document.querySelector('#pills-activity-tab').classList.contains('active')) {
        cookie_setting.audience_parser.page = "activity"
    } else if (document.querySelector('#pills-channel-tab').classList.contains('active')) {
        cookie_setting.audience_parser.page = "channel"
    }

    if (cookie_setting.audience_parser.page == "status") {
        document.getElementById('messages_count').value = 0
        document.getElementById('posts_count').value = 0
    } else if (cookie_setting.audience_parser.page == "activity") {
        document.getElementById('posts_count').value = 0
    } else if (cookie_setting.audience_parser.page == "channel") {
        document.getElementById('messages_count').value = 0
    }

    if (cookie_setting.audience_parser.page == "status") {
        if (
            ['online_recently', 'online_last_month', 'online_last_week', 'online_long_time'].every(item => document.querySelector(`#${item}`).value == "0")
            && document.querySelector("#online_time").classList.contains('online_time_disable')
        ) {
            (new bootstrap.Toast(document.getElementById('no_status'))).show()
            event.preventDefault()
            return
        }
    }

    document.cookie = JSON.stringify(cookie_setting)
})

setInterval(() => {
    document.getElementById('textInput').textContent = document.getElementById('online_time').value
    document.getElementById("groups_number").textContent = document.getElementById("text_list").value.split('\n').filter(item => item).length

    const checkerHours = document.getElementById('hours')
    const checkerDays = document.getElementById('days')
    const inputRange = document.querySelector("#online_time")

    if (checkerHours.checked || checkerDays.checked) {
        inputRange.classList.remove("online_time_disable")
        inputRange.classList.add('online_time_able')
        inputRange.disabled = false
    } else {
        inputRange.classList.remove("online_time_able")
        inputRange.classList.add('online_time_disable')
        inputRange.disabled = true
    }
}, 1000)

const catchEndScriptInterval = setInterval(() => {
    if (find_logging_block[0].textContent .includes("--END_SCRIPT--")) {
        document.querySelector(".stage").style.display = "none"
        document.querySelector("#select_text").style.removeProperty("display")

        document.querySelector("#download_result").onclick = async () => {
            await fetch(`/api/get_last_parsed_audience`).then(async response => await response.json()).then(async response => {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: `parsed_users.txt`,
                    types: [{
                        description: 'Txt file',
                        accept: { 'text/plain': '.txt' }
                    }],
                    excludeAcceptAllOption: true
                })
            
                const writableStream = await fileHandle.createWritable()
            
                await writableStream.write(response.result)
                await writableStream.close()
            })
        }

        clearInterval(catchEndScriptInterval)
    }
}, 500)