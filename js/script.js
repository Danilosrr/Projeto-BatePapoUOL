let loginName;
let login;
let messageTo='Todos';
let privacy='Público';
let privacyText=document.querySelector('.message-privacy');
let messageType='message'

/*Side-bar functions*/
function selectParticipants(selection){
    let selectionArray = selection.parentNode.querySelectorAll('.check-icon')
    selectionArray.forEach(element => { 
        element.classList.add('hide');
    });
    selection.querySelector('.check-icon').classList.toggle('hide');
    
    updateTo(selection);
}
function selectPrivacy(selection){
    let selectionArray = selection.parentNode.querySelectorAll('.check-icon')
    selectionArray.forEach(element => { 
        element.classList.add('hide');
    });
    selection.querySelector('.check-icon').classList.toggle('hide');
    
    updatePrivacity(selection);
}
function updateTo(selection){
    messageTo=selection.querySelector('p').textContent;
    privacyText.innerHTML=`Enviando para ${messageTo} (${privacy})`;
}
function updatePrivacity(selection){
    privacy=selection.querySelector('p').textContent;
    privacyText.innerHTML=`Enviando para ${messageTo} (${privacy})`;

    if (privacy==='Público'){
        messageType='message';
    }else if(privacy==='Reservadamente'){
        messageType='private_message';
    }
}
function showMenu(){
    const menu = document.querySelector('aside');
    const grayscale = document.querySelector('.grayscale');
    menu.classList.toggle('active');
    grayscale.classList.toggle('hide');
};

/*Login Functions*/
function enter(){
    const nameInput = document.querySelector('.login-button .type-here');

    if(nameInput.value != '' && nameInput.value != undefined){
        loginName = nameInput.value;

        login={
            name: loginName
        };

        const namePromise= axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", login);
        namePromise.then(enterChat);
        namePromise.catch(loginError)
        setInterval(updateStatus,5000);
    }     
};
function enterChat(){
    document.querySelector('.login-input').classList.add('hide');
    setTimeout(() => {
        document.querySelector('.login-screen').style.display = 'none'
    }, 1000); 

    setInterval(updateParticipants,10000);
    setInterval(updateMessages,5000);
}
function loginError(erro) {
    if (erro.response.status === 400) {
      alert("nome de usuário já cadastrado");
    }
}

/*Update Functions*/
function updateStatus(){
    axios.post("https://mock-api.driven.com.br/api/v4/uol/status", login)
};
function updateMessages(){
    const messagePromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages", login);
    messagePromise.then(renderMessages);
}
function updateParticipants(){
    const participantsPromise = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants", login);
    participantsPromise.then(renderparticipants);
}

/*Rendering Functions*/
function renderMessages(response){
    serverMessage=response.data;

    for(let i=0;i<serverMessage.length;i++){
        let message = document.createElement('div');
        message.setAttribute('class', 'message');
        message.setAttribute('data-identifier', 'message');
        message.innerHTML += `
            <p><time>(${serverMessage[i].time}) <time><strong>${serverMessage[i].from} <strong><text>${serverMessage[i].text}<text><p>
            `;

        document.querySelector('.messages').appendChild(message);
        document.querySelector(".messages").scrollIntoView(false);
    }
};

function renderparticipants(response){
    serverParticipants=response.data;
    let participant=document.querySelector('.contacts-list');

    participant.innerHTML=`
        <span data-identifier="participant" onclick="selectParticipants(this)">
            <ion-icon name="people"></ion-icon>
            <p>Todos</p>
            <ion-icon class="check-icon" name="checkmark"></ion-icon>
        </span>`;

    for(let i=0;i<serverParticipants.length;i++){
        if(serverParticipants[i].name !== login.name){
            participant.innerHTML +=`
                <span data-identifier="participant" onclick="selectParticipants(this)">
                    <ion-icon name="people"></ion-icon>
                    <p>${serverParticipants[i].name}</p>
                    <ion-icon class="check-icon hide" name="checkmark"></ion-icon>
                </span>
            `;
        }
    }
}

function sendMessage() {
    let messageText = document.querySelector(".message-text").value
    if(messageText !== undefined && messageText !== ""){
        let message = {
            from: login.name,
            to: messageTo,
            text: messageText,
            type: messageType,
        }
        const sendPromise = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message)
        sendPromise.then(sendSuccessfully)
    }    
}

function sendSuccessfully() {
    document.querySelector(".message-text").value=""
    renderMessages()
}