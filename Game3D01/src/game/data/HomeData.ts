import IData from "./IData";
import GameEvent from "../../main/GameEvent";
import { TopUI } from "../../main/scene/main/MainUI";
import Game from "../Game";
import { GOLD_CHANGE_TYPE } from "../../UseGoldType";
import App from "../../core/App";
import SysHero from "../../main/sys/SysHero";
import SysMap from "../../main/sys/SysMap";
import Session from "../../main/Session";
import { Guide_Type } from "../../main/guide/GuideManager";

export default class HomeData implements IData{
    isGuide:boolean;
    totalEnergy:number;
    curEnergy:number;
    maxEngergy:number;
    lastTime:number;
    chapterId:number;
    mapIndex:number;
    battleLv:number;
    playerLv:number;
    /**
     * 金币
     */
    coins:number;
    /**
     * 钻石
     */
    redDiamond:number = 0;
    blueDiamond:number = 0;
    playerExp:number = 0;

    isPass:boolean = false;

    /**
     * 新手引导的状态 0是关闭
     */
    public newStat = 0;


    public constructor(){
        Laya.stage.on( GameEvent.NEW_DAY , this,this.newDayFun );
        Laya.stage.on( GameEvent.AD_OVER ,this,this.adOverFun );
    }

    public adOverFun():void{
        this.adTimes++;
    }

    public newDayFun():void{
        this.adPower = 0;
    }

    public setChapterId( value:number  ):void{
        this.chapterId = value;
        Session.rankData.saveWorldRank();
        Session.rankData.saveFriendRank();
    }

    /**
     * 设置数据
     * @param data 
     */
    public setData(data:any):void{
        this.totalEnergy = data.totalEnergy;
        this.maxEngergy = data.maxEngergy;
        this.lastTime = data.lastTime;
        this.curEnergy = data.curEnergy;
        this.chapterId = data.chapterId;
        this.mapIndex = data.mapIndex;
        this.battleLv = data.battleLv;
        this.playerLv = data.playerLv;
        this.coins = data.coins;
        this.blueDiamond = (data.blueDiamond?data.blueDiamond:0);
        this.redDiamond = (data.redDiamond?data.redDiamond:0);
        this.playerExp = data.playerExp;
        this.isGuide = data.isGuide;
        if(this.playerExp == null)
        {
            this.playerExp = 0;
        }
        if( Date.now() >= this.lastTime){
            this.curEnergy = this.totalEnergy;
        } else {
            let deltaTime:number = this.lastTime - Date.now();
            let time:number = Math.floor(deltaTime / 1000);
            let delta:number = Math.ceil(time / TopUI.TOTAL_TIME);
            this.curEnergy = this.totalEnergy - delta;
            console.log("Session剩余的时间", time , this.curEnergy);
        }
        
        this.newStat = (data.newStat?data.newStat:Guide_Type.over);
        
        this.curEnergy = 20;
        if( data.openBtn == null ){
            this.openBtn = ["1","1","1","-1","1"];
        }else{
            this.openBtn = data.openBtn.split(",");
        }
        this.adPower = (data.adPower?data.adPower:0);

        if( data.loginTime == null ){
            App.sendEvent( GameEvent.NEW_DAY);
        }else{
            let last = new Date( data.loginTime );
            let now = new Date();
            if( now.getDate() != last.getDate() ){
                App.sendEvent( GameEvent.NEW_DAY );
            }
        }
        this.timeFun( 0 );
        data.loginTime = Date.now();

        this.adTimes = (data.adTimes?data.adTimes:0);
    }

    public timeFun( send:number ):void{
        if( send == 1){
            App.sendEvent( GameEvent.NEW_DAY );
        }
        let now = new Date();
        let h = 60 * 60 * 1000;
        let time:number = 24 * h - now.getHours() * h - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000;
        Laya.timer.once( time + 1000 ,this,this.timeFun , [1] );
    }

    public loginTime:number = 0;

