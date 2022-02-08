let loginName;
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
        document.querySelector('.login-input').classList.add('hide');
        setTimeout(() => {
            document.querySelector('.login-screen').style.display = 'none'
        }, 1000); 
    }
};
