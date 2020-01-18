import BaseHttp from "../core/net/BaseHttp";
import App from "../core/App";
import ReceiverHttp from "./ReceiverHttp";
import Session from "../main/Session";
import PlatformID from "../platforms/PlatformID";
import { BasePlatform } from "../platforms/BasePlatform";

/*
* name;
*/
export default class LoginHttp extends BaseHttp {
    
    private jsCode: string;
    constructor(hand:Laya.Handler) {
        super(hand);
    }

    static create(hand:Laya.Handler): LoginHttp {
        return new LoginHttp(hand);
    }

    public static FRONT:string = "";

    send(): void {
        let str:string = "gamelogin/testlogin";
        if(App.platformId != PlatformID.H5 && App.platformId != PlatformID.TEST)
        {
            str = "gamelogin/login";
        }
        super.send(App.serverIP + str + "?scode=" + App.platformId + "&jscode=" + LoginHttp.FRONT + this.jsCode,null, "get", "text");
    }

    onSuccess(data): void {
        if(App.platformId == PlatformID.TEST)
        {
            Session.SKEY = data;
        }
        else
        {
            let obj: any = JSON.parse(data);
            Session.SKEY = obj.openid;
        }
        super.onSuccess(data);
        console.log("login success",data);
    }
    

    checkLogin(): void {
        let BP = Laya.ClassUtils.getRegClass("p" + App.platformId);
        new BP().login((code:string)=>{
            this.jsCode = code;
            this.send();
        });
    }

}