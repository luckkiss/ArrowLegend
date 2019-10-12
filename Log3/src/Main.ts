import GameConfig from "./GameConfig";
import LogData from "./LogData";
import { ui } from "./ui/layaMaxUI";
import MyData from "./MyData";
import ListCell from "./ListCell";
class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
		
		if( Laya.Browser.onPC == false ){
			Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
		}else{
			Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
		}

		Laya.stage.alignH = "center";

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
		this.nameMap["VZGU"] = "胡老总";
		this.nameMap["igoY"] = "刘跃进";
		this.nameMap["o2X0"] = "达叔";
	}

	public nameMap:any = {};

	public onlyMap:object = {};

	public useMap:object = {};

	onConfigLoaded(): void {
		this.onlyMap["1"] = {};
		this.onlyMap["11"] = {};

		this.useMap["20"] = {};

		//加载IDE指定的场景
		Laya.Scene.open( "MainScene.scene" , false , null, new Laya.Handler(this,this.comFun)  );
		this.logTypeMap[18] = "广告加载失败";
		this.logTypeMap[19] = "广告显示成功";
		this.logTypeMap[20] = "广告播放完毕";
		this.logTypeMap[21] = "广告失败2";

		this.logTypeMap[10001] = "显示登陆界面";
		this.logTypeMap[10002] = "点击开始按钮";
		this.logTypeMap[10003] = "登陆成功";
		this.logTypeMap[10004] = "注册用户";
		this.logTypeMap[10005] = "显示主界面";
		this.logTypeMap[10006] = "新手战斗加载";
		this.logTypeMap[10007] = "滑动摇杆移动到指定位置";
		this.logTypeMap[10008] = "最佳控制区域";
		this.logTypeMap[10009] = "主角会自动攻击，移动中不会攻击";
		this.logTypeMap[10010] = "显示引导怪";
		this.logTypeMap[10011] = "通过传送进入下一关";
		this.logTypeMap[10012] = "到达传送点进入正式地图";
		this.logTypeMap[10013] = "点击复活";
		this.logTypeMap[10014] = "复活成功";

		let ss:string = "100000,100101,100201,100301,100401,100501,100601,100701,100801,100901,101001,200101,200201,200301,200401,200501,200601,200701,200801,200901,201001,201101,201201,201301,201401,201501,201601,201701,201801,201901,202001,300101,300201,300301,300401,300501,300601,300701,300801,300901,301001,301002,301003,301004,301101,301201,301301,301401,301501,301601,301701,301801,301901,302001,302002,302003,302101,302201,302301,302401,302501,302601,302701,302801,302901,303001"
		let arr = ss.split(",");
		for(let i = 0; i < arr.length;i++)
		{
			this.logTypeMap[Number(arr[i])] = "地图" + arr[i];
		}

		this.allMap = {};
		let key:string;
		for(key in this.logTypeMap)
		{
			let myData:MyData = new MyData();
			myData.id = key;
			myData.content = this.logTypeMap[key];
			myData.count = 0;
			this.allMap[key] = myData;
		}
	}

	itemErrorFun():void {
		
		for( let i of this.logArr ) {
			if( i.actionId == "1" ){
				//this.main.txt2.text += ( "物品错误的唯一登陆id是:" + i.onlyId + "\n" );
			}
		}
	}

	public timeFun():string {
		let s:number = 0;
		let a:number = 0;
		for( let i of this.logArr ) {
			if( i.actionId == "0" ){
				a++;
				s += parseInt(i.content);
			}
		}
		return  "平均加载时长:" + parseInt(s/a/1000 + "") + "秒";
	}

	public main:ui.MainSceneUI = null;

	public comFun( e:Laya.Scene ):void{
		this.main = <any>e;
		this.main.nowBtn.clickHandler = new Laya.Handler( this, this.loadNow );
		this.main.selectBtn.clickHandler = new Laya.Handler( this,this.selectFun );
		this.main.input.text = this.getNowString();
		this.main.adBtn.clickHandler = new Laya.Handler( this,this.hhhFun );

		this.list = new Laya.List();
        this.list.pos(this.main.box.x,this.main.box.y);
        this.main.box.addChild(this.list);
        this.list.itemRender = ListCell;
        this.list.repeatX = 1;
        this.list.repeatY = 25;
        this.list.vScrollBarSkin = "";
		this.list.renderHandler = new Laya.Handler(this, this.updateItem);
		this.list.array = [];
	}

	private updateItem(cell: ListCell, index: number):void
	{
		let data:MyData = this.list.getItem(index);
		cell.update( data );
	}

	private list:Laya.List;

	public hhhFun():void{
		let arr:Array<any> = [];
		for( let i in this.mmm ){
			let obj:any = {};
			obj.id = i;
			obj.value = this.mmm[i];
			arr.push( obj );
		}
		arr.sort( (a:any,b:any)=>{
			return  b.value - a.value;
		} );
		
		Laya.stage.removeChildren();

		let ss:string = "";
		for( let iia of arr ){
			ss += ( iia.value + " ---- " + iia.id + " " + this.getName( iia.id ) + "\n" );
		}

		let t = new Laya.Text();
		t.text = ss;
		t.color = "#ffffff";
		t.fontSize = 26;
		t.graphics.drawRect( 0,0, Laya.stage.width,Laya.stage.height , "#000000" );

		Laya.stage.addChild( t );
	}

	public getName( s:string ):string{
		for ( let i in this.nameMap ){
			if( s.substr( s.length - 4  ) == i ){
				return this.nameMap[i];
			}
		}
		return this.pNameMap[s];
	}

	selectFun():void{
		this.loadByDate( this.main.input.text );
	}

	loadNow():void {
		this.loadByDate( this.getNowString() );
	}

	public getNowString():string{
		var d:Date = new Date();
		var y:number = d.getFullYear();
		var m:number = d.getMonth() + 1;
		var day:number = d.getDate();
		var str:string = this.v(y) + "-" + this.v(m) + "-" + this.v(day);
		return str;
	}

	private loadByDate( str:string ):void{
		this.main.txt2.text = ""; 
		let url:string = "";
		if( this.main.cb1.selectedIndex == 0 ){
			url = "https://s1.kuwan511.com";
		}else if( this.main.cb1.selectedIndex == 1 ){
			url = "https://s1.kuwan511.com";
		}
		Laya.loader.load( url + "/DFile." + str + ".log?ver=" + Math.random() ,new Laya.Handler(this,this.txtCom) , null, Laya.Loader.TEXT , 1, false, "" , true  );		
	}

	public v(a:number):String {
		return (a<10)?("0" + a):(a + "");
	}

	public logArr:Array<LogData> = [];
	public logTypeMap:any = {};
	public pNameMap:any = {};

	private allMap:any = {};

	public txtCom( text:String ):void {
		this.logArr.length = 0;

		let key:string;
		for(key in this.allMap)
		{
			let myData:MyData = this.allMap[key];
			myData.count = 0;
		}

		let arr = text.split("\n");
		for( let i of arr  ){
			let log = new LogData(i);

			let myData:MyData = this.allMap[log.actionId];
			if(myData)
			{
				myData.count++;
			}
		}
		
		// this.addText( this.getOnline() );
		// this.addText( this.getText( logMap ) );
		this.showResult();
	}

	private showResult():void
	{
		this.main.text.text = "";
		let key:string;
		let arr = [];
		for(key in this.allMap)
		{
			let myData:MyData = this.allMap[key];
			this.main.text.text += myData.id + "\t" + myData.content +"\t" + myData.count + "\n";
			arr.push(myData);
		}
		this.list.array = arr;
	}

	public mmm:any = {};
	public addUserNum( code:string ):void{
		if( this.mmm[code] == null) {
			this.mmm[code] = 1;
		}else{
			this.mmm[code]++;
		}
	}

	public addText( text:string ):void {
		this.main.text.text += (text + "\n" );
	}

	//查一下 为什么没有一级
	public getOnline():string{
		let onlineMap:any = {};
		let a:number = 0;
		for( let i of this.logArr ) {
			if( i.online() ){
				if( onlineMap[i.code] == null ){
					a++;
					onlineMap[i.code] = 1;
				}
			}
		}
		console.log( "在线map:" , onlineMap );
		this.main.txt2.text += "在线code:";
		this.main.txt2.text += JSON.stringify( onlineMap );
		return "5分钟内在线人数:" + a;
	}

	public getText( obj:any ):string{
		let s:string = "";
		for( let i in obj ){
			if( i == "undefined" ){
				continue;
			}
			s += i;
			s += " ";
			if( this.logTypeMap[i + ""] == null ){
				s += "\n";	
				continue;
			}
			let arr = this.logTypeMap[i + ""];
			if( typeof arr === "string" ){
				s += this.logTypeMap[i + ""];
			}else{
				s += arr[0];
				let ss:Laya.Handler = arr[1];
				let sss = ss.run();
				s += sss;
			}
			s += " ";
			s += obj[i];
			s += "\n";	
		}
		return s;
	}
}
//激活启动类
new Main();