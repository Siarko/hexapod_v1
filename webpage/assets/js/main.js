
let hexState = false;

let View;
let Backend;
let Users = new UsersManager();

window.addEventListener('load', onLoad);

function onLoad(event) {
    View = new ViewLayer();
    Backend = new BackendServer({
        onOpen: function(e){
            View.disableAll(false);
            Backend.send({
                type: 'tokenCheck'
            }, null, false)
        },
        onClose: function(e){
            View.disableAll();
        }
    });
    Backend.open();

    Backend.setDataHandler("ID", function (data) {
        Users.setOwnUser(data.data);
    });
    Backend.setDataHandler('tokenCheck', function (data) {
        Users.setCurrentUserId(data.data);
        if (Users.isUserNone()) {
            View.setElementStateText(View.useButton, false, "Przejmij kontrolę");
        } else if (Users.isUserCurrent()) {
            View.setElementStateText(View.useButton, false, "Oddaj kontrolę");
        } else {
            View.setElementStateText(View.useButton, true, "ZABLOKOWANY");
        }
    });

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
    View.setElementStateText(View.useButton, true, "Checking");
    View.useButton.addEventListener('click', function(){
        if(Backend.isUserNone()){
            Backend.send({type: "tokenCheck"}, null, false);
        }
        if(Backend.isUserCurrent()){
            Backend.send({type: "tokenFree"},null, false);
        }
    });
}
