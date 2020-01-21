import Sprite3D = Laya.Sprite3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Scene3D = Laya.Scene3D;
import GameBG from "./GameBG";
import Rocker from "./GameRocker";
import GameMap0 from "./GameMap0";
import GamePro from "./GamePro";
import GameExecut from "./GameExecut";
import GameCameraNum from "./GameCameraNum";
import BattleLoader from "../main/scene/battle/BattleLoader";
import SysEnemy from "../main/sys/SysEnemy";
import App from "../core/App";
import GameProType from "./GameProType";
import AttackType from "./ai/AttackType";
import MoveType from "./move/MoveType";
import HeadTranslateScript from "./controllerScript/HeadTranslateScript";
import FootRotateScript from "./controllerScript/FootRotateScript";
import Monster from "./player/Monster";
import Hero from "./player/Hero";
import SceneManager from "../main/SceneManager";
import ShakeUtils from "../core/utils/ShakeUtils";
import CoinEffect from "./effect/CoinEffect";
import PlayerSkillManager from "./PlayerSkillManager";
import Session from "../main/Session";
import BuffManager from "./buff/BuffManager";
import GameAlert from "../main/GameAlert";
import { BaseCookie } from "../gameCookie/BaseCookie";
import CookieKey from "../gameCookie/CookieKey";
import SysMap from "../main/sys/SysMap";
import GameEvent from "../main/GameEvent";
import SysChapter from "../main/sys/SysChapter";
import Coin from "./player/Coin";
import LogType from "../core/manager/LogType";
import GameCube from "../main/scene/battle/GameCube";

export default class Game {
    static codeVer:string = "3.0.0.200120";
    static resVer:string = "3.0.0.200120";

    static battleGuide:number;

    /**本地资源 */
	static nativefiles:string[] = [
        "loading/jianduxia.png",
        "loading/jiandushang.png",
        "loading/jiazai.jpg",
        "loading/btn_kaishi.png", 
        "loading/dan.png", 
        "loading/loadingClip.png",
        "loading/logo.png",
        "loading/shouci.png",
        "loading/zhudi.jpg"];

    //战斗中的临时数据
    static level:number;
    static lastLevel:number;

    static userHeadUrl:string = "";
    static userName:string = "";

    static poolTagArr:any = {};

    static isStartBattle:boolean = false;

    static TestShooting = 0;
    static BigMapMode = 1;

    static state:number = 0;
    static isPopupSkill:number = 0;

    static rebornTimes:number = 2;

    
    // static monsterResClones: Laya.Sprite3D[] = [];

    static cameraCN: GameCameraNum;

    static Event_MAIN_DIE:string = "Event_MAIN_DIE";
    static Event_PlayStop: string = "Game.Event_PlayStop";
    static Event_Short: string = "Game.Event_Short";
    static Event_Hit: string = "Game.Event_Hit";
    static Event_KeyNum: string = "Game.Event_KeyNum";

    static Event_ADD_HP: string = "Event_ADD_HP";
    static Event_UPDATE_ATTACK_SPEED: string = "Event_UPDATE_ATTACK_SPEED";

    static Event_NPC: string = "Event_NPC";
    static Event_COINS: string = "Event_COINS";
    static Event_EXP:string = "Event_EXP";
    static Event_LEVEL:string = "Event_LEVEL";
    static Event_SELECT_NEWSKILL:string = "Event_SELECT_NEWSKILL";

    static skillManager:PlayerSkillManager = new PlayerSkillManager();

    static AiArr: GamePro[] = [];
    static HeroArrows: GamePro[] = [];
    //3d层
    static layer3d: Sprite3D = new Sprite3D();
    static layer3dCube: Sprite3D = new Sprite3D();
    static layer3dCoins: Sprite3D = new Sprite3D();

    //3d摄像机
    static camera: Camera;
    //临时v3
    //static v3:Vector3 = new Vector3(0,0,0);
    //3d场景
    static scene3d: Laya.Scene3D;
    //主英雄
    //static hero:Laya.Sprite3D;
    static hero: Hero;
    //主敌人    
    static e0_: GamePro;

