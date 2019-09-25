import { ui } from "./../ui/layaMaxUI"
import LoginHttp from "../net/LoginHttp";
import ReceiverHttp from "../net/ReceiverHttp";
import GameMain from "./GameMain";
import App from "../core/App";
import PlatformID from "../platforms/PlatformID";
import Game from "../game/Game";
import CookieKey from "../gameCookie/CookieKey";
    export default class HomeLoading extends ui.game.homePageUI {
    
    private rect:Laya.Rectangle;
    constructor() { 
        super(); 
        this.name = "HomeLoading";
        this.mouseEnabled = true;
        this.rect = new Laya.Rectangle(0,0,1,this.barImg.height);
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        this.loadingBox.visible = false;
        this.startBtn.visible = true;
        this.vvv.visible = (App.platformId == PlatformID.TEST || App.platformId == PlatformID.H5);

        Game.cookie.getCookie(CookieKey.USER_ID, (res) => {
			if (res == null) {
			}
			else {
				App.soundManager.setMusicVolume(res.state);
				this.vvv.t1.text = res.userId;
			}
		});
    }

    load():void
    {
        this.loadingBox.visible = true;
        this.startBtn.visible = false;

        this.barImg.scrollRect = this.rect;
        this.sliderImg.x = this.rect.width;
        this.txt.text = "0%";
        Laya.loader.load([
			{ url: "res/atlas/main.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/atlas/guide.atlas", type: Laya.Loader.ATLAS },
			{ url: "res/atlas/zhaohuan.atlas", type: Laya.Loader.ATLAS },
			// { url: "res/atlas/shezhi.atlas", type: Laya.Loader.ATLAS },
			// { url: "res/atlas/tianfu.atlas", type: Laya.Loader.ATLAS },
			{ url: "h5/tables.zip", type: Laya.Loader.BUFFER }
		], new Laya.Handler(this, this.onHandler), new Laya.Handler(this, this.onProgress));
    }

    private onHandler(): void {
		console.log("加载完成");
		new LoginHttp(new Laya.Handler(this, this.onSuccess)).checkLogin();
	}

	private onSuccess(data): void {
		console.log("登录成功");
		ReceiverHttp.create(new Laya.Handler(this, this.onReceive)).send();
	}


	private isInit: boolean = false;
	private onReceive(data): void {
		if (this.isInit) {
			return;
		}
		console.log("获取玩家数据成功" + data);
		this.isInit = true;
        new GameMain();
        this.removeSelf();
	}

	private onProgress(value: number): void {
        this.rect.width = this.barImg.width * value;
        this.barImg.scrollRect = this.rect;
        this.sliderImg.x = this.rect.width;
		value = value * 100;
		this.txt.text = "" + value.toFixed(0) + "%";
	}
}