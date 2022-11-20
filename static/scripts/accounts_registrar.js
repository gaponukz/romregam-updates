const ids_list = [
    "sms_service", "accounts_num", "threads_num", "country", "name_gender",
    "name_language", "sleep_before_thread", "waiting_timeout",
    "delay_between", "delay_to", "set2fa", "clients", "randomize_api",
    "randomize_devices", "randomize_versions", "set2fa", "devices",
    "versions", "lang_pack", "system_lang_pack", "skip_old_accounts"
]

let services_data = JSON.parse(document.getElementById("tokens").dataset?.tokens.replaceAll(`'`, `"`).replaceAll("None", "null"))

const service_url = {
    "smsactivate": "https://api.sms-activate.org/stubs/handler_api.php",
    "smsman": "http://api.sms-man.ru/stubs/handler_api.php",
    "smshub": "http://smshub.org/stubs/handler_api.php"
}

document.getElementById("accounts_registrar").addEventListener("submit", (event) => {
    if (document.querySelector("#sms_service").value == "Select") {
        (new bootstrap.Toast(document.getElementById('forgot_country'))).show()
        event.preventDefault()
    }

    if (!document.getElementById('country').value) {
        (new bootstrap.Toast(document.getElementById('forgot_country'))).show()
        event.preventDefault()
    }

    if (!haveFreeProxies) {
        (new bootstrap.Toast(document.getElementById('no_proxies'))).show()
        event.preventDefault()
    }
    let cookie_setting = {}

    if (!document.cookie) { cookie_setting = { accounts_registrar: {} } } else { cookie_setting = JSON.parse(document.cookie) }

    if (!cookie_setting.accounts_registrar) { cookie_setting.accounts_registrar = {} }

    for (let id of ids_list) {
        cookie_setting.accounts_registrar[id] = document.getElementById(id).value
    }

    document.cookie = JSON.stringify(cookie_setting)

})

document.getElementById('update_balance').onclick = async() => {
    const selected_service = document.getElementById("sms_service").value
    const token = services_data.filter(item => item.service == selected_service)[0]?.token

    let angle = 0
    const thisInterval = setInterval(() => {
        document.querySelector("#update_balance > img").style.transform = `rotate(${angle}deg)`
        angle += 1
    }, 5)

    await fetch(`/api/get_service_balance?selected_service=${selected_service}&token=${token}`)
        .then(async response => await response.json()).then(response => {
            document.getElementById("balance").value = response.balance || "0"
            clearInterval(thisInterval)
        })
}

document.getElementById('update_phones').onclick = async() => {
    const selected_service = document.getElementById("sms_service").value
    const token = services_data.filter(item => item.service == selected_service)[0]?.token
    const country = document.getElementById('country').value

    let angle = 0
    const thisInterval = setInterval(() => {
        document.querySelector("#update_phones > img").style.transform = `rotate(${angle}deg)`
        angle += 1
    }, 5)

    await fetch(`/api/get_service_aviable_phones?selected_service=${selected_service}&token=${token}&country=${country}`)
        .then(async response => await response.json()).then(response => {
            document.getElementById("phone_numbers").value = response.count || "0"
            clearInterval(thisInterval)
        })
}

document.getElementById('update_price').onclick = async() => {
    const selected_service = document.getElementById("sms_service").value
    const token = services_data.filter(item => item.service == selected_service)[0]?.token
    const country = document.getElementById('country').value

    let angle = 0
    const thisInterval = setInterval(() => {
        document.querySelector("#update_price > img").style.transform = `rotate(${angle}deg)`
        angle += 1
    }, 5)

    await fetch(`/api/get_service_price?selected_service=${selected_service}&token=${token}&country=${country}`)
        .then(async response => await response.json()).then(response => {
            document.getElementById("price").value = response.cost || "0"
            clearInterval(thisInterval)
        })
}

if (document.cookie) {
    let cookie_setting = JSON.parse(document.cookie)

    if (cookie_setting.accounts_registrar) {

        for (let id of ids_list) {
            try {
                document.querySelector(`#${id}`).value = cookie_setting.accounts_registrar[id]
            } catch (e) { console.log(id) }
        }
    }
}

for (let element of document.querySelectorAll(".table > tbody > tr")) {
    element.onclick = async() => {
        const selected_service = document.getElementById("sms_service").value
        const token = services_data.filter(item => item.service == selected_service)[0]?.token
        const country = element.children[0].textContent

        if (selected_service != "Select") {
            if (!element.classList.contains("table-secondary")) {
                for (let _element of document.querySelectorAll(".table > tbody > tr")) {
                    _element.classList.remove("table-secondary")
                } 
                element.classList.add("table-secondary")
                await fetch(`/api/get_service_balance?selected_service=${selected_service}&token=${token}`)
                .then(async response => await response.json()).then(response => {
                    document.getElementById("balance").value = response.balance || "0"
                })

                await fetch(`/api/get_service_aviable_phones?selected_service=${selected_service}&token=${token}&country=${country}`)
                    .then(async response => await response.json()).then(response => {
                        document.getElementById("phone_numbers").value = response.count || "0"
                    })
                
                await fetch(`/api/get_service_price?selected_service=${selected_service}&token=${token}&country=${country}`)
                    .then(async response => await response.json()).then(response => {
                        document.getElementById("price").value = response.cost || "0"
                })
            }
        }
        document.getElementById('country').value = element.children[0].textContent
        document.getElementById("close_modal").click()
    }
}

for (let id of ["randomize_api", "randomize_devices", "randomize_versions", "set2fa", "skip_old_accounts"]) {
    document.querySelector(`#${id}`).addEventListener('change', (event) => {
        if (event.currentTarget.checked) {
            event.currentTarget.value = "1"
        } else {
            event.currentTarget.value = "0"
        }
    })
}

const getBlob = urlToGet => {
    return fetch(urlToGet).then(data => data.blob());
 }
 
 const catchEndScriptInterval = setInterval(() => {
     if (find_logging_block[0].textContent .includes("--END_SCRIPT--")) {
         document.querySelector(".stage").style.display = "none"
         document.querySelector("#select_text").style.removeProperty("display")
 
         document.querySelector("#download_result").onclick = async () => {
             const fileHandle = await window.showSaveFilePicker({
                 suggestedName: `RegsiteredAccounts.zip`,
                 multiple: true,
                 types: [{
                     description: 'Zip file', 
                     accept: { 'application/zip': ['.zip'] },
                 }],
                 excludeAcceptAllOption: true
             })
             
             const writableStream = await fileHandle.createWritable()
 
             await writableStream.write(await getBlob("/api/get_last_registered_accounts"));
             await writableStream.close()
         }
 
         clearInterval(catchEndScriptInterval)
     }
 }, 500)
