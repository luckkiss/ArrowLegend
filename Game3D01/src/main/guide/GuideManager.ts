import { ui } from "../../ui/layaMaxUI";
import Session from "../Session";

export default class GuideManager{
    
    public static g:GuideManager = null;

    public handMv:ui.test.newhand1UI = new ui.test.newhand1UI();

    public maskLayer:Laya.Box = new Laya.Box();
    
    constructor(){
        this.maskLayer = new Laya.Box();
        this.maskLayer.size( Laya.stage.width , Laya.stage.height );
        this.maskLayer.mouseThrough = false;
        this.maskLayer.zOrder = 1000000;
        this.maskLayer.mouseEnabled = true;
    }

    public static getInstance():GuideManager {
        if( GuideManager.g == null ){
            GuideManager.g = new GuideManager();
        }
        return GuideManager.g;
    }

    public target:Laya.Sprite = null;
    public nextStat:number = 0;

    public hand( target:Laya.Sprite , x:number = 0 , y:number = 0 , nextStat:number  ):void{
        //return;
        this.target = target;
        this.nextStat = nextStat;
        this.handMv.visible = true;
        Laya.stage.addChild( this.handMv );
        let p = target.localToGlobal( new Laya.Point(0,0) );
        this.handMv.pos( p.x , p.y );
        this.handMv.lightClip.play();
        this.handMv.ani1.play( 0 , true );
        Laya.stage.on( Laya.Event.CLICK ,this , this.clickFun );
        Laya.stage.addChild( this.maskLayer );
    }

    public clickFun( e:Laya.Event ):void{
        let r = this.target.getBounds();
        let p = this.target.localToGlobal( new Laya.Point(0,0) );
        let r1 = new Laya.Rectangle( p.x,p.y,r.width,r.height );
        let cc = r1.contains( Laya.stage.mouseX , Laya.stage.mouseY );
        if( cc ){
            Session.homeData.newStat = this.nextStat;
            this.target.event( Laya.Event.CLICK , e );
            this.handMv.visible = false;
        }
    }

    public removeMask():void{
        this.maskLayer.removeSelf();
    }
}