(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 750;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "showall";
    GameConfig.screenMode = "vertical";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "MainScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class LogData {
        constructor(str) {
            let arr = str.split("\t");
            this.time = parseInt(arr[0]);
            this.gameVer = arr[1];
            this.code = arr[2];
            this.platform = arr[3];
            this.onlyId = arr[4];
            this.actionId = arr[5];
            this.content = arr[6];
            if (arr.length >= 8) {
                this.pName = arr[7];
            }
        }
        online() {
            let a = Date.now();
            if ((a - this.time) < 5 * 60 * 1000) {
                return true;
            }
            return false;
        }
    }

    class MyData {
        constructor() {
            this.count = 0;
        }
    }

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        class MainSceneUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.loadScene("MainScene");
            }
        }
        ui.MainSceneUI = MainSceneUI;
        REG("ui.MainSceneUI", MainSceneUI);
        class txtCellUI extends Laya.View {
            constructor() { super(); }
            createChildren() {
                super.createChildren();
                this.createView(txtCellUI.uiView);
            }
        }
        txtCellUI.uiView = { "type": "View", "props": { "width": 750, "height": 34 }, "compId": 2, "child": [{ "type": "Label", "props": { "y": 0, "x": 0, "width": 100, "var": "idTxt", "text": "label", "height": 34, "fontSize": 30, "color": "#f9f4f4", "bold": true }, "compId": 3 }, { "type": "Label", "props": { "y": 0, "x": 156, "width": 432, "var": "strTxt", "text": "label", "height": 34, "fontSize": 30, "color": "#f9f4f4", "bold": true }, "compId": 4 }, { "type": "Label", "props": { "y": 0, "x": 650, "width": 100, "var": "countTxt", "text": "label", "height": 34, "fontSize": 30, "color": "#f9f4f4", "bold": true }, "compId": 5 }], "loadList": [], "loadList3D": [] };
        ui.txtCellUI = txtCellUI;
        REG("ui.txtCellUI", txtCellUI);
    })(ui || (ui = {}));

    class ListCell extends ui.txtCellUI {
        constructor() { super(); }
        update(data) {
            this.idTxt.text = data.id;
            this.strTxt.text = data.content;
            this.countTxt.text = data.count + "";
        }
    }

    class Main {
        constructor() {
            this.nameMap = {};
            this.onlyMap = {};
            this.useMap = {};
            this.main = null;
            this.logArr = [];
            this.logTypeMap = {};
            this.pNameMap = {};
            this.allMap = {};
            this.mmm = {};
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError = true;
            Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
            if (Laya.Browser.onPC == false) {
                Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
            }
            else {
                Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
            }
            Laya.stage.alignH = "center";
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
            this.nameMap["VZGU"] = "胡老总";
            this.nameMap["igoY"] = "刘跃进";
            this.nameMap["o2X0"] = "达叔";
        }
        onConfigLoaded() {
            this.onlyMap["1"] = {};
            this.onlyMap["11"] = {};
            this.useMap["20"] = {};
            Laya.Scene.open("MainScene.scene", false, null, new Laya.Handler(this, this.comFun));
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
            let ss = "100000,100101,100201,100301,100401,100501,100601,100701,100801,100901,101001,200101,200201,200301,200401,200501,200601,200701,200801,200901,201001,201101,201201,201301,201401,201501,201601,201701,201801,201901,202001,300101,300201,300301,300401,300501,300601,300701,300801,300901,301001,301002,301003,301004,301101,301201,301301,301401,301501,301601,301701,301801,301901,302001,302002,302003,302101,302201,302301,302401,302501,302601,302701,302801,302901,303001";
            let arr = ss.split(",");
            for (let i = 0; i < arr.length; i++) {
                this.logTypeMap[Number(arr[i])] = "地图" + arr[i];
            }
            this.allMap = {};
            let key;
            for (key in this.logTypeMap) {
                let myData = new MyData();
                myData.id = key;
                myData.content = this.logTypeMap[key];
                myData.count = 0;
                this.allMap[key] = myData;
            }
        }
        itemErrorFun() {
            for (let i of this.logArr) {
                if (i.actionId == "1") ;
            }
        }
        timeFun() {
            let s = 0;
            let a = 0;
            for (let i of this.logArr) {
                if (i.actionId == "0") {
                    a++;
                    s += parseInt(i.content);
                }
            }
            return "平均加载时长:" + parseInt(s / a / 1000 + "") + "秒";
        }
        comFun(e) {
            this.main = e;
            this.main.nowBtn.clickHandler = new Laya.Handler(this, this.loadNow);
            this.main.selectBtn.clickHandler = new Laya.Handler(this, this.selectFun);
            this.main.input.text = this.getNowString();
            this.main.adBtn.clickHandler = new Laya.Handler(this, this.hhhFun);
            this.list = new Laya.List();
            this.list.pos(this.main.box.x, this.main.box.y);
            this.main.box.addChild(this.list);
            this.list.itemRender = ListCell;
            this.list.repeatX = 1;
            this.list.repeatY = 25;
            this.list.vScrollBarSkin = "";
            this.list.renderHandler = new Laya.Handler(this, this.updateItem);
            this.list.array = [];
        }
        updateItem(cell, index) {
            let data = this.list.getItem(index);
            cell.update(data);
        }
        hhhFun() {
            let arr = [];
            for (let i in this.mmm) {
                let obj = {};
                obj.id = i;
                obj.value = this.mmm[i];
                arr.push(obj);
            }
            arr.sort((a, b) => {
                return b.value - a.value;
            });
            Laya.stage.removeChildren();
            let ss = "";
            for (let iia of arr) {
                ss += (iia.value + " ---- " + iia.id + " " + this.getName(iia.id) + "\n");
            }
            let t = new Laya.Text();
            t.text = ss;
            t.color = "#ffffff";
            t.fontSize = 26;
            t.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
            Laya.stage.addChild(t);
        }
        getName(s) {
            for (let i in this.nameMap) {
                if (s.substr(s.length - 4) == i) {
                    return this.nameMap[i];
                }
            }
            return this.pNameMap[s];
        }
        selectFun() {
            this.loadByDate(this.main.input.text);
        }
        loadNow() {
            this.loadByDate(this.getNowString());
        }
        getNowString() {
            var d = new Date();
            var y = d.getFullYear();
            var m = d.getMonth() + 1;
            var day = d.getDate();
            var str = this.v(y) + "-" + this.v(m) + "-" + this.v(day);
            return str;
        }
        loadByDate(str) {
            this.main.txt2.text = "";
            let url = "";
            if (this.main.cb1.selectedIndex == 0) {
                url = "https://s1.kuwan511.com";
            }
            else if (this.main.cb1.selectedIndex == 1) {
                url = "https://s1.kuwan511.com";
            }
            Laya.loader.load(url + "/DFile." + str + ".log?ver=" + Math.random(), new Laya.Handler(this, this.txtCom), null, Laya.Loader.TEXT, 1, false, "", true);
        }
        v(a) {
            return (a < 10) ? ("0" + a) : (a + "");
        }
        txtCom(text) {
            this.logArr.length = 0;
            let key;
            for (key in this.allMap) {
                let myData = this.allMap[key];
                myData.count = 0;
            }
            let arr = text.split("\n");
            for (let i of arr) {
                let log = new LogData(i);
                let myData = this.allMap[log.actionId];
                if (myData) {
                    myData.count++;
                }
            }
            this.showResult();
        }
        showResult() {
            this.main.text.text = "";
            let key;
            let arr = [];
            for (key in this.allMap) {
                let myData = this.allMap[key];
                this.main.text.text += myData.id + "\t" + myData.content + "\t" + myData.count + "\n";
                arr.push(myData);
            }
            this.list.array = arr;
        }
        addUserNum(code) {
            if (this.mmm[code] == null) {
                this.mmm[code] = 1;
            }
            else {
                this.mmm[code]++;
            }
        }
        addText(text) {
            this.main.text.text += (text + "\n");
        }
        getOnline() {
            let onlineMap = {};
            let a = 0;
            for (let i of this.logArr) {
                if (i.online()) {
                    if (onlineMap[i.code] == null) {
                        a++;
                        onlineMap[i.code] = 1;
                    }
                }
            }
            console.log("在线map:", onlineMap);
            this.main.txt2.text += "在线code:";
            this.main.txt2.text += JSON.stringify(onlineMap);
            return "5分钟内在线人数:" + a;
        }
        getText(obj) {
            let s = "";
            for (let i in obj) {
                if (i == "undefined") {
                    continue;
                }
                s += i;
                s += " ";
                if (this.logTypeMap[i + ""] == null) {
                    s += "\n";
                    continue;
                }
                let arr = this.logTypeMap[i + ""];
                if (typeof arr === "string") {
                    s += this.logTypeMap[i + ""];
                }
                else {
                    s += arr[0];
                    let ss = arr[1];
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
    new Main();

}());
