if (URL.includes("ai_worker_logging?message=true")) {
    setInterval(() => {
        let filename = `static/ai_worker_statistic.json`
        let raw_file = new XMLHttpRequest();

        raw_file.open("GET", filename, false);
        raw_file.onreadystatechange = () => {
            if(raw_file.readyState === 4) {
                if(raw_file.status === 200 || raw_file.status == 0) {
                    let statistics = JSON.parse(raw_file.responseText)

                    for (item of ['first_message', 'middle_message', 'offers']) {
                        document.getElementById(item).textContent = statistics[item]
                    }
                }
            }
        }
        raw_file.send(null);
    }, 500)
}

document.getElementById("submit_forms").style.display = "none"
document.getElementById("clear_all").style.removeProperty('display')

document.getElementById("clear_all").onclick = () => {
    if (document.cookie) {
        let cookie = JSON.parse(document.cookie)
        if (cookie.ai_worker) {
            cookie.ai_worker = {}
        }
        document.cookie = JSON.stringify(cookie)
    }
    location.pathname = '/ai_worker_logging'
}