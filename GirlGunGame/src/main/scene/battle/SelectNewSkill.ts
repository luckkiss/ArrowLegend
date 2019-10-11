import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
import SkillGrid from "./SkillGrid";
import SysSkill from "../../sys/SysSkill";
import App from "../../../core/App";
import SysBuff from "../../sys/SysBuff";
import SysNpc from "../../sys/SysNpc";
import Session from "../../Session";
import { AD_TYPE } from "../../../ADType";
    export default class SelectNewSkill extends ui.test.battlestopUI {

    private grid1:SkillGrid;
    private grid2:SkillGrid;
    constructor() { 
        super(); 

        this.grid1 = new SkillGrid(new Laya.Handler(this,this.onClick));
        this.grid2 = new SkillGrid(new Laya.Handler(this,this.onClick));

        this.box1.addChild(this.grid1);
        this.box2.addChild(this.grid2);

        this.queding.deshuliang.text = "刷新"

        App.sdkManager.initAdBtn(this.queding.fuhuo,AD_TYPE.AD_CHANGE_SKILL);
        this.queding.fuhuo.clickHandler = new Laya.Handler(this,this.showAD);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private showAD():void
    {
        App.sdkManager.playAdVideo(AD_TYPE.AD_CHANGE_SKILL,new Laya.Handler(this,this.onChangeSkill))
    }

    private onClick(sys:SysSkill):void
    {
        console.log(sys.skillName);
        if(!Game.hero.changeBlood(sys))
        {
            Game.skillManager.addSkill(sys);
        }
        Game.bg.clearNpc();
        this.removeSelf();
    }

    private onDis():void
    {
        Game.executor.stop_();
        // this.baioti.text = "本次冒险升到了" + Game.hero.playerData.level + "级";

        this.box1.scaleX = 1;
        this.box2.scaleX = 1;

        this.setSkill();
    }

    private onChangeSkill():void
    {
        this.setSkill();
    }

    private setSkill():void
    {
        let id:number = Game.battleLoader.chapterId == 1 ? 1005 : 1004;
        this.grid1.update(Game.skillManager.getRandomSkillByNpcId(id));
        this.grid2.update(Game.skillManager.getRandomSkillByNpcId(id));
    }


    removeSelf():Laya.Node
    {
        if(Session.talentData.dropLevelhp > 0)
        {
            Game.hero.addBlood(Session.talentData.dropLevelhp);
        }
        console.log("战斗内升级回血",Session.talentData.dropLevelhp);
        Game.executor.start();
        Game.state = 0;
        return super.removeSelf();
    }
}