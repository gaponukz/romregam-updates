const prettyTableCounter = () => {
    let table = document.getElementById("main_table")
    let accounts = table.getElementsByTagName("tr")
    let index = 1;
    for (let i = 1; i < accounts.length; i++) {
        let element = accounts[i]

        if (element.style.display != "none") {
            element.children[0].innerText = ` ${index} `
            index += 1
        }
    }

    table = document.getElementById("archive_table")

    if (table) {
        accounts = table.getElementsByTagName("tr")
        index = 1;
        for (let i = 1; i < accounts.length; i++) {
            let element = accounts[i]
    
            if (element.style.display != "none") {
                element.children[0].innerText = ` ${index} `
                index += 1
            }
        }
    }
}

const update_table = () => {
    let input = document.getElementById('update_table')
    let table = document.getElementById("main_table")
    let tr = table.getElementsByTagName("tr")
    let users_length = 0

    for (let i = 0; i < tr.length; i++) {
        tr[i].style.display = ""
    }

    for (let i = 0; i < tr.length; i++) {
        if (tr[i].getElementsByTagName("td")[4].innerText) {
            users_length += 1
        }
    }

    for (let i = 0; i < users_length - parseInt(input.value); i++) {
        if (tr[users_length-i]) {
            tr[users_length-i].style.display = "none"
        }
    }
    prettyTableCounter()
}

const search_table = () => {
    let input, filter, table, tr, input_text;
    input = document.getElementById("search_table")
    table = document.getElementById("main_table")
    filter = input.value.toUpperCase()

    tr = table.getElementsByTagName("tr")
  
    for (let i = 1; i < tr.length+1; i++) {
        let usernames = tr[i].getElementsByTagName("td")[2]
        let names = tr[i].getElementsByTagName("td")[3]
        let phones = tr[i].getElementsByTagName("td")[4]

        input_text = usernames.textContent || usernames.innerText
        input_text += names.textContent || names.innerText
        input_text += phones.textContent || phones.innerText

        if (input_text.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = ""
        } else {
            tr[i].style.display = "none"
        }
        prettyTableCounter()
    }
}

document.getElementById('update_table').onkeyup = update_table
document.getElementById('search_table').onkeyup = search_table

document.getElementById("filter").onchange = (event) => {
    let elements = [
        "profile_photo", "usernames", 
        "untoched_more_then",
        "proxy", "status", "bio"
    ].filter(element => element != event.target.value)

    for (let id of elements) {
        try {
            document.getElementById(id).style.display = "none"
        } catch (error) {}
    }

    document.getElementById(event.target.value).style.removeProperty("display")
}

document.getElementById("reset_filter").onclick = () => {
    let table = document.getElementById("main_table")
    let accounts = table.getElementsByTagName("tr")

    for (let i = 0; i < accounts.length; i++) {
        let element = accounts[i]

        if (element.style.display == "none") {
            element.style.removeProperty("display")
        }
    }
    prettyTableCounter()
}

document.getElementById("apply_filter").onclick = () => {
    const deffault_url = "https://img.icons8.com/windows/32/000000/user.png"
    let filter_id = document.getElementById("filter").value
    let value = document.getElementById(filter_id).value
    let table = document.getElementById("main_table")
    let accounts = table.getElementsByTagName("tr")

    switch (filter_id) {
        case "profile_photo":
            value = parseInt(value)

            for (let tr of [...accounts].slice(1)) {
                if (!["Phone", ""].includes(tr.children[4].textContent)) {
                    let photo = tr.children[1].children[0].src
                    if (value && (photo == deffault_url)) {
                        tr.style.display = "none"
                    } else if (!value && (photo != deffault_url)) {
                        tr.style.display = "none"
                    }
                }
            }
            break;
        case "usernames":
            value = parseInt(value)

            for (let tr of [...accounts].slice(1)) {
                if (!["Phone", ""].includes(tr.children[4].textContent)) {
                    let avatar = tr.children[2].textContent == ""
                    if (value && avatar) {
                        tr.style.display = "none"
                    } else if (!value && !avatar) {
                        tr.style.display = "none"
                    }
                }
            }
            break;
        case "untoched_more_then":
            value = parseInt(value.split()[0])

            for (let tr of [...accounts].slice(1)) {
                if (!["Acc untouched", ""].includes(tr.children[4].textContent)) {
                    let untouched = parseInt(tr.children[5].textContent.split()[0])

                    if (value >= untouched) {
                        tr.style.display = "none"
                    }
                }
            }
            break;
        case "proxy":
            value = parseInt(value)

            for (let tr of [...accounts].slice(1)) {
                if (!["Proxy", ""].includes(tr.children[4].textContent)) {
                    let proxy = tr.children[6].textContent == ""
                    if (value && proxy) {
                        tr.style.display = "none"
                    } else if (!value && !proxy) {
                        tr.style.display = "none"
                    }
                }
            }
            break;
        case "status":
            let values = {
                "no_limits": "~~no_limits~~",
                "banned": "https://img.icons8.com/fluency-systems-filled/48/fa314a/bad-banana.png",
                "spam_block": "https://img.icons8.com/fluency-systems-filled/48/fa314a/spam-can.png",
                "not_connected": "https://img.icons8.com/fluency-systems-filled/48/fa314a/cellular-network.png"
            }

            value = values[value]

            for (let tr of [...accounts].slice(1)) {
                if (!["Status", ""].includes(tr.children[4].textContent)) {
                    let status = tr.children[7].innerHTML
                    if ((!status.includes(value)) && value != "~~no_limits~~") {
                        tr.style.display = "none"
                    } else if (value == "~~no_limits~~") {
                        if (Object.keys(values).some(item => status.includes(values[item]))) {
                            tr.style.display = "none"
                        }
                    }
                }
            }
            break;
        case "bio":
            let bio_url = "https://img.icons8.com/fluency-systems-filled/48/4a90e2/magical-scroll.png"
            value = parseInt(value)

            for (let tr of [...accounts].slice(1)) {
                if (!["Phone", ""].includes(tr.children[4].textContent)) {
                    let avatar = !tr.children[7].innerHTML.includes(bio_url)
                    
                    if (value && avatar) {
                        tr.style.display = "none"
                    } else if (!value && !avatar) {
                        tr.style.display = "none"
                    }
                }
            }
            break;
    }
    prettyTableCounter()
}

try {
    document.getElementById("archive_filter").onchange = (event) => {
        let elements = [
            "archive_profile_photo", "archive_usernames", 
            "archive_untoched_more_then",
            "archive_proxy", "archive_status", "archive_bio"
        ].filter(element => element != event.target.value)
    
        for (let id of elements) {
            try {
                document.getElementById(id).style.display = "none"
            } catch (error) {}
        }
    
        document.getElementById("archive_" + event.target.value).style.removeProperty("display")
    }
    
    document.getElementById("archive_reset_filter").onclick = () => {
        let table = document.getElementById("archive_table")
        let accounts = table.getElementsByTagName("tr")
    
        for (let i = 0; i < accounts.length; i++) {
            let element = accounts[i]
    
            if (element.style.display == "none") {
                element.style.removeProperty("display")
            }
        }
        prettyTableCounter()
    }
    
    document.getElementById("archive_apply_filter").onclick = () => {
        const deffault_url = "https://img.icons8.com/windows/32/000000/user.png"
        let filter_id = document.getElementById("archive_filter").value
        let value = document.getElementById("archive_" + filter_id).value
        let table = document.getElementById("archive_table")
        let accounts = table.getElementsByTagName("tr")
    
        switch (filter_id) {
            case "profile_photo":
                value = parseInt(value)
    
                for (let tr of [...accounts].slice(1)) {
                    if (!["Phone", ""].includes(tr.children[4].textContent)) {
                        let photo = tr.children[1].children[0].src
                        if (value && (photo == deffault_url)) {
                            tr.style.display = "none"
                        } else if (!value && (photo != deffault_url)) {
                            tr.style.display = "none"
                        }
                    }
                }
                break;
            case "usernames":
                value = parseInt(value)
    
                for (let tr of [...accounts].slice(1)) {
                    if (!["Phone", ""].includes(tr.children[4].textContent)) {
                        let avatar = tr.children[2].textContent == ""
                        if (value && avatar) {
                            tr.style.display = "none"
                        } else if (!value && !avatar) {
                            tr.style.display = "none"
                        }
                    }
                }
                break;
            case "untoched_more_then":
                value = parseInt(value.split()[0])
    
                for (let tr of [...accounts].slice(1)) {
                    if (!["Acc untouched", ""].includes(tr.children[4].textContent)) {
                        let untouched = parseInt(tr.children[5].textContent.split()[0])
    
                        if (value >= untouched) {
                            tr.style.display = "none"
                        }
                    }
                }
                break;
            case "proxy":
                value = parseInt(value)
    
                for (let tr of [...accounts].slice(1)) {
                    if (!["Proxy", ""].includes(tr.children[4].textContent)) {
                        let proxy = tr.children[6].textContent == ""
                        if (value && proxy) {
                            tr.style.display = "none"
                        } else if (!value && !proxy) {
                            tr.style.display = "none"
                        }
                    }
                }
                break;
            case "status":
                let values = {
                    "no_limits": "~~no_limits~~",
                    "banned": "https://img.icons8.com/fluency-systems-filled/48/fa314a/bad-banana.png",
                    "spam_block": "https://img.icons8.com/fluency-systems-filled/48/fa314a/spam-can.png",
                    "not_connected": "https://img.icons8.com/fluency-systems-filled/48/fa314a/cellular-network.png"
                }
    
                value = values[value]
    
                for (let tr of [...accounts].slice(1)) {
                    if (!["Status", ""].includes(tr.children[4].textContent)) {
                        let status = tr.children[7].innerHTML
                        if ((!status.includes(value)) && value != "~~no_limits~~") {
                            tr.style.display = "none"
                        } else if (value == "~~no_limits~~") {
                            if (Object.keys(values).some(item => status.includes(values[item]))) {
                                tr.style.display = "none"
                            }
                        }
                    }
                }
                break;
            case "bio":
                let bio_url = "https://img.icons8.com/fluency-systems-filled/48/4a90e2/magical-scroll.png"
                value = parseInt(value)
    
                for (let tr of [...accounts].slice(1)) {
                    if (!["Phone", ""].includes(tr.children[4].textContent)) {
                        let avatar = !tr.children[7].innerHTML.includes(bio_url)
                        
                        if (value && avatar) {
                            tr.style.display = "none"
                        } else if (!value && !avatar) {
                            tr.style.display = "none"
                        }
                    }
                }
                break;
        }
        prettyTableCounter()
    }
} catch (e) {}
