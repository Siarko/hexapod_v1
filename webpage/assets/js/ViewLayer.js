
class ViewLayer{

    static instance = null;

    constructor() {
        if(ViewLayer.instance == null){
            ViewLayer.instance = this;
        }else{
            return ViewLayer.instance;
        }
        this.mainContainer = document.getElementById('mainContainer');
        this.enableButton = document.getElementById("enableButton");
        this.useButton = document.getElementById("useButton");
        this.joyLeft = new JoyStick('joystickLeft');
        this.joyRight = new JoyStick('joystickRight');
        return this;
    }

    setElementStateText(button, state, text){
        button.disabled = state;
        button.innerText = text;
    }

    setCssActive(object){
        this.setCssClasses(object, 'active', 'inactive');
    }
    setCssInactive(object){
        this.setCssClasses(object, 'inactive', 'active');
    }
    
    setCssClasses(object, add = null, remove = null){
        if(add !== null){
            if(typeof add === 'string'){
                add = [add];
            }
            object.classList.add(add);
        }
        if(remove !== null){
            if(typeof remove === 'string'){
                remove = [remove];
            }
            object.classList.remove(remove);
        }
    }

    disableAll(state = true){
        this.enableButton.disabled = state;
        this.joyRight.setDisabled(state);
        this.joyLeft.setDisabled(state);
        if(state){
            View.setCssInactive(View.mainContainer);
        }else{
            View.setCssActive(View.mainContainer);
        }
    }
}
