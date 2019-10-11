import { ui } from "../../ui/layaMaxUI";
import App from "../../core/App";
import { AD_TYPE } from "../../ADType";
import Session from "../Session";
import { HeroLvType } from "../../game/data/HeroData";
import { GOLD_CHANGE_TYPE } from "../../UseGoldType";
import GetItemDialog from "./GetItemDialog";
import AdDiamond from "./AdDiamond";
import { GoldType } from "../../game/data/HomeData";

export default class NoResDialog extends ui.test.NoResDialogUI{
    constructor(){
        super();
    }

    public setType( type:NoResDialogType ):void{
        if( type == 0 ){
            this.vs.selectedIndex = 0;
            this.l1.text = "剩余次数:" + Session.homeData.adPower + "/3";
            this.title.text = "体力不足";
            this.btnView.fuhuo.clickHandler = new Laya.Handler( this,this.playAdFun );
        }else{
            this.vs.selectedIndex = 1;
            if( type == NoResDialogType.red ){
                this.title.text = "红宝石不足";
                this.dia.vs.selectedIndex = 1;
                this.setGoldType( GoldType.RED_DIAMONG );
            }else if( type == NoResDialogType.blue ){
                this.title.text = "蓝宝石不足";
                this.dia.vs.selectedIndex = 2;
                this.setGoldType( GoldType.BLUE_DIAMONG );
            }
            //this.btnView.fuhuo.clickHandler = new Laya.Handler( this,this.ad2Fun );
            this.btnView.fuhuo.on( Laya.Event.CLICK , this,this.ad2Fun ); //.fuhuo.clickHandler = new Laya.Handler( this,this.ad2Fun );
        }
        this.btnView.ani1.play( 0 , true);
    }

    public ad2Fun():void{
        if( this.check() > 0 ){
            return;
        }
        App.sdkManager.playAdVideo( AD_TYPE.AD_DIAMOND , new Laya.Handler(this,this.adFun) );
    }

    private adFun():void{
        let v:number = Math.ceil( Math.random() * 4 )  + 6;
        this.addNum = v;
        Session.homeData.changeGold( this.goldType , v , GOLD_CHANGE_TYPE.AD_DIAMOND );
        let g = new GetItemDialog();
        g.setData( {type:this.goldType , value:v } );
        g.popup(true);
        g.once( Laya.Event.UNDISPLAY ,this, this.undisFun );
        let b = Session.heroData.getHeroBaseData( Session.heroData.nowRoleId );
        if( this.heroType == HeroLvType.ATK ){
            b.atkTime = Laya.Browser.now() + 60 * 1000;
        }else if( this.heroType == HeroLvType.HP ) {
            b.hpTime  = Laya.Browser.now() + 60 * 1000;
        }
    }

    public goldType:number = 0;
    public setGoldType(a:GoldType):void{
        this.goldType = a;
        //this.v1.vs.selectedIndex = a;

        let res = this.check();
        if( res < 0 ){
            this.fc.visible = false;
        }else{
            this.fc.visible = true;
            Laya.timer.frameLoop( 1, this,this.loopFun );
        }
        this.on( Laya.Event.UNDISPLAY ,this,this.aundisFun );
    }

    public aundisFun():void{
        Laya.timer.clearAll( this );
    }

    public loopFun():void{
        let res = this.check();
        if( res < 0 ){
            this.fc.visible = false;
            return;
        }else{
            this.fc.value = "00:" + this.getV0(  Math.ceil( res/1000 )  );
        }
    }

    public getV0( v:number ):string{
        return ( (v<10) ? ("0" + v) : ("" + v) );
    }

    private check():number{
        let t = Session.heroData.getBaseTime( this.heroType , Session.heroData.nowRoleId );
        return t - Laya.Browser.now();
    }

    public addNum:number = 0;
    public heroType:HeroLvType;

    

    private undisFun():void{
        this.event( AdDiamond.CHANGE_GOLD_EVENT , [this.goldType , this.addNum] );
    }

    public static CHANGE_GOLD_EVENT:string = "CHANGE_GOLD_EVENT";

    public playAdFun():void{
        if( Session.homeData.adPower == 3 ){
            return;
        }
        App.sdkManager.playAdVideo( AD_TYPE.AD_POWER ,  new Laya.Handler( this,this.overFun ) );
    }

    public overFun():void{
        Session.homeData.adPower++;
        this.close();
        Session.saveData();
        Session.homeData.curEnergy = 20;
        Session.homeData.lastTime = 0;
    }
}

export enum NoResDialogType{
    tili = 0,
    red = 1,
    blue = 2
}