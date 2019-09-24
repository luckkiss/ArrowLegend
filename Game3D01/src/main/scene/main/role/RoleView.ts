import { ui } from "../../../../ui/layaMaxUI";
import Session from "../../../Session";
import SysRoleUp from "../../../sys/SysRoleUp";
import { HeroLvType } from "../../../../game/data/HeroData";
import SysRoleBase from "../../../sys/SysRolebase";
import App from "../../../../core/App";
import AdDiamond from "../../../dialog/AdDiamond";
import AutoEvent from "../../../../core/utils/AutoEvent";
import GameEvent from "../../../GameEvent";
import SysSkill from "../../../sys/SysSkill";
import { GoldType } from "../../../../game/data/HomeData";
import FlyUpTips from "../../../FlyUpTips";
import WorldCell from "../world/WorldCell";
import FlyEffect from "../../../../game/effect/FlyEffect";
import RollCell from "./RollCell";
export default class RoleView extends ui.test.jueseUI {
    public nowRoleId:number = 1;
    public autoEvent:AutoEvent = new AutoEvent();

    constructor() {
        super();
        this.autoEvent.setSprite( this );
        this.shengmingniu.clickHandler = new Laya.Handler( this,this.hpFun );
        this.gongjiniu.clickHandler = new Laya.Handler( this,this.atkFun );
        this.updateAll();
        this.on(Laya.Event.DISPLAY,this,this.disFun);
        
        this.jia.clickHandler = new Laya.Handler( this,this.jiaFun , [GoldType.RED_DIAMONG , this.redImg , this.xueshu , HeroLvType.HP ]  );
        this.jia2.clickHandler = new Laya.Handler( this,this.jiaFun , [GoldType.BLUE_DIAMONG , this.blueImg , this.gongshu  , HeroLvType.ATK ] );

        this.autoEvent.onEvent( GameEvent.GOLD_CHANGE , this,this.goldChangeFun );
        this.autoEvent.onEvent( GameEvent.HERO_UPDATE , this,this.heroFun );
        Laya.stage.on( GameEvent.HERO_UPDATE , this, this.heroLvUpFun );
        //let sss = Session.heroData.getHeroData(1);
        //console.log( sss );
        this.lvEff.visible = false;

        
        this.a1.ani1.interval = this.a2.ani1.interval = 1000/60;
        //this.a2.ani1.gotoAndStop( 60 );
        this.a1.ani1.stop();
        this.a2.ani1.stop();
        
        this.a1.visible = this.a2.visible = false;

        //Laya.stage.on( GameEvent.APP_ENERGY ,  this, this.reducePowerFun );
        //Laya.stage.on( Laya.Event.CLICK ,this,this.reducePowerFun , [1] );
        Laya.timer.loop( 4000 , this,this.ani1tFun );

        let r = new RollCell();
        r.heroLvType = HeroLvType.HP;
        r.goldType = GoldType.RED_DIAMONG;
        r.vs1 = this.vs1;
        r.vs2 = this.vs11;
        r.goldImg = this.redImg;
        r.goldFc = this.xueshu;
        r.lvUpBtnGoldText = this.hpGold;
        r.progressBarImg = this.tiao;
        r.lvFc = this.hpLv;
        r.goldAddBtn = this.jia;
        r.goldBox = this.box1;
        r.nowLvAddfc = this.shengmingjia;
        r.heroBaseFc = this.shengmingshu;
        r.heroAddFc = this.hpAddFc;
        r.lvUpBtn = this.shengmingniu;

        let r1 = new RollCell();
        r1.heroLvType = HeroLvType.ATK;
        r1.goldType = GoldType.BLUE_DIAMONG;
        r1.vs1 = this.vs2;
        r1.vs2 = this.vs12;
        r1.goldImg = this.blueImg;
        r1.goldFc = this.gongshu;
        r1.lvUpBtnGoldText = this.atkGold;
        r1.progressBarImg = this.tiao2;
        r1.lvFc = this.atkLv;
        r1.goldAddBtn = this.jia2;
        r1.goldBox = this.box2;
        r1.nowLvAddfc = this.gongjijia;
        r1.heroBaseFc = this.gongjishu;
        r1.heroAddFc = this.atkAddFc;
        r1.lvUpBtn = this.gongjiniu;

        this.heroLvTypeMap[r.heroLvType] = r;
        this.heroLvTypeMap[r1.heroLvType] = r1;
    }
    /**
     * map
     */
    public heroLvTypeMap:any = {};

    private ani1tFun():void{
        this.a1.visible = true;
        this.a1.ani1.play( 0 , false );
        Laya.timer.once( 1000 , this,this.ani2tFun );
    }

    private ani2tFun():void{
        this.a2.visible = true;
        this.a2.ani1.play( 0 , false );
    }

    /**
     * 角色升级特效
     */
    public heroLvUpFun():void{
        this.lvEff.visible = true;
        this.lvEff.ani1.gotoAndStop(0);
        this.lvEff.ani1.interval = 1000/60;
        this.lvEff.ani1.play( 0,false );
        this.lvEff.ani1.on( Laya.Event.COMPLETE ,this,this.efFun );
    }

    public efFun():void{
        this.lvEff.visible = false;
    }

    /**
     * 角色升级后调用
     */
    public heroFun():void{
        this.updateAll();
    }

    public goldChangeFun():void{
        //this.updateAll();
    }

    public oldNum:number = 0;
    
    /**
     * 点击加号 获得宝石
     * @param goldType 
     */
    public jiaFun( goldType:GoldType , flyTarget:Laya.Image , fc:Laya.FontClip , type:HeroLvType  ):void{
        let d = new AdDiamond();
        d.heroType = type;
        d.setGoldType( goldType );
        d.popup();

        this.oldNum = Session.homeData.getGoldByType( goldType );
        d.on( AdDiamond.CHANGE_GOLD_EVENT , this, this.flyGoldFun , [flyTarget , fc , type ] );
    }

    public flyGoldFun( flyTarget:Laya.Image , fc:Laya.FontClip , type:HeroLvType , y:GoldType , v:number ):void{
        let fly = new FlyEffect();
        fly.flyNum = v;
        fly.flySkin = flyTarget.skin;
        fly.endOffX = flyTarget.width /2 ;
        fly.endOffY = flyTarget.height / 2;
        fly.flyTargetHandler = new Laya.Handler( this,this.flyFun , [type] );
        fly.flyFromP( Laya.stage.width/2 , Laya.stage.height/2 , flyTarget , v , this.oldNum , fc  );
        //Laya.MouseManager.enabled = false;
    }

    public flyFun( type:HeroLvType , fc:Laya.FontClip , now:number  ) :void{
        let lv = Session.heroData.getHeroLv( this.nowRoleId , type );
        let sysRB = SysRoleBase.getSys( this.nowRoleId );
        let sys = SysRoleUp.getSysRole( this.nowRoleId , lv );
        let cost = sys.getCost( type );
        let rc:RollCell = <any>this.heroLvTypeMap[type];
        rc.setValue( now , cost );
        if( now == cost ){
            Laya.timer.once( 800 , this, this.tttFun , [ rc ]  );
            //rc.effect1();
        }
    }

    public tttFun( rc:RollCell ):void{
        rc.effect1();
        //Laya.MouseManager.enabled = true;
    }

    /**
     * 显示的时候刷新一下
     */
    public disFun():void {
        this.updateAll();
    }

    public hpFun():void{
        let res = Session.heroData.lvUp( this.nowRoleId , HeroLvType.HP );
        this.tip(res);
    }

    public atkFun():void{
        let res = Session.heroData.lvUp( this.nowRoleId , HeroLvType.ATK );
        this.tip(res);
    }

    public tip(res:number):void{
        if( res == 2 ){
            FlyUpTips.setTips("钻石不够");
        }else if( res == 3 ){
            FlyUpTips.setTips("升级到头了");
        }else if( res == 4 ){
            FlyUpTips.setTips("金币不够");
        }else if( res == 5 ){
            FlyUpTips.setTips("升级到头了");
        }
    }

    public updateAll():void{
        for( let k in this.heroLvTypeMap ){
            let cell:RollCell = <any>this.heroLvTypeMap[k];
            cell.setData( this.nowRoleId );
        }
        this.setSkill( this.nowRoleId );
    }

    public setSkill( roleId:number ):void{
        let sys = SysRoleBase.getSys( roleId );
        let sysSkill:SysSkill = App.tableManager.getDataByNameAndId( SysSkill.NAME,sys.baseSkill );
        this.skillLabel.text = sysSkill.skillInfo;
        this.jinengming.text = sysSkill.skillName;
        this.jinengtubiao.skin = null;
        this.jinengtubiao.skin = "icons/skill/" + sysSkill.id + ".png";
    }
}