    static selectEnemy(pro: GamePro): void {
        Game.e0_ = pro;
        let curScale: number = (pro as Monster).sysEnemy.zoomMode / 100;
        curScale = 1 / curScale;
        if (Game.e0_.sp3d && Game.e0_.sp3d.transform)  {
            Game.e0_.sp3d.addChild(Game.selectFoot);
            Game.e0_.addSprite3DToChild("guadian", Game.selectHead);
            // Game.selectHead.transform.localScale = new Laya.Vector3(curScale, curScale, curScale);
            Game.selectHead.transform.localScaleX = curScale;
            Game.selectHead.transform.localScaleY = curScale;
            Game.selectHead.transform.localScaleZ = curScale;
            // Game.selectFoot.transform.localScale = new Laya.Vector3(curScale, curScale, curScale);
            Game.selectFoot.transform.localScaleX = curScale;
            Game.selectFoot.transform.localScaleY = curScale;
            Game.selectFoot.transform.localScaleZ = curScale;
        }
        else  {
            // console.log("克隆体没有了？");
        }
    }

    //主箭    
    static a0: GamePro;

    //2d背景
    static bg: GameBG;
    //贴图材质
    static material_blinn: Laya.BlinnPhongMaterial;

    //栅栏
    static fence: Laya.Sprite3D;

    static bullet: Laya.MeshSprite3D;
    //摇杆
    static ro: Rocker;

    static cameraY: number = 10;

    static sqrt3: number = 10 * Math.sqrt(3);

    static map0: GameMap0;

    static footLayer: Laya.Sprite = new Laya.Sprite();
    static bloodLayer: Laya.Sprite = new Laya.Sprite();
    static frontLayer: Laya.Sprite = new Laya.Sprite();
    static topLayer: Laya.Sprite = new Laya.Sprite();

    static scenneM: SceneManager = new SceneManager();
    static buffM:BuffManager = new BuffManager();


    /**脚底红圈 */
    static selectFoot: Laya.Sprite3D;
    /**头顶的红三角 */
    static selectHead: Laya.Sprite3D;

    static executor: GameExecut;

    static battleLoader: BattleLoader = new BattleLoader();

    static updateMap(): void {
        if (Game.map0) {
            if (Game.bg) {
                Game.bloodLayer.pos(Game.bg.x, Game.bg.y);
                Game.frontLayer.pos(Game.bg.x, Game.bg.y);
                Game.footLayer.pos(Game.bg.x, Game.bg.y);
                Game.topLayer.pos(Game.bg.x, Game.bg.y);
                Game.map0.pos(Game.bg.x, Game.bg.y);
            }
        }
    }

    static cookie:BaseCookie;

