
import Game from "../Game";
import GamePro from "../GamePro";
import MemoryManager from "../../main/scene/battle/MemoryManager";
import SysBullet from "../../main/sys/SysBullet";
import GameHitBox from "../GameHitBox";
import Monster from "../player/Monster";
import MonsterBullet from "../player/MonsterBullet";
import BoomCircle from "./BoomCircle";
import GameBG from "../GameBG";

/**子弹爆炸特效 */
export default class BoomEffect {
    static TAG: string = "BoomEffect";

    public pro: GamePro;
    public effectId: number = 0;
    public sp3d: Laya.Sprite3D;

    public boomCircle: BoomCircle;
    constructor() {

    }

    static getEffect(pro: GamePro, sys: SysBullet): void  {
        if (!sys)  {
            return null;
        }
        let tag: string = BoomEffect.TAG + sys.boomEffect;
        Game.poolTagArr[tag] = tag;
        let effect: BoomEffect = Laya.Pool.getItemByClass(tag, BoomEffect);
        if (sys.attackAngle > 0)  {
            if (!effect.boomCircle)  {
                effect.boomCircle = new BoomCircle();
            }
            effect.boomCircle.alpha = 1;
            Game.bg._box.addChild(effect.boomCircle);
            effect.boomCircle.img.scale(sys.attackAngle / 64,sys.attackAngle / 64);
            effect.boomCircle.pos(pro.hbox.cx, pro.hbox.cy);
            Laya.Tween.to(effect.boomCircle, { alpha: 0 }, 500, null, new Laya.Handler(this, effect.recover));
            if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) <= sys.attackAngle) {
                if(pro instanceof Monster)
                {
                    pro.hurtValue = (pro as Monster).sysEnemy.enemyAttack;
                }
                else if(pro instanceof MonsterBullet)
                {
                    pro.hurtValue = (pro as MonsterBullet).enemy.sysEnemy.enemyAttack;
                }
                Game.hero.hbox.linkPro_.event(Game.Event_Hit, pro);
            }
        }
        
        if (sys.boomEffect <= 0)  {
            return null;
        }
        if (!effect.pro)  {
            effect.pro = pro;
            effect.effectId = sys.boomEffect;
            effect.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/" + sys.boomEffect + "/monster.lh"));
            // console.log("创建新的怪物子弹爆炸特效");
        }
        effect.sp3d.transform.localPositionX = pro.sp3d.transform.localPositionX;
        effect.sp3d.transform.localPositionZ = pro.sp3d.transform.localPositionZ;
        Game.layer3d.addChild(effect.sp3d);
        
        setTimeout(() => {
            effect.recover();
        }, 500);
    }

    recover(): void  {
        this.boomCircle && this.boomCircle.removeSelf();
        this.sp3d && this.sp3d.removeSelf();
        Laya.Pool.recover(BoomEffect.TAG + this.effectId, this);
    }
}