import MainScene from "./scene/main/MainScene";
import BattleScene from "./scene/battle/BattleScene";
import App from "../core/App";
import Game from "../game/Game";

export default class SceneManager {

    constructor() { };

    public main: MainScene;
    public battle: BattleScene;

    showMain(): void {
        if (!this.main)  {
            this.main = new MainScene();
        }
        Game.isStartBattle = false;
        App.layerManager.sceneLayer.removeChildren();
        App.layerManager.sceneLayer.addChild(this.main);

        this.main.y = (Laya.stage.height - Laya.stage.designHeight )/2;

        //this.main.alpha = 0.5;

        this.battle && this.battle._top && this.battle._top.reset();
        this.battle && this.battle.up(null);
    }

    showBattle(): void {
        if (!this.battle)  {
            this.battle = new BattleScene();
        }
        App.layerManager.sceneLayer.removeChildren();
        App.layerManager.sceneLayer.addChild(this.battle);
        Game.playBattleMusic();
    }
}