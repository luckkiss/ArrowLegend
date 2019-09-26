import GameConfig from "./GameConfig";
import GameBG from "./game/GameBG";
import GameMain from "./main/GameMain";
import { ui } from "./ui/layaMaxUI"
import App from "./core/App";
import PlatformID from "./platforms/PlatformID";
import { BasePlatform } from "./platforms/BasePlatform";
import HitType from "./game/ai/HitType";
import GameScaleAnimator1 from "./game/ai/GameScaleAnimator1";
import GameScaleAnimator2 from "./game/ai/GameScaleAnimator2";
import GameScaleAnimator3 from "./game/ai/GameScaleAnimator3";
import GameScaleAnimator4 from "./game/ai/GameScaleAnimator4";
import NPC_1001 from "./main/scene/battle/npc/NPC_1001";
import NPC_1002 from "./main/scene/battle/npc/NPC_1002";
import NPC_1003 from "./main/scene/battle/npc/NPC_1003";
import AttackType from "./game/ai/AttackType";
import AIType from "./game/ai/AIType";
import BaseAI from "./game/ai/BaseAi";
import FlyAndHitAi from "./game/ai/FlyAndHitAi";
import FlowerAI from "./game/ai/FlowerAI";
import StoneAI from "./game/ai/StoneAI";
import TreeAI from "./game/ai/TreeAI";
import RandMoveAI from "./game/ai/RandMoveAI";
import MoveAndHitAi from "./game/ai/MoveAndHitAi";
import ReboundAI from "./game/ai/ReboundAI";
import JumpFollowAI from "./game/ai/JumpFollowAI";
import ArcherAI from "./game/ai/ArcherAI";
import MoveType from "./game/move/MoveType";
import FlyGameMove from "./game/move/FlyGameMove";
import PlaneGameMove from "./game/move/PlaneGameMove";
import FixedGameMove from "./game/move/FixedGameMove";
import JumpMove from "./game/move/JumpMove";
import BackMove from "./game/move/BackMove";
import TestPlatform from "./platforms/TestPlatform";
import WXPlatform from "./platforms/WXPlatform";
import BuffID from "./game/buff/BuffID";
import FireBuff from "./game/skill/player/FireBuff";
import IceBuff from "./game/skill/player/IceBuff";
import Game from "./game/Game";
import WudiBuff from "./game/skill/player/WudiBuff";
import ShitouAI from "./game/ai/ShitouAI";
import FlyGameMove2 from "./game/move/FlyGameMove2";
import MyEffect from "./core/utils/MyEffect";
import Session from "./main/Session";
import ZipLoader from "./core/utils/ZipLoader";
import GameEvent from "./main/GameEvent";
import NPC_1001_view from "./main/scene/battle/npc/NPC_1001_view";
import HomeLoading from "./main/HomeLoading";
import InitView from "./main/InitView";

class Main {
	private _initView: InitView;
	private homePage: HomeLoading;
	constructor() {
		UIConfig.popupBgAlpha = 0.8;
		if (window["Laya3D"]) Laya3D.init(GameBG.width, GameBG.height);
		else Laya.init(GameBG.width, GameBG.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		//Laya.stage.scaleMode = GameConfig.scaleMode;
		//console.log(Laya.Stage.SCALE_FIXED_WIDTH);
		Laya.stage.bgColor = "#000000";
		Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
		//Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		if (GameConfig.stat) Laya.Stat.show();

		console.log("代码版本",Game.codeVer);
		console.log("代码版本",Game.resVer);
		//App.top = 90;
		if (Laya.Browser.window.wx) {
			Laya.URL.basePath = "https://img.kuwan511.com/arrowLegend/" + Game.resVer + "/";
			Laya.MiniAdpter.nativefiles = ["loading/jiazai.jpg", "loading/btn_kaishi.png", "loading/loadingClip.png","loading/logo.png","loading/zhudi.jpg","loading/zhudi2.png"];
			Laya.Browser.window.wx.getSystemInfo({
				success(res) {
					let model = res.model;
					GameBG.height = GameBG.width / res.windowWidth * res.windowHeight;
				}
			});
		}

		this._initView = new InitView();
		Laya.stage.once(GameEvent.INIT_COM,this,this.onInitCom);
		Laya.stage.addChild(this._initView);

		App.init();
		MyEffect.initBtnEffect();

		let bg = new ui.test.StageBgUI();
		Laya.stage.addChild( bg );
		bg.centerY = 0;
		bg.zOrder = 1000;
		bg.mouseEnabled = false;
	}

	private zipFun(arr: any[]): void {
		GameMain.initDialog();
		GameMain.initTable(arr);
		Session.init();
		this.authSetting();
		Laya.stage.event(GameEvent.CONFIG_OVER);
	}

	private onInitCom(): void {
		Laya.stage.addChild(App.layerManager);
		App.layerManager.y = (Laya.stage.height - Laya.stage.designHeight )/2;
		
		App.soundManager.pre = "h5/sounds/";
		ZipLoader.instance.zipFun(Laya.loader.getRes("h5/tables.zip"), new Laya.Handler(this, this.zipFun));
		this.regClass();
	}

	private curBP: BasePlatform;
	private authSetting(): void {
		if (!this.homePage) {
			this.homePage = new HomeLoading();
		}
		Laya.stage.addChild(this.homePage);

		let BP = Laya.ClassUtils.getRegClass("p" + App.platformId);
		if (!this.curBP) {
			this.curBP = new BP();
		}
		this.curBP.checkUpdate();
		this.curBP.getUserInfo(this.getUserInfoSuccess.bind(this));

		this._initView && this._initView.removeSelf();
	}

	private isSuccess: boolean = false;
	private getUserInfoSuccess(): void {
		if (this.isSuccess) {
			return;
		}
		this.isSuccess = true;
		this.homePage.load();
		console.log("授权成功，开始加载");
	}

	private regClass(): void {
		var REG: Function = Laya.ClassUtils.regClass;
		//击退效果
		REG("HIT_" + HitType.hit1, GameScaleAnimator1);
		REG("HIT_" + HitType.hit2, GameScaleAnimator2);
		REG("HIT_" + HitType.hit3, GameScaleAnimator4);
		REG("HIT_" + HitType.hit4, GameScaleAnimator3);
		//NPC
		REG("NPC1001", NPC_1001);
		REG("NPC1002", NPC_1002);
		REG("NPC1003", NPC_1003);

		REG("NPCVIEW1001", NPC_1001_view);
		// REG("NPCVIEW1002", NPC_1002_view);
		// REG("NPCVIEW1003", NPC_1003_view);
		//攻击类型
		REG(AttackType.TAG + AIType.NOTHAS, BaseAI);
		REG(AttackType.TAG + AIType.FLYHIT, FlyAndHitAi);
		REG(AttackType.TAG + AIType.BULLET, FlowerAI);
		REG(AttackType.TAG + AIType.STONE, StoneAI);
		REG(AttackType.TAG + AIType.SHITOUREN, ShitouAI);
		REG(AttackType.TAG + AIType.TREE, TreeAI);
		REG(AttackType.TAG + AIType.RANDOM_MOVE, RandMoveAI);
		REG(AttackType.TAG + AIType.MOVEHIT, MoveAndHitAi);
		REG(AttackType.TAG + AIType.REBOUND, ReboundAI);
		REG(AttackType.TAG + AIType.JUMP_FOLLOW, JumpFollowAI);
		REG(AttackType.TAG + AIType.RED_LINE, ArcherAI);
		//移动类型
		REG(MoveType.TAG + MoveType.FLY, FlyGameMove);
		REG(MoveType.TAG + MoveType.MOVE, PlaneGameMove);
		REG(MoveType.TAG + MoveType.FIXED, FixedGameMove);
		REG(MoveType.TAG + MoveType.JUMP, JumpMove);
		REG(MoveType.TAG + MoveType.BACK, BackMove);
		REG(MoveType.TAG + MoveType.BOOM, FlyGameMove2);
		//平台
		REG("p" + PlatformID.TEST, TestPlatform);
		REG("p" + PlatformID.H5, TestPlatform);
		REG("p" + PlatformID.WX, WXPlatform);
		//buff
		//无敌
		REG("BUFF" + BuffID.WUDI_5009, WudiBuff);
		//火焰
		REG("BUFF" + BuffID.FIRE_2001, FireBuff);
		REG("BUFF" + BuffID.FIRE_5001, FireBuff);
		//淬毒
		REG("BUFF" + BuffID.DU_2002, FireBuff);
		REG("BUFF" + BuffID.DU_5002, FireBuff);
		//冰冻
		REG("BUFF" + BuffID.ICE_2003, IceBuff);
		REG("BUFF" + BuffID.ICE_5003, IceBuff);


	}
}
//激活启动类
new Main();
