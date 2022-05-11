let wsGateway = `ws://${window.location.hostname}/ws`;
if (MODE === 'dev') {
    wsGateway = `ws://192.168.1.48/ws`;
}

class BackendServer {

    constructor(props) {
        let self = this;
        this.websocket = null;
        this.lastSendData = {};
        this.responseHandlers = {};
        this.ownID = null;
        this.currentUserID = null;
        this.setDataHandler("ID", function (data) {
            self.ownID = data.data;
        });
        this.setDataHandler('tokenCheck', function (data) {
            self.currentUserID = data.data;
            if (self.isUserNone()) {
                //no user is using hexapod
                View.setUseButtonStateText(false, "Przejmij kontrolę");
            } else if (!self.isUserCurrent()) {
                //someone else has control
                View.setUseButtonStateText(true, "ZABLOKOWANY");
            } else {
                //current user has control
                View.setUseButtonStateText(false, "Oddaj kontrolę");
            }
        });
    }

    open() {
        console.log('Trying to open a WebSocket connection...');
        this.websocket = new WebSocket(wsGateway);
        this.websocket.onopen = this.onOpen.bind(this);
        this.websocket.onclose = this.onClose.bind(this);
        this.websocket.onmessage = this.onMessage.bind(this);
    }

    isOpen() {
        return this.websocket !== null && this.websocket.readyState === WebSocket.OPEN;
    }

    isUserCurrent() {
        return this.ownID !== null && this.currentUserID !== null && this.currentUserID === this.ownID;
    }

    isUserNone() {
        return this.ownID !== null && this.currentUserID !== null && this.currentUserID === -1;
    }

    onOpen(event) {
        let self = this;
        console.log('Connection opened');
        View.disableAll(false);
        Backend.send({
            type: 'tokenCheck'
        }, null, false)
    }

    onClose(event) {
        console.log('Connection closed');
        View.disableAll();
        setTimeout(this.open.bind(this), 2000);
    }

    onMessage(event) {
        let data = JSON.parse(event.data);
        if (MODE === 'dev') {
            console.log("REC: ", data);
        }
        if(Array.isArray(data.batch)){
            for(const value of data.batch){
                this.processReceivedMessage(value);
            }
        }else{
            this.processReceivedMessage(data)
        }
    }

    send(data, handler = null, cacheable = true) {
        if (typeof handler == 'function') {
            if (this.responseHandlers[data.type] === undefined) {
                this.responseHandlers[data.type] = handler;
            }
        }
        data = JSON.stringify(data);
        if (!this.wasLastSend(data) || !cacheable) {
            if (cacheable) {
                this.setLastSend(data)
            }
            this.websocket.send(data);
            if (MODE === "dev") {
                console.log("SEND: ", data);
            }
        }
    }

    processReceivedMessage(data){
        if (this.responseHandlers[data.type] !== undefined) {
            this.responseHandlers[data.type](data);
        }
    }

    setDataHandler(type, handler) {
        this.responseHandlers[type] = handler;
    }

    wasLastSend(data) {
        return (this.lastSendData[data.type] === data)
    }

    setLastSend(data) {
        this.lastSendData[data.type] = data;
    }


}