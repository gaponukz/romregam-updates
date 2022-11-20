const ids = [
    "channels", "alphabet", 
    "double_alphabet", "kombine"
]

for (let id of ids) {
    document.querySelector(`#${id}`).addEventListener('change', (event) => {
        if  (event.currentTarget.checked) {
            event.currentTarget.value = "1"
        } else {
            event.currentTarget.value = "0"
        }
    })
}

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.chat_parser) {
        for (let id of ids) {
            document.querySelector(`#${id}`).value = "1" ?  cookie_setting.chat_parser[id] : "0"
            document.querySelector(`#${id}`).checked = cookie_setting.chat_parser[id] == "1"
        }

        document.getElementById("keywords_timeout").value = cookie_setting.chat_parser.keywords_timeout
    }
}

document.querySelector("#chat_parser").addEventListener("submit", (event) => {
    if (!document.querySelector("#text_list").value) {
        (new bootstrap.Toast(document.getElementById('forgot_keywords'))).show()
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

    if (!document.cookie) {
        cookie_setting = { chat_parser: {} } 
    } else {
        cookie_setting = JSON.parse(document.cookie)
        cookie_setting.chat_parser = {}
    }


    for (id of ids.concat("keywords_timeout")) {
        cookie_setting.chat_parser[id] = document.querySelector(`#${id}`).value
    }
    document.cookie = JSON.stringify(cookie_setting)
})

const getBlob = async urlToGet => {
    return fetch(urlToGet).then(data => data.blob());
}

const catchEndScriptInterval = setInterval(() => {
    if (find_logging_block[0].textContent .includes("--END_SCRIPT--")) {
        document.querySelector(".stage").style.display = "none"
        document.querySelector("#select_text").style.removeProperty("display")

        document.querySelector("#download_result").onclick = async () => {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: `parsed_groups.xlsx`,
                types: [{
                    description: 'Txt file',
                    accept: { 'application/vnd.ms-excel': '.xlsx' }
                }],
                excludeAcceptAllOption: true
            })
        
            const writableStream = await fileHandle.createWritable()
            await writableStream.write(await getBlob("/api/get_last_parsed_groups"));
            await writableStream.close()

        }

        clearInterval(catchEndScriptInterval)
    }
}, 500)

setInterval(() => {
    let keywordsNumbers = document.querySelector("#text_list").value.split('\n').filter(item => item).length
    let allKeywordsNumbers = keywordsNumbers

    if (document.querySelector(`#alphabet`).value == "1") {
        allKeywordsNumbers += keywordsNumbers * 26
    }
    if (document.querySelector(`#double_alphabet`).value == "1") {
        allKeywordsNumbers += keywordsNumbers * Math.pow(26, 2)
    }
    if (document.querySelector(`#kombine`).value == "1") {
        if (keywordsNumbers != 1) {
            allKeywordsNumbers += keywordsNumbers ** 2
        }
    }

    if (allKeywordsNumbers) {
        document.querySelector(`#keyword_number`).textContent = allKeywordsNumbers
    }
}, 250)