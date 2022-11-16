let find_logging_block = document.querySelectorAll("#logging")

if (document.querySelector("#download_logs")) {
    document.querySelector("#download_logs").onclick = async () => {    
        const fileHandle = await window.showSaveFilePicker({
            suggestedName: `${document.location.pathname.slice(1)}.log`,
            types: [
                {
                    description: 'Log file',
                    accept: { 'text/plain': '.txt' }
              }
            ],
            excludeAcceptAllOption: true
        })
    
        const writableStream = await fileHandle.createWritable()
    
        await writableStream.write(find_logging_block[0].innerText)
        await writableStream.close()
    }
    
}

if (find_logging_block && document.URL.includes("?")) {
    let interval = setInterval(() => {
        let element = find_logging_block[0]

        try {
            fetch(`/api/logging?page=${document.location.pathname.slice(1)}`).then((response) => response.text()).then(logs => {
                element.innerHTML = logs
                element.scrollTop = element.scrollHeight
    
                if (logs.includes("--END_SCRIPT--")) {
                    (new bootstrap.Toast(document.getElementById('script_ending'))).show()
                    // setTimeout(() => { document.location = document.location.pathname }, 5000)
                    clearInterval(interval)
                }
            }).catch(error => {
                console.error(error)
                clearInterval(interval)
            })
        } catch (e) {
            console.error(e)
            clearInterval(interval)
        }
    }, 1000)
}
