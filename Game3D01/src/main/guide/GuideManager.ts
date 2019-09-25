import { ui } from "../../ui/layaMaxUI";

export default class GuideManager{
    
    public static g:GuideManager = null;

    public handMv:ui.test.newhand1UI = new ui.test.newhand1UI();

    constructor(){
        
    }

    public static getInstance():GuideManager {
        if( GuideManager.g == null ){
            GuideManager.g = new GuideManager();
        }
        return GuideManager.g;
    }

    public hand( target:Laya.Sprite , x:number = 0 , y:number = 0 ):void{
        Laya.stage.addChild( this.handMv );
        let p = target.localToGlobal( new Laya.Point(0,0) );
        this.handMv.pos( p.x , p.y );
        this.handMv.ani1.play( 0 , true );
    }
}