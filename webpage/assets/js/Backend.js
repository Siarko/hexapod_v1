let wsGateway = `ws://${window.location.hostname}/ws`;
if (MODE === 'dev') {
    wsGateway = `ws://192.168.1.48/ws`;
}

class BackendServer {

    constructor(props) {
        this.websocket = null;
        this.lastSendData = {};
        this.responseHandlers = {};

        this.openHandler = props.onOpen || function(){};
        this.closeHandler = props.onClose || function(){};
    }

    open() {
        debug('Trying to open a WebSocket connection...');
        this.websocket = new WebSocket(wsGateway);
        this.websocket.onopen = this._onOpen.bind(this);
        this.websocket.onclose = this.onClose.bind(this);
        this.websocket.onmessage = this.onMessage.bind(this);
        this.websocket.onerror = this.onError.bind(this);
    }

    isOpen() {
        return this.websocket !== null && this.websocket.readyState === WebSocket.OPEN;
    }

    _onOpen(event) {
        debug('Connection opened');
        this.openHandler(event);
    }

    onClose(event) {
        debug("Connection closed");
        this.closeHandler(event);
        setTimeout(this.open.bind(this), 2000);
    }

    onError(event){
        debug(event);
    }

    onMessage(event) {
        let data = JSON.parse(event.data);
        debug("RECV: ", event.data);
        if(Array.isArray(event.data.batch)){
            for(const value of event.data.batch){
                this.processReceivedMessage(value);
            }
        }else{
            this.processReceivedMessage(event.data)
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
            debug("SEND: ", data);
            this.websocket.send(data);
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