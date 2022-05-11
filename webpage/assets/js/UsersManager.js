class UsersManager {
    static instance = null;

    constructor(props) {
        if(UsersManager.instance === null){
            UsersManager.instance = this;
        }else{
            return UsersManager.instance;
        }
        this.ownID = null;
        this.currentUserID = null;
    }

    setOwnUser(id){
        this.ownID = id;
    }

    setCurrentUserId(id){
        this.currentUserID = id;
    }

    isUserCurrent() {
        return this.ownID !== null && this.currentUserID !== null && this.currentUserID === this.ownID;
    }

    isUserNone() {
        return this.ownID !== null && this.currentUserID !== null && this.currentUserID === -1;
    }


}