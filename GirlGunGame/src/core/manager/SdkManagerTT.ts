import App from "../App";
import GameEvent from "../../main/GameEvent";
import LogType from "./LogType";
import FlyUpTips from "../../main/FlyUpTips";
import { AD_TYPE } from "../../ADType";
import Log from "../../Log";

export default class SdkManagerTT {
    public haveRight:boolean = false;
    constructor(){
        
        Laya.Browser.window.wx.updateShareMenu({});
        Laya.Browser.window.wx.showShareMenu({});
        Laya.Browser.window.wx.onShareAppMessage( ()=>{
            return this.getShareObject();
        } );
        
        Laya.Browser.window.wx.getSetting({
            success: res=>{
                if( res.authSetting["scope.userInfo"] == true ){
                    console.log( "已经有授权了" );
                    this.getUserInfo();
                }else{
                    this.haveRight = false;
                    console.log( "没有授权" );
                }
            }
        });
        
        Laya.Browser.window.wx.setKeepScreenOn({keepScreenOn:true});
        Laya.Browser.window.wx.onShow( (res)=>{
            App.sendEvent( GameEvent.WX_ON_SHOW );
        } );

        Laya.Browser.window.wx.onHide( (res)=>{
            App.sendEvent( GameEvent.WX_ON_HIDE );
        } );

        const updateManager = Laya.Browser.window.wx.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log("版本更新回调:" , res.hasUpdate );
        });

        updateManager.onUpdateReady( function () {
        
        Laya.Browser.window.wx.showModal( {
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                }
            }
        } )
        })

        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
        });

        setTimeout(() => {
            this.initAd();
            this.initBanner();
        }, 3000);
    }


    public wxName:string = null;
    public wxHead:string = null;

    public getUserInfo():void {
        Laya.Browser.window.wx.getUserInfo({
            success:(res)=>{
                var userInfo = res.userInfo;
                this.wxName = userInfo.nickName;
                this.wxHead = userInfo.avatarUrl;
                var gender = userInfo.gender; //性别 0：未知、1：男、2：女
                var province = userInfo.province;
                var city = userInfo.city;
                var country = userInfo.country;
                console.log( "已经授权了:" , this.wxName ,this.wxHead );
                this.haveRight = true;
            }
          });
    }

    public callLaterFun():void{
        this.initAd();
    }

    public gameClubButton:any;
    
    public static FLY_BOX:number = 0;
    public static GAME_OVER:number = 1;
    public static GET_PET:number = 2;
    public static TIME_GOLD:number = 3;
    public static TREASURE:number = 4;
    public static ZHUAN:number = 5;
    public static AD_DIALOG:number = 7;
    
    public static NEXT_STAGE_CHAPING:number = 6;

    static REBORTH:number = 11;

    public adMap:any = {};

    public log( type:number , content:string = "" ):void{
        Log.log( type , content );
    }
    
    initAd():void {
        // if( App.isSimulator() ){
        //     return;
        // }

        if( Laya.Browser.window.wx ){
            this.adMap[AD_TYPE.AD_REBORTH] = "d8b0aae30j4gcj918m";
            this.adMap[AD_TYPE.AD_BATTLE10] = "d8b0aae30j4gcj918m";
            this.adMap[AD_TYPE.AD_CHANGE_SKILL] = "d8b0aae30j4gcj918m"
            // this.adMap[SdkSession.GET_PET] = "adunit-237729103790be65";
            // this.adMap[SdkSession.TIME_GOLD] = "adunit-7b46c29d0d9cf9b3";
            // this.adMap[SdkSession.TREASURE] = "adunit-d4c57c5c9ae67d48";
            // this.adMap[SdkSession.ZHUAN] = "adunit-61819bd988150e65";
            // this.adMap[SdkSession.NEXT_STAGE_CHAPING] = "adunit-8687ae6ea48ab104";
            // this.adMap[SdkSession.AD_DIALOG] = "adunit-ed6eb635c1d6b846";
        }

        this.ad = Laya.Browser.window.wx.createRewardedVideoAd({adUnitId:this.adMap[AD_TYPE.AD_REBORTH]});
        this.ad.onClose( (res)=>{
            console.log("广告 观看结果返回");
            if ( res && res.isEnded || res===undefined ){
                this.lastAdSucTime = Laya.Browser.now();
                this.exeHandler();
                this.log( LogType.AD_SUC_OVER , this.currentAdType + "" );
                App.sendEvent( GameEvent.AD_OVER );
            }
        });
        this.ad.onError( err => {
            this.adStat = 2;
            this.errCode = err.errCode;
            console.log("广告 加载错误:",err);
            if( this.errCode == 1004 ){
                console.log("加载视频失败,30秒后重试");
                Laya.timer.once( 30 * 1000 , this,this.retryAdFun );
            }
            this.log( LogType.AD_FAIL , this.errCode + "" );
        });
        this.ad.onLoad( ()=>{
            this.adStat = 1;
            console.log("广告 加载成功-----------------");
        });
    }

    public retryAdFun():void{
        this.ad.load();
    }
    
    /**
     * 最后广告成功时间
     */
    public lastAdSucTime:number = 0;
    public currentAdType:number = 0;

    public ad:any;
    public adHandler:Laya.Handler = null;
    /**
     * 1就是加载成功了
     * 2就是加载错误了
     */
    public adStat:number = 0;
    public errCode:number = 0;

    public playAdVideo( code:AD_TYPE , h:Laya.Handler ):void{
        this.currentAdType = code;
        if( Laya.Browser.window.wx == null ){
            h.runWith(1);
            App.sendEvent( GameEvent.AD_OVER );
            return;
        }
        if( this.adStat == 2 || this.ad == null ){
            this.share2( h );
            return;
        }
        this.adHandler = h;
        let adid = this.adMap[code];
        Laya.Browser.window.wx.createRewardedVideoAd({ adUnitId: adid });
        this.tryShowAD();
    }

    public initAdBtn(sp:Laya.UIComponent ,type:number ):void{
        sp.gray = (this.adStat == 2);
        sp.once( Laya.Event.UNDISPLAY , this, this.adUndisFun , [type] );
    }

    public adUndisFun(type:number):void{
        
    }

    public tryShowAD():void {
        this.log( LogType.AD_SUC );
        this.ad.show().catch(() => {
                this.ad.load().then( () => this.ad.show() ).catch(err => {
                    console.log('广告再加载失败');
                    console.log(err);
                    this.adStat = 2;
                    this.log( LogType.AD_FAIL_2 );
                })
        })
    }

    public exeHandler():void{
        this.adHandler.runWith(1);
    }

    public exeHandler2():void{
        this.share( this.adHandler );
    }

    public share2(h:Laya.Handler):void{
        var obj:any = this.getShareObject();
        obj.query = "";
        obj.imageUrlId = "";
        Laya.Browser.window.wx.shareAppMessage(obj);
        this.shareStartTime = Laya.Browser.now();
        Laya.stage.once( GameEvent.WX_ON_SHOW ,this,this.showFun,[h] );
    }

    public share( h:Laya.Handler , type:number = 0 ):void{
        this.checkShare();
        if( Laya.Browser.onMiniGame == false ){
            this.shareTimes++;
            h.runWith(1);
            return;
        }
        var obj:any = this.getShareObject();
        obj.query = "";
        obj.imageUrlId = "";
        Laya.Browser.window.wx.shareAppMessage(obj);
        this.shareStartTime = Laya.Browser.now();
        let chao:boolean = this.shareTimes >= SdkManagerTT.SHARE_MAX_TIMES;
        Laya.stage.once( GameEvent.WX_ON_SHOW ,this,this.showFun,[chao?null:h] );
    }

    public onlyShare():void{
        var obj:any = this.getShareObject();
        obj.query = "";
        Laya.Browser.window.wx.shareAppMessage(obj);
    }

    public showFun(h:Laya.Handler):void{
        if( h == null ){
            FlyUpTips.setTips("分享成功" );
            return;
        }
        if( (Laya.Browser.now() - this.shareStartTime) > 2000 ){
            this.shareTimes++;
            h.runWith(1);
        }else{
            FlyUpTips.setTips( "请分享到不同群获得奖励" );
        }
    }

    public shareStartTime:number = 0;

    public checkShare():void {
        let now = new Date();
        let last = new Date( this.shareTime );
        if( now.getDate() != last.getDate() ){
            this.shareTimes = 0;
        }
        this.shareTime = Date.now();
    }

    public getShareObject():any
    {
        var obj:any = {};
        obj.title = '魔法飞弹';
        obj.desc = '有人@你，和我一起来玩吧！';
        obj.imageUrl = "https://img.kuwan511.com/arrowLegend/shareImg.jpg";
        obj.destWidth = 500;
        obj.destHeight = 400;
        return obj;
    }

    /**
     * 今天分享了几次
     */
    public shareTimes:number = 0;

    /**
     * 最大分享次数
     */
    public static SHARE_MAX_TIMES:number = 6;

    /**
     * 分享的时间
     */
    public shareTime:number = 0;

    /**
     * 存数据到排行榜服务器
     * @param stageNum 
     */
    public savePlayerData( stageNum:number ):void{
        if( Laya.Browser.onMiniGame == false ){
            return;
        }
        var obj:any = {};
        var o1:any = {};
        o1.key = "stageNum";
        o1.value = stageNum + "";
        obj["KVDataList"] = [o1];
        obj.success = (res)=>{
            console.log("存储数据成功" ,res);
        }
        obj.fail = (res)=>{
            console.log("失败",res);
        }
        Laya.Browser.window.wx.setUserCloudStorage(obj);
    }

    private bannerAd;
    initBanner(): void {
        let sysInfo = Laya.Browser.window.wx.getSystemInfoSync();
        console.log("======================",sysInfo.model,sysInfo.windowWidth,sysInfo.windowHeight,sysInfo.screenWidth,sysInfo.screenHeight);
        let delta = 0;
        if (sysInfo.model == "iPhone X" || sysInfo.model == "iPhone XR" || sysInfo.model == "iPhone XS Max" || sysInfo.model == "iPhone XS")  {
            delta = 24;
        }
        var targetBannerAdWidth = 200;
        let ll = (sysInfo.windowWidth - targetBannerAdWidth) / 2;
        // 创建一个居于屏幕底部正中的广告
        this.bannerAd = Laya.Browser.window.wx.createBannerAd({
            adUnitId: "35kkgk805i952d16gc",
            adIntervals: 60,
            style: {
                width: targetBannerAdWidth,
                left:ll
            }
        });
        // top: sysInfo.windowHeight - (targetBannerAdWidth / 16) * 9 // 根据系统约定尺寸计算出广告高度
        this.bannerAd.onError(function (res) { });

        // 尺寸调整时会触发回调，通过回调拿到的广告真实宽高再进行定位适配处理
        // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
        this.bannerAd.onResize(size => {
            this.bannerAd.style.left = (sysInfo.windowWidth - size.width) * 0.5;
            this.bannerAd.style.top = sysInfo.windowHeight - size.height - delta;
            console.log("banner pos",this.bannerAd.style.left,this.bannerAd.style.top);
        })

        // this.bannerAd.show();
    }

    showBanner(): void {
        this.bannerAd && this.bannerAd.show();
    }

    hideBanner(): void {
        this.bannerAd && this.bannerAd.hide();
    }

    private recorde;
    private videoUrl;
    private isEnd: boolean;
    private isClickStop: boolean;
    recorder(): void {
        console.log("开始录屏");
        if (!this.recorde)  {
            this.recorde = Laya.Browser.window.tt.getGameRecorderManager();
            this.recorde.onStart(res => {
            });
            this.recorde.onStop((res) => {
                this.videoUrl = res.videoPath;
                console.log("录屏结束");
                this.isEnd = true;

                if (this.isClickStop)  {
                    this.stopRecorder(this._hand);
                }
            });
        }

        this.isClickStop = false;
        this.isEnd = false;
        this.recorde.start({
            duration: 15,
        })
    }

    private _hand:Laya.Handler;
    stopRecorder(handler:Laya.Handler): void {
        this._hand = handler;
        this.isClickStop = true;
        if (this.isEnd)  {
            Laya.Browser.window.wx.shareVideo({
                videoPath: this.videoUrl,
                success: (res) => {
                    this._hand && this._hand.run();
                },
                fail: (res) => {}
            });
        }
        else  {
            this.recorde.stop();
        }
    }
}