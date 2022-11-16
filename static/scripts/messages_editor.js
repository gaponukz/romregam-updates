fetch(`/api/get_chats_data`).then(response => response.json()).then(chats => {
    chats = chats.chats
    class Participant {
        constructor(name = "", username = "", user_id = null) {
            this.name = name;
            this.username = username;
            if (user_id === null) {
                let number = Math.ceil(Math.random() * 10000000);
                this.user_id = number;
            } else {
                this.user_id = user_id;
            }
        }
        createDropItem(emptyMessageDropList, chooseDropList) {
            const emptyMessageDropItem = document.createElement('div');
            const chooseDropItem = document.createElement('div');
            emptyMessageDropList.append(emptyMessageDropItem);
            chooseDropList.append(chooseDropItem);
            emptyMessageDropItem.className = 'editor__dropitem editor__dropitememptymessage';
            emptyMessageDropItem.dataset.id = this.user_id;
            chooseDropItem.className = 'editor__dropitem editor__dropitemchoose';
            chooseDropItem.dataset.id = this.user_id;
            emptyMessageDropItem.innerHTML = this.name;
            chooseDropItem.innerHTML = this.name;
            emptyMessageDropItem.addEventListener('click', () => {
                emptyMessageDropList.parentElement.querySelector('span').innerHTML = this.name;
                emptyMessageDropList.parentElement.querySelector('span').dataset.id = emptyMessageDropItem.dataset.id;
                document.querySelector('.editor__emptymessageinput').classList.remove('select_user_placeholder')
            });
            chooseDropItem.addEventListener('click', () => {
                chooseDropList.parentElement.querySelector('span').innerHTML = this.name;
                document.querySelector('.editor__back').style.display = 'flex';
                loadChat['link'].forEach(messageLink => {
                    messageLink.hidden();
                    const id = messageLink.message.from_id.id;
                    if (id !== undefined && id !== null && id == chooseDropItem.dataset.id) {
                        messageLink.display();
                    }
                });
            });
        }
    }
    
    class Message {
        constructor(name, file, message = null, media = null) {
            this.name = name;
            this.file = file;
            if (message === null) {
                this.message = JSON.parse(JSON.stringify({ "_": "Message", "peer_id": { "_": "Channel", "id": 0, "title": "Telethon Chat", "photo": { "_": "ChatPhoto", "photo_id": 0, "dc_id": 4, "has_video": false, "stripped_thumb": "" }, "date": "", "creator": false, "left": false, "broadcast": false, "verified": false, "megagroup": true, "restricted": false, "signatures": false, "min": false, "scam": false, "has_link": false, "has_geo": false, "slowmode_enabled": false, "call_active": false, "call_not_empty": false, "fake": false, "gigagroup": false, "access_hash": 0, "username": "", "restriction_reason": [], "admin_rights": null, "banned_rights": null, "default_banned_rights": { "_": "ChatBannedRights", "until_date": "", "view_messages": false, "send_messages": false, "send_media": false, "send_stickers": true, "send_gifs": true, "send_games": true, "send_inline": true, "embed_links": false, "send_polls": true, "change_info": true, "invite_users": true, "pin_messages": true }, "participants_count": null }, "message": "", "out": false, "mentioned": false, "media_unread": false, "silent": false, "post": false, "from_scheduled": false, "legacy": false, "edit_hide": false, "pinned": false, "from_id": { "_": "User", "is_self": false, "contact": false, "mutual_contact": false, "deleted": false, "bot": true, "bot_chat_history": true, "bot_nochats": true, "verified": false, "restricted": false, "min": false, "bot_inline_geo": false, "support": false, "scam": false, "apply_min_photo": true, "fake": false, "access_hash": 0, "first_name": "", "last_name": null, "username": "", "phone": null, "photo": { "_": "UserProfilePhoto", "photo_id": 0, "dc_id": 4, "has_video": false, "stripped_thumb": "" }, "status": null, "bot_info_version": 3, "restriction_reason": [], "bot_inline_placeholder": "", "lang_code": null }, "fwd_from": null, "via_bot_id": null, "reply_to": null, "media": null, "reply_markup": null, "entities": [], "views": null, "forwards": null, "replies": null, "edit_date": null, "post_author": null, "grouped_id": null, "restriction_reason": [], "ttl_period": null }));
            } else {
                this.message = message;
            }
            this.media = media;
        }
        create() {
            this.link = document.createElement('div');
            this.link.classList.add('editor__message');
            const firstName = this.message.from_id?.first_name || "";
            const lastName = this.message.from_id?.last_name || "";
            const fullName = (firstName + " " + lastName).slice(0, 30);
            if (this.media !== null && this.media["_"] !== "MessageMediaWebPage") {
                this.link.innerHTML = `
                <div class="message__photo">
                    <img src="${this.media}" alt="">
                </div>`;
            } else {
                this.link.innerHTML = `
                <div class="message__photo">
                    <img src="static\\chats_data\\${this.name}\\profile_photos\\${this.message.from_id?.id}.jpg" alt="">
                </div>`;
            }
            editorChat.append(this.link);
            const messagePhotoImg = this.link.querySelector('.message__photo > img');
            messagePhotoImg.addEventListener('error', (e) => {
                messagePhotoImg.parentElement.innerHTML = `<div class="message__ava">${fullName[0]}</div>`;
            });
            if (this.message.media === null || this.message.media["_"] === "MessageMediaWebPage") {
                const messageBlock = document.createElement('div');
                messageBlock.classList.add("message__block");
                messageBlock.innerHTML = `
                <div class="message__heading">
                    <div class="message__name">${fullName}</div>
                    <div class="message__delete"><img src="static\\styles\\img\\bin-casual.png" alt=""></div>
                    <div class="message__time">${getTime(this.message.date)}</div>
                </div>
                <div class="message__content" contenteditable spellcheck="false">${this.message.message}</div>`;
                this.link.append(messageBlock);
                if (this.message.reply_to !== null) {
                    const messageReply = document.createElement('div');
                    const repliedMessage = findMessage(this.message.reply_to.reply_to_msg_id);
                    const repliedFirstName = repliedMessage?.from_id.first_name || "";
                    const repliedLastName = repliedMessage?.from_id.last_name || "";
                    const repliedFullName = (repliedFirstName + " " + repliedLastName).slice(0, 30);
                    this.link.querySelector(".message__heading").after(messageReply);
                    if (repliedMessage?.media === null || (repliedMessage?.media ? repliedMessage?.media["_"] : null) === "MessageMediaWebPage") {
                        messageReply.innerHTML = `
                        <div class="message__fromwhom"><img src="static\\styles\\img\\reply.png" alt=""><p>${repliedFullName}</p></div>
                        <div class="message__fromcontent">${repliedMessage.message}</div>`;
                        messageReply.classList.add("message__reply1");
                    } else {
                        messageReply.innerHTML = `
                        <div class="message__fromwhom"><img src="static\\styles\\img\\reply.png" alt=""><p>${repliedFullName}</p></div>
                        <div class="message__fromimg"><img src="static\\chats_data\\${this.name}\\chat_media\\${repliedMessage?.media?.photo?.id}.jpg" alt=""></div>`;
                        messageReply.classList.add("message__reply2");
                    }
                }
            } else {
                const messageImage = document.createElement('div');
                let extension

                try {
                    console.log(this.message.media.document.attributes[0])
                    extension = this.message.media.photo ? this.message.media.photo.attributes[1].file_name.split('.')[0] : this.message.media.document.attributes[1]?.file_name?.split('.')[1]
                } catch { extension = "jpg"}

                if (this.message.media.document) {
                    if (this.message.media.document.attributes[0]["_"] == "DocumentAttributeVideo") {
                        extension = "mp4"
                    }
                }

                let imageBlock = extension == 'mp4' ? `
                <video autoplay loop muted>
                    <source type="video/mp4" src="static\\chats_data\\${this.name}\\chat_media\\${this.message.media?.photo ? this.message.media?.photo?.id : this.message.media?.document?.id}.${extension}">
                </video>
                ` : `
                <img src="static\\chats_data\\${this.name}\\chat_media\\${this.message.media?.photo ? this.message.media?.photo?.id : this.message.media?.document?.id}.${extension}" alt="">
                `

                messageImage.classList.add('message__image');   
                messageImage.innerHTML = `
                <div class="message__imageup">
                <div class="message__name">${fullName}</div>
                <div class="message__delete"><img src="static\\styles\\img\\bin-casual.png" alt=""></div>
                </div>
                <div class="message__curimage">
                    ${imageBlock}
                <div class="message__imagetime">${getTime(this.message.date)}</div>
                </div>`;
                this.link.append(messageImage);
            }
            const messageDelete = this.link.querySelector(".message__delete");
            messageDelete.addEventListener("mouseover", () => {
                messageDelete.firstChild.setAttribute("src", "static\\styles\\img\\bin.png");
            });
            messageDelete.addEventListener("mouseout", () => {
                messageDelete.firstChild.setAttribute("src", "static\\styles\\img\\bin-casual.png");
            });
            messageDelete.addEventListener("click", () => {
                this.remove();
                const index = loadChat.link.indexOf(this);
                const buffer = loadChat.link.slice(0, index);
                const buffer2 = loadChat.link.slice(index + 1);
                const buffer3 = new Array().concat(buffer, buffer2);
                loadChat.link = buffer3;
            });
        }
        remove() {
            this.link.remove();
        }
        hidden() {
            this.link.style.display = "none";
        }
        display() {
            this.link.style.display = "flex";
        }
    }
    
    class Window {
        constructor(type = 0) {
            this.create(type);
        }
        create(type) {
            this.link = document.createElement('div');
            this.link.classList.add('dialog__window');
            document.body.append(this.link);
            const popup = document.createElement('div');
            popup.classList.add('popup');
            this.link.append(popup);
            if (type === 0) {
                popup.innerHTML = `
                <div class="popup__header">Enter the name of the new story</div>
                <div class="popup__row">
                    <input type="text" class="editor__input">
                    <div class="popup__button popup__ok">Okey</div>
                </div>`;
                const popupOk = document.querySelector('.popup__ok');
                popupOk.addEventListener('click', () => {
                    const text = popupOk.parentElement.querySelector('input').value;
                    if (text !== "") {
                        chats.push({ name: text, file: text + '.json', messages: [] });
                        const dropList = document.querySelector('.historydl');
                        const dropItem = document.createElement('div');
                        dropItem.classList.add('editor__dropitem');
                        dropItem.innerHTML = text;
                        dropItem.addEventListener("click", () => {
                            let messages;
                            for (let chat of chats) {
                                if (chat.name === text) {
                                    messages = chat;
                                    break;
                                }
                            }
                            dropList.parentElement.querySelector('span').innerHTML = text;
                            document.querySelectorAll(".editor__input > span").forEach(span => {
                                span.innerHTML = '';
                            });
                            dropList.parentElement.querySelector('span').innerHTML = messages.name;
                            document.querySelector('.editor__back').style.display = '';
                            loadChat(messages);
                        });
                        dropList.append(dropItem);
                        this.remove();
                    }
                });
            } else if (type === 1) {
                popup.innerHTML = `
                <div class="popup__header">Enter a name</div>
                <input type="text" class="editor__input popup__input popup__name">
                <div class="popup__header">Enter a username</div>
                <input type="text" class="editor__input popup__input popup__username">
                <div class="popup__header">Upload a photo</div>
                <div class="popup__row">
                    <label class="popup__button popup__browse" for="browse">Browse</label>
                    <input type="file" id="browse">
                    <div class="popup__button popup__ok">Okey</div>
                </div>`;
                const popupOk = document.querySelector('.popup__ok');
                popupOk.addEventListener('click', () => {
                    const name = popupOk.parentElement.parentElement.querySelector('.popup__name').value;
                    const username = popupOk.parentElement.parentElement.querySelector('.popup__username').value;
                    if (name !== "" && username !== "") {
                        const participant = new Participant(name, username);
                        loadChat.participants.push(participant);
                        const reader = new FileReader();
                        if (browse.files.length > 0) {
                            reader.readAsDataURL(browse.files[browse.files.length - 1]);
                            reader.addEventListener('load', () => {
                                participant.media = reader.result;
                            });
                        }
                        const emptyMessageDropList = document.querySelector(".emptymessagedl");
                        const chooseDropList = document.querySelector(".choosedl");
                        participant.createDropItem(emptyMessageDropList, chooseDropList);
                        this.remove();
                    }
                });
                if (loadChat['link'] === undefined) {
                    this.remove();
                }
            }
            this.link.addEventListener('click', event => {
                if (event.target === this.link) {
                    this.remove();
                }
            });
        }
        remove() {
            this.link.remove();
        }
    }
    
    function loadChat(chat) {
        loadChat.messages = chat.messages;
        loadChat.nameChat = chat.name;
        loadChat.fileChat = chat.file;
        document.querySelector('.editor__historyinput').classList.remove('choose_placeholder')
        document.querySelector('.editor__emptymessageinput').classList.add('select_user_placeholder')

        document.querySelectorAll(".editor__message").forEach(element => {
            element.remove();
        });
        document.querySelectorAll(".editor__dropitemchoose").forEach(element => {
            element.remove();
        });
        document.querySelectorAll(".editor__dropitememptymessage").forEach(element => {
            element.remove();
        });
        loadChat['link'] = [];
        loadChat['id'] = 0;
        loadChat.participants = [];
        const emptyMessageDropList = document.querySelector(".emptymessagedl");
        const chooseDropList = document.querySelector(".choosedl");
        chat.messages.forEach(message => {
            if (message.id > loadChat.id) {
                loadChat.id = message.id;
            }
            const messageLink = new Message(chat.name, chat.file, message);
            loadChat['link'].push(messageLink);
            messageLink.create();
            if (!isId(message.from_id?.id)) {
                const firstName = message.from_id?.first_name || "";
                const lastName = message.from_id?.last_name || "";
                const fullName = (firstName + " " + lastName).slice(0, 30);
                const participant = new Participant(fullName, message.from_id?.username || "", message.from_id?.id);
                participant.media = null;
                loadChat.participants.push(participant);
                participant.createDropItem(emptyMessageDropList, chooseDropList);
            }
        });
    }
    
    function isId(id) {
        let flag = false;
        document.querySelectorAll('.editor__dropitemchoose').forEach(element => {
            if (Number(element.dataset.id) == id) {
                flag = true;
            }
        });
        return flag;
    }
    
    function getTime(date) {
        let time = new Date(date);
        let minutes = time.getMinutes().toString();
        let hours = time.getHours().toString();
        while (minutes.length < 2) {
            minutes = "0" + minutes;
        }
        while (hours.length < 2) {
            hours = "0" + hours;
        }
        return hours + ":" + minutes;
    }
    function findMessage(id) {
        for (let message of loadChat.messages) {
            if (message.id === id) {
                return message;
            }
        }
    }
    
    function isLink(word) {
        const ends = ['.com', '.ua', '.ru', '.org', '.gov', '.net', '.biz', '.in'];
        const starts = ['https://', 'http://'];
        for (let end of ends) {
            if (word.endsWith(end)) {
                return true;
            }
        }
        for (let start of starts) {
            if (word.startsWith(start)) {
                return true;
            }
        }
        return false;
    }
    
    function findParticipant(indeficator = null) {
        let id;
        if (indeficator === null) {
            id = document.querySelector('.editor__emptymessageinput > span').dataset.id;
        } else {
            id = indeficator;
        }
        for (let participant of loadChat.participants) {
            if (id == participant.user_id) {
                return participant;
            }
        }
        return null;
    }
    
    const editorChat = document.querySelector('.editor__chat');
    const dropList = document.querySelector(".historydl");
    for (let chat of chats) {
        const dropItem = document.createElement('div');
        dropItem.classList.add('editor__dropitem');
        dropItem.innerHTML = chat.name;
        dropItem.addEventListener("click", () => {
            document.querySelectorAll(".editor__input > span").forEach(span => {
                span.innerHTML = '';
            });
            dropList.parentElement.querySelector('span').innerHTML = chat.name;
            document.querySelector('.editor__back').style.display = '';
            loadChat(chat);
        });
        dropList.append(dropItem);
    }
    
    const editorWindows = document.querySelectorAll('.editor__window');
    editorWindows.forEach((editorWindow) => {
        editorWindow.addEventListener('click', () => {
            const dropList = editorWindow.querySelector('.editor__droplist');
            if (dropList.hasChildNodes()) {
                if (dropList.dataset.isOpened === 'true') {
                    editorWindow.style.borderRadius = '5px';
                    dropList.style.display = 'none';
                    dropList.dataset.isOpened = false;
                } else {
                    editorWindow.style.borderRadius = '5px 5px 0 0';
                    dropList.style.display = 'block';
                    dropList.dataset.isOpened = true;
                }
            }
        });
    });
    
    document.querySelector('.editor__search').addEventListener('click', () => {
        const searchWord = document.querySelector('.editor__searchinput').value;
        loadChat['link'].forEach(messageLink => {
            messageLink.hidden();
            const element = messageLink.link.querySelector('.message__content');
            let msg = "";
            if (element != null) {
                msg = element.innerHTML;
            }
            if (msg.includes(searchWord)) {
                messageLink.display();
            }
        });
    });
    
    document.querySelector('.editor__dellinks').addEventListener('click', () => {
        const buffer = [];
        loadChat.link.forEach((link) => {
            if (!isLink(link.message.message)) {
                buffer.push(link);
            } else {
                link.hidden();
            }
        });
        loadChat.link = buffer;
    });
    
    document.querySelector('.editor__save').addEventListener('click', async () => {
        new Promise(async (resolve, reject) => {
            const saveFile = {
                "name": loadChat.link[0].name,
                "file": loadChat.link[0].file,
                "participants": loadChat.participants,
                "messages": []
            };
            loadChat.link.forEach((link, index) => {
                saveFile.messages.push(link.message);
                const messageContent = link.link.querySelector('.message__content');
                if (messageContent !== null) {
                    saveFile.messages[index].message = messageContent.innerHTML;
                }
            });
            chats.forEach((chat, index, chats) => {
                if (chat.name === saveFile.name) {
                    chats[index].messages = saveFile.messages;
                }
            });
            resolve(saveFile)
        }).then(async data => {
            document.querySelector("#chats_data").value = JSON.stringify(data)
            setTimeout(_ => document.getElementById('load').submit(), 1000)
        })
    });
    
    document.querySelector('.editor__back').addEventListener('click', () => {
        document.querySelector('.editor__back').style.display = '';
        document.querySelector('.editor__chooseinput > span').innerHTML = '';
        loadChat.link.forEach(link => {
            link.display();
        });
    });
    
    document.querySelector('.editor__newhistory').addEventListener('click', () => {
        const window = new Window(0);
    });
    document.querySelector('.editor__newparticipant').addEventListener('click', () => {
        const window = new Window(1);
    });
    const emptyMessage = document.querySelector('.editor__emptymessage');
    emptyMessage.addEventListener('click', () => {
        const option = emptyMessage.querySelector('span');
        if (option != '') {
            const id = document.querySelector('.editor__emptymessageinput > span').dataset.id;
            if (id !== undefined) {
                const message = new Message(loadChat.nameChat, loadChat.fileChat);
                message.message.date = new Date();
                const participant = findParticipant(message.message.from_id.id);
                console.log('here')
                if (participant !== null) {
                    message.message.from_id.first_name = participant.name;
                    message.message.from_id.id = participant.user_id;
                    message.message.from_id.username = participant.username;
                    message.media = participant.media ?? null;
                }
                if (loadChat['id'] !== undefined) {
                    (loadChat['id'])++;
                    message.message.id = loadChat['id'];
                } else {
                    message.message.id = -1;
                }
                message.create();
                loadChat['link'].push(message);
            }
        }
    });
})