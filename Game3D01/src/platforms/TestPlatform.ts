import { BasePlatform } from "./BasePlatform";
import Game from "../game/Game";
import { ui } from "../ui/layaMaxUI";
import LoginHttp from "../net/LoginHttp";
import App from "../core/App";
import CookieKey from "../gameCookie/CookieKey";
import HomeLoading from "../main/HomeLoading";

export default class TestPlatform extends BasePlatform{
    checkUpdate():void
    {

    }

    login(callback):void
    {
        // callback && callback("" + Date.now());
        callback && callback("shfdsaomghjgai123fdafda456");
    }

    private cb;
    getUserInfo(callback):void
    {
        this.cb = callback;
        // callback && callback();
        let uu:HomeLoading = <any>Laya.stage.getChildByName("HomeLoading");
        uu.once( Laya.Event.CLICK ,this,this.clickFun);
    }

    clickFun( e:Laya.Event ):void{
        let uu:HomeLoading = <any>Laya.stage.getChildByName("HomeLoading");
        if(e.target == uu.idTxt)
        {
            return;
        }
        LoginHttp.FRONT = "test" + uu.idTxt.text + Date.now();
        Game.cookie.setCookie(CookieKey.USER_ID, { "userId": uu.idTxt.text });
        this.cb && this.cb();
    }

    onShare(callback):void
    {
        callback && callback();
        Game.hero.reborn();
    }
}