import App from "../App";

/*
* name;
*/
export default class SoundManager{
    public pre:string = "";
    constructor(){
    }

    public setMusicVolume(value:number):void
    {
        App.gameSoundManager.setBgmMuted( value == 0 );
    }

    public setSoundVolume(value:number):void
    {
        App.gameSoundManager.setEffMuted( value == 0 );
    }

    
    public soundName:string;
    public isMusic:boolean;
    public play(soundName:string,isMusic:boolean = false):void
    {
        this.soundName = soundName;
        this.isMusic = isMusic;
        var url:string = this.pre + soundName;

        if( isMusic ){
            App.gameSoundManager.playBgm( url );
        }else{
            App.gameSoundManager.playEffect( url );
        }
        return;
        if(Laya.loader.getRes(url))
        {
            this.onLoadCom(url,isMusic);
        }
        else
        {
            Laya.loader.load(url,new Laya.Handler(this,this.onLoadCom,[url,isMusic]));
        }
    }

    private onLoadCom(url,isMusic):void
    {
        if(isMusic)
        {
            Laya.SoundManager.playMusic(url,0);
        }
        else
        {
            Laya.SoundManager.playSound(url,1);
        }
    }

}