    /**
     * 存储数据
     * @param data 
     */
    public saveData(data:any):void{
        data.curEnergy = this.curEnergy;
        data.maxEngergy = this.maxEngergy;
        data.lastTime = this.lastTime;
        data.totalEnergy = this.totalEnergy;
        data.battleLv = this.battleLv;
        data.playerLv = this.playerLv;
        data.coins = this.coins;
        data.blueDiamond = this.blueDiamond;
        data.redDiamond = this.redDiamond;
        data.playerExp = this.playerExp;
        data.chapterId = this.chapterId;
        data.mapIndex = this.mapIndex;
        console.log("当前的层数",data.mapIndex);
        if(Game.battleLoader.chapterId >= this.chapterId)
        {
            if( Game.battleLoader.index > this.mapIndex ) {
                data.mapIndex = Game.battleLoader.index - 1;
                data.mapIndex = Math.max(0,data.mapIndex);
                console.log("存储最高层数",data.mapIndex);
            }
        }
        data.isGuide = this.isGuide;
        data.newStat = this.newStat;
        data.openBtn = this.openBtn.join(",");
        data.adPower = this.adPower;
        data.adTimes = this.adTimes;
    }

    /**
     * 第一次运行初始化数据
     * @param data 
     */
    public initData(data:any):void{
        this.totalEnergy = TopUI.MAX_ENERGY;
        this.maxEngergy = TopUI.MAX_ENERGY;
        this.curEnergy = this.totalEnergy;
        this.lastTime = 0;
        this.isGuide = true;
        this.chapterId = 0;
        this.mapIndex = 0;
        this.battleLv = 1;
        this.playerLv = 1;
        this.coins = 0;
        this.redDiamond = 10;
        this.playerExp = 0;
        this.blueDiamond = 10;
        this.coins = 1000;
        this.newStat = 1;
        this.openBtn = ["1","-1","-1","-1","1"];
        this.adPower = 0;
        this.adTimes = 0;
    }

    /**
     * 广告次数
     */
    public adTimes:number = 0;

    /**
     * 今天看了多少次恢复体力的广告
     */
    public adPower:number = 0;

    public openBtn:Array<string> = [];

    /**
     * 
     * @param gold 金币改变数量
     * @param type 操作类型 日志用
     */
    public changeGold( type:GoldType , value:number , useType:GOLD_CHANGE_TYPE = 0 ):boolean{
        let num = this.getGoldByType(type);
        if( ( num  + value )  < 0 ){
            return false;
        }
        this.setGoldByType( type , value );
        Laya.stage.event( GameEvent.GOLD_CHANGE );
        return true;
    }

    public getGoldByType( type:GoldType ):number{
        if( type == GoldType.GOLD ){
            return this.coins;
        }else if( type == GoldType.RED_DIAMONG ){
            return this.redDiamond;
        }else if( type == GoldType.BLUE_DIAMONG ){
            return this.blueDiamond;
        }
    }

    public setGoldByType( type:GoldType , value:number ):void{
        if( type == GoldType.GOLD ){
            this.coins += value;
        }else if( type == GoldType.RED_DIAMONG ){
            this.redDiamond += value;
        }else if( type == GoldType.BLUE_DIAMONG ){
            this.blueDiamond += value;
        }
    }

    /**
     * 君主经验
     * @param exp 
     */
    public addPlayerExp( exp:number ):void{
        this.playerExp += exp;
        while( true ){
            let sys:SysHero = App.tableManager.getDataByNameAndId(SysHero.NAME , this.playerLv );    
            if( this.playerExp >= sys.roleExp  ){
                let nowLv = this.playerLv + 1;
                if( App.tableManager.getDataByNameAndId(SysHero.NAME , this.playerLv ) == null ){
                    //等级已经到头了
                    break;
                }
                this.playerLv = nowLv;
                this.playerExp -= sys.roleExp;
            }else{
                break;
            }
        }
        App.sendEvent( GameEvent.PLAYER_INFO_UPDATE );
    }
}

export enum GoldType{
    GOLD = 0,
    RED_DIAMONG = 1,
    BLUE_DIAMONG = 2
}