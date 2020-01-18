import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
// import { SkillSelector } from "../SelectNewSkill";
import SkillGrid from "../SkillGrid";
import SysSkill from "../../../sys/SysSkill";
import SysNpc from "../../../sys/SysNpc";
import App from "../../../../core/App";
import SysBuff from "../../../sys/SysBuff";
export default class NPC_1001_view extends ui.test.tianshi_1UI {
    private grid1: SkillGrid;
    private grid2: SkillGrid;
    constructor() {
        super();

        this.grid1 = new SkillGrid(new Laya.Handler(this, this.onClick));
        this.grid2 = new SkillGrid(new Laya.Handler(this, this.onClick));

        this.queding.visible = false;

        this.box1.addChild(this.grid1);
        this.box2.addChild(this.grid2);

        this.on(Laya.Event.DISPLAY, this, this.onDis);
        this.on(Laya.Event.UNDISPLAY, this, this.onUndis);
    }

    private onUndis(): void  {
        if (Laya.Browser.window.tt)  {
            App.sdkManager.hideBanner();
        }
    }

    private onClick(sys: SysSkill): void  {
        console.log(sys.skillName);
        if (!Game.hero.changeBlood(sys))  {
            Game.skillManager.addSkill(sys);
        }
        Game.bg.clearNpc();
        this.removeSelf();
    }

    private onDis(): void  {
        Game.executor.stop_();
        // this.baioti.text = "本次冒险升到了" + Game.hero.playerData.level + "级";
        let id: number = Game.battleLoader.chapterId == 1 ? 1006 : 1001;
        let sys: SysNpc = App.tableManager.getDataByNameAndId(SysNpc.NAME, id);
        this.box1.scaleX = 1;
        this.box2.scaleX = 1;

        this.grid1.update(Game.skillManager.getRandomSkillByNpcId(id));
        this.grid2.update(sys.skillId);

        if (Laya.Browser.window.tt)  {
            App.sdkManager.showBanner();
        }
    }


    removeSelf(): Laya.Node  {
        Game.executor.start();
        Game.state = 0;
        return super.removeSelf();
    }
}