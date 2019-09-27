import { ui } from "../../ui/layaMaxUI";
import App from "../../core/App";
import { AD_TYPE } from "../../ADType";
import Session from "../Session";
import GameEvent from "../GameEvent";

export default class NoResDialog extends ui.test.NoResDialogUI{
    constructor(){
        super();
    }

    public setType( type:NoResDialogType ):void{
        if( type == 0 ){
            this.vs.selectedIndex = 0;
            this.l1.text = "剩余次数:" + Session.homeData.adPower + "/3";
            this.title.text = "体力不足";
            this.fuhuo.clickHandler = new Laya.Handler( this,this.adFun );
        }else{
            this.vs.selectedIndex = 1;
            if( type == NoResDialogType.red ){
                this.title.text = "红宝石不足";
                this.dia.vs.selectedIndex = 0;
            }else if( type == NoResDialogType.blue ){
                this.title.text = "蓝宝石不足";
                this.dia.vs.selectedIndex = 1;
            }
        }
    }

    public adFun():void{
        if( Session.homeData.adPower == 3 ){
            return;
        }
        App.sdkManager.playAdVideo( AD_TYPE.AD_POWER ,  new Laya.Handler( this,this.overFun ) );
    }

    public overFun():void{
        Session.homeData.adPower++;
        this.close();
        Session.homeData.curEnergy = 20;
        Session.homeData.lastTime = 0;
        Session.saveData();
        App.sendEvent(GameEvent.AD_UPDATE_POWER);
    }
}

export enum NoResDialogType{
    tili = 0,
    red = 1,
    blue = 2
}