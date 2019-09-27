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
import GuideManager, { Guide_Type } from "../../../guide/GuideManager";
import Game from "../../../../game/Game";
import GameMain from "../../../GameMain";
import NoResDialog, { NoResDialogType } from "../../../dialog/NoResDialog";
export default class RoleView extends ui.test.jueseUI {
    public nowRoleId:number = 1;
    public autoEvent:AutoEvent = new AutoEvent();
    private _gameScene:Laya.Scene3D;
    private _layer3d:Laya.Sprite3D;
    constructor() {
        super();

        //创建场景
		this._gameScene = new Laya.Scene3D();
        this.roleBox.addChild(this._gameScene);
        this._layer3d = new Laya.Sprite3D();
        this._gameScene.addChild(this._layer3d);
		
		//创建相机
		let camera = new Laya.Camera(0, 0.1, 100);
		this._gameScene.addChild(camera);
		camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;


		
		//添加光照
		let directionLight = new Laya.DirectionLight();
		this._gameScene.addChild(directionLight);
		directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));

        this.autoEvent.setSprite( this );
        
        this.shengmingniu.clickHandler = new Laya.Handler( this,this.hpFun, [this.shengmingniu] );
        this.gongjiniu.clickHandler = new Laya.Handler( this,this.atkFun, [this.gongjiniu] );
        
 
        
       
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
        r.lv = this.lv1;

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
        r1.lv = this.lv2;

        this.heroLvTypeMap[r.heroLvType] = r;
        this.heroLvTypeMap[r1.heroLvType] = r1;

        //this.showRoleById(1);

        this.zuo.clickHandler = new Laya.Handler( this,this.turnFun , [-1] );
        this.you.clickHandler = new Laya.Handler( this,this.turnFun , [1]  );
        this.updateAll();

        Laya.stage.on( GameEvent.AD_OVER, this,this.adOverFun );
    }

    private adOverFun():void{
        Laya.timer.callLater( this,this.clFun );
    }

    private clFun():void{
        this.setNowRoleId( this.nowRoleId );
    }

    private turnFun( v:number ):void{
        let now = this.nowRoleId;
        if( v <= 0 ){
            now = Math.max( now + v , 1 );
        }else{
            now = Math.min( now + v , 3 );
        }
        this.setNowRoleId( now );
    }

    public setNowRoleId( now:number ):void{
        this.nowRoleId = now;
        this.showRoleById( now );
        
        this.zuo.visible = !(now == 1);
        this.you.visible = !(now == 3);

        this.updateAll();
        
        this.fuhuo.mouseEnabled = false;

        if( now == 3 ){
            this.vs109.visible = false;
        }else{
            if( Session.heroData.nowRoleId == now ){
                //如果是已经装备了
                this.vs109.visible = true;
                this.vs109.selectedIndex = 0;
            }else {
                this.vs109.visible = true;
                let sys = SysRoleBase.getSys( now );
                sys.videoLock = 8;
                if( Session.homeData.adTimes >= sys.videoLock ){
                    //次数够了
                    this.vs109.selectedIndex = 2;
                    this.fuhuo.mouseEnabled = true;
                    this.fuhuo.clickHandler = new Laya.Handler( this,this.seleHeroFun, [now] );
                }else{
                    //显示进度
                    this.vs109.selectedIndex = 1;
                    this.hongzuan.value = Session.homeData.adTimes + "/" + sys.videoLock;
                    let per = Session.homeData.adTimes / sys.videoLock;
                    this.zitiao.scrollRect = new Laya.Rectangle( 0 , 0, this.zitiao.width * per , this.zitiao.height );
                    if( per == 0 ){
                        this.zitiao.visible = false;
                    }
                }
            }
        }
    }

    public seleHeroFun( now:number ):void {
        Session.heroData.nowRoleId = now;
        this.setNowRoleId( now );
        this.xuan.ani1.interval = 1000 / 45;
        this.xuan.ani1.play( 0, false );
    }

    /**切换3D模型 */
    private showRoleById(roleId:number) {
        this._layer3d.removeChildren();
        if( roleId == 3 ){
            this.qidai.visible = true;
            return;
        }
        this.qidai.visible = false;
        Laya.Sprite3D.load("h5/hero/" + roleId + "/hero.lh",new Laya.Handler(this,(sp3d:Laya.Sprite3D)=>{
            sp3d.transform.localRotationEulerY = 0;
            var scale = 0.85;
            var xx = 0;
            if(  roleId == 2 ){
                xx = 0.05;
                //scale = 0.7;
                sp3d.transform.localRotationEulerY = 15;
            }
            sp3d.transform.localScale = new Laya.Vector3(scale, scale, scale);
            sp3d.transform.localPositionZ = -3;
            sp3d.transform.localPositionY = -0.4;
            sp3d.transform.localPositionX = xx;
            
            let aniSprite3d = sp3d.getChildAt(0) as Laya.Sprite3D;
            this._layer3d.addChild(sp3d);
            if (aniSprite3d) {
                let ani_:Laya.Animator = aniSprite3d.getComponent(Laya.Animator) as Laya.Animator;
                ani_.speed = 0.5;
                ani_.play("Idle");
            }
        }));
    }
    
    showLayer(isLeft:boolean):void
    {
        this._layer3d.transform.localPositionX = isLeft ? 2: -2;
        Laya.Tween.to(this._layer3d.transform,{localPositionX:0},300);
    }

    hideLayer(isLeft:boolean):void
    {
        this._layer3d.transform.localPositionX = 0;
        Laya.Tween.to(this._layer3d.transform,{localPositionX:isLeft ? -2: 2},300);
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
        this.lvEff.sk1.play( 0 , false , false, 0 );
        Laya.timer.frameLoop( 1,this,this.floopFun , [this.lvEff.sk1] );
        //this.lvEff.sk1.index
        // this.lvEff.ani1.gotoAndStop(0);
        // this.lvEff.ani1.interval = 1000/60;
        // this.lvEff.ani1.play( 0,false );
        // this.lvEff.ani1.on( Laya.Event.COMPLETE ,this,this.efFun );
    }

    public floopFun(sk:laya.ani.bone.Skeleton):void{
        if( sk.index == sk.total ){
            sk.stop();
            this.lvEff.visible = false;
            Laya.timer.clear( this,this.floopFun );
        }
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
        // let d = new AdDiamond();
        // d.heroType = type;
        // d.setGoldType( goldType );
        // d.popup();

        let dia = new NoResDialog();
        dia.heroType = type;
        if( goldType == GoldType.RED_DIAMONG ){
            dia.setType( NoResDialogType.red );
        }else{
            dia.setType( NoResDialogType.blue );
        }
        dia.popup();
        this.oldNum = Session.homeData.getGoldByType( goldType );
        dia.on( AdDiamond.CHANGE_GOLD_EVENT , this, this.flyGoldFun , [flyTarget , fc , type ] );
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
        this.setNowRoleId( Session.heroData.nowRoleId );
        if( Session.homeData.newStat == Guide_Type.click_hp ){
            GuideManager.getInstance().hand( this.shengmingniu , this.shengmingniu.width/2 , this.shengmingniu.height/2 , Guide_Type.over , 600 , true );
        }
    }

    public hpFun( btn:Laya.Button ):void{
        if( btn.visible == false ){
            return;
        }
        let res = Session.heroData.lvUp( this.nowRoleId , HeroLvType.HP );
        this.tip(res);
    }

    public atkFun( btn:Laya.Button ):void{
        if( btn.visible == false ){
            return;
        }
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
            App.dialogManager.open( GameMain.TIME_GOLD );
        }else if( res == 5 ){
            FlyUpTips.setTips("升级到头了");
        }else if( res == 0 ) {
            Game.playSound( "fx_slot_lucky.wav" );
        }
    }

    public updateAll():void{
        for( let k in this.heroLvTypeMap ){
            let cell:RollCell = <any>this.heroLvTypeMap[k];
            cell.setData( this.nowRoleId );
        }
        this.setSkill( this.nowRoleId );
        // if( SysRoleBase.have( this.nowRoleId ) == false ){
        //     this.xuan.visible = false;
        // }else{
        //     this.xuan.visible = true;
        // }
    }

    public setSkill( roleId:number ):void{
        if( SysRoleBase.have( roleId ) == false){
            this.skillLabel.text = "";
            this.jinengming.text = "";
            this.jinengtubiao.skin = "main/kawen.png";
            
            return;
        }

        let sys = SysRoleBase.getSys( roleId );
        let sysSkill:SysSkill = App.tableManager.getDataByNameAndId( SysSkill.NAME,sys.baseSkill );
        this.skillLabel.text = sysSkill.skillInfo;
        this.jinengming.text = sysSkill.skillName;
        this.jinengtubiao.skin = null;
        this.jinengtubiao.skin = "icons/skill/" + sysSkill.id + ".png";
    }
}