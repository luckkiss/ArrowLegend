import { ui } from "../../ui/layaMaxUI";
import RotationEffect from "../../core/utils/RotationEffect";
import App from "../../core/App";
import { AD_TYPE } from "../../ADType";
import Session from "../Session";
import { GoldType } from "../../game/data/HomeData";
import { GOLD_CHANGE_TYPE } from "../../UseGoldType";
import GetItemDialog from "./GetItemDialog";
import { HeroLvType } from "../../game/data/HeroData";

export default class AdDiamond extends ui.test.juese_tishiUI{
    constructor(){
        super();
        this.bg.height = Laya.stage.height;
        RotationEffect.play( this.light );
        this.rebornBtn.clickHandler = new Laya.Handler(this,this.clickFun);
    }

    private clickFun():void{
        if( this.check() > 0 ){
            return;
        }
        App.sdkManager.playAdVideo( AD_TYPE.AD_DIAMOND , new Laya.Handler(this,this.adFun) );
    }

    public goldType:number = 0;
    public setGoldType(a:GoldType):void{
        this.goldType = a;
        this.v1.vs.selectedIndex = a;

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

    private adFun():void{
        let v:number = Math.ceil( Math.random() * 4 )  + 6;
        this.addNum = v;
        //v = 500;
        Session.homeData.changeGold( this.goldType , v , GOLD_CHANGE_TYPE.AD_DIAMOND );
        let g = new GetItemDialog();
        
        // let arr = [];
        // arr.push( {type:GoldType.BLUE_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.RED_DIAMONG , value:v }  );
        //  arr.push( {type:GoldType.GOLD , value:v }  );

        // arr.push( {type:GoldType.BLUE_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.RED_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.GOLD , value:v }  );

        // arr.push( {type:GoldType.BLUE_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.RED_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.GOLD , value:v }  );

        // arr.push( {type:GoldType.BLUE_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.RED_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.GOLD , value:v }  );
        
        g.setData( {type:this.goldType , value:v } );
        //g.setData(arr);

        g.popup(true);

        g.once( Laya.Event.UNDISPLAY ,this, this.undisFun );

        let b = Session.heroData.getHeroBaseData( Session.heroData.nowRoleId );
        if( this.heroType == HeroLvType.ATK ){
            b.atkTime = Laya.Browser.now() + 60 * 1000;
        }else if( this.heroType == HeroLvType.HP ) {
            b.hpTime  = Laya.Browser.now() + 60 * 1000;
        }
    }

    private undisFun():void{
        this.event( AdDiamond.CHANGE_GOLD_EVENT , [this.goldType , this.addNum] );
    }

    public static CHANGE_GOLD_EVENT:string = "CHANGE_GOLD_EVENT";
}