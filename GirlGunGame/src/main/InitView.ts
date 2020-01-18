import { ui } from "../ui/layaMaxUI";
import App from "../core/App";
import GameEvent from "./GameEvent";
import { BaseCookie } from "../gameCookie/BaseCookie";
import PlatformID from "../platforms/PlatformID";
import TestCookie from "../gameCookie/TestCookie";
import WXCookie from "../gameCookie/WXCookie";
import Game from "../game/Game";
import CookieKey from "../gameCookie/CookieKey";

export default class InitView extends ui.test.initViewUI{
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        this.initTxt.text = "0%";
        Laya.loader.load("h5/config.json", new Laya.Handler(this, this.configFun));
    }

    private configFun(): void {
		let config = Laya.loader.getRes("h5/config.json");
		App.platformId = config.platformId;
		App.serverIP = config.platforms[App.platformId];

		let bc: BaseCookie;
		if (App.platformId != PlatformID.WX) {
			bc = new TestCookie();
		}
		else if (App.platformId == PlatformID.WX) {
			bc = new WXCookie();
		}
		else if (App.platformId == PlatformID.TT) {
			bc = new WXCookie();
		}
		Game.cookie = bc;

		Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
			if (res == null) {
				Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
				App.soundManager.setMusicVolume(1);
			}
			else {
				App.soundManager.setMusicVolume(res.state);
			}
		});

		Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
			if (res == null) {
				Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
				App.soundManager.setSoundVolume(1);
			}
			else {
				App.soundManager.setSoundVolume(res.state);
			}
		});
		Game.playBgMusic();

		let arr:any[] = [{ url: "h5/tables.zip", type: Laya.Loader.BUFFER }];
		for(let i = 0; i < Game.nativefiles.length; i++)
		{
			arr.push({ url: Game.nativefiles[i], type: Laya.Loader.IMAGE });
		}
		Laya.loader.load(arr,new Laya.Handler(this, this.onInitCom), new Laya.Handler(this, this.onInitProgress));
    }


    private onInitCom():void
    {
        Laya.stage.event(GameEvent.INIT_COM);
    }

    private onInitProgress(value: number): void {
		value = value * 100;
		this.initTxt.text = "" + value.toFixed(0) + "%";
	}

}