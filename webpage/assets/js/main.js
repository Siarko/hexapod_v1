
let hexState = false;

let View;
let Backend;

window.addEventListener('load', onLoad);

function onLoad(event) {
    View = new ViewLayer();
    Backend = new BackendServer();
    Backend.open();

    initOnButton();
    initUseButton();
    initJoystickUpdate();
    View.disableAll();
}

function initJoystickUpdate(){
    setInterval(function(){
        if(!Backend.isOpen()){ return; }
        let data = {
            type: "wju",
            joyLeft: View.joyLeft.getXY(),
            joyRight: View.joyRight.getXY()
        }
        Backend.send(data);
    }, 50);
}

function initOnButton(){
    View.enableButton.textContent = "ON"
    View.enableButton.classList.add("inactive");
    View.enableButton.addEventListener('click', function(){
        if(hexState){
            View.enableButton.textContent = "ON"
            View.setCssClasses(View.enableButton, 'inactive', 'active');
        }else{
            View.enableButton.textContent = "OFF"
            View.setCssClasses(View.enableButton, 'active', 'inactive');
        }
        hexState =!hexState;
    });
}

function initUseButton(){
    View.setUseButtonStateText(true, "Checking");
    View.useButton.addEventListener('click', function(){
        if(Backend.isUserNone()){
            Backend.send({type: "tokenCheck"}, null, false);
        }
        if(Backend.isUserCurrent()){
            Backend.send({type: "tokenFree"},null, false);
        }
    });
}
