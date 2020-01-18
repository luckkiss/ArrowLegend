import LayerManager from "./manager/LayerManager";
import TableManager from "./manager/TableManager";
import BitmapNumber from "./display/BitmapNumber";
import SoundManager from "./manager/SoundManager";
import SdkManagerTT from "./manager/SdkManagerTT";
import DialogManager from "./manager/DialogManager";
import GameSoundManager from "./manager/GameSoundManager";

export default class App{
    static top:number = 10;

    static serverIP:string;
    static platformId:number = 0;

    static layerManager:LayerManager = null;
    static tableManager:TableManager = null;
    static soundManager:SoundManager = null;
    static sdkManager:SdkManagerTT = null;
    static eventManager:Laya.EventDispatcher = new Laya.EventDispatcher();
    static dialogManager:DialogManager = new DialogManager();
    static gameSoundManager:GameSoundManager = null;

    static init():void{
        App.layerManager = new LayerManager();
        App.tableManager = new TableManager();
        App.soundManager = new SoundManager();
        App.sdkManager = new SdkManagerTT();
        App.gameSoundManager = new GameSoundManager();
    }

    static sendEvent( event:string ,data?:any):void{
        Laya.stage.event( event ,data);
    }

     /**
     * 是否是在模拟器
     */
    public static isSimulator():Boolean {
        if( Laya.Browser.onMiniGame ){
            return Laya.Browser.window.wx.getSystemInfoSync().brand == "devtools";
        }else{
            return false;
        }
    }

    
    public static RandomByArray( arr:Array<any> , deleteArr:boolean = false ):any{
        let value = Math.random() * arr.length;
        let index = Math.floor(value);
        let resvalue = arr[index];
        if( deleteArr ) {
            arr.splice( index,1);
        }
        return resvalue;
    }

     /**
         * 他会自动帮你拼参数 
         * 你不需要get的时候把参数拼在url后面
         * 也就是说get 和 post 是是一样的
         */
    public static http( url:string , data:any , method:string,caller:any = null ,listener:Function = null,args:Array<any> = null ):Laya.HttpRequest{
        var http = new Laya.HttpRequest();
        let arr:Array<string> = [];
        let str:string = "";
        if( typeof data === 'string' ){
            str = data;
        }else{
            for( let k in data ){
                arr.push( k + "=" + data[k] );
            }
            str = arr.join("&");
        }
        if( method == "GET" ){
            url = url + "?" + str;
            data = null;
        }
        http.send(url,str,method);
        if( caller && listener ){
            http.once(Laya.Event.COMPLETE,caller,listener,args );
        }
        return http;
    }
}