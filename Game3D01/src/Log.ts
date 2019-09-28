import Session from "./main/Session";
import App from "./core/App";
import Game from "./game/Game";
import LogType from "./core/manager/LogType";

export default class Log{
    public static onlyid = Math.random();
    constructor(){
        
    }

    public static init():void{
        
    }

    public static log( type:LOG_TYPE , content:string = "" ):void {
        var arr:Array<any> = [];
        arr.push( Laya.Browser.now() );
        arr.push( Game.codeVer );
        arr.push( Session.SKEY );
        arr.push( 0 );
        arr.push( Log.onlyid );
        arr.push( type );
        arr.push( content );
        arr.push( App.sdkManager.wxName );
        let str = arr.join( "\t" );
        App.http( App.serverIP + "gamex2/gamelog" ,"log=" + str ,"post" );
    }
}

export enum LOG_TYPE{
    REG = 0,
    LOGIN = 1
}