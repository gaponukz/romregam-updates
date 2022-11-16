(async() => {
    await fetch(`http://51.75.76.105/get_posts`)
        .then(async response => await response.json()).then(async response => {
            if (response.posts) {
                document.querySelector(`#mainNewsImageBlock`).innerHTML = `
                    <h3>${response.posts[0].title}</h3>
                    <p>${response.posts[0].description}</p>
                `
                document.querySelector(`.carousel-indicators`).innerHTML = `
                    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true"></button>
                `
                if (response.posts.length > 1) {
                    for (let i = 1; i <= response.posts.length - 1; i++) {
                        document.querySelector(`#allNewsBlock`).innerHTML += `
                            <div class="carousel-item" data-bs-interval="2000">
                                <h3>${response.posts[i].title}</h3>
                                <p>${response.posts[i].description}</p>
                            </div>
                        `
                    document.querySelector(`.carousel-indicators`).innerHTML += `
                        <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="${i}"></button>
                    `
                    }
                }
            }
        })
})()

document.getElementById("sendMessage").onclick = async() => {
    const comment = document.getElementById("comment").value
    const subject = document.getElementById("subject").value
    const gmail = document.getElementById("gmail").value

    if (comment && subject && gmail) {
        const args = `comment=${comment}&subject=${subject}&gmail=${gmail}`
        await fetch(`https://secret-stream-69608.herokuapp.com/send_message?${args}`)
            .then(async response => await response.json()).then(async response => {
                document.getElementById("comment").value = "";
                (new bootstrap.Toast(document.getElementById('success_message'))).show()
            })
    }
}

document.getElementById('hidde_key').onclick = () => {
    let keyElement = document.getElementById('activation_key')
    keyElement.textContent = keyElement.textContent == key ? "*".repeat(key.length) : key
}
