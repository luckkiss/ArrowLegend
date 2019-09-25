import { ui } from "../../ui/layaMaxUI";
import MyEffect from "../../core/utils/MyEffect";
import Game from "../../game/Game";

export default class OpenIconDialog extends ui.test.OpenIconUI{
    public openIndex:number = 0;
    constructor( openIndex:number ){
        super();
        this.openIndex = openIndex;

        this.icon.skin = null;
        
        if( this.openIndex == 1 ){
            this.icon.skin = "main/btn_1.png";
        }else if( this.openIndex == 2 ){
            this.icon.skin = "main/btn_2.png";
        }

        this.icon.anchorX = this.icon.anchorY = 0.5;
        this.icon.x += (this.icon.width/2 * 1.5);
        this.icon.y += (this.icon.height/2 * 1.5);

        MyEffect.rotation( this.light , 4000 );
        this.light.alpha = 0;
        MyEffect.show( this.light , 800 );
        MyEffect.popup( this.title ,  1 , 300, 600 );
        
        Laya.timer.once( 1400 , this,this.cFun );

        let p = this.icon.localToGlobal( new Laya.Point(0,0) );
        this.icon.x = p.x; //+ this.icon.width/2 * 1.5;
        this.icon.y = p.y; //+ this.icon.height/2 * 1.5;
        Laya.stage.addChild( this.icon );
        this.icon.zOrder = 1000;
        MyEffect.popup( this.icon , 1.5 , 300, 1100 );
    }

    public cFun():void{
        //this.closeText.visible = true;
        //MyEffect.flash( this.closeText , 800 );
        //Laya.stage.once( Laya.Event.CLICK , this,this.clickFun );
        Laya.timer.once( 100 , this, this.clickFun );
    }

    public clickFun():void{
        let time:number = 600;
        MyEffect.hide( this.light, time );
        MyEffect.hide( this.title,time );
        MyEffect.hide( this.closeText , time );
        MyEffect.hide( Laya.Dialog.manager.maskLayer ,  time );
        Laya.timer.once( time + 100 , this, this.tFun );
    }

    public tFun():void{
        this.close();
        Laya.Dialog.manager.maskLayer.alpha = 0.8;
        Game.scenneM.main.mainUI.bottomUI.fly( this.icon  , this.openIndex );
    }
}