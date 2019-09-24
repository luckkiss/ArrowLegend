
import Game from "../Game";
import GamePro from "../GamePro";
import MemoryManager from "../../main/scene/battle/MemoryManager";
import SysBullet from "../../main/sys/SysBullet";
import GameHitBox from "../GameHitBox";
import Monster from "../player/Monster";
import MonsterBullet from "../player/MonsterBullet";

/**子弹爆炸特效 */
export default class BoomEffect{
    static TAG:string = "BoomEffect";

    public pro: GamePro;
    public effectId:number = 0;
    public sp3d:Laya.Sprite3D;
    constructor() {

    }

    static getEffect(pro: GamePro,sys:SysBullet):BoomEffect
    {
        if(!sys)
        {
            return null;
        }
        if(sys.boomEffect <= 0)
        {
            return null;
        }
        let tag:string = BoomEffect.TAG + sys.boomEffect;
        Game.poolTagArr[tag] = tag;
        let effect:BoomEffect = Laya.Pool.getItemByClass(tag,BoomEffect);
        if(!effect.pro)
        {
            effect.pro = pro;
            effect.effectId = sys.boomEffect;
            effect.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/" + sys.boomEffect + "/monster.lh"));
            MemoryManager.ins.add(effect.sp3d.url);
            console.log("创建新的怪物子弹爆炸特效");
        }
        effect.sp3d.transform.localPositionX = pro.sp3d.transform.localPositionX;
        effect.sp3d.transform.localPositionZ = pro.sp3d.transform.localPositionZ;
        Game.layer3d.addChild(effect.sp3d);

        if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) <= sys.attackAngle) {
            pro.hurtValue = (pro as MonsterBullet).enemy.sysEnemy.enemyAttack;
            Game.hero.hbox.linkPro_.event(Game.Event_Hit, pro);
        }

        setTimeout(() => {
            // effect.recover();
        }, 500);
        return effect;
    }

    recover():void
    {
        this.sp3d && this.sp3d.removeSelf();
        Laya.Pool.recover(BoomEffect.TAG + this.effectId,this);
        MemoryManager.ins.app(this.sp3d.url);
    }
}