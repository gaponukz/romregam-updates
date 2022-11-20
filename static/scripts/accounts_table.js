const busy_account_image = "https://img.icons8.com/fluency-systems-filled/48/F25081/hotel-door-hanger.png"
let acc_elements = []
let select_all_button = document.querySelector("#select_all")

select_all_button.onclick = () => {
// button to select all accounts from the table (show in the table and append to acc_elements)
    for(let element of document.querySelectorAll(".table > tbody > tr")) {
        if (!(element.classList.contains("table-secondary"))) {
            if (element.cells[4].textContent && element.style.display !== "none") {
                if (!element.children[7].innerHTML.includes(busy_account_image)) {
                    element.classList = ["table-secondary"]
                    acc_elements.push(element)
    
                    document.querySelector("#accounts").value += ` ${element.children[4].textContent}`
                }

            }
        }
    }
    // button to clear all selected accounts from the table (show in the table and remove from acc_elements)
    let new_button = document.createElement("button")
    new_button.setAttribute("type", "button")
    new_button.setAttribute("class", "btn btn-primary btn-sm")
    new_button.setAttribute("style", "height: 28px; padding: 2px; background-color: #2d76cc")
    new_button.setAttribute("id", "remove_all")
    new_button.innerHTML = `&nbsp ${removeSecectionText} &nbsp`

    new_button.onclick = () => {
        for(let element of document.querySelectorAll(".table > tbody > tr")) {
            if ((element.classList.contains("table-secondary"))) {
                element.classList.remove("table-secondary")

                acc_elements = acc_elements.filter((elem) => {
                    return elem != element
                })
                try {
                    document.querySelector("#accounts").value = document.querySelector("#accounts")
                        .value.replace(element.children[4].textContent, "")
                } catch {
                    document.querySelector("#selected_accounts").value = document.querySelector("#selected_accounts")
                        .value.replace(element.children[4].textContent, "")
                }
            }
        }
        new_button.replaceWith(select_all_button)
    }

    select_all_button.replaceWith(new_button)
}

const onSelectAccount = (element) => {
    return () => {
        if (element.classList.contains("table-secondary")) {
            element.classList.remove("table-secondary")
            document.querySelector("#accounts").value = document.querySelector("#accounts")
                .value.replace(element.children[4].textContent, "")
        
        }  else {
            if (!element.children[7].innerHTML.includes(busy_account_image)) {
                element.classList = ["table-secondary"]

                if (!document.querySelector("#accounts").value) {
                    document.querySelector("#accounts").value = element.children[4].textContent
                } else {
                    document.querySelector("#accounts").value += ` ${element.children[4].textContent}`
                }
            }
        }
    }
}

for(let element of document.querySelectorAll(".table > tbody > tr")) {
    // button to select an account from the table (show in the table and append to acc_elements)
    element.onclick = onSelectAccount(element)
}