    static door: Laya.Sprite3D;
    static isOpen: boolean = false;
    static openDoor(): void {
        if (Game.isOpen)  {
            return;
        }
        console.log("开门");

        if(Game.battleLoader.index >= SysMap.getTotal(Game.battleLoader.chapterId) && Game.battleLoader._configId != 100000)
        {
            console.log("通关了");
            Session.homeData.isPass = true;
            if(Game.battleLoader.chapterId >= Session.homeData.chapterId)
            {
                Session.homeData.chapterId++;
                Session.homeData.setChapterId(Session.homeData.chapterId,0);
            }
            Game.battleLoader.index = 0;
            Session.homeData.mapIndex = 0;
        }

        Game.cookie.setCookie(CookieKey.CURRENT_BATTLE,{
            "mapId":Game.battleLoader.mapId,
            "index":Game.battleLoader.index,
            "configId":Game.battleLoader._configId,
            "curhp":Game.hero.gamedata.hp,
            "maxhp":Game.hero.gamedata.maxhp,
            "skills":Game.skillManager.skills,
            "coins":Game.battleCoins,
            "chapterId":Game.battleLoader.chapterId
        });
        Game.isOpen = true;
        if(Session.homeData.isGuide)
        {
            Session.homeData.chapterId = 1;
            Game.scenneM.battle.setGuide("通过传送进入下一关。",5);
            App.sdkManager.log(LogType.BATTLE_GUIDE_5);
            Session.homeData.isGuide = false;
            Game.battleLoader.index = 1;
            Game.battleLoader.chapterId = 1;
            SysChapter.randomDiamond(Game.battleLoader.chapterId);
            Session.homeData.setChapterId(Session.homeData.chapterId,1);
            Game.battleGuide = 9999;
        }
        else
        {
            if(!Session.homeData.isPass)
            {
                Game.battleLoader.index++;
                if(Game.battleLoader.chapterId == Session.homeData.chapterId)
                {
                    if(Session.homeData.mapIndex < Game.battleLoader.index)
                    {
                        Session.homeData.mapIndex = Game.battleLoader.index - 1;
                        Session.homeData.setChapterId(Session.homeData.chapterId,Session.homeData.mapIndex);
                    }
                }
            }
        }


        Game.bg.setDoor(1);
        Game.layer3d.addChild(Game.door);
        // Game.door.transform.localPositionY = 0;
        // console.log("门的位置",Game.door.transform.localPositionX,Game.door.transform.localPositionY,Game.door.transform.localPositionZ);
        // Game.door.active = true;
        Game.map0.setDoor(true);
        Game.shakeBattle();
        Game.battleLoader.clearMonster(true);
        Session.saveData();
    }

    static shakeBattle():void
    {
        Game.scenneM.battle.pos(0,0);
        ShakeUtils.execute(Game.scenneM.battle, 75, 4);
    }

    static closeDoor(): void {
        console.log("关门====================");
        Game.isOpen = false;
        // Game.door.transform.localPositionY = -500;
        Game.door && Game.door.removeSelf();
        Game.map0.setDoor(false);
        Game.bg.setDoor(0);
    }

    static setSelectEffect(): void {
        if (!Game.selectHead) {
            Game.selectHead = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/head/monster.lh"));

            Game.selectHead.addComponent(HeadTranslateScript);
        }
        if (!Game.selectFoot) {
            Game.selectFoot = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/foot/hero.lh"));
            Game.selectFoot.addComponent(FootRotateScript);
        }
        
        // if (!Game.selectHead.getComponent(HeadTranslateScript))  {
        //     Game.selectHead.addComponent(HeadTranslateScript);
        // }

        // Game.selectFoot = Laya.loader.getRes("h5/effects/foot/hero.lh");
        // if (!Game.selectFoot.getComponent(FootRotateScript))  {
        //     Game.selectFoot.addComponent(FootRotateScript);
        // }
    }

    static reset(): void {
        Game.state = 0;
        Game.isPopupSkill = 0;
        // Game.AiArr.length = 1;
        Game.bloodLayer.removeChildren();
        Game.frontLayer.removeChildren();
        Game.footLayer.removeChildren();
        Game.layer3d.removeChildren();
        Game.layer3dCoins.removeChildren();
        Game.layer3dCube.removeChildren();
        Game.topLayer.removeChildren();
        Game.selectHead && Game.selectHead.removeSelf();
        Game.selectFoot && Game.selectFoot.removeSelf();
        Game.map0.reset();
        Game.e0_ = null;
        Game.executor && Game.executor.stop_();
        if (Game.ro) {
            Game.ro.destroy();
        }
    }

    static getRandPos(pro: GamePro,range1:number = 4): number[]  {
        let mRow: number = Math.floor(pro.hbox.y / GameBG.ww);
        let mCol: number = Math.floor(pro.hbox.x / GameBG.ww);

        let range: number = range1;

        var info: any = Game.map0.info;
        var arr: number[][] = [];
        for (let i = mRow - range; i <= mRow + range; i++) {
            if (i <= 3 || i >= GameBG.MAP_ROW - 3)  {
                continue;
            }
            for (let j = mCol - range; j <= mCol + range; j++) {
                if (j == mRow && i == mCol) {
                    continue;
                }
                if (j <= 1 || j >= GameBG.MAP_COL - 1)  {
                    continue;
                }
                var key: number = info[i + "_" + j];
                if (key == null)  {
                    continue;
                }
                if (key == 0) {
                    let aaa: number[] = [j, i];
                    arr.push(aaa);
                }
            }
        }
        var toArr: number[] = [];
        if (arr.length > 0) {
            var rand: number = Math.floor(arr.length * Math.random());
            toArr = arr[rand];
        }
        if(toArr.length == 0)
        {
            toArr = [mRow,mCol];
        }
        return toArr;
    }

    constructor() {
        //Laya.Scene3D
    }

    static alert:GameAlert;

    /**战斗中的金币 */
    static battleCoins: number = 0;
    static battleExp:number = 0;

    static heroExp:number = 0;


    static showCoinsNum:number = 0;

    static showBlueNum:number = 0;
    static showRedNum:number = 0;
    

    static showMain():void
    {
        GameCube.recover();
        // Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
        Game.selectFoot && Game.selectFoot.removeSelf();
        Game.selectHead && Game.selectHead.removeSelf();
        Game.skillManager.clear();
        Game.battleLoader.index = 1;
        Game.rebornTimes = 2;
        if(Game.hero)
        {
            Game.hero.resetBlood();
            Game.hero.resetSkill();
            Game.hero.resetAI();
        }
        
        Game.battleExp = Game.heroExp = 0;
        Game.battleLoader.clearMonster();
        Game.scenneM.showMain();

        if(Game.map0)
        {
            Game.map0.Eharr.length = 0;
        }
        
        Game.AiArr.length = 0;

        Game.playBgMusic();

        if(Game.showCoinsNum > 0)
        {
            Game.showCoinsNum = Game.showCoinsNum + Math.floor(Game.showCoinsNum * Session.talentData.lineGold / 100);
            Laya.stage.event(GameEvent.ADD_COIN,Game.showCoinsNum);
            Game.showCoinsNum = 0;
        }
        Game.showBlueNum = Game.showRedNum = 0;

        Laya.stage.event(GameEvent.SHOW_MAIN);
    }

    static playBgMusic():void
    {
        Game.playMusic("menu.mp3");
    }

    static playBattleMusic():void
    {
        Game.playMusic("state_fight.mp3");
    }

    static playMusic(str:string):void
    {
        Game.cookie.getCookie(CookieKey.MUSIC_SWITCH,(res)=>{
            if(res == null ||res.state == 1)
            {
                App.soundManager.play(str,true);
            }
        });
    }

    static playSound(str:string):void
    {
        Game.cookie.getCookie(CookieKey.SOUND_SWITCH,(res)=>{
            if(res.state == 1)
            {
                App.soundManager.play(str);
            }
        });
    }

    static dropDiamond(pro:GamePro):void
    {
        Game.showBlueNum = Game.showRedNum = 0;
        if (Game.map0.Eharr.length == 0)  {
            if(Game.battleLoader.index == SysChapter.dropIndex)
            {
                if(SysChapter.blueNum > 0)
                {
                    CoinEffect.addEffect(pro,SysChapter.blueNum,Coin.TYPE_BLUE);
                }
                else if(SysChapter.redNum > 0)
                {
                    CoinEffect.addEffect(pro,SysChapter.redNum,Coin.TYPE_RED);
                }
            }

            if(Game.battleLoader.index == SysChapter.heartIndex)
            {
                if(SysChapter.heartNum > 0)
                {
                    CoinEffect.addEffect(pro,SysChapter.heartNum,Coin.TYPE_HEART);

                    setTimeout(() => {
                        CoinEffect.flyHeart();
                    }, 1000);
                }
            }
        }
    }
}