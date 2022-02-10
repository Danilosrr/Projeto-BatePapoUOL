let loginName;
let login;
const menu = document.querySelector('aside');
const main = document.querySelector('main');

function showMenu(){
    menu.classList.toggle('active');
    main.classList.toggle('grayscale');
};

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

    setInterval(updateParticipants,5000);
    setInterval(updateMessages,5000);
}

function loginError(erro) {
    if (erro.response.status === 400) {
      alert("nome de usuário já cadastrado");
    }
}

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
/*get messages from serverMessage */
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
        setTimeout(() => document.querySelector(".messages").scrollIntoView(false), 0);
    }
};

function renderparticipants(response){
    serverParticipants=response.data;
    let participant=document.querySelector('.contacts-list');
    for(let i=0;i<serverParticipants.length;i++){
        participant.innerHTML =`
        <span><ion-icon name="people"></ion-icon>
        <p>${serverParticipants[i].name}</p>
        </span>
        `
    }
}