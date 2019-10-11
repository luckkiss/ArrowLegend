import Game from "../Game";
import GamePro from "../GamePro";
import GameProType from "../GameProType";
import CoinEffect from "./CoinEffect";

export default class DieEffect{
    static TAG:string = "DieEffect";

    public sp3d:Laya.Sprite3D;
    constructor() {
        
    }

    static addEffect(player:GamePro):DieEffect
    {
        let effect:DieEffect = Laya.Pool.getItemByClass(DieEffect.TAG,DieEffect);
        if(!effect.sp3d)
        {
            effect.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/monsterDie/monster.lh"));
        }
        
        effect.sp3d.transform.localRotationEulerY = 45;
        
        Game.layer3d.addChild(effect.sp3d);
        effect.sp3d.transform.localPosition = player.sp3d.transform.localPosition;
        effect.sp3d.transform.localScaleX = 0.3;
        effect.sp3d.transform.localScaleY = 0.3;
        effect.sp3d.transform.localScaleZ = 0.3;
        Laya.timer.once(1000,this,()=>{
            effect.recover();
        })
        return effect;
    }

    recover():void
    {
        this.sp3d && this.sp3d.removeSelf();
        Laya.Pool.recover(DieEffect.TAG,this);
        if (Game.map0.Eharr.length == 0)  {
            CoinEffect.fly();
            Laya.stage.event(Game.Event_EXP);
        }
    }
}