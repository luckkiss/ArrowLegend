import BaseHttp from "../core/net/BaseHttp";
import App from "../core/App";
import Session from "../main/Session";
import Game from "../game/Game";

/*
* name;
*/
export default class SenderHttp extends BaseHttp {
    constructor() {
        super(null);
    }

    static create(): SenderHttp {
        return new SenderHttp();
    }


    send(): void {
        let obj = Session.gameData;
        let gamedata:any = {};
        gamedata.obj = obj;
        super.send(App.serverIP + "game/save","skey=" + Session.SKEY + "&gamedata=" + JSON.stringify(gamedata), "post", "text");
    }

    onSuccess(data): void {
        super.onSuccess(data);
        console.log("save success",data);
    }
}