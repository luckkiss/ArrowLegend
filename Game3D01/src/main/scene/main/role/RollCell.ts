import { HeroLvType } from "../../../../game/data/HeroData";
import { GoldType } from "../../../../game/data/HomeData";
import MyEffect from "../../../../core/utils/MyEffect";
import SysRoleBase from "../../../sys/SysRolebase";
import SysRoleUp from "../../../sys/SysRoleUp";
import Session from "../../../Session";
import { ui } from "../../../../ui/layaMaxUI";

export default class RollCell{
    
    public heroLvType:HeroLvType;
    public goldType:GoldType;
    /**
     * 显示当前等级的那个
     */
    public vs1:Laya.ViewStack;
    /**
     * 显示当前宝石进度的那个
     */
    public vs2:Laya.ViewStack;
    /**
     * 金币的图片
     */
    public goldImg:Laya.Image;
    /**
     * 显示钻石数量的进度
     */
    public goldFc:Laya.FontClip;

    /**
     * 升级按钮 里面的金币数字
     */
    public lvUpBtnGoldText:Laya.Text;
    /**
     * 进度条
     */
    public progressBarImg:Laya.Image;
    
    /**
     * 显示人物当前能力的等级
     */
    public lvFc:Laya.FontClip;
    /**
     * 点击按钮 弹出看广告增加钻石的窗口
     */
    public goldAddBtn:Laya.Button;
    /**
     * 显示进度的那个box
     */
    public goldBox:Laya.Box;

    /**
     * 当前等级 增加的能力值
     */
    public nowLvAddfc:Laya.FontClip;
    /**
     * 基础能力值
     */
    public heroBaseFc:Laya.FontClip;
    /**
     * 英雄增加的绿色的那个
     */
    public heroAddFc:Laya.FontClip;
    /**
     * 升级按钮
     */
    public lvUpBtn:Laya.Button;
    
    public lv:ui.test.juese_2UI;

    /**
     * 设置当前的进度
     */
    public setValue( now:number , max:number ):void {
        let vv = now / max;
        this.progressBarImg.scrollRect = new Laya.Rectangle( 0 , 0,  this.progressBarImg.width * vv , this.progressBarImg.height );
        this.progressBarImg.visible = (vv != 0);
        this.goldFc.value = now + "/" + max;
    }

    /**
     * 进度条满了 弹出升级按钮
     */
    public effect1():void{
        this.vs2.selectedIndex = 1;
        this.lvUpBtn.scale(0,0);
        let t = new Laya.Tween();
        t.to( this.lvUpBtn , { scaleX:1,scaleY:1 } , 400 , Laya.Ease.backOut );
    }

    public setData( roleId:number ):void
    {
        let haveRold = SysRoleBase.have( roleId );
        if( haveRold ){
            this.vs2.visible = true;
            this.vs1.visible = true;
            this.heroAddFc.visible = true;
            if( Session.heroData.test( roleId , this.heroLvType ) ){
                this.lv.ani1.play( 0, true );
                this.lv.visible = true;
            }else{
                this.lv.visible = false;
            }

        }else{
            this.vs2.visible = false;
            this.vs1.visible = false;
            this.heroBaseFc.value = "0";
            this.heroAddFc.visible = false;
            
            this.nowLvAddfc.value = "+0";
            this.lv.visible = false;
            return;
        }

        let lv = Session.heroData.getHeroLv( roleId , this.heroLvType );
        let sysRoleBase = SysRoleBase.getSys( roleId );
        let sysRoleUp = SysRoleUp.getSysRole( roleId , lv );
        let cost = sysRoleUp.getCost( this.heroLvType );
        let costType = sysRoleUp.getCostType( this.heroLvType );
        let have = Session.homeData.getGoldByType( costType );
        
        //中间的
        this.heroBaseFc.value = sysRoleBase.getValue( this.heroLvType ) + "";
        this.heroAddFc.value =  "+" + SysRoleUp.getAddValue( roleId , lv , this.heroLvType );
        this.heroAddFc.x =  this.heroBaseFc.x + this.heroBaseFc.value.length * 23 + 10;
        
        //按钮里的
        this.lvUpBtnGoldText.text = sysRoleUp.costGold + "";

        //下面的
        this.setValue( have , cost );
        this.nowLvAddfc.value = "+" + sysRoleUp.getValue( this.heroLvType );
        this.lvFc.value = lv + "";
        if( lv >= sysRoleBase.roleLimt ){
            //超过最高等级了 只显示max
            this.vs1.selectedIndex = 1;
            this.vs2.visible = false;
            return;
        }
        this.vs2.visible = true;
        this.vs1.selectedIndex = 0;
        
        if( have >= cost ){
            //如果钻石够了 就显示升级按钮
            this.vs2.selectedIndex = 1;
            //this.lvUpBtn.mouseEnabled = true;
        }else{
            //钻石不够 继续显示进度条
            this.vs2.selectedIndex = 0;
            //this.lvUpBtn.mouseEnabled = false;
        }
    }
}