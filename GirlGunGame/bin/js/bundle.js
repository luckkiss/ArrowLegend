(function () {
    'use strict';

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "game/viewbg.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    var Sprite = Laya.Sprite;
    class LayerManager extends Sprite {
        constructor() {
            super();
            this.sceneLayer = new Sprite();
            this.panelLayer = new Sprite();
            this.faceLayer = new Sprite();
            this.alertLayer = new Sprite();
            this.guideLayer = new Sprite();
            this.addChild(this.sceneLayer);
            this.addChild(this.panelLayer);
            this.addChild(this.faceLayer);
            this.addChild(this.alertLayer);
            this.addChild(this.guideLayer);
        }
    }

    class TableManager {
        constructor() {
            this.map = {};
            this.mapList = {};
        }
        register(fileName, cla) {
            this.map[fileName] = cla;
        }
        getOneByName(fileName) {
            return this.map[fileName];
        }
        getTable(tabelId) {
            return this.mapList[tabelId];
        }
        getDataByNameAndId(tabelId, id) {
            var arr = this.getTable(tabelId);
            var len = arr.length;
            for (var i = 0; i < len; i++) {
                if (arr[i].id == id) {
                    return arr[i];
                }
            }
        }
        onParse(arr) {
            for (var i = 0; i < arr.length; i += 2) {
                var keyname = arr[i];
                var Cla = this.getOneByName(keyname);
                console.log(keyname);
                if (Cla == null) {
                    console.error("没有注册表-------" + keyname);
                    continue;
                }
                var contente = arr[i + 1];
                var strary = contente.split("\n");
                var tmp = strary[strary.length - 1];
                if (tmp === "") {
                    strary.pop();
                }
                var head = String(strary[0]).replace("\r", "");
                var headary = head.split("\t");
                var contentary = strary.slice(1);
                var dataList = [];
                for (var k = 0; k < contentary.length; k++) {
                    var propstr = String(contentary[k]).replace("\r", "");
                    var propary = propstr.split("\t");
                    var clazz = new Cla();
                    for (var j = 0, len2 = propary.length; j < len2; j++) {
                        var now = clazz[headary[j]];
                        var value = propary[j];
                        if (typeof now === 'number') {
                            now = parseInt(value + "");
                            if ((now + "") != value) {
                                now = parseFloat(value + "");
                            }
                        }
                        else {
                            now = value;
                        }
                        clazz[headary[j]] = now;
                    }
                    dataList.push(clazz);
                }
                this.mapList[keyname] = dataList;
            }
        }
    }

    class SoundManager {
        constructor() {
            this.pre = "";
        }
        setMusicVolume(value) {
            App.gameSoundManager.setBgmMuted(value == 0);
        }
        setSoundVolume(value) {
            App.gameSoundManager.setEffMuted(value == 0);
        }
        play(soundName, isMusic = false) {
            this.soundName = soundName;
            this.isMusic = isMusic;
            var url = this.pre + soundName;
            if (isMusic) {
                App.gameSoundManager.playBgm(url);
            }
            else {
                App.gameSoundManager.playEffect(url);
            }
            return;
            if (Laya.loader.getRes(url)) {
                this.onLoadCom(url, isMusic);
            }
            else {
                Laya.loader.load(url, new Laya.Handler(this, this.onLoadCom, [url, isMusic]));
            }
        }
        onLoadCom(url, isMusic) {
            if (isMusic) {
                Laya.SoundManager.playMusic(url, 0);
            }
            else {
                Laya.SoundManager.playSound(url, 1);
            }
        }
    }

    class GameEvent {
    }
    GameEvent.INIT_COM = "INIT_COMPLETE";
    GameEvent.START_BATTLE = "START_BATTLE";
    GameEvent.MEMORY_WARNING = "MEMORY_WARNING";
    GameEvent.CONFIG_OVER = "CONFIG_OVER";
    GameEvent.GOLD_CHANGE = "GOLD_CHANGE";
    GameEvent.HERO_UPDATE = "HERO_UPDATE";
    GameEvent.WX_ON_SHOW = "WX_ON_SHOW";
    GameEvent.WX_ON_HIDE = "WX_ON_HIDE";
    GameEvent.SHOW_ACTION_RECT = "SHOW_ACTION_RECT";
    GameEvent.BOOS_BLOOD_UPDATE = "BOOS_BLOOD_UPDATE";
    GameEvent.PLAYER_INFO_UPDATE = "PLAYER_INFO_UPDATE";
    GameEvent.TALENT_UPDATE = "TALENT_UPDATE";
    GameEvent.PASS_CHAPTER = "PASS_CHAPTER";
    GameEvent.LV_UP_VIEW = "LV_UP_VIEW";
    GameEvent.LV_UP_VIEW_2 = "LV_UP_VIEW_2";
    GameEvent.ADD_COIN = "ADD_COIN";
    GameEvent.APP_ENERGY = "APP_ENERGY";
    GameEvent.SHOW_MAIN = "SHOW_MAIN";
    GameEvent.RED_UPDATE = "RED_UPDATE";
    GameEvent.NEW_DAY = "NEW_DAY";
    GameEvent.AD_OVER = "AD_OVER";
    GameEvent.AD_UPDATE_POWER = "AD_UPDATE_POWER";

    class LogType {
    }
    LogType.HEART = 100;
    LogType.LOGIN_TIME = 0;
    LogType.ERROR_ITEM_NULL = 1;
    LogType.LOGIN_INFO = 2;
    LogType.LOGIN_STATUS = 3;
    LogType.WX_HIDE = 4;
    LogType.WX_SHOW = 5;
    LogType.LOAD_ERROR = 6;
    LogType.HANGUP_START = 7;
    LogType.HANGUP_OVER = 8;
    LogType.PLAYER_DATA = 9;
    LogType.NEW_PLAYER = 10;
    LogType.CODE_ERROR = 11;
    LogType.LOAD_CONFIG = 13;
    LogType.LOAD_VERSION = 14;
    LogType.LOAD_fileconfig = 15;
    LogType.LOAD_CONFIGZIP = 16;
    LogType.LOAD_CONFIG_ERR = 17;
    LogType.AD_FAIL = 18;
    LogType.AD_SUC = 19;
    LogType.AD_SUC_OVER = 20;
    LogType.AD_FAIL_2 = 21;
    LogType.OPEN_TASK = 22;
    LogType.OPEN_TIANFU = 23;
    LogType.CLOSE_ZHUAN_PAN = 24;
    LogType.OPEN_ZHUAN = 25;
    LogType.AD_ZHUAN = 26;
    LogType.NEWER_FIRST_CLICK = 1000;
    LogType.NEWER_OPEN_ROLE = 1001;
    LogType.NEWER_EQUIP = 1002;
    LogType.NEWER_YUELAIYUEQIANGDA = 1005;
    LogType.NEWER_HALF = 1006;
    LogType.NEWER_XINGLAI = 1007;
    LogType.NEWER_CLICK_CITY = 1008;
    LogType.NEWER_CLICK_STAGE = 1009;
    LogType.MAP_INDEX = 1010;
    LogType.CHAPTER_INDEX = 1011;
    LogType.REBORTH_TIMES = 1012;
    LogType.BATTLE_GUIDE = 1013;
    LogType.SHOW_LOGIN_BTN = 1014;
    LogType.START_LOADING = 1015;
    LogType.START_LOADING_GUIDE = 1016;
    LogType.SHOW_MAIN = 1017;

    class FlyUpTips extends Laya.Sprite {
        constructor() {
            super();
            this._bg = new Laya.Image("main/diban.png");
            this._bg.sizeGrid = "17,16,22,15";
            this.addChild(this._bg);
            this._bg.anchorX = this._bg.anchorY = 0.5;
            this._txt = new Laya.Label();
            this._txt.bold = true;
            this._txt.color = "#ffffff";
            this._txt.fontSize = 20;
            this._txt.align = "CENTER";
            this.addChild(this._txt);
            this._txt.anchorX = this._txt.anchorY = 0.5;
        }
        setTips(str, delay, color = "#ffffff", isFly) {
            if (str == null || str == "") {
                return;
            }
            Laya.Tween.clearTween(this);
            this._txt.text = str;
            this._txt.color = color;
            this._bg.size(this._txt.textField.textWidth + 200, this._txt.textField.textHeight + 40);
            this.pos(Laya.stage.width * 0.5, Laya.stage.height * 0.5);
            Laya.stage.addChild(this);
            this.alpha = 1;
            if (isFly) {
                Laya.Tween.to(this, { y: Laya.stage.height * 0.5 - 200 }, delay, null, Laya.Handler.create(this, this.onCom));
            }
            else {
                Laya.Tween.to(this, { alpha: 0 }, delay, null, Laya.Handler.create(this, this.onCom), 500);
            }
        }
        onCom() {
            this.removeSelf();
            this._txt.text = "";
        }
        static setTips(str, delay = 1200, color = "#ffffff", isFly = true) {
            if (this._fly == null) {
                this._fly = new FlyUpTips();
            }
            this._fly.setTips(str, delay, color, isFly);
        }
    }

    var AD_TYPE;
    (function (AD_TYPE) {
        AD_TYPE[AD_TYPE["AD_DIAMOND"] = 0] = "AD_DIAMOND";
        AD_TYPE[AD_TYPE["AD_REBORTH"] = 1] = "AD_REBORTH";
        AD_TYPE[AD_TYPE["AD_BATTLE10"] = 2] = "AD_BATTLE10";
        AD_TYPE[AD_TYPE["AD_CHANGE_SKILL"] = 3] = "AD_CHANGE_SKILL";
        AD_TYPE[AD_TYPE["AD_POWER"] = 4] = "AD_POWER";
    })(AD_TYPE || (AD_TYPE = {}));

    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var game;
        (function (game) {
            class addBloodEffUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(addBloodEffUI.uiView);
                }
            }
            addBloodEffUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Animation", "props": { "y": 0, "var": "ani", "source": "game/jiaxue.ani" }, "compId": 3 }], "loadList": ["game/jiaxue.ani"], "loadList3D": [] };
            game.addBloodEffUI = addBloodEffUI;
            REG("ui.game.addBloodEffUI", addBloodEffUI);
            class battleIndexBoxUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battleIndexBoxUI.uiView);
                }
            }
            battleIndexBoxUI.uiView = { "type": "View", "props": { "width": 370, "height": 105 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 50, "x": 83, "var": "pbox1" }, "compId": 13, "child": [{ "type": "Sprite", "props": { "texture": "bg/guandian.png" }, "compId": 7 }, { "type": "Sprite", "props": { "x": 17, "texture": "bg/guandian.png" }, "compId": 8 }, { "type": "Sprite", "props": { "x": 34, "texture": "bg/guandian.png" }, "compId": 9 }] }, { "type": "Box", "props": { "y": 50, "x": 238, "var": "pbox2" }, "compId": 14, "child": [{ "type": "Sprite", "props": { "texture": "bg/guandian.png" }, "compId": 10 }, { "type": "Sprite", "props": { "x": 17, "texture": "bg/guandian.png" }, "compId": 11 }, { "type": "Sprite", "props": { "x": 34, "texture": "bg/guandian.png" }, "compId": 12 }] }, { "type": "Box", "props": { "width": 370, "var": "box", "height": 105 }, "compId": 18 }], "loadList": ["bg/guandian.png"], "loadList3D": [] };
            game.battleIndexBoxUI = battleIndexBoxUI;
            REG("ui.game.battleIndexBoxUI", battleIndexBoxUI);
            class boomRectUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(boomRectUI.uiView);
                }
            }
            boomRectUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "var": "img", "skin": "bg/boomEff.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "loadList": ["bg/boomEff.png"], "loadList3D": [] };
            game.boomRectUI = boomRectUI;
            REG("ui.game.boomRectUI", boomRectUI);
            class heheUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(heheUI.uiView);
                }
            }
            heheUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 11, "x": 8, "width": 1088, "skin": "battleBg/1.png", "sizeGrid": "680,0,594,0", "height": 1552 }, "compId": 3 }], "loadList": ["battleBg/1.png"], "loadList3D": [] };
            game.heheUI = heheUI;
            REG("ui.game.heheUI", heheUI);
            class homePageUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(homePageUI.uiView);
                }
            }
            homePageUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "texture": "loading/jiazai.jpg" }, "compId": 5 }, { "type": "Image", "props": { "x": 245, "var": "startBtn", "stateNum": 1, "skin": "loading/btn_kaishi.png", "scaleY": 0.6, "scaleX": 0.6, "bottom": 139 }, "compId": 6 }, { "type": "Image", "props": { "y": 285, "x": 134, "skin": "loading/logo.png" }, "compId": 8 }, { "type": "Box", "props": { "width": 750, "var": "loadingBox", "height": 118, "bottom": 20 }, "compId": 9, "child": [{ "type": "Box", "props": { "y": 0 }, "compId": 16, "child": [{ "type": "Sprite", "props": { "width": 750, "texture": "loading/jianduxia.png", "height": 26 }, "compId": 11 }, { "type": "Image", "props": { "width": 750, "var": "barImg", "skin": "loading/jiandushang.png", "height": 26 }, "compId": 12 }] }, { "type": "Sprite", "props": { "y": 45, "x": 264, "texture": "loading/shouci.png" }, "compId": 10 }, { "type": "Sprite", "props": { "y": -2.5, "x": 0, "var": "sliderImg", "texture": "loading/dan.png" }, "compId": 13 }, { "type": "Label", "props": { "y": 83, "x": 325, "width": 100, "var": "txt", "text": "100%", "height": 34, "fontSize": 30, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 14 }] }, { "type": "TextInput", "props": { "y": 697, "x": 236, "width": 278, "var": "idTxt", "prompt": "输入用户名", "mouseEnabled": true, "height": 83, "fontSize": 40, "bgColor": "#ffffff" }, "compId": 18 }], "loadList": ["loading/jiazai.jpg", "loading/btn_kaishi.png", "loading/logo.png", "loading/jianduxia.png", "loading/jiandushang.png", "loading/shouci.png", "loading/dan.png"], "loadList3D": [] };
            game.homePageUI = homePageUI;
            REG("ui.game.homePageUI", homePageUI);
            class mainSceneUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(mainSceneUI.uiView);
                }
            }
            mainSceneUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 186, "x": 0, "width": 750, "var": "mainBox", "height": 1027 }, "compId": 3 }, { "type": "Box", "props": { "width": 750, "var": "topBox", "top": 80, "height": 106 }, "compId": 4 }, { "type": "Box", "props": { "width": 750, "var": "bottomBox", "height": 122, "bottom": 0 }, "compId": 5 }], "loadList": [], "loadList3D": [] };
            game.mainSceneUI = mainSceneUI;
            REG("ui.game.mainSceneUI", mainSceneUI);
            class newGuideUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(newGuideUI.uiView);
                }
            }
            newGuideUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "x": 0, "var": "img", "skin": "guide/fangbian.png", "bottom": 0 }, "compId": 3 }], "loadList": ["guide/fangbian.png"], "loadList3D": [] };
            game.newGuideUI = newGuideUI;
            REG("ui.game.newGuideUI", newGuideUI);
            class newGuide2UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(newGuide2UI.uiView);
                }
            }
            newGuide2UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.75 }, "compId": 6 }, { "type": "Image", "props": { "x": 580, "skin": "guide/nvren.png", "bottom": 0 }, "compId": 3 }, { "type": "Image", "props": { "y": 903, "x": 66, "width": 479, "skin": "guide/qipao.png", "sizeGrid": "83,148,116,72", "height": 205 }, "compId": 4 }, { "type": "Label", "props": { "y": 934, "x": 90, "wordWrap": true, "width": 429, "var": "txt", "text": "滑动摇杆，控制角色到达指定位置。", "height": 101, "fontSize": 40, "color": "#ffffff", "bold": true, "align": "left" }, "compId": 5 }], "loadList": ["guide/nvren.png", "guide/qipao.png"], "loadList3D": [] };
            game.newGuide2UI = newGuide2UI;
            REG("ui.game.newGuide2UI", newGuide2UI);
            class newGuide3UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(newGuide3UI.uiView);
                }
            }
            newGuide3UI.uiView = { "type": "View", "props": { "y": 70, "x": 42, "width": 142, "height": 350, "anchorY": 0.2, "anchorX": 0.3 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 142, "height": 350 }, "compId": 7, "child": [{ "type": "Image", "props": { "skin": "guide/huangdian.png" }, "compId": 3 }, { "type": "Image", "props": { "y": 161, "x": 31, "var": "img2", "skin": "guide/huangjian.png" }, "compId": 4 }, { "type": "Image", "props": { "y": 235, "x": 31, "var": "img1", "skin": "guide/huangjian.png" }, "compId": 5 }, { "type": "Image", "props": { "y": 309, "x": 31, "var": "img0", "skin": "guide/huangjian.png" }, "compId": 6 }] }], "loadList": ["guide/huangdian.png", "guide/huangjian.png"], "loadList3D": [] };
            game.newGuide3UI = newGuide3UI;
            REG("ui.game.newGuide3UI", newGuide3UI);
            class viewbgUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(viewbgUI.uiView);
                }
            }
            viewbgUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "bg", "skin": "loading/zhudi.jpg" }, "compId": 7 }], "loadList": ["loading/zhudi.jpg"], "loadList3D": [] };
            game.viewbgUI = viewbgUI;
            REG("ui.game.viewbgUI", viewbgUI);
        })(game = ui.game || (ui.game = {}));
    })(ui || (ui = {}));
    (function (ui) {
        var test;
        (function (test) {
            class alertUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(alertUI.uiView);
                }
            }
            alertUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.5 }, "compId": 12 }, { "type": "Box", "props": { "y": 10, "width": 600, "height": 400, "centerY": 0, "centerX": 0 }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 600, "skin": "main/fuhuodi2.jpg", "sizeGrid": "193,104,147,117", "height": 400 }, "compId": 4 }, { "type": "Label", "props": { "y": 127, "x": 15, "width": 570, "var": "txt", "text": "本局将不会产生任何收益。", "height": 40, "fontSize": 36, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 6 }, { "type": "Button", "props": { "y": 271, "x": 55, "width": 200, "var": "cancelBtn", "stateNum": 1, "skin": "main/btn_hong.png", "sizeGrid": "27,29,43,25", "height": 100 }, "compId": 8, "child": [{ "type": "Sprite", "props": { "y": 29, "x": 69, "texture": "main/quxiao.png" }, "compId": 9 }] }, { "type": "Button", "props": { "y": 271, "x": 335, "width": 200, "var": "sureBtn", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "18,31,46,34", "height": 100 }, "compId": 10, "child": [{ "type": "Sprite", "props": { "y": 27, "x": 69, "texture": "main/queding.png" }, "compId": 11 }] }, { "type": "Label", "props": { "y": 180, "x": 15, "width": 570, "var": "txt2", "text": "本局将不会产生任何收益。", "height": 40, "fontSize": 36, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 14 }, { "type": "Sprite", "props": { "y": 19, "x": 245, "texture": "main/biaotitishi.png" }, "compId": 15 }] }], "loadList": ["main/fuhuodi2.jpg", "main/btn_hong.png", "main/quxiao.png", "main/btn_lv.png", "main/queding.png", "main/biaotitishi.png"], "loadList3D": [] };
            test.alertUI = alertUI;
            REG("ui.test.alertUI", alertUI);
            class BaseTipDialogUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(BaseTipDialogUI.uiView);
                }
            }
            BaseTipDialogUI.uiView = { "type": "View", "props": { "width": 600, "height": 400 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 600, "skin": "main/fuhuodi2.jpg", "sizeGrid": "128,62,71,54", "height": 400 }, "compId": 3 }, { "type": "Button", "props": { "y": 21, "x": 531, "var": "cBtn", "stateNum": 1, "skin": "main/btn_guanbi.png", "name": "close" }, "compId": 4 }], "loadList": ["main/fuhuodi2.jpg", "main/btn_guanbi.png"], "loadList3D": [] };
            test.BaseTipDialogUI = BaseTipDialogUI;
            REG("ui.test.BaseTipDialogUI", BaseTipDialogUI);
            class battleUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battleUI.uiView);
                }
            }
            battleUI.uiView = { "type": "Dialog", "props": { "width": 750, "height": 418 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 290, "x": 671, "width": 60, "var": "lvBox", "height": 138 }, "compId": 11, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "bg/jinengtiaoxia.png", "sizeGrid": "0,22,0,22", "alpha": 0.8 }, "compId": 3 }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "lvBar" }, "compId": 12, "child": [{ "type": "Image", "props": { "var": "jingyantiao", "skin": "bg/jinengtiaoshang.png", "sizeGrid": "-11,34,-17,24" }, "compId": 4 }] }] }, { "type": "Button", "props": { "y": 141, "x": 698, "var": "zanting", "stateNum": 1, "skin": "bg/btn_zhanting.png", "pivotY": 34, "pivotX": 43 }, "compId": 6 }, { "type": "Sprite", "props": { "y": 28, "x": 39, "texture": "bg/qianshu.png", "scaleX": 1, "alpha": 0.8 }, "compId": 7 }, { "type": "FontClip", "props": { "y": 45, "x": 83, "width": 36, "var": "jinbishu", "value": "123", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 121, "align": "left" }, "compId": 8 }, { "type": "Image", "props": { "y": 26, "x": 8, "skin": "bg/dongjin.png", "scaleY": 1, "scaleX": 1 }, "compId": 13 }, { "type": "Box", "props": { "x": 190, "width": 370, "var": "indexBox", "height": 105 }, "compId": 28 }, { "type": "Sprite", "props": { "y": 18.5, "x": 339, "var": "boss", "texture": "bg/BOSS.png" }, "compId": 27 }, { "type": "Box", "props": { "y": 112.5, "x": 190, "var": "bossxuetiao" }, "compId": 35, "child": [{ "type": "Image", "props": { "y": 38, "x": 41, "width": 331, "skin": "bg/bosstiaoxia.png", "sizeGrid": "0,21,0,22", "height": 42 }, "compId": 33 }, { "type": "Image", "props": { "y": 37, "x": 44, "var": "bossxue", "skin": "bg/bosstiaoshang.png" }, "compId": 32 }, { "type": "Sprite", "props": { "texture": "bg/bosstouxiang.png" }, "compId": 34 }] }], "loadList": ["bg/jinengtiaoxia.png", "bg/jinengtiaoshang.png", "bg/btn_zhanting.png", "bg/qianshu.png", "main/clipshuzi.png", "bg/dongjin.png", "bg/BOSS.png", "bg/bosstiaoxia.png", "bg/bosstiaoshang.png", "bg/bosstouxiang.png"], "loadList3D": [] };
            test.battleUI = battleUI;
            REG("ui.test.battleUI", battleUI);
            class battleLvUIUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battleLvUIUI.uiView);
                }
            }
            battleLvUIUI.uiView = { "type": "View", "props": { "y": 34, "x": 34, "width": 69, "height": 69, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 2, "child": [{ "type": "Button", "props": { "y": 34, "x": 34, "width": 69, "var": "box", "height": 69, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5, "child": [{ "type": "Button", "props": { "y": 0, "x": 0, "var": "btn", "stateNum": 1, "skin": "bg/xiaoguan.png" }, "compId": 3, "child": [{ "type": "Label", "props": { "y": 23, "x": 13, "wordWrap": true, "width": 42, "var": "shuziyou", "text": "98", "height": 32, "fontSize": 24, "color": "#f3e9e9", "align": "center" }, "compId": 4 }] }] }], "loadList": ["bg/xiaoguan.png"], "loadList3D": [] };
            test.battleLvUIUI = battleLvUIUI;
            REG("ui.test.battleLvUIUI", battleLvUIUI);
            class battlestopUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battlestopUI.uiView);
                }
            }
            battlestopUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "x": 0, "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.7 }, "compId": 23 }, { "type": "Box", "props": { "width": 681, "var": "box", "height": 900, "centerY": 0, "centerX": 0 }, "compId": 22, "child": [{ "type": "Image", "props": { "width": 681, "skin": "main/biaotilan.png", "sizeGrid": "0,23,0,125", "height": 99 }, "compId": 4 }, { "type": "Box", "props": { "y": 254, "x": 164, "width": 287, "var": "box1", "height": 446, "anchorX": 0.5 }, "compId": 25 }, { "type": "Box", "props": { "y": 254, "x": 496, "width": 287, "var": "box2", "height": 446, "anchorX": 0.5 }, "compId": 26 }, { "type": "Sprite", "props": { "y": 28.5, "x": 142, "texture": "main/qing.png" }, "compId": 27 }, { "type": "guanggao", "props": { "y": 744, "x": 149, "var": "queding", "runtime": "ui.test.guanggaoUI" }, "compId": 36 }] }], "loadList": ["main/biaotilan.png", "main/qing.png"], "loadList3D": [] };
            test.battlestopUI = battlestopUI;
            REG("ui.test.battlestopUI", battlestopUI);
            class battlestop2UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(battlestop2UI.uiView);
                }
            }
            battlestop2UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "alpha": 0.6 }, "compId": 24, "child": [{ "type": "Rect", "props": { "width": 750, "lineWidth": 1, "height": 1700, "fillColor": "#000000" }, "compId": 25 }] }, { "type": "Box", "props": { "x": 0, "width": 750, "height": 1256, "centerY": 0 }, "compId": 23, "child": [{ "type": "Label", "props": { "y": 57, "x": 304.5, "var": "baioti", "text": "暂停", "fontSize": 70, "color": "#ffffff", "align": "center" }, "compId": 5 }, { "type": "Button", "props": { "y": 927, "x": 530, "width": 296, "var": "btnPlay", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 17, "child": [{ "type": "Sprite", "props": { "y": 37, "x": 89, "texture": "bg/sanjiao.png" }, "compId": 18 }] }, { "type": "Button", "props": { "y": 720, "x": 195, "width": 296, "var": "btnMusic", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 19, "child": [{ "type": "Image", "props": { "y": 39, "x": 173, "var": "musicImg", "skin": "bg/zhanting_0.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 20 }, { "type": "Sprite", "props": { "y": 43, "x": 69, "texture": "bg/yinyue.png" }, "compId": 28 }] }, { "type": "Button", "props": { "y": 927, "x": 195, "width": 296, "var": "btnHome", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 21, "child": [{ "type": "Sprite", "props": { "y": 32, "x": 86.5, "texture": "bg/huijia.png" }, "compId": 22 }] }, { "type": "Button", "props": { "y": 720, "x": 541, "width": 296, "var": "btnSound", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 26, "child": [{ "type": "Sprite", "props": { "y": 43, "x": 76, "texture": "bg/yinxiao.png" }, "compId": 29 }, { "type": "Image", "props": { "y": 39, "x": 177, "var": "soundImg", "skin": "bg/zhanting_0.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 27 }] }] }], "loadList": ["main/btn_lv.png", "bg/sanjiao.png", "main/btn_huang.png", "bg/zhanting_0.png", "bg/yinyue.png", "bg/huijia.png", "bg/yinxiao.png"], "loadList3D": [] };
            test.battlestop2UI = battlestop2UI;
            REG("ui.test.battlestop2UI", battlestop2UI);
            class Blood2UIUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(Blood2UIUI.uiView);
                }
            }
            Blood2UIUI.uiView = { "type": "View", "props": { "width": 85, "height": 17, "centerX": 0 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "texture": "bg/xuetiaodi.png" }, "compId": 3 }, { "type": "Sprite", "props": { "var": "bar", "texture": "bg/xuetiaoshanghong.png" }, "compId": 4 }, { "type": "Label", "props": { "y": -1, "x": 0, "width": 85, "var": "txt", "text": "600", "stroke": 3, "height": 18, "fontSize": 18, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 6 }], "loadList": ["bg/xuetiaodi.png", "bg/xuetiaoshanghong.png"], "loadList3D": [] };
            test.Blood2UIUI = Blood2UIUI;
            REG("ui.test.Blood2UIUI", Blood2UIUI);
            class BloodUIUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(BloodUIUI.uiView);
                }
            }
            BloodUIUI.uiView = { "type": "View", "props": { "width": 85, "height": 24, "centerX": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 7, "x": 0, "skin": "bg/heroBlood.png" }, "compId": 8 }, { "type": "Image", "props": { "y": 7, "width": 85, "var": "bar", "skin": "bg/xuetiaoshang.png", "height": 17 }, "compId": 10 }, { "type": "Box", "props": { "y": 7, "width": 85, "var": "colBox", "height": 17 }, "compId": 7 }, { "type": "Label", "props": { "y": 2, "x": 0, "width": 85, "var": "txt", "text": "600", "stroke": 3, "height": 18, "fontSize": 18, "color": "#ffffff", "bold": true, "align": "center" }, "compId": 6 }], "loadList": ["bg/heroBlood.png", "bg/xuetiaoshang.png"], "loadList3D": [] };
            test.BloodUIUI = BloodUIUI;
            REG("ui.test.BloodUIUI", BloodUIUI);
            class BottomBoxUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(BottomBoxUI.uiView);
                }
            }
            BottomBoxUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 451, "x": 0, "width": 750, "texture": "main/jianhei.png", "height": 93 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 544, "x": 0, "texture": "main/dazhao.png" }, "compId": 5 }, { "type": "Button", "props": { "y": 530, "x": 18, "stateNum": 2, "skin": "main/btn_0.png" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 545, "x": 242, "texture": "main/xiaobiao.png" }, "compId": 6 }, { "type": "Button", "props": { "y": 537, "x": 243, "stateNum": 2, "skin": "main/btn_1.png" }, "compId": 8 }], "loadList": ["main/jianhei.png", "main/dazhao.png", "main/btn_0.png", "main/xiaobiao.png", "main/btn_1.png"], "loadList3D": [] };
            test.BottomBoxUI = BottomBoxUI;
            REG("ui.test.BottomBoxUI", BottomBoxUI);
            class BulletShadowUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(BulletShadowUI.uiView);
                }
            }
            BulletShadowUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": -19, "x": -19, "var": "img", "texture": "bg/douying.png" }, "compId": 3 }], "loadList": ["bg/douying.png"], "loadList3D": [] };
            test.BulletShadowUI = BulletShadowUI;
            REG("ui.test.BulletShadowUI", BulletShadowUI);
            class chengerUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(chengerUI.uiView);
                }
            }
            chengerUI.uiView = { "type": "View", "props": { "width": 160, "height": 160 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 80, "x": 80, "skin": "main/erbei.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 20 }, { "value": 1.25, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 35 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 39 }, { "value": 1.15, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 43 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 46 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 48 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 51 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 20 }, { "value": 1.25, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 35 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 39 }, { "value": 1.15, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 43 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 46 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 48 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 51 }] } }], "name": "ani1", "id": 1, "frameRate": 60, "action": 2 }], "loadList": ["main/erbei.png"], "loadList3D": [] };
            test.chengerUI = chengerUI;
            REG("ui.test.chengerUI", chengerUI);
            class chengjiuUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(chengjiuUI.uiView);
                }
            }
            chengjiuUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "y": 0, "x": 0, "runtime": "ui.game.viewbgUI" }, "compId": 29 }, { "type": "Box", "props": { "y": 111, "x": 37, "width": 675, "var": "listBox", "height": 1100 }, "compId": 25 }], "loadList": [], "loadList3D": [] };
            test.chengjiuUI = chengjiuUI;
            REG("ui.test.chengjiuUI", chengjiuUI);
            class chengjiu_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(chengjiu_1UI.uiView);
                }
            }
            chengjiu_1UI.uiView = { "type": "View", "props": { "width": 675, "height": 262 }, "compId": 1, "child": [{ "type": "Image", "props": { "y": 2, "x": 0, "width": 675, "skin": "chengjiu/chengjiupai.png", "sizeGrid": "0,58,0,88", "height": 260 }, "compId": 2 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "chengjiu/chengjiupai2.png" }, "compId": 4 }, { "type": "Label", "props": { "y": 59, "x": 86, "width": 295, "var": "chengjiuming", "text": "玩家名字七个字", "strokeColor": "#bc871f", "stroke": 3, "height": 33, "fontSize": 30, "color": "#f3e9e9", "align": "left" }, "compId": 5 }, { "type": "Label", "props": { "y": 56, "x": 490, "width": 137, "text": "等级：11", "strokeColor": "#bc871f", "stroke": 3, "height": 33, "fontSize": 30, "color": "#f3e9e9", "align": "right" }, "compId": 6 }, { "type": "Label", "props": { "y": 113, "x": 83, "width": 339, "var": "xiangjie", "text": "玩家名字七个字", "strokeColor": "#bc871f", "height": 56, "fontSize": 24, "color": "#af6538", "align": "left" }, "compId": 7 }, { "type": "Button", "props": { "y": 168, "x": 549, "width": 182, "var": "lingqu", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "41,31,38,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8, "child": [{ "type": "Image", "props": { "y": 24, "x": 64, "skin": "chengjiu/lingquzi.png" }, "compId": 11 }] }, { "type": "Image", "props": { "y": 174, "x": 84, "width": 342, "skin": "main/shukuang.png", "sizeGrid": "0,52,0,49", "height": 41 }, "compId": 12 }, { "type": "Image", "props": { "y": 176, "x": 86, "width": 337, "var": "jindu", "skin": "main/jindutiao.png", "sizeGrid": "0,46,0,55", "height": 37 }, "compId": 13 }, { "type": "Image", "props": { "y": 7, "x": 13, "skin": "chengjiu/xiao.png" }, "compId": 14 }], "loadList": ["chengjiu/chengjiupai.png", "chengjiu/chengjiupai2.png", "main/btn_lv.png", "chengjiu/lingquzi.png", "main/shukuang.png", "main/jindutiao.png", "chengjiu/xiao.png"], "loadList3D": [] };
            test.chengjiu_1UI = chengjiu_1UI;
            REG("ui.test.chengjiu_1UI", chengjiu_1UI);
            class chengsanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(chengsanUI.uiView);
                }
            }
            chengsanUI.uiView = { "type": "View", "props": { "width": 160, "height": 160 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 80, "x": 80, "skin": "main/sanbei.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 20 }, { "value": 1.25, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 35 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 39 }, { "value": 1.15, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 43 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 46 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 48 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 51 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 20 }, { "value": 1.25, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 35 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 39 }, { "value": 1.15, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 43 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 46 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 48 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 51 }] } }], "name": "ani1", "id": 1, "frameRate": 60, "action": 0 }], "loadList": ["main/sanbei.png"], "loadList3D": [] };
            test.chengsanUI = chengsanUI;
            REG("ui.test.chengsanUI", chengsanUI);
            class dianjuUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(dianjuUI.uiView);
                }
            }
            dianjuUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "heng", "scaleX": 1, "anchorY": 0.35, "anchorX": 0.65 }, "compId": 6, "child": [{ "type": "Clip", "props": { "x": 0.5, "var": "huoxing", "skin": "bg/clip_huoxing.png", "clipY": 2, "clipX": 3, "autoPlay": true }, "compId": 3 }, { "type": "Image", "props": { "y": 32, "x": 110.5, "var": "dianju", "skin": "bg/dianju.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 31, "x": 88.5, "var": "jia", "skin": "bg/dianjujia.png" }, "compId": 5 }] }, { "type": "Box", "props": { "y": 0, "x": 0, "var": "zong", "anchorY": 0.65, "anchorX": 0.3 }, "compId": 9, "child": [{ "type": "Clip", "props": { "y": 101, "x": 30.381484041268237, "var": "shudianju", "skin": "bg/clip_dianjushu.png", "clipY": 3, "clipX": 3, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Clip", "props": { "x": 42.38148404126824, "width": 58, "var": "shuhuoxing", "skin": "bg/clip_huoxing.png", "rotation": 62, "height": 48, "clipY": 2, "clipX": 3, "autoPlay": true }, "compId": 8 }] }], "loadList": ["bg/clip_huoxing.png", "bg/dianju.png", "bg/dianjujia.png", "bg/clip_dianjushu.png"], "loadList3D": [] };
            test.dianjuUI = dianjuUI;
            REG("ui.test.dianjuUI", dianjuUI);
            class GameOverUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(GameOverUI.uiView);
                }
            }
            GameOverUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.6 }, "compId": 4 }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "height": 1334 }, "compId": 8, "child": [{ "type": "Box", "props": { "y": 366, "x": 379, "var": "bigBox" }, "compId": 87, "child": [{ "type": "Box", "props": { "y": 5, "width": 742, "var": "lightView", "height": 742, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 20, "child": [{ "type": "Image", "props": { "skin": "shengli/guangzhuan1.png" }, "compId": 21 }, { "type": "Image", "props": { "y": 0, "x": 741, "skin": "shengli/guangzhuan1.png", "scaleX": -1 }, "compId": 25 }, { "type": "Image", "props": { "y": 740, "x": 0, "skin": "shengli/guangzhuan1.png", "scaleY": -1 }, "compId": 24 }, { "type": "Image", "props": { "y": 741, "x": 742, "skin": "shengli/guangzhuan1.png", "scaleY": -1, "scaleX": -1 }, "compId": 23 }] }, { "type": "Box", "props": { "width": 532, "var": "topBox", "height": 494, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 42, "child": [{ "type": "Image", "props": { "y": 152, "x": 167, "skin": "shengli/qi.png" }, "compId": 14 }, { "type": "Image", "props": { "x": 321, "skin": "shengli/haojiao.png" }, "compId": 15 }, { "type": "Image", "props": { "x": 194, "skin": "shengli/haojiao.png", "scaleX": -1 }, "compId": 16 }, { "type": "Image", "props": { "y": 157, "skin": "shengli/shenglibu.png" }, "compId": 17 }, { "type": "Image", "props": { "y": 102, "x": 183, "skin": "shengli/dunpai.png" }, "compId": 18 }, { "type": "FontClip", "props": { "y": 161.5, "x": 206, "width": 159, "var": "cengshu", "value": "12", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.7, "scaleX": 0.7, "height": 133, "align": "center" }, "compId": 30 }] }, { "type": "Box", "props": { "y": 176, "x": 10, "var": "expBox", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 43, "child": [{ "type": "Image", "props": { "x": 12.5, "width": 430, "skin": "bg/qianshu.png", "sizeGrid": "0,56,0,50", "height": 67 }, "compId": 32 }, { "type": "Box", "props": { "y": 3, "x": -0.5, "width": 439, "var": "expBar", "height": 67 }, "compId": 41, "child": [{ "type": "Image", "props": { "width": 439, "var": "dengjitiao", "skin": "bg/jingyantiaoshang.png", "sizeGrid": "0,24,0,29", "height": 59 }, "compId": 33 }, { "type": "Image", "props": { "width": 437, "skin": "bg/jingyantiaoguang.png", "sizeGrid": "0,38,0,44", "height": 67 }, "compId": 40 }] }, { "type": "Image", "props": { "y": -12, "x": -28, "width": 64, "skin": "shengli/dunpai.png", "height": 90 }, "compId": 31 }, { "type": "FontClip", "props": { "y": 11, "x": -19, "width": 182, "var": "dengji", "value": "12", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 121, "align": "center" }, "compId": 39 }] }] }, { "type": "Box", "props": { "y": 665, "x": 371, "var": "lingqu", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 44, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 441, "skin": "main/biaotihuang.png", "sizeGrid": "0,38,0,36", "height": 99 }, "compId": 45 }, { "type": "Sprite", "props": { "y": 24, "x": 168, "texture": "main/jainglizi.png" }, "compId": 46 }] }] }, { "type": "Box", "props": { "y": 800, "x": 375, "width": 256, "var": "lanBox", "height": 78, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 74, "child": [{ "type": "Sprite", "props": { "y": 3, "x": 0, "texture": "juese/jiangbeihei.png", "scaleY": 0.3, "scaleX": 0.3 }, "compId": 77 }, { "type": "Sprite", "props": { "texture": "juese/jiangbei.png", "scaleY": 0.3, "scaleX": 0.3 }, "compId": 78 }, { "type": "FontClip", "props": { "y": 24, "x": 120, "width": 500, "var": "lanzuan", "value": "+120", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.4, "scaleX": 0.4, "height": 120, "align": "left" }, "compId": 79 }] }, { "type": "Box", "props": { "y": 900, "x": 375, "width": 256, "var": "ziBox", "height": 78, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 75, "child": [{ "type": "Sprite", "props": { "y": 3, "texture": "juese/jiangbeihei.png", "scaleY": 0.3, "scaleX": 0.3 }, "compId": 80 }, { "type": "Sprite", "props": { "x": 0, "texture": "juese/jiangbei1.png", "scaleY": 0.3, "scaleX": 0.3 }, "compId": 81 }, { "type": "FontClip", "props": { "y": 24, "x": 120, "width": 500, "var": "hongzuan", "value": "+120", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.4, "scaleX": 0.4, "height": 120, "align": "left" }, "compId": 82 }] }, { "type": "Box", "props": { "y": 1000, "x": 375, "width": 256, "var": "coinBox", "height": 78, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 76, "child": [{ "type": "Sprite", "props": { "y": -14, "x": 0, "texture": "juese/jiangbi.png", "scaleY": 0.35, "scaleX": 0.35 }, "compId": 83 }, { "type": "FontClip", "props": { "y": 24, "x": 120, "width": 500, "var": "coinClip", "value": "+120", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.4, "scaleX": 0.4, "height": 120, "align": "left" }, "compId": 84 }, { "type": "FontClip", "props": { "y": 24, "x": 310, "width": 500, "var": "deltaCoin", "value": "+120", "skin": "main/greenFont.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.4, "scaleX": 0.4, "height": 120, "align": "left" }, "compId": 85 }] }, { "type": "Box", "props": { "y": 1080, "x": 196, "width": 358, "var": "fuhuo", "height": 100 }, "compId": 89, "child": [{ "type": "guanggao", "props": { "var": "fuhuoBtn", "runtime": "ui.test.guanggaoUI" }, "compId": 88 }, { "type": "chenger", "props": { "y": -68, "x": 258, "runtime": "ui.test.chengerUI" }, "compId": 90 }] }, { "type": "Box", "props": { "y": 1218, "x": 295, "var": "closeTxt", "bottom": 76 }, "compId": 91, "child": [{ "type": "Text", "props": { "var": "clickClose", "text": "点击关闭", "fontSize": 40, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 92 }] }], "loadList": ["shengli/guangzhuan1.png", "shengli/qi.png", "shengli/haojiao.png", "shengli/shenglibu.png", "shengli/dunpai.png", "main/clipshuzi.png", "bg/qianshu.png", "bg/jingyantiaoshang.png", "bg/jingyantiaoguang.png", "main/biaotihuang.png", "main/jainglizi.png", "juese/jiangbeihei.png", "juese/jiangbei.png", "juese/jiangbei1.png", "juese/jiangbi.png", "main/greenFont.png"], "loadList3D": [] };
            test.GameOverUI = GameOverUI;
            REG("ui.test.GameOverUI", GameOverUI);
            class GetItemCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(GetItemCellUI.uiView);
                }
            }
            GetItemCellUI.uiView = { "type": "View", "props": { "width": 600, "height": 600 }, "compId": 2, "child": [{ "type": "Light", "props": { "y": 300, "x": 300, "var": "light", "blendMode": "lighter", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.LightUI" }, "compId": 4 }, { "type": "Image", "props": { "y": 431, "x": 177, "width": 244, "skin": "main/yuanhei.png", "sizeGrid": "0,28,0,30", "height": 64 }, "compId": 14 }, { "type": "Label", "props": { "y": 431, "x": 156, "width": 288, "var": "label", "text": "X 1000", "height": 64, "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 5 }, { "type": "GoldView", "props": { "y": 150, "x": 155, "var": "v1", "runtime": "ui.test.GoldViewUI" }, "compId": 13 }], "loadList": ["main/yuanhei.png"], "loadList3D": [] };
            test.GetItemCellUI = GetItemCellUI;
            REG("ui.test.GetItemCellUI", GetItemCellUI);
            class GetItemDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(GetItemDialogUI.uiView);
                }
            }
            GetItemDialogUI.uiView = { "type": "Dialog", "props": { "width": 750, "isModal": true, "height": 1200 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "y": 10, "x": 10, "centerY": 0, "centerX": 0, "runtime": "ui.game.viewbgUI" }, "compId": 18 }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 750, "var": "box", "height": 1000 }, "compId": 15 }, { "type": "Button", "props": { "y": 1100, "x": 375, "width": 358, "var": "rebornBtn", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "name": "close", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 16, "child": [{ "type": "Label", "props": { "y": 30, "x": 68, "width": 222, "var": "deshuliang", "text": "确定", "height": 40, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 17 }] }], "loadList": ["main/btn_lv.png"], "loadList3D": [] };
            test.GetItemDialogUI = GetItemDialogUI;
            REG("ui.test.GetItemDialogUI", GetItemDialogUI);
            class GoldViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(GoldViewUI.uiView);
                }
            }
            GoldViewUI.uiView = { "type": "View", "props": { "width": 300, "height": 300 }, "compId": 2, "child": [{ "type": "ViewStack", "props": { "y": 19, "x": 23, "var": "vs" }, "compId": 10, "child": [{ "type": "Box", "props": { "y": 8, "x": 1, "visible": false, "var": "red", "name": "item1" }, "compId": 3, "child": [{ "type": "Sprite", "props": { "y": 7, "x": 0, "texture": "juese/jiangbeihei.png" }, "compId": 11 }, { "type": "Sprite", "props": { "texture": "juese/jiangbei1.png" }, "compId": 6 }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "juese/jiangbeiguang1.png", "blendMode": "lighter", "alpha": 0.5 }, "compId": 7 }] }, { "type": "Box", "props": { "y": 8, "visible": false, "var": "blue", "name": "item2" }, "compId": 4, "child": [{ "type": "Sprite", "props": { "y": 6, "x": 0, "texture": "juese/jiangbeihei.png" }, "compId": 12 }, { "type": "Sprite", "props": { "texture": "juese/jiangbeilan.png" }, "compId": 8 }, { "type": "Sprite", "props": { "texture": "juese/jiangbeiguanglan.png", "blendMode": "lighter", "alpha": 0.5 }, "compId": 9 }] }, { "type": "Image", "props": { "x": 1, "visible": false, "var": "gold", "skin": "juese/jiangbi.png", "name": "item0" }, "compId": 5 }] }], "loadList": ["juese/jiangbeihei.png", "juese/jiangbei1.png", "juese/jiangbeiguang1.png", "juese/jiangbeilan.png", "juese/jiangbeiguanglan.png", "juese/jiangbi.png"], "loadList3D": [] };
            test.GoldViewUI = GoldViewUI;
            REG("ui.test.GoldViewUI", GoldViewUI);
            class guangUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(guangUI.uiView);
                }
            }
            guangUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": -219, "x": -210, "skin": "main/guang1.png", "blendMode": "lighter" }, "compId": 3 }, { "type": "Image", "props": { "y": -219, "x": -210, "skin": "main/guang2.png", "blendMode": "lighter" }, "compId": 4 }, { "type": "Image", "props": { "y": -281, "x": -223, "skin": "main/guang1.png", "rotation": 12, "blendMode": "lighter" }, "compId": 5 }, { "type": "Image", "props": { "y": -254, "x": -156, "skin": "main/guang2.png", "rotation": -3, "blendMode": "lighter" }, "compId": 6 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "alpha": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "alpha", "index": 45 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "alpha", "index": 95 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "alpha", "index": 389 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 442 }] } }, { "target": 4, "keyframes": { "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "alpha", "index": 45 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 95 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "alpha", "index": 115 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 183 }] } }, { "target": 5, "keyframes": { "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 115 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 183 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "alpha", "index": 244 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 313 }] } }, { "target": 6, "keyframes": { "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "alpha", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "label": null, "key": "alpha", "index": 244 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "alpha", "index": 313 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "label": null, "key": "alpha", "index": 389 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "alpha", "index": 442 }] } }], "name": "ani1", "id": 1, "frameRate": 40, "action": 2 }], "loadList": ["main/guang1.png", "main/guang2.png"], "loadList3D": [] };
            test.guangUI = guangUI;
            REG("ui.test.guangUI", guangUI);
            class guanggaoUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(guanggaoUI.uiView);
                }
            }
            guanggaoUI.uiView = { "type": "View", "props": { "width": 358, "height": 100 }, "compId": 2, "child": [{ "type": "Button", "props": { "y": 50, "x": 179, "width": 358, "var": "fuhuo", "stateNum": 1, "skin": "main/btn_zi.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3, "child": [{ "type": "Sprite", "props": { "y": 4, "x": 90, "texture": "main/action.png" }, "compId": 4 }, { "type": "Label", "props": { "y": 30, "x": 159, "width": 122, "var": "deshuliang", "text": "免费获得", "height": 40, "fontSize": 28, "color": "#ffffff", "align": "left" }, "compId": 5 }] }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 4 }, { "value": 0.9, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 7 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 11 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 15 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "scaleY", "index": 30 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 4 }, { "value": 0.9, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 7 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 11 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 15 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "scaleX", "index": 30 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["main/btn_zi.png", "main/action.png"], "loadList3D": [] };
            test.guanggaoUI = guanggaoUI;
            REG("ui.test.guanggaoUI", guanggaoUI);
            class HengjuUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(HengjuUI.uiView);
                }
            }
            HengjuUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Clip", "props": { "y": -46.5, "x": -107, "var": "huoxing", "skin": "bg/clip_huoxing.png", "clipY": 2, "clipX": 3, "autoPlay": true }, "compId": 3 }, { "type": "Box", "props": { "y": -29, "x": -29, "width": 58, "var": "box", "height": 58 }, "compId": 6, "child": [{ "type": "Image", "props": { "y": 29, "x": 29, "var": "dianju", "skin": "bg/dianju.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }] }, { "type": "Image", "props": { "y": 0, "x": -20.5, "var": "jia", "skin": "bg/dianjujia.png" }, "compId": 5 }], "loadList": ["bg/clip_huoxing.png", "bg/dianju.png", "bg/dianjujia.png"], "loadList3D": [] };
            test.HengjuUI = HengjuUI;
            REG("ui.test.HengjuUI", HengjuUI);
            class HeroFootUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(HeroFootUI.uiView);
                }
            }
            HeroFootUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 132, "texture": "bg/renlankuang.png", "pivotY": 55, "pivotX": 66, "height": 110 }, "compId": 3 }, { "type": "Sprite", "props": { "y": 0, "x": 0, "width": 50, "var": "dir", "texture": "bg/andanlandian.png", "pivotY": 110, "pivotX": 25, "height": 40 }, "compId": 4 }], "loadList": ["bg/renlankuang.png", "bg/andanlandian.png"], "loadList3D": [] };
            test.HeroFootUI = HeroFootUI;
            REG("ui.test.HeroFootUI", HeroFootUI);
            class hongtanUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(hongtanUI.uiView);
                }
            }
            hongtanUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "loadList": [], "loadList3D": [] };
            test.hongtanUI = hongtanUI;
            REG("ui.test.hongtanUI", hongtanUI);
            class huziUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(huziUI.uiView);
                }
            }
            huziUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": -51, "skin": "bg/tianshiying.png", "scaleY": 0.8, "scaleX": 0.8, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 5 }, { "type": "Image", "props": { "y": -188, "x": -29, "skin": "bg/zhuanpan.png" }, "compId": 4 }, { "type": "Image", "props": { "y": -225, "x": -164, "skin": "bg/huzi.png" }, "compId": 3, "child": [{ "type": "Image", "props": { "y": 7, "x": 15, "var": "tan", "skin": "bg/tantan.jpg", "scaleY": 1.1, "scaleX": 1.1 }, "compId": 6 }] }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "y": [{ "value": -232, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }, { "value": -255, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 20 }, { "value": -232, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "y", "index": 40 }], "x": [{ "value": -162, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 0 }, { "value": -162, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "x", "index": 40 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["bg/tianshiying.png", "bg/zhuanpan.png", "bg/huzi.png", "bg/tantan.jpg"], "loadList3D": [] };
            test.huziUI = huziUI;
            REG("ui.test.huziUI", huziUI);
            class initViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(initViewUI.uiView);
                }
            }
            initViewUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#000000" }, "compId": 3 }, { "type": "Label", "props": { "x": 0, "width": 750, "var": "initTxt", "text": "0%", "height": 100, "fontSize": 60, "color": "#ffffff", "centerY": 0, "bold": true, "align": "center" }, "compId": 4 }], "loadList": [], "loadList3D": [] };
            test.initViewUI = initViewUI;
            REG("ui.test.initViewUI", initViewUI);
            class jueseUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(jueseUI.uiView);
                }
            }
            jueseUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 1, "child": [{ "type": "viewbg", "props": { "runtime": "ui.game.viewbgUI" }, "compId": 51 }, { "type": "Box", "props": { "y": 141, "x": 0, "width": 751, "height": 1093 }, "compId": 119, "child": [{ "type": "Button", "props": { "y": 274, "x": 111, "visible": true, "var": "zuo", "stateNum": 1, "skin": "main/btn_zuo.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 43 }, { "type": "Button", "props": { "y": 276, "x": 633, "width": 63, "visible": true, "var": "you", "stateNum": 1, "skin": "main/btn_zuo.png", "scaleX": -1, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 44 }, { "type": "Box", "props": { "y": 465, "x": 384, "var": "roleBox" }, "compId": 114, "child": [{ "type": "Image", "props": { "skin": "ren/ying.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 115 }] }, { "type": "Sprite", "props": { "y": 110, "x": 296, "var": "qidai", "texture": "juese/weikai.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 117 }, { "type": "Box", "props": { "y": 665, "x": 0, "width": 751, "height": 428 }, "compId": 94, "child": [{ "type": "Image", "props": { "y": 122, "width": 495, "skin": "juese/juese_zi.png", "sizeGrid": "0,16,0,15", "height": 305 }, "compId": 31 }, { "type": "Image", "props": { "y": -14, "x": 34, "var": "shengming", "skin": "juese/juese_di.png" }, "compId": 21, "child": [{ "type": "Image", "props": { "y": 92, "x": 41, "skin": "juese/juese_jiaxue.png" }, "compId": 9 }, { "type": "Label", "props": { "y": 5, "x": 54, "width": 74, "text": "生命", "height": 39, "fontSize": 36, "color": "#ffffff", "align": "left" }, "compId": 22 }, { "type": "Image", "props": { "y": 171, "x": 32, "skin": "juese/shengming.png" }, "compId": 68 }, { "type": "FontClip", "props": { "y": 177, "x": 69, "width": 461, "var": "shengmingjia", "value": "+1", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.25, "scaleX": 0.25, "height": 115, "align": "center" }, "compId": 69 }, { "type": "ViewStack", "props": { "y": 216.8, "x": 41, "var": "vs1", "selectedIndex": 0 }, "compId": 108, "child": [{ "type": "Box", "props": { "name": "item0" }, "compId": 106, "child": [{ "type": "FontClip", "props": { "y": 4, "x": 65.5, "width": 180, "var": "hpLv", "value": "99", "spaceX": -3, "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:vbnd", "scaleY": 0.25, "scaleX": 0.25, "height": 113, "align": "center" }, "compId": 86 }, { "type": "Sprite", "props": { "x": -0.5, "texture": "main/dengji.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 87 }] }, { "type": "Sprite", "props": { "y": 3, "x": 11, "texture": "juese/max.png", "name": "item1" }, "compId": 107 }] }, { "type": "ViewStack", "props": { "y": 280, "x": -32.25, "width": 257, "var": "vs11", "height": 127 }, "compId": 112, "child": [{ "type": "Button", "props": { "y": 64, "x": 126, "width": 182, "var": "shengmingniu", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "41,31,38,33", "name": "item1", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 32, "child": [{ "type": "Image", "props": { "y": 12, "x": 71, "skin": "juese/shengzizi.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 60 }, { "type": "Sprite", "props": { "y": 38.5, "x": 40, "texture": "main/jinbi.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 75 }, { "type": "Text", "props": { "y": 37, "x": 70.5, "var": "hpGold", "text": "1000", "fontSize": 28, "color": "#ffffff", "align": "left", "runtime": "laya.display.Text" }, "compId": 76 }] }, { "type": "Box", "props": { "y": 31, "x": 27.399999999999977, "var": "box1", "name": "item0" }, "compId": 72, "child": [{ "type": "Image", "props": { "y": 5, "x": 16, "width": 151, "skin": "juese/juese_tiaoxia.png", "height": 40 }, "compId": 12 }, { "type": "Image", "props": { "y": 4.5, "x": 16, "width": 151, "var": "tiao", "skin": "main/juese_tiaoshang.png", "height": 36 }, "compId": 13 }, { "type": "Button", "props": { "y": 24.5, "x": 184, "var": "jia", "stateNum": 1, "skin": "juese/btn_jia.png", "scaleY": 1.2, "scaleX": 1.2, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 59 }, { "type": "Image", "props": { "y": 24, "x": 16, "var": "redImg", "skin": "main/baoshi.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 58 }, { "type": "FontClip", "props": { "y": 50, "x": 11, "width": 917, "var": "xueshu", "value": "1299/1234", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "center" }, "compId": 14 }, { "type": "juese_zuanguang", "props": { "y": 23, "x": 17, "var": "a1", "runtime": "ui.test.juese_zuanguangUI" }, "compId": 99 }] }] }, { "type": "juese_2", "props": { "y": 111.5, "x": 147.5, "var": "lv1", "runtime": "ui.test.juese_2UI" }, "compId": 126 }] }, { "type": "Image", "props": { "y": -13, "x": 276, "var": "gongji", "skin": "juese/juese_di.png" }, "compId": 23, "child": [{ "type": "Image", "props": { "y": 92, "x": 41, "skin": "juese/juese_jiagong.png" }, "compId": 24 }, { "type": "Label", "props": { "y": 5, "x": 54, "width": 74, "text": "攻击", "height": 39, "fontSize": 36, "color": "#ffffff", "align": "left" }, "compId": 29 }, { "type": "Image", "props": { "y": 172, "x": 28, "skin": "juese/gongji.png" }, "compId": 70 }, { "type": "FontClip", "props": { "y": 175, "x": 70, "width": 461, "var": "gongjijia", "value": "+1", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.25, "scaleX": 0.25, "height": 115, "align": "center" }, "compId": 71 }, { "type": "ViewStack", "props": { "y": 212, "x": 39, "var": "vs2" }, "compId": 111, "child": [{ "type": "Sprite", "props": { "y": 3, "x": 11, "var": "atkMax", "texture": "juese/max.png", "name": "item1" }, "compId": 102 }, { "type": "Box", "props": { "y": 0, "x": 0, "width": 110, "name": "item0", "height": 35.4 }, "compId": 110, "child": [{ "type": "FontClip", "props": { "y": 4, "x": 65, "width": 180, "var": "atkLv", "value": "99", "spaceX": -3, "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:vbnd", "scaleY": 0.25, "scaleX": 0.25, "height": 113, "align": "center" }, "compId": 88 }, { "type": "Sprite", "props": { "texture": "main/dengji.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 89 }] }] }, { "type": "ViewStack", "props": { "y": 290, "x": -18, "width": 234, "var": "vs12", "height": 116 }, "compId": 113, "child": [{ "type": "Button", "props": { "y": 53, "x": 105, "width": 182, "var": "gongjiniu", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "41,31,38,33", "name": "item1", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 66, "child": [{ "type": "Image", "props": { "y": 13, "x": 77, "skin": "juese/shengzizi.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 77 }, { "type": "Sprite", "props": { "y": 39, "x": 46, "texture": "main/jinbi.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 78 }, { "type": "Text", "props": { "y": 38, "x": 76, "var": "atkGold", "text": "1000", "fontSize": 28, "color": "#ffffff", "align": "left", "runtime": "laya.display.Text" }, "compId": 79 }] }, { "type": "Box", "props": { "y": 16, "x": 5, "width": 230, "var": "box2", "name": "item0", "height": 84 }, "compId": 73, "child": [{ "type": "Image", "props": { "y": 9, "x": 16, "width": 151, "skin": "juese/juese_tiaoxia.png", "height": 40 }, "compId": 61 }, { "type": "Image", "props": { "y": 8.5, "x": 17, "var": "tiao2", "skin": "main/juese_tiaoshang.png", "height": 36 }, "compId": 62 }, { "type": "Button", "props": { "y": 28.5, "x": 185, "var": "jia2", "stateNum": 1, "skin": "juese/btn_jia.png", "scaleY": 1.2, "scaleX": 1.2, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 63 }, { "type": "Image", "props": { "y": 28, "x": 18, "var": "blueImg", "skin": "main/baoshi2.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 64 }, { "type": "FontClip", "props": { "y": 51, "x": 11, "width": 910, "var": "gongshu", "value": "1299/1234", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "center" }, "compId": 65 }, { "type": "juese_zuanguang", "props": { "y": 22, "x": 28, "var": "a2", "runtime": "ui.test.juese_zuanguangUI" }, "compId": 101 }] }] }, { "type": "juese_2", "props": { "y": 111, "x": 148, "var": "lv2", "runtime": "ui.test.juese_2UI" }, "compId": 127 }] }, { "type": "Box", "props": { "y": 1, "x": 496, "width": 327, "height": 427 }, "compId": 93, "child": [{ "type": "Image", "props": { "y": 122, "x": -1, "width": 255, "skin": "juese/juese_lan.png", "sizeGrid": "0,16,0,15", "height": 304 }, "compId": 30 }, { "type": "Box", "props": { "y": -17, "x": 37.5 }, "compId": 120, "child": [{ "type": "Image", "props": { "x": 1, "width": 175, "skin": "juese/juese_hei.png", "sizeGrid": "23,70,19,34", "height": 367, "alpha": 0.5 }, "compId": 38 }, { "type": "Image", "props": { "y": 206, "x": 2, "skin": "juese/juesekuai.png" }, "compId": 40 }, { "type": "Image", "props": { "y": 49, "width": 177, "var": "jinengtubiao", "skin": "main/kawen.png", "height": 177 }, "compId": 39 }, { "type": "Label", "props": { "y": 10, "x": 20, "width": 133, "var": "jinengming", "text": "技能名字", "height": 33, "fontSize": 30, "color": "#f3e9e9", "align": "center" }, "compId": 41 }, { "type": "Label", "props": { "y": 254, "x": 9, "wordWrap": true, "width": 157, "var": "skillLabel", "text": "技能说明技能说明技能说明技能说明技能说明", "height": 114, "fontSize": 22, "color": "#f3e9e9", "align": "center" }, "compId": 42 }] }] }] }, { "type": "Box", "props": { "y": 545, "x": 36 }, "compId": 95, "child": [{ "type": "Image", "props": { "y": 4, "width": 674, "skin": "juese/juese_hei.png", "sizeGrid": "15,26,22,22", "height": 69, "alpha": 0.5 }, "compId": 53 }, { "type": "Sprite", "props": { "x": 63, "texture": "juese/juese_jiaxue.png" }, "compId": 54 }, { "type": "Sprite", "props": { "y": 2, "x": 364, "texture": "juese/juese_jiagong.png" }, "compId": 55 }, { "type": "FontClip", "props": { "y": 23, "x": 169, "var": "shengmingshu", "value": "600", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "align": "left" }, "compId": 56 }, { "type": "FontClip", "props": { "y": 23, "x": 460, "var": "gongjishu", "value": "600", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "align": "left" }, "compId": 57 }, { "type": "FontClip", "props": { "y": 23, "x": 250, "var": "hpAddFc", "value": "+11", "skin": "main/greenFont.png", "sheet": "123456 7890-+ /:%.ab", "scaleY": 0.3, "scaleX": 0.3, "align": "left" }, "compId": 90 }, { "type": "FontClip", "props": { "y": 23, "x": 542, "var": "atkAddFc", "value": "+11", "skin": "main/greenFont.png", "sheet": "123456 7890-+ /:%.ab", "scaleY": 0.3, "scaleX": 0.3, "align": "left" }, "compId": 91 }] }, { "type": "shengjiEFF", "props": { "y": 241, "x": 284, "var": "lvEff", "scaleY": 2, "scaleX": 2, "blendMode": "lighter", "runtime": "ui.test.shengjiEFFUI" }, "compId": 97 }, { "type": "ViewStack", "props": { "y": 407, "x": 204, "width": 387, "var": "vs109", "height": 116 }, "compId": 145, "child": [{ "type": "Box", "props": { "y": 1.5, "x": -12, "name": "item1" }, "compId": 138, "child": [{ "type": "Image", "props": { "y": 22, "x": 41, "width": 331, "skin": "bg/bosstiaoxia.png", "sizeGrid": "0,20,0,20", "height": 42 }, "compId": 140 }, { "type": "Sprite", "props": { "y": 24, "x": 44, "var": "zitiao", "texture": "juese/suipianshang.png" }, "compId": 141 }, { "type": "Sprite", "props": { "texture": "juese/suipian.png" }, "compId": 142 }, { "type": "FontClip", "props": { "y": 25, "x": 128, "width": 599, "var": "hongzuan", "value": "123/900", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 120, "align": "center" }, "compId": 143 }, { "type": "Text", "props": { "y": 78, "x": 71, "text": "累计观看视频50次", "fontSize": 30, "color": "#ffffff", "bold": true, "align": "center", "runtime": "laya.display.Text" }, "compId": 146 }] }, { "type": "Button", "props": { "y": 50.5, "x": 176, "width": 280, "var": "fuhuo", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "name": "item2", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 139, "child": [{ "type": "Sprite", "props": { "y": 25.5, "x": 74.5, "texture": "main/xuanzezi.png" }, "compId": 144 }] }, { "type": "yixuanze", "props": { "y": -19.5, "x": 35, "var": "xuan", "name": "item0", "runtime": "ui.test.yixuanzeUI" }, "compId": 148 }] }] }], "loadList": ["main/btn_zuo.png", "ren/ying.png", "juese/weikai.png", "juese/juese_zi.png", "juese/juese_di.png", "juese/juese_jiaxue.png", "juese/shengming.png", "main/clipshuzi.png", "main/dengji.png", "juese/max.png", "main/btn_lv.png", "juese/shengzizi.png", "main/jinbi.png", "juese/juese_tiaoxia.png", "main/juese_tiaoshang.png", "juese/btn_jia.png", "main/baoshi.png", "juese/juese_jiagong.png", "juese/gongji.png", "main/baoshi2.png", "juese/juese_lan.png", "juese/juese_hei.png", "juese/juesekuai.png", "main/kawen.png", "main/greenFont.png", "bg/bosstiaoxia.png", "juese/suipianshang.png", "juese/suipian.png", "main/xuanzezi.png"], "loadList3D": [] };
            test.jueseUI = jueseUI;
            REG("ui.test.jueseUI", jueseUI);
            class juese_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(juese_1UI.uiView);
                }
            }
            juese_1UI.uiView = { "type": "View", "props": { "width": 265, "height": 540 }, "compId": 1, "child": [{ "type": "Box", "props": { "y": 5, "width": 265, "var": "ren" }, "compId": 7, "child": [{ "type": "Image", "props": { "y": 436, "skin": "ren/ying.png" }, "compId": 9 }, { "type": "Image", "props": { "y": 5, "x": -110, "skin": "ren/juese1.png" }, "compId": 8 }] }], "loadList": ["ren/ying.png", "ren/juese1.png"], "loadList3D": [] };
            test.juese_1UI = juese_1UI;
            REG("ui.test.juese_1UI", juese_1UI);
            class juese_2UI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(juese_2UI.uiView);
                }
            }
            juese_2UI.uiView = { "type": "Scene", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "main/juese_sheng.png", "anchorY": 1, "anchorX": 0.5 }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }, { "value": -18, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 10 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "y", "index": 20 }] } }, { "target": 2, "keyframes": { "scaleY": [{ "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 2, "key": "scaleY", "index": 0 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 2, "key": "scaleY", "index": 10 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 2, "label": null, "key": "scaleY", "index": 20 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 2, "key": "scaleX", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 2, "label": null, "key": "scaleX", "index": 20 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["main/juese_sheng.png"], "loadList3D": [] };
            test.juese_2UI = juese_2UI;
            REG("ui.test.juese_2UI", juese_2UI);
            class juese_tishiUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(juese_tishiUI.uiView);
                }
            }
            juese_tishiUI.uiView = { "type": "Dialog", "props": { "width": 750, "isModal": true, "height": 1200 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "y": 0, "x": 0, "var": "bg", "runtime": "ui.game.viewbgUI" }, "compId": 29 }, { "type": "Box", "props": { "width": 750, "height": 506, "centerY": -150, "centerX": 0 }, "compId": 4, "child": [{ "type": "Light", "props": { "y": 259, "x": 375, "var": "light", "blendMode": "lighter", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.LightUI" }, "compId": 20 }, { "type": "Button", "props": { "y": 661, "x": 375, "width": 358, "var": "rebornBtn", "stateNum": 1, "skin": "main/btn_zi.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Sprite", "props": { "y": 7, "x": 46, "texture": "main/action.png" }, "compId": 14 }, { "type": "Label", "props": { "y": 29, "x": 98, "width": 222, "var": "deshuliang", "text": "随机获得6~10个", "height": 40, "fontSize": 28, "color": "#ffffff", "align": "center" }, "compId": 13 }] }, { "type": "Button", "props": { "y": 68, "x": 614, "var": "closeBtn", "stateNum": 1, "skin": "main/btn_guanbi.png", "name": "close" }, "compId": 9 }, { "type": "GoldView", "props": { "y": 53, "x": 145, "var": "v1", "scaleY": 1.6, "scaleX": 1.6, "runtime": "ui.test.GoldViewUI" }, "compId": 28 }, { "type": "Box", "props": { "y": 474, "x": 262 }, "compId": 31, "child": [{ "type": "Image", "props": { "width": 244, "skin": "main/yuanhei.png", "sizeGrid": "0,28,0,30", "height": 64 }, "compId": 30 }, { "type": "Label", "props": { "y": 12, "x": 38, "width": 167, "text": "水晶不足", "height": 40, "fontSize": 36, "color": "#ffffff", "align": "center" }, "compId": 10 }] }] }, { "type": "Text", "props": { "y": 943, "x": 361, "runtime": "laya.display.Text" }, "compId": 33 }, { "type": "FontClip", "props": { "y": 926, "x": 206, "width": 691, "var": "fc", "value": "11:11", "skin": "main/redFont.png", "sheet": "123456 7890-+ /:abcd", "scaleY": 0.5, "scaleX": 0.5, "height": 113, "align": "center" }, "compId": 34 }], "loadList": ["main/btn_zi.png", "main/action.png", "main/btn_guanbi.png", "main/yuanhei.png", "main/redFont.png"], "loadList3D": [] };
            test.juese_tishiUI = juese_tishiUI;
            REG("ui.test.juese_tishiUI", juese_tishiUI);
            class juese_zuanguangUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(juese_zuanguangUI.uiView);
                }
            }
            juese_zuanguangUI.uiView = { "type": "Scene", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "juese/1.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "visible": [{ "value": true, "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "visible", "index": 0 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "visible", "index": 58 }, { "value": false, "tweenMethod": "linearNone", "tween": false, "target": 3, "label": null, "key": "visible", "index": 100 }], "skin": [{ "value": "juese/1.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 0 }, { "value": "juese/2.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 3 }, { "value": "juese/3.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 6 }, { "value": "juese/4.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 9 }, { "value": "juese/5.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 12 }, { "value": "juese/6.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 15 }, { "value": "juese/7.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 18 }, { "value": "juese/8.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 21 }, { "value": "juese/9.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 24 }, { "value": "juese/10.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 27 }, { "value": "juese/11.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 30 }, { "value": "juese/11.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "label": null, "key": "skin", "index": 38 }, { "value": "juese/12.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 41 }, { "value": "juese/13.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 44 }, { "value": "juese/14.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 47 }, { "value": "juese/15.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 50 }, { "value": "juese/16.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 53 }, { "value": "juese/17.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 56 }, { "value": "juese/17.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "label": null, "key": "skin", "index": 58 }, { "value": "juese/17.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "label": null, "key": "skin", "index": 100 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["juese/1.png", "juese/2.png", "juese/3.png", "juese/4.png", "juese/5.png", "juese/6.png", "juese/7.png", "juese/8.png", "juese/9.png", "juese/10.png", "juese/11.png", "juese/12.png", "juese/13.png", "juese/14.png", "juese/15.png", "juese/16.png", "juese/17.png"], "loadList3D": [] };
            test.juese_zuanguangUI = juese_zuanguangUI;
            REG("ui.test.juese_zuanguangUI", juese_zuanguangUI);
            class LightUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(LightUI.uiView);
                }
            }
            LightUI.uiView = { "type": "View", "props": { "width": 742, "height": 742 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "texture": "main/guangzhuan1.png" }, "compId": 9 }, { "type": "Sprite", "props": { "y": 0, "x": 742, "texture": "main/guangzhuan1.png", "scaleX": -1 }, "compId": 10 }, { "type": "Sprite", "props": { "y": 742, "x": 0, "texture": "main/guangzhuan1.png", "scaleY": -1 }, "compId": 11 }, { "type": "Sprite", "props": { "y": 742, "x": 742, "texture": "main/guangzhuan1.png", "scaleY": -1, "scaleX": -1 }, "compId": 12 }], "loadList": ["main/guangzhuan1.png"], "loadList3D": [] };
            test.LightUI = LightUI;
            REG("ui.test.LightUI", LightUI);
            class LoadingUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(LoadingUI.uiView);
                }
            }
            LoadingUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#ffffff" }, "compId": 3 }, { "type": "Box", "props": { "width": 156, "scaleY": 1.5, "scaleX": 1.5, "height": 156, "centerY": 0, "centerX": 0 }, "compId": 5, "child": [{ "type": "Clip", "props": { "y": 0, "x": 0, "var": "clip", "skin": "loading/loadingClip.png", "interval": 150, "clipY": 4, "clipX": 4, "autoPlay": true }, "compId": 10 }, { "type": "Label", "props": { "y": 58, "x": 0, "width": 156, "var": "txt", "text": "10%", "height": 40, "fontSize": 36, "color": "#b7b7b7", "bold": true, "align": "center" }, "compId": 7 }] }], "loadList": ["loading/loadingClip.png"], "loadList3D": [] };
            test.LoadingUI = LoadingUI;
            REG("ui.test.LoadingUI", LoadingUI);
            class LoginViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(LoginViewUI.uiView);
                }
            }
            LoginViewUI.uiView = { "type": "View", "props": { "width": 750, "height": 500 }, "compId": 2, "child": [{ "type": "TextInput", "props": { "y": 121, "x": 236, "width": 278, "var": "t1", "prompt": "输入用户名", "height": 83, "fontSize": 40, "bgColor": "#ffffff" }, "compId": 3 }], "loadList": [], "loadList3D": [] };
            test.LoginViewUI = LoginViewUI;
            REG("ui.test.LoginViewUI", LoginViewUI);
            class mainUIUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(mainUIUI.uiView);
                }
            }
            mainUIUI.uiView = { "type": "View", "props": { "width": 750, "height": 141 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 0, "x": 0, "width": 750, "texture": "main/hei.jpg", "height": 141, "alpha": 0.7 }, "compId": 63 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 501, "skin": "main/touxiangdi.png", "sizeGrid": "0,85,0,54", "height": 106, "alpha": 1 }, "compId": 40 }, { "type": "Image", "props": { "y": 8, "x": 8, "width": 69, "var": "headImg", "scaleY": 1.2, "scaleX": 1.2, "height": 69 }, "compId": 42 }, { "type": "Image", "props": { "y": 8, "x": 8, "skin": "main/touxiangkuang.png", "scaleY": 1.2, "scaleX": 1.2 }, "compId": 41 }, { "type": "Image", "props": { "y": 106, "x": 0, "width": 447, "skin": "main/jingyantiaodi.png", "sizeGrid": "0,67,0,42", "height": 35 }, "compId": 43 }, { "type": "Image", "props": { "y": 106, "x": 0, "width": 449, "var": "jingyantiao", "skin": "main/jingyantiaoshang.png", "sizeGrid": "0,64,0,26", "height": 35 }, "compId": 44 }, { "type": "FontClip", "props": { "y": 114, "x": 82, "width": 226, "var": "dengji", "value": "12", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "left" }, "compId": 21 }, { "type": "Label", "props": { "y": 11, "x": 101, "width": 229, "var": "nameTxt", "text": "玩家名字七个字", "height": 33, "fontSize": 30, "color": "#f3e9e9", "align": "left" }, "compId": 45 }, { "type": "Image", "props": { "y": 105.5, "x": 8, "width": 26, "skin": "main/dunpai.png", "height": 35 }, "compId": 61 }, { "type": "Image", "props": { "y": 109, "x": 38, "skin": "main/dengji.png", "scaleY": 0.5, "scaleX": 0.5 }, "compId": 46 }, { "type": "Image", "props": { "y": 65, "x": 123, "var": "goldImg", "skin": "main/dongjin.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 47 }, { "type": "FontClip", "props": { "y": 53, "x": 140, "width": 582, "var": "coinClip", "value": "12999", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "left" }, "compId": 48 }, { "type": "Sprite", "props": { "y": 50, "x": 265, "texture": "main/tili.png" }, "compId": 49 }, { "type": "FontClip", "props": { "y": 80, "x": 310, "width": 472, "var": "timerClip", "value": "00:00", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.15, "scaleX": 0.15, "height": 122 }, "compId": 56 }, { "type": "FontClip", "props": { "y": 53, "x": 302, "width": 434, "var": "tiliClip", "value": "20/20", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 147 }, "compId": 57 }, { "type": "FontClip", "props": { "y": 32, "x": 325, "width": 472, "var": "appEnergyClip", "value": "-5", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.15, "scaleX": 0.15, "height": 122 }, "compId": 58 }, { "type": "Button", "props": { "y": 63, "x": 413, "var": "jia", "stateNum": 1, "skin": "main/btn_jia.png", "scaleY": 1, "scaleX": 1, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 62 }], "loadList": ["main/hei.jpg", "main/touxiangdi.png", "main/touxiangkuang.png", "main/jingyantiaodi.png", "main/jingyantiaoshang.png", "main/clipshuzi.png", "main/dunpai.png", "main/dengji.png", "main/dongjin.png", "main/tili.png", "main/btn_jia.png"], "loadList3D": [] };
            test.mainUIUI = mainUIUI;
            REG("ui.test.mainUIUI", mainUIUI);
            class MainUITestUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(MainUITestUI.uiView);
                }
            }
            MainUITestUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "loadList": [], "loadList3D": [] };
            test.MainUITestUI = MainUITestUI;
            REG("ui.test.MainUITestUI", MainUITestUI);
            class moguiUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(moguiUI.uiView);
                }
            }
            moguiUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 101, "x": 0, "skin": "bg/tianshiying.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Box", "props": { "y": -3, "x": -7 }, "compId": 4, "child": [{ "type": "Image", "props": { "y": -53, "x": 97, "skin": "bg/guichibang.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0 }, "compId": 5 }, { "type": "Image", "props": { "y": -61, "x": -86, "skin": "bg/guichibang.png", "scaleX": -1, "rotation": 0, "anchorY": 0.5, "anchorX": 0 }, "compId": 6 }, { "type": "Image", "props": { "y": -75, "x": -12, "skin": "bg/gui.png", "scaleY": 1.3, "scaleX": 1.3, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7 }, { "type": "Image", "props": { "y": -199, "x": -102, "var": "tan", "skin": "bg/tantan.jpg", "scaleY": 1.1, "scaleX": 1.1 }, "compId": 8 }] }], "animations": [{ "nodes": [{ "target": 4, "keyframes": { "y": [{ "value": -105.5, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "y", "index": 0 }, { "value": -135, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "y", "index": 20 }, { "value": -105.5, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "y", "index": 40 }], "x": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "x", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "x", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "x", "index": 40 }] } }, { "target": 5, "keyframes": { "y": [{ "value": -61, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "y", "index": 0 }], "x": [{ "value": 89, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "x", "index": 0 }], "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 0 }, { "value": 30, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 40 }] } }, { "target": 6, "keyframes": { "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "rotation", "index": 0 }, { "value": -30, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "rotation", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "rotation", "index": 40 }] } }, { "target": 3, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }], "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 20 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 40 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 20 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 40 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["bg/tianshiying.png", "bg/guichibang.png", "bg/gui.png", "bg/tantan.jpg"], "loadList3D": [] };
            test.moguiUI = moguiUI;
            REG("ui.test.moguiUI", moguiUI);
            class mogui_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(mogui_1UI.uiView);
                }
            }
            mogui_1UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "alpha": 0.6 }, "compId": 20, "child": [{ "type": "Rect", "props": { "width": 750, "lineWidth": 1, "height": 1700, "fillColor": "#000000" }, "compId": 21 }] }, { "type": "Box", "props": { "centerY": 0, "centerX": 0 }, "compId": 19, "child": [{ "type": "Image", "props": { "y": 0, "x": 34, "width": 681, "skin": "main/biaotihong.png", "sizeGrid": "0,23,0,125", "height": 99 }, "compId": 3 }, { "type": "Label", "props": { "y": 31, "x": 196.5, "var": "biaoti2", "text": "你遇见了恶魔", "fontSize": 48, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 4, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 6 }] }, { "type": "Label", "props": { "y": 25, "x": 196.5, "var": "baioti", "text": "你遇见了恶魔", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 5 }, { "type": "mogui", "props": { "y": 305, "x": 344.5, "scaleY": 0.8, "scaleX": 0.8, "runtime": "ui.test.moguiUI" }, "compId": 7 }, { "type": "Label", "props": { "y": 433, "x": 135, "text": "是否与魔鬼签订契约？", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 8 }, { "type": "Label", "props": { "y": 520, "x": 190, "var": "txt", "text": "失去274生命上限", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 9 }, { "type": "Label", "props": { "y": 726, "width": 750, "var": "tisheng", "text": "攻速提升", "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 11 }, { "type": "Sprite", "props": { "y": 568, "x": 297, "texture": "main/PT1.png" }, "compId": 12 }, { "type": "Image", "props": { "y": 808, "x": 301.5, "width": 147, "var": "skillBox", "height": 147 }, "compId": 13 }, { "type": "Button", "props": { "y": 1096, "x": 546, "width": 204, "var": "btn_lv", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,22,0,23", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 15, "child": [{ "type": "Image", "props": { "y": 17, "x": 69, "skin": "main/qianding.png" }, "compId": 17 }] }, { "type": "Button", "props": { "y": 1096, "x": 212, "width": 204, "var": "btn_hong", "stateNum": 1, "skin": "main/btn_hong.png", "sizeGrid": "0,22,0,23", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 16, "child": [{ "type": "Image", "props": { "y": 19, "x": 64, "skin": "main/jujue.png" }, "compId": 18 }] }] }], "loadList": ["main/biaotihong.png", "main/PT1.png", "main/btn_lv.png", "main/qianding.png", "main/btn_hong.png", "main/jujue.png"], "loadList3D": [] };
            test.mogui_1UI = mogui_1UI;
            REG("ui.test.mogui_1UI", mogui_1UI);
            class newhandUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(newhandUI.uiView);
                }
            }
            newhandUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "loadList": [], "loadList3D": [] };
            test.newhandUI = newhandUI;
            REG("ui.test.newhandUI", newhandUI);
            class newhand1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(newhand1UI.uiView);
                }
            }
            newhand1UI.uiView = { "type": "View", "props": { "width": 100, "height": 100 }, "compId": 2, "child": [{ "type": "Clip", "props": { "y": -137, "x": -155, "var": "lightClip", "skin": "guide/clip_guang.png", "scaleY": 2, "scaleX": 2, "clipY": 2, "clipX": 4, "blendMode": "lighter" }, "compId": 9 }, { "type": "Image", "props": { "y": 43, "x": 12, "skin": "guide/xiaoshou.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 2 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "scaleY", "index": 6 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "scaleY", "index": 8 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 2 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "scaleX", "index": 6 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "scaleX", "index": 8 }], "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "rotation", "index": 0 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "rotation", "index": 8 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["guide/clip_guang.png", "guide/xiaoshou.png"], "loadList3D": [] };
            test.newhand1UI = newhand1UI;
            REG("ui.test.newhand1UI", newhand1UI);
            class NoResDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(NoResDialogUI.uiView);
                }
            }
            NoResDialogUI.uiView = { "type": "Dialog", "props": { "width": 600, "isModal": true, "height": 450 }, "compId": 2, "child": [{ "type": "BaseTipDialog", "props": { "y": 0, "x": 0, "runtime": "ui.test.BaseTipDialogUI" }, "compId": 42 }, { "type": "Image", "props": { "y": 19, "x": 245, "skin": "main/biaotitishi.png" }, "compId": 28 }, { "type": "Text", "props": { "y": 111, "x": 6, "width": 588, "var": "title", "text": "体力不足", "height": 36, "fontSize": 36, "color": "#ffffff", "bold": true, "align": "center", "runtime": "laya.display.Text" }, "compId": 10 }, { "type": "ViewStack", "props": { "y": 129, "x": 6, "var": "vs" }, "compId": 40, "child": [{ "type": "Box", "props": { "y": 38, "x": 2, "width": 535, "name": "item0", "height": 174 }, "compId": 38, "child": [{ "type": "Sprite", "props": { "y": 14, "x": 244, "var": "xin", "texture": "main/daxin.png" }, "compId": 9 }, { "type": "Text", "props": { "y": 138, "x": 110, "width": 380, "var": "l1", "text": "剩余次数:0/3", "height": 36, "fontSize": 36, "color": "#ffffff", "bold": true, "align": "center", "runtime": "laya.display.Text" }, "compId": 12 }] }, { "type": "Box", "props": { "y": 11, "x": 211, "width": 184, "name": "item1", "height": 218 }, "compId": 39, "child": [{ "type": "GoldView", "props": { "y": 1, "x": 0, "var": "dia", "scaleY": 0.6, "scaleX": 0.6, "runtime": "ui.test.GoldViewUI" }, "compId": 36 }, { "type": "FontClip", "props": { "y": 170, "x": -195, "width": 1950, "var": "fc", "value": "11:11", "skin": "main/redFont.png", "sheet": "123456 7890-+ /:abcd", "scaleY": 0.3, "scaleX": 0.3, "name": "item1", "height": 100, "align": "center" }, "compId": 35 }] }] }, { "type": "guanggao", "props": { "y": 350, "x": 121, "var": "btnView", "runtime": "ui.test.guanggaoUI" }, "compId": 41 }], "loadList": ["main/biaotitishi.png", "main/daxin.png", "main/redFont.png"], "loadList3D": [] };
            test.NoResDialogUI = NoResDialogUI;
            REG("ui.test.NoResDialogUI", NoResDialogUI);
            class OpenIconUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(OpenIconUI.uiView);
                }
            }
            OpenIconUI.uiView = { "type": "Dialog", "props": { "width": 750, "isModal": true, "height": 1334 }, "compId": 2, "child": [{ "type": "Light", "props": { "y": 606, "x": 375, "var": "light", "blendMode": "lighter", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.LightUI" }, "compId": 4 }, { "type": "Button", "props": { "y": 606, "x": 375, "var": "icon", "stateNum": 2, "skin": "main/btn_2.png", "selected": true, "scaleY": 1.5, "scaleX": 1.5, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Image", "props": { "y": 341, "x": 384, "var": "title", "skin": "main/changhong2.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6, "child": [{ "type": "Sprite", "props": { "y": 16.25, "x": 88.75, "texture": "main/xitongzi.png" }, "compId": 8 }] }, { "type": "Box", "props": { "x": 295, "visible": false, "var": "closeText", "bottom": 268 }, "compId": 9, "child": [{ "type": "Text", "props": { "var": "clickClose", "text": "点击关闭", "fontSize": 40, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 10 }] }], "loadList": ["main/btn_2.png", "main/changhong2.png", "main/xitongzi.png"], "loadList3D": [] };
            test.OpenIconUI = OpenIconUI;
            REG("ui.test.OpenIconUI", OpenIconUI);
            class paihangUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(paihangUI.uiView);
                }
            }
            paihangUI.uiView = { "type": "Dialog", "props": { "width": 750, "isShowEffect": false, "height": 1334 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 109, "x": 34, "width": 682, "skin": "main/fuhuodi2.jpg", "sizeGrid": "113,70,76,69", "height": 1073 }, "compId": 3 }, { "type": "Button", "props": { "y": 123, "x": 617, "width": 80, "var": "guanbi", "stateNum": 1, "skin": "main/btn_guanbi.png", "name": "close", "height": 80 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 100, "x": 200, "texture": "main/changhong2.png" }, "compId": 5 }, { "type": "Sprite", "props": { "y": 100, "x": 264, "texture": "paihang/paihangzi.png" }, "compId": 6 }, { "type": "Tab", "props": { "y": 252, "x": 57, "var": "tab", "stateNum": 2, "space": 30, "skin": "main/btn_anniu.png", "labels": "," }, "compId": 7 }, { "type": "Image", "props": { "y": 357, "x": 57, "width": 628, "skin": "main/tishilan.png", "sizeGrid": "16,14,22,14", "height": 765, "alpha": 0.6 }, "compId": 11 }, { "type": "List", "props": { "y": 358, "x": 0, "width": 759, "var": "list", "height": 732 }, "compId": 13, "child": [{ "type": "paihang1", "props": { "y": 0, "x": 0, "renderType": "render", "runtime": "ui.test.paihang1UI" }, "compId": 14 }] }, { "type": "WXOpenDataViewer", "props": { "y": 358, "x": 60, "width": 627, "var": "wxOpen", "iconSign": "wx", "height": 763, "runtime": "laya.ui.WXOpenDataViewer" }, "compId": 15 }, { "type": "Sprite", "props": { "y": 262.5, "x": 116, "texture": "paihang/haoyouzi.png" }, "compId": 16 }, { "type": "Sprite", "props": { "y": 262.5, "x": 339, "texture": "paihang/shijiezi.png" }, "compId": 18 }, { "type": "Text", "props": { "y": 1133, "x": 525.5224609375, "var": "myText", "text": "我的名次:11", "fontSize": 30, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 19 }], "loadList": ["main/fuhuodi2.jpg", "main/btn_guanbi.png", "main/changhong2.png", "paihang/paihangzi.png", "main/btn_anniu.png", "main/tishilan.png", "paihang/haoyouzi.png", "paihang/shijiezi.png"], "loadList3D": [] };
            test.paihangUI = paihangUI;
            REG("ui.test.paihangUI", paihangUI);
            class paihang1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(paihang1UI.uiView);
                }
            }
            paihang1UI.uiView = { "type": "View", "props": { "width": 750, "height": 92 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 3.5, "x": 68, "var": "paiming", "skin": "paihang/yiming.png" }, "compId": 3 }, { "type": "Image", "props": { "y": 4.5, "x": 144, "width": 77, "var": "touxiang", "height": 77 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 90, "x": 71, "width": 600, "texture": "paihang/xiaoxi.png" }, "compId": 5 }, { "type": "Text", "props": { "y": 25, "x": 224, "width": 283, "var": "mingzi", "text": "玩家弓箭七个字", "height": 36, "fontSize": 36, "color": "#ffffff", "bold": true, "runtime": "laya.display.Text" }, "compId": 6 }, { "type": "FontClip", "props": { "y": 22, "x": 487.5, "width": 364, "var": "goldFc", "value": "9999", "spaceX": 0, "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:%.ab", "scaleY": 0.4, "scaleX": 0.4, "height": 113, "align": "right" }, "compId": 7 }, { "type": "Sprite", "props": { "y": 22, "x": 632.5, "texture": "paihang/fen.png" }, "compId": 8 }, { "type": "FontClip", "props": { "y": 23, "x": 29.5, "width": 364, "var": "fc1", "value": "10", "spaceX": 0, "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:%.ab", "scaleY": 0.4, "scaleX": 0.4, "height": 113, "align": "center" }, "compId": 9 }], "loadList": ["paihang/yiming.png", "paihang/xiaoxi.png", "main/clipshuzi.png", "paihang/fen.png"], "loadList3D": [] };
            test.paihang1UI = paihang1UI;
            REG("ui.test.paihang1UI", paihang1UI);
            class qiandaoUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(qiandaoUI.uiView);
                }
            }
            qiandaoUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": -154, "x": -54, "texture": "qiandao/tou.png" }, "compId": 3 }, { "type": "Image", "props": { "y": 233, "x": 45, "width": 667, "skin": "main/fuhuodi2.jpg", "sizeGrid": "154,70,76,69", "height": 1036 }, "compId": 4 }, { "type": "Image", "props": { "y": 219, "x": 129, "width": 500, "skin": "main/paihangbangdi.png", "sizeGrid": "0,177,0,175", "height": 130 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 220, "x": 312, "texture": "qiandao/qiandaozi.png" }, "compId": 11 }, { "type": "Button", "props": { "y": 233, "x": 621, "width": 91, "var": "guanbi", "stateNum": 1, "skin": "main/btn_guanbi.png", "name": "close", "height": 91 }, "compId": 12 }, { "type": "qiandao1", "props": { "y": 355, "x": 62, "runtime": "ui.test.qiandao1UI" }, "compId": 14 }, { "type": "qiandao1", "props": { "y": 355, "x": 279, "runtime": "ui.test.qiandao1UI" }, "compId": 15 }, { "type": "qiandao1", "props": { "y": 355, "x": 496, "runtime": "ui.test.qiandao1UI" }, "compId": 16 }, { "type": "qiandao1", "props": { "y": 593, "x": 62, "runtime": "ui.test.qiandao1UI" }, "compId": 17 }, { "type": "qiandao1", "props": { "y": 593, "x": 279, "runtime": "ui.test.qiandao1UI" }, "compId": 18 }, { "type": "qiandao1", "props": { "y": 593, "x": 496, "runtime": "ui.test.qiandao1UI" }, "compId": 19 }, { "type": "qiandao2", "props": { "y": 834, "x": 49, "runtime": "ui.test.qiandao2UI" }, "compId": 20 }, { "type": "Button", "props": { "y": 1175, "x": 175, "width": 214, "var": "LingBtn", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,19,0,18", "height": 94, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 21, "child": [{ "type": "Sprite", "props": { "y": 17, "x": 62, "texture": "qiandao/qiandaoanniu.png" }, "compId": 22 }] }, { "type": "Button", "props": { "y": 1175, "x": 496, "width": 396, "var": "AdLingBtn", "stateNum": 1, "skin": "main/btn_zi.png", "sizeGrid": "0,31,0,36", "height": 94, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 25, "child": [{ "type": "Sprite", "props": { "y": 4.5, "x": 81, "texture": "main/action.png" }, "compId": 27 }, { "type": "Sprite", "props": { "y": 16.5, "x": 144, "texture": "main/shuangbei.png" }, "compId": 29 }] }], "loadList": ["qiandao/tou.png", "main/fuhuodi2.jpg", "main/paihangbangdi.png", "qiandao/qiandaozi.png", "main/btn_guanbi.png", "main/btn_huang.png", "qiandao/qiandaoanniu.png", "main/btn_zi.png", "main/action.png", "main/shuangbei.png"], "loadList3D": [] };
            test.qiandaoUI = qiandaoUI;
            REG("ui.test.qiandaoUI", qiandaoUI);
            class qiandao1UI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(qiandao1UI.uiView);
                }
            }
            qiandao1UI.uiView = { "type": "Scene", "props": { "width": 202, "height": 209 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 202, "skin": "qiandao/riliye.png", "sizeGrid": "0,78,0,65", "height": 209 }, "compId": 3 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 202, "visible": true, "var": "xuanzhong", "skin": "qiandao/riliyeguang.png", "sizeGrid": "0,78,0,65", "height": 209, "alpha": 0 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 43, "x": 41.5, "var": "tianshu", "texture": "qiandao/yitian.png" }, "compId": 6 }, { "type": "Sprite", "props": { "y": 86, "x": 72.5, "var": "tupian", "texture": "main/jinbi.png" }, "compId": 8 }, { "type": "Label", "props": { "y": 144, "x": 50, "width": 102, "var": "cengshuTxt", "text": "×1234", "height": 36, "fontSize": 36, "color": "#702915", "align": "center" }, "compId": 9 }], "loadList": ["qiandao/riliye.png", "qiandao/riliyeguang.png", "qiandao/yitian.png", "main/jinbi.png"], "loadList3D": [] };
            test.qiandao1UI = qiandao1UI;
            REG("ui.test.qiandao1UI", qiandao1UI);
            class qiandao2UI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(qiandao2UI.uiView);
                }
            }
            qiandao2UI.uiView = { "type": "Scene", "props": { "width": 657, "height": 243 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 657, "skin": "qiandao/riliye.png", "sizeGrid": "90,78,89,67", "height": 243 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 50, "x": 35.5, "texture": "qiandao/diqitian.png" }, "compId": 5 }, { "type": "Sprite", "props": { "y": 110, "x": 470, "texture": "qiandao/qitian.png" }, "compId": 6 }], "loadList": ["qiandao/riliye.png", "qiandao/diqitian.png", "qiandao/qitian.png"], "loadList3D": [] };
            test.qiandao2UI = qiandao2UI;
            REG("ui.test.qiandao2UI", qiandao2UI);
            class RankCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(RankCellUI.uiView);
                }
            }
            RankCellUI.uiView = { "type": "View", "props": { "width": 604, "height": 91 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 604, "var": "bg", "skin": "rank/paiminglv.png", "sizeGrid": "21,40,18,38", "height": 91 }, "compId": 4 }, { "type": "Image", "props": { "y": 4, "x": 6, "width": 592, "var": "di", "skin": "rank/paimingBG.png", "sizeGrid": "18,88,12,88", "height": 83 }, "compId": 3 }, { "type": "FontClip", "props": { "y": 21, "x": 391, "width": 125, "var": "jifen", "value": "11", "skin": "rank/clip_shuzi.png", "sheet": "1234 5678 90-+", "height": 51, "align": "right" }, "compId": 5 }, { "type": "FontClip", "props": { "y": 21, "x": -11, "width": 125, "var": "mingci", "value": "11", "skin": "rank/clip_shuzi.png", "sheet": "1234 5678 90-+", "height": 51, "align": "center" }, "compId": 6 }, { "type": "Image", "props": { "y": 12.5, "x": 20, "var": "title", "skin": "rank/jinpai.png" }, "compId": 7 }, { "type": "Text", "props": { "y": 27, "x": 184, "width": 211, "var": "mingzi", "text": "骑马合成冲", "strokeColor": "#000000", "stroke": 2, "height": 39, "fontSize": 30, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 8 }, { "type": "Image", "props": { "y": 20.5, "x": 111, "width": 50, "var": "img", "height": 50 }, "compId": 11 }], "loadList": ["rank/paiminglv.png", "rank/paimingBG.png", "rank/clip_shuzi.png", "rank/jinpai.png"], "loadList3D": [] };
            test.RankCellUI = RankCellUI;
            REG("ui.test.RankCellUI", RankCellUI);
            class RankDialogUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(RankDialogUI.uiView);
                }
            }
            RankDialogUI.uiView = { "type": "Dialog", "props": { "width": 750, "isShowEffect": false, "isModal": true, "height": 1200 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 34, "width": 682, "skin": "main/fuhuodi2.jpg", "sizeGrid": "102,70,76,69", "height": 1109 }, "compId": 17 }, { "type": "Tab", "props": { "y": 142, "x": 70, "var": "tab", "stateNum": 2, "selectedIndex": 0, "labels": "," }, "compId": 11 }, { "type": "WXOpenDataViewer", "props": { "y": 200, "x": 70, "width": 610, "var": "wxopen", "iconSign": "wx", "height": 800, "runtime": "laya.ui.WXOpenDataViewer" }, "compId": 9 }, { "type": "Sprite", "props": { "y": 148, "x": 84, "texture": "rank/haoyou.png", "mouseEnabled": false }, "compId": 12 }, { "type": "Sprite", "props": { "y": 147.5, "x": 193, "texture": "rank/shijie.png", "mouseEnabled": false }, "compId": 13 }, { "type": "Image", "props": { "y": 17, "skin": "rank/paihangbangzi.png", "centerX": 0 }, "compId": 18 }, { "type": "Button", "props": { "y": 8, "x": 614, "width": 80, "stateNum": 1, "skin": "timegold/btn_guanbi.png", "name": "close", "height": 80 }, "compId": 19 }, { "type": "Box", "props": { "y": 200, "x": 71, "width": 641, "var": "worldBox", "height": 930 }, "compId": 23, "child": [{ "type": "Text", "props": { "y": 848, "x": 364, "width": 249, "var": "myText", "text": "当前排名:未上榜", "height": 40, "fontSize": 30, "color": "#ffffff", "align": "right", "runtime": "laya.display.Text" }, "compId": 16 }, { "type": "List", "props": { "y": 0, "x": 0, "width": 613, "height": 818 }, "compId": 21, "child": [{ "type": "RankCell", "props": { "y": 0, "x": 0, "renderType": "render", "runtime": "ui.test.RankCellUI" }, "compId": 22 }] }] }], "loadList": ["main/fuhuodi2.jpg", "rank/haoyou.png", "rank/shijie.png", "rank/paihangbangzi.png", "timegold/btn_guanbi.png"], "loadList3D": [] };
            test.RankDialogUI = RankDialogUI;
            REG("ui.test.RankDialogUI", RankDialogUI);
            class ReborthUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ReborthUI.uiView);
                }
            }
            ReborthUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.75 }, "compId": 3 }, { "type": "Box", "props": { "width": 750, "height": 506, "centerY": -2, "centerX": 3 }, "compId": 6, "child": [{ "type": "BaseTipDialog", "props": { "y": 53, "x": 75.5, "var": "bgv", "runtime": "ui.test.BaseTipDialogUI" }, "compId": 43 }, { "type": "Button", "props": { "y": 460, "x": 374, "width": 240, "visible": false, "var": "rebornBtn", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Image", "props": { "y": 29, "x": 89, "skin": "main/queding.png" }, "compId": 17 }] }, { "type": "Label", "props": { "y": 360, "x": 276, "width": 167, "text": "剩余次数：", "height": 40, "fontSize": 36, "color": "#ffffff", "align": "center" }, "compId": 13 }, { "type": "Label", "props": { "y": 360, "x": 443, "width": 45, "var": "txt", "text": "2", "height": 40, "fontSize": 36, "color": "#ffffff", "align": "left" }, "compId": 14 }, { "type": "Image", "props": { "y": 68, "x": 331, "skin": "main/biaotifuhuo.png" }, "compId": 15 }, { "type": "Label", "props": { "y": 221, "x": 353, "width": 45, "var": "daojishi", "height": 64, "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 40 }] }, { "type": "Button", "props": { "y": 870, "x": 375, "width": 358, "var": "fuhuo", "stateNum": 1, "skin": "main/btn_zi.png", "sizeGrid": "0,27,0,28", "scaleY": 1, "scaleX": 1, "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 36, "child": [{ "type": "Sprite", "props": { "y": 4, "x": 90, "texture": "main/action.png" }, "compId": 37 }, { "type": "Label", "props": { "y": 30, "x": 150, "width": 122, "var": "deshuliang", "text": "免费复活", "height": 40, "fontSize": 28, "color": "#ffffff", "align": "left" }, "compId": 38 }] }, { "type": "Image", "props": { "y": 586, "x": 296, "var": "jindu", "skin": "main/quantiao.png" }, "compId": 41 }, { "type": "Box", "props": { "y": 667, "x": 375, "var": "centerBox" }, "compId": 42 }], "loadList": ["main/btn_lv.png", "main/queding.png", "main/biaotifuhuo.png", "main/btn_zi.png", "main/action.png", "main/quantiao.png"], "loadList3D": [] };
            test.ReborthUI = ReborthUI;
            REG("ui.test.ReborthUI", ReborthUI);
            class RedPointViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(RedPointViewUI.uiView);
                }
            }
            RedPointViewUI.uiView = { "type": "View", "props": { "width": 50, "height": 100 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 59, "x": 25, "skin": "main/hongdian.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "scaleY", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 19 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 24 }, { "value": 0.9, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 28 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 32 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 35 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "label": null, "key": "scaleX", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 19 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 24 }, { "value": 0.9, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 28 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 32 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 35 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["main/hongdian.png"], "loadList3D": [] };
            test.RedPointViewUI = RedPointViewUI;
            REG("ui.test.RedPointViewUI", RedPointViewUI);
            class ReducePowerUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ReducePowerUI.uiView);
                }
            }
            ReducePowerUI.uiView = { "type": "View", "props": { "y": 45, "x": 100, "width": 200, "height": 90, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 16, "x": 16, "texture": "main/tili.png", "scaleY": 2, "scaleX": 2 }, "compId": 3 }, { "type": "FontClip", "props": { "y": 20, "x": 85, "var": "fc", "value": "-20", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.4, "scaleX": 0.4 }, "compId": 4 }], "loadList": ["main/tili.png", "main/clipshuzi.png"], "loadList3D": [] };
            test.ReducePowerUI = ReducePowerUI;
            REG("ui.test.ReducePowerUI", ReducePowerUI);
            class RockerViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(RockerViewUI.uiView);
                }
            }
            RockerViewUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "var": "sp", "skin": "bg/rockerBg.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Box", "props": { "width": 304, "var": "dir", "height": 304, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 7, "child": [{ "type": "Sprite", "props": { "y": 26, "x": 26.5, "texture": "bg/rollDir.png" }, "compId": 5 }] }, { "type": "Image", "props": { "var": "sp0", "skin": "bg/rockerBall.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }], "loadList": ["bg/rockerBg.png", "bg/rollDir.png", "bg/rockerBall.png"], "loadList3D": [] };
            test.RockerViewUI = RockerViewUI;
            REG("ui.test.RockerViewUI", RockerViewUI);
            class SawHengUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(SawHengUI.uiView);
                }
            }
            SawHengUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "bg", "skin": "bg/501.png", "sizeGrid": "0,64,0,64" }, "compId": 3 }], "loadList": ["bg/501.png"], "loadList3D": [] };
            test.SawHengUI = SawHengUI;
            REG("ui.test.SawHengUI", SawHengUI);
            class SawZongUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(SawZongUI.uiView);
                }
            }
            SawZongUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Image", "props": { "var": "bg", "skin": "bg/502.png", "sizeGrid": "64,0,64,0" }, "compId": 3 }], "loadList": ["bg/502.png"], "loadList3D": [] };
            test.SawZongUI = SawZongUI;
            REG("ui.test.SawZongUI", SawZongUI);
            class selectmissionUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(selectmissionUI.uiView);
                }
            }
            selectmissionUI.uiView = { "type": "Scene", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "x": 0, "centerY": 0 }, "compId": 20, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "main/jiandi.jpg" }, "compId": 3 }] }, { "type": "Box", "props": { "x": 18.5, "centerY": 0 }, "compId": 21, "child": [{ "type": "Image", "props": { "x": 0.5, "width": 714, "skin": "main/biaotilan.png", "sizeGrid": "0,38,0,134", "height": 99 }, "compId": 4 }, { "type": "Label", "props": { "y": 24, "x": 210.5, "var": "biaoti2", "text": "1.我也草原", "fontSize": 60, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 5, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 7 }] }, { "type": "Label", "props": { "y": 19, "x": 212.5, "var": "biaoti", "text": "1.我也草原", "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 686, "x": 171.5, "var": "changdu2", "text": "章节长度：50", "fontSize": 60, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 8, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 10 }] }, { "type": "Label", "props": { "y": 682, "x": 172.5, "var": "changdu", "text": "章节长度：50", "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 9 }, { "type": "Label", "props": { "y": 781, "x": 37.5, "width": 630, "var": "miaoshu2", "text": "一片肥沃的草原，是打猎的好地方", "height": 34, "fontSize": 34, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 11, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 13 }] }, { "type": "Label", "props": { "y": 776, "x": 37.5, "width": 630, "var": "miaoshu", "text": "一片肥沃的草原，是打猎的好地方", "fontSize": 34, "color": "#ffffff", "align": "center" }, "compId": 12 }, { "type": "Button", "props": { "y": 958, "x": 354.5, "width": 301, "var": "btn_jinru", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,16,0,18", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 14, "child": [{ "type": "Label", "props": { "y": 42, "x": 90, "text": "进入", "fontSize": 60, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 15, "child": [{ "type": "Script", "props": { "y": 0, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 17 }] }, { "type": "Label", "props": { "y": 38, "x": 93, "text": "进入", "strokeColor": "#000000", "stroke": 3, "fontSize": 60, "color": "#ffffff", "align": "center" }, "compId": 16 }] }, { "type": "Button", "props": { "y": 1155, "x": 41.5, "var": "fanhui", "stateNum": 1, "skin": "main/btn_lan.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 18, "child": [{ "type": "Image", "props": { "y": 17, "x": 19, "skin": "main/toujian.png" }, "compId": 19 }] }, { "type": "xiaodao", "props": { "y": 151, "x": 14, "runtime": "ui.test.xiaodaoUI" }, "compId": 22 }, { "type": "Label", "props": { "y": 944, "x": 245, "var": "tiaojian2", "text": "通过第1章解锁", "height": 34, "fontSize": 34, "color": "#000000", "alpha": 0.5, "align": "center" }, "compId": 23, "child": [{ "type": "Script", "props": { "y": 1, "x": 0, "strength": 2, "runtime": "laya.effect.BlurFilterSetter" }, "compId": 25 }] }, { "type": "Label", "props": { "y": 938, "x": 245.06494140625, "var": "tiaojian", "text": "通过第1章解锁", "fontSize": 34, "color": "#ffffff", "align": "center" }, "compId": 24 }] }], "loadList": ["main/jiandi.jpg", "main/biaotilan.png", "main/btn_huang.png", "main/btn_lan.png", "main/toujian.png"], "loadList3D": [] };
            test.selectmissionUI = selectmissionUI;
            REG("ui.test.selectmissionUI", selectmissionUI);
            class settingUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(settingUI.uiView);
                }
            }
            settingUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "runtime": "ui.game.viewbgUI" }, "compId": 28 }, { "type": "Box", "props": { "width": 750, "height": 1334, "centerY": 0 }, "compId": 27 }, { "type": "Box", "props": { "y": 273, "x": 99.5, "width": 551, "var": "box1", "height": 708 }, "compId": 43, "child": [{ "type": "Label", "props": { "y": -75, "x": -99.5, "width": 750, "var": "id", "text": "ID:1234", "height": 45, "fontSize": 40, "color": "#ffffff", "align": "center" }, "compId": 29 }, { "type": "Label", "props": { "y": -12, "x": -99.5, "width": 750, "var": "ver", "text": "VER:4.0.2", "height": 45, "fontSize": 40, "color": "#ffffff", "align": "center" }, "compId": 31 }, { "type": "Sprite", "props": { "y": 58, "x": 216, "texture": "shezhi/yuyan.png" }, "compId": 32 }, { "type": "Button", "props": { "y": 162, "x": 275.5, "width": 540, "var": "yuyan", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,31,0,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 33, "child": [{ "type": "Sprite", "props": { "y": 18, "x": 179, "texture": "shezhi/jianti.png" }, "compId": 38 }] }, { "type": "Button", "props": { "y": 343, "x": 275, "width": 540, "var": "yinxiao", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,31,0,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 36, "child": [{ "type": "Image", "props": { "y": 19, "x": 241, "var": "soundImg", "skin": "shezhi/kai.png" }, "compId": 39 }] }, { "type": "Button", "props": { "y": 477, "x": 5, "width": 540, "var": "yinyue", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,31,0,33", "height": 91 }, "compId": 37, "child": [{ "type": "Image", "props": { "y": 21, "x": 240, "var": "musicImg", "skin": "shezhi/kai.png" }, "compId": 40 }] }, { "type": "Sprite", "props": { "y": 239, "x": 216, "texture": "shezhi/yinxiao.png" }, "compId": 41 }, { "type": "Sprite", "props": { "y": 420, "x": 216, "texture": "shezhi/yinyue.png" }, "compId": 42 }, { "type": "Button", "props": { "y": 611, "x": 5.5, "width": 540, "var": "zuobi", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,31,0,33", "label": "作弊", "height": 91 }, "compId": 44 }] }], "loadList": ["shezhi/yuyan.png", "main/btn_lv.png", "shezhi/jianti.png", "shezhi/kai.png", "shezhi/yinxiao.png", "shezhi/yinyue.png"], "loadList3D": [] };
            test.settingUI = settingUI;
            REG("ui.test.settingUI", settingUI);
            class shengjiUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(shengjiUI.uiView);
                }
            }
            shengjiUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "scaleY": 1.5, "runtime": "ui.game.viewbgUI" }, "compId": 24 }, { "type": "Light", "props": { "y": 371, "x": 375, "width": 742, "var": "lightView", "height": 742, "blendMode": "lighter", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.LightUI" }, "compId": 3 }, { "type": "Box", "props": { "y": 341, "x": 373, "var": "dunpaiBox", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 54, "child": [{ "type": "Image", "props": { "skin": "main/dunpai.png" }, "compId": 4 }, { "type": "FontClip", "props": { "y": 62, "x": 32, "width": 159, "var": "lvClip", "value": "12", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.6, "scaleX": 0.6, "height": 121, "align": "center" }, "compId": 5 }] }, { "type": "Box", "props": { "y": 536, "x": 372, "var": "lvBox", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 55, "child": [{ "type": "Image", "props": { "width": 520, "skin": "main/yuanhei.png", "sizeGrid": "0,28,0,30", "height": 64 }, "compId": 7 }, { "type": "Label", "props": { "y": 5, "x": 21, "width": 477, "text": "等级达到     级", "height": 52, "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 6 }, { "type": "Label", "props": { "y": 6, "x": 298, "width": 63, "var": "lvLabel", "text": "10", "height": 52, "fontSize": 48, "color": "#ffffff", "align": "center" }, "compId": 23 }] }, { "type": "Box", "props": { "y": 671, "x": 371, "var": "lingqu", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 56, "child": [{ "type": "Image", "props": { "x": -0.5, "width": 441, "skin": "main/biaotihuang.png", "sizeGrid": "0,38,0,36", "height": 99 }, "compId": 8 }, { "type": "Sprite", "props": { "y": 24, "x": 167.5, "texture": "main/jainglizi.png" }, "compId": 10 }] }, { "type": "Button", "props": { "y": 1130, "x": 375, "width": 358, "var": "rebornBtn", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,27,0,28", "name": "close", "height": 100, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 20, "child": [{ "type": "Label", "props": { "y": 24, "x": 66, "width": 222, "var": "deshuliang", "text": "确定", "height": 40, "fontSize": 36, "color": "#ffffff", "align": "center" }, "compId": 21 }] }, { "type": "Box", "props": { "y": 800, "x": 375, "width": 256, "var": "lanBox", "height": 78, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 39, "child": [{ "type": "Sprite", "props": { "y": 3, "x": 0, "texture": "juese/jiangbeihei.png", "scaleY": 0.3, "scaleX": 0.3 }, "compId": 42 }, { "type": "Sprite", "props": { "texture": "juese/jiangbei.png", "scaleY": 0.3, "scaleX": 0.3 }, "compId": 43 }, { "type": "FontClip", "props": { "y": 24, "x": 120, "width": 500, "var": "lanzuan", "value": "+120", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.4, "scaleX": 0.4, "height": 120, "align": "left" }, "compId": 44 }] }, { "type": "Box", "props": { "y": 900, "x": 375, "width": 256, "var": "ziBox", "height": 78, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 40, "child": [{ "type": "Sprite", "props": { "y": 3, "texture": "juese/jiangbeihei.png", "scaleY": 0.3, "scaleX": 0.3 }, "compId": 45 }, { "type": "Sprite", "props": { "x": 0, "texture": "juese/jiangbei1.png", "scaleY": 0.3, "scaleX": 0.3 }, "compId": 46 }, { "type": "FontClip", "props": { "y": 24, "x": 120, "width": 500, "var": "hongzuan", "value": "+120", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.4, "scaleX": 0.4, "height": 120, "align": "left" }, "compId": 47 }] }, { "type": "Box", "props": { "y": 1000, "x": 375, "width": 256, "var": "coinBox", "height": 78, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 50, "child": [{ "type": "Sprite", "props": { "y": -6, "x": 0, "texture": "juese/jiangbi.png", "scaleY": 0.35, "scaleX": 0.35 }, "compId": 51 }, { "type": "FontClip", "props": { "y": 24, "x": 120, "width": 500, "var": "coinClip", "value": "+120", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.4, "scaleX": 0.4, "height": 120, "align": "left" }, "compId": 52 }, { "type": "FontClip", "props": { "y": 24, "x": 310, "width": 500, "var": "deltaCoin", "value": "+120", "skin": "main/greenFont.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.4, "scaleX": 0.4, "height": 120, "align": "left" }, "compId": 53 }] }], "loadList": ["main/dunpai.png", "main/clipshuzi.png", "main/yuanhei.png", "main/biaotihuang.png", "main/jainglizi.png", "main/btn_lv.png", "juese/jiangbeihei.png", "juese/jiangbei.png", "juese/jiangbei1.png", "juese/jiangbi.png", "main/greenFont.png"], "loadList3D": [] };
            test.shengjiUI = shengjiUI;
            REG("ui.test.shengjiUI", shengjiUI);
            class shengjiEFFUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(shengjiEFFUI.uiView);
                }
            }
            shengjiEFFUI.uiView = { "type": "View", "props": { "width": 100, "height": 100 }, "compId": 2, "child": [{ "type": "SkeletonPlayer", "props": { "y": 50, "x": 50, "var": "sk1", "url": "juese/levelUp.sk", "runtime": "laya.ani.bone.Skeleton" }, "compId": 4 }], "loadList": ["juese/levelUp.sk"], "loadList3D": [] };
            test.shengjiEFFUI = shengjiEFFUI;
            REG("ui.test.shengjiEFFUI", shengjiEFFUI);
            class SkillGridUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(SkillGridUI.uiView);
                }
            }
            SkillGridUI.uiView = { "type": "View", "props": { "width": 287, "height": 446 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "width": 287, "skin": "bg/kapai.png", "sizeGrid": "23,23,24,27", "height": 446 }, "compId": 3 }, { "type": "Label", "props": { "y": 15, "x": 64, "width": 160, "var": "txt", "text": "汉字", "height": 30, "fontSize": 30, "color": "#ffffff", "align": "center" }, "compId": 4 }, { "type": "Box", "props": { "y": 60, "x": 52, "width": 183, "var": "imgBox", "height": 183 }, "compId": 6, "child": [{ "type": "Image", "props": { "y": 91, "x": 91, "var": "img", "skin": "main/kawen.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 11 }] }, { "type": "Label", "props": { "y": 259, "x": 24, "wordWrap": true, "width": 240, "var": "shuoming", "text": "汉字", "height": 162, "fontSize": 30, "color": "#ffffff", "align": "left" }, "compId": 9 }], "loadList": ["bg/kapai.png", "main/kawen.png"], "loadList3D": [] };
            test.SkillGridUI = SkillGridUI;
            REG("ui.test.SkillGridUI", SkillGridUI);
            class StageBgUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(StageBgUI.uiView);
                }
            }
            StageBgUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": -95, "x": 0, "texture": "main/tiaoaa.jpg" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 1334, "x": 0, "texture": "main/tiaoaa.jpg" }, "compId": 4 }, { "type": "Sprite", "props": { "y": -351, "x": 0, "width": 750, "texture": "main/5122.jpg", "height": 256 }, "compId": 5 }, { "type": "Sprite", "props": { "y": 1429, "x": 0, "width": 750, "texture": "main/5122.jpg", "height": 256 }, "compId": 6 }], "loadList": ["main/tiaoaa.jpg", "main/5122.jpg"], "loadList3D": [] };
            test.StageBgUI = StageBgUI;
            REG("ui.test.StageBgUI", StageBgUI);
            class talentUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(talentUI.uiView);
                }
            }
            talentUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334, "centerY": 0 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "runtime": "ui.game.viewbgUI" }, "compId": 29 }, { "type": "Image", "props": { "y": 141, "width": 698, "var": "tianfudi", "skin": "tianfu/tiandi.png", "sizeGrid": "89,0,115,0", "height": 1065, "centerX": 0 }, "compId": 31, "child": [{ "type": "Button", "props": { "y": 923, "x": 360, "width": 250, "var": "shengmingniu", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "41,31,38,33", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 114, "child": [{ "type": "FontClip", "props": { "y": 24, "x": 44, "width": 386, "var": "qianshu", "value": "1299", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 115, "align": "right" }, "compId": 116 }, { "type": "Image", "props": { "y": 24, "x": 158, "skin": "main/dongjin.png" }, "compId": 117 }] }, { "type": "List", "props": { "y": 77, "x": 69, "width": 588, "var": "list", "spaceY": 35, "spaceX": 25, "repeatY": 3, "repeatX": 3, "height": 755 }, "compId": 115, "child": [{ "type": "TianFuCell", "props": { "y": 0, "x": 0, "renderType": "render", "runtime": "ui.test.TianFuCellUI" }, "compId": 118 }] }, { "type": "Box", "props": { "zOrder": 100, "y": 276, "x": 5, "visible": false, "var": "tipBox" }, "compId": 123, "child": [{ "type": "Sprite", "props": { "y": 53, "texture": "tianfu/qipao.png" }, "compId": 124 }, { "type": "Sprite", "props": { "x": 101, "texture": "tianfu/qipaojian.png" }, "compId": 125 }, { "type": "Text", "props": { "y": 86, "x": 9, "width": 287, "var": "txt5", "valign": "middle", "text": "这里是天赋信息", "height": 90, "fontSize": 30, "align": "center", "runtime": "laya.display.Text" }, "compId": 126 }] }, { "type": "Text", "props": { "y": 814.5, "x": 205, "width": 310, "var": "lvTime", "text": "已升级0次", "height": 35, "fontSize": 28, "color": "#482910", "align": "center", "runtime": "laya.display.Text" }, "compId": 129 }] }], "loadList": ["tianfu/tiandi.png", "main/btn_lv.png", "main/clipshuzi.png", "main/dongjin.png", "tianfu/qipao.png", "tianfu/qipaojian.png"], "loadList3D": [] };
            test.talentUI = talentUI;
            REG("ui.test.talentUI", talentUI);
            class TalentCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TalentCellUI.uiView);
                }
            }
            TalentCellUI.uiView = { "type": "View", "props": { "width": 660, "height": 179 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 0, "x": 0 }, "compId": 9, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "var": "b1" }, "compId": 27, "child": [{ "type": "Box", "props": { "y": 27, "x": 212, "width": 66, "var": "xian1", "height": 127 }, "compId": 19, "child": [{ "type": "Image", "props": { "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "height": 126 }, "compId": 23 }, { "type": "Image", "props": { "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "rotation": 90, "height": 59 }, "compId": 24 }, { "type": "Image", "props": { "y": 119, "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "rotation": 90, "height": 59 }, "compId": 25 }] }, { "type": "talent_1", "props": { "var": "t1", "runtime": "ui.test.talent_1UI" }, "compId": 6 }] }, { "type": "Box", "props": { "y": 27, "x": 443, "var": "b2" }, "compId": 26, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "width": 66, "scaleX": -1, "height": 127 }, "compId": 18, "child": [{ "type": "Image", "props": { "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "height": 126 }, "compId": 20 }, { "type": "Image", "props": { "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "rotation": 90, "height": 59 }, "compId": 21 }, { "type": "Image", "props": { "y": 119, "x": 59, "width": 7, "skin": "tianfu/lvtiao.png", "rotation": 90, "height": 59 }, "compId": 22 }] }, { "type": "talent_1", "props": { "y": -27, "x": -18, "var": "t2", "runtime": "ui.test.talent_1UI" }, "compId": 7 }] }, { "type": "Box", "props": { "y": 49.75, "x": 233 }, "compId": 8, "child": [{ "type": "Image", "props": { "y": -0.5, "skin": "tianfu/biaoti.png" }, "compId": 3 }, { "type": "FontClip", "props": { "y": 28.5, "x": 108, "width": 253, "var": "dengji0", "value": "10", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.3, "scaleX": 0.3, "height": 115, "align": "left" }, "compId": 4 }, { "type": "Image", "props": { "y": 24.5, "x": 41, "skin": "main/dengji.png", "scaleY": 0.7, "scaleX": 0.7 }, "compId": 5 }] }] }], "loadList": ["tianfu/lvtiao.png", "tianfu/biaoti.png", "main/clipshuzi.png", "main/dengji.png"], "loadList3D": [] };
            test.TalentCellUI = TalentCellUI;
            REG("ui.test.TalentCellUI", TalentCellUI);
            class TalentViewUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TalentViewUI.uiView);
                }
            }
            TalentViewUI.uiView = { "type": "Dialog", "props": { "width": 750, "isModal": true, "height": 1200 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "centerY": 0, "centerX": 0, "runtime": "ui.game.viewbgUI" }, "compId": 22 }, { "type": "Text", "props": { "y": 857, "x": 241, "var": "l1", "text": "请选择您的天赋", "fontSize": 40, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 9 }, { "type": "TalentZhuan", "props": { "y": 476, "x": 164, "var": "b0", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 10 }, { "type": "TalentZhuan", "props": { "y": 476, "x": 380, "var": "b1", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 16 }, { "type": "TalentZhuan", "props": { "y": 476, "x": 595, "var": "b2", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 17 }, { "type": "TalentZhuan", "props": { "y": 715, "x": 165, "var": "b3", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 18 }, { "type": "TalentZhuan", "props": { "y": 715, "x": 380, "var": "b4", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 19 }, { "type": "TalentZhuan", "props": { "y": 715, "x": 595, "var": "b5", "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.TalentZhuanUI" }, "compId": 20 }, { "type": "Box", "props": { "width": 252, "var": "box1", "height": 166, "centerY": 0, "centerX": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 24, "child": [{ "type": "Image", "props": { "y": 57, "x": -95, "width": 449, "skin": "main/yuanhei.png", "sizeGrid": "0,28,0,30", "height": 64 }, "compId": 37 }, { "type": "Text", "props": { "y": 9, "x": 48.5, "width": 155, "var": "l11", "text": "攻击力", "height": 46, "fontSize": 30, "color": "#ffffff", "align": "center", "runtime": "laya.display.Text" }, "compId": 27 }, { "type": "FontClip", "props": { "y": 75, "x": -131, "width": 697, "var": "f1", "value": "+11.1%", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:%.ab", "scaleY": 0.3, "scaleX": 0.3, "height": 113, "align": "right" }, "compId": 34 }, { "type": "FontClip", "props": { "y": 75, "x": 181, "width": 700, "var": "f2", "value": "+11.1%", "skin": "main/greenFont.png", "sheet": "123456 7890-+ /:%.ab", "scaleY": 0.3, "scaleX": 0.3, "height": 113, "align": "left" }, "compId": 35 }, { "type": "Sprite", "props": { "y": 75, "x": 104.5, "texture": "main/jiantou.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 36 }] }, { "type": "Image", "props": { "y": -8, "var": "nameImg", "skin": "tianfu/gongzi.png", "centerX": 0 }, "compId": 25 }, { "type": "Box", "props": { "x": 301, "bottom": 50 }, "compId": 26, "child": [{ "type": "Text", "props": { "var": "clickClose", "text": "点击关闭", "fontSize": 40, "color": "#ffffff", "runtime": "laya.display.Text" }, "compId": 23 }] }], "loadList": ["main/yuanhei.png", "main/clipshuzi.png", "main/greenFont.png", "main/jiantou.png", "tianfu/gongzi.png"], "loadList3D": [] };
            test.TalentViewUI = TalentViewUI;
            REG("ui.test.TalentViewUI", TalentViewUI);
            class TalentZhuanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TalentZhuanUI.uiView);
                }
            }
            TalentZhuanUI.uiView = { "type": "View", "props": { "width": 175, "height": 212 }, "compId": 2, "child": [{ "type": "TianFuCell", "props": { "y": 0, "x": 175, "var": "back", "scaleX": -1, "runtime": "ui.test.TianFuCellUI" }, "compId": 3 }, { "type": "TianFuCell", "props": { "y": 0, "x": 0, "var": "wenhao", "runtime": "ui.test.TianFuCellUI" }, "compId": 4 }], "loadList": [], "loadList3D": [] };
            test.TalentZhuanUI = TalentZhuanUI;
            REG("ui.test.TalentZhuanUI", TalentZhuanUI);
            class talent_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(talent_1UI.uiView);
                }
            }
            talent_1UI.uiView = { "type": "View", "props": { "width": 231, "height": 179 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 19, "x": 18, "skin": "tianfu/pan.png" }, "compId": 27 }, { "type": "Image", "props": { "y": 22, "x": 23, "width": 186, "var": "wenHao", "skin": "tianfu/dang.jpg", "height": 132 }, "compId": 9 }, { "type": "Box", "props": { "y": 2, "x": 21, "width": 200, "visible": false, "var": "infoBox", "height": 164 }, "compId": 26, "child": [{ "type": "Sprite", "props": { "y": 23.5, "x": 6, "var": "icon", "texture": "tianfu/icon1.jpg" }, "compId": 4 }, { "type": "Image", "props": { "y": 120.5, "x": 5, "width": 184, "var": "tiao2", "skin": "juese/juese_tiaoshang.png", "height": 31 }, "compId": 5 }, { "type": "Label", "props": { "y": 57.5, "x": 103, "width": 89, "var": "jinengming", "text": "技能名", "strokeColor": "#351d03", "stroke": 3, "height": 33, "fontSize": 26, "color": "#f3e9e9", "align": "left" }, "compId": 6 }, { "type": "FontClip", "props": { "y": 125.5, "x": 9, "width": 881, "var": "qianshu2", "value": "1299/1300", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:cdef", "scaleY": 0.2, "scaleX": 0.2, "height": 115, "align": "center" }, "compId": 7 }, { "type": "Image", "props": { "y": 24.5, "x": 182, "var": "sheng", "skin": "main/juese_sheng.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }] }, { "type": "Image", "props": { "y": -1, "x": 0, "width": 231, "visible": false, "var": "select", "skin": "tianfu/xuanzhong1.png", "sizeGrid": "57,40,49,42", "height": 179 }, "compId": 28 }], "loadList": ["tianfu/pan.png", "tianfu/dang.jpg", "tianfu/icon1.jpg", "juese/juese_tiaoshang.png", "main/clipshuzi.png", "main/juese_sheng.png", "tianfu/xuanzhong1.png"], "loadList3D": [] };
            test.talent_1UI = talent_1UI;
            REG("ui.test.talent_1UI", talent_1UI);
            class TestViewUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TestViewUI.uiView);
                }
            }
            TestViewUI.uiView = { "type": "View", "props": { "width": 300, "height": 300 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 81, "x": 74, "width": 93, "var": "box", "pivotY": 47, "pivotX": 47, "height": 93 }, "compId": 5, "child": [{ "type": "Sprite", "props": { "y": 48, "x": 45, "width": 90, "var": "s2", "texture": "main/baoshi2.png", "pivotY": 48, "pivotX": 45, "height": 96 }, "compId": 3 }, { "type": "Sprite", "props": { "y": 48, "x": 45, "width": 90, "var": "s1", "texture": "main/baoshi2.png", "pivotY": 48, "pivotX": 45, "height": 96 }, "compId": 4 }] }], "animations": [{ "nodes": [{ "target": 5, "keyframes": { "y": [{ "value": 81, "tweenMethod": "backIn", "tween": true, "target": 5, "key": "y", "index": 0 }, { "value": 239, "tweenMethod": "linearNone", "tween": false, "target": 5, "key": "y", "index": 40 }], "x": [{ "value": 74, "tweenMethod": "backIn", "tween": true, "target": 5, "key": "x", "index": 0 }, { "value": 236, "tweenMethod": "backIn", "tween": true, "target": 5, "key": "x", "index": 40 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 0 }], "loadList": ["main/baoshi2.png"], "loadList3D": [] };
            test.TestViewUI = TestViewUI;
            REG("ui.test.TestViewUI", TestViewUI);
            class TianFuCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TianFuCellUI.uiView);
                }
            }
            TianFuCellUI.uiView = { "type": "View", "props": { "width": 175, "height": 212 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 13, "x": 12, "var": "bg1", "skin": "tianfu/PTkuang.png" }, "compId": 3 }, { "type": "Sprite", "props": { "y": 28.5, "x": 29, "var": "box2", "texture": "tianfu/touwen.png" }, "compId": 10 }, { "type": "Image", "props": { "y": 0, "x": 0, "width": 175, "var": "select", "skin": "tianfu/xuanzhong1.png", "sizeGrid": "50,50,38,47", "height": 212, "blendMode": "lighter" }, "compId": 13 }, { "type": "Box", "props": { "y": 28.5, "x": 29, "width": 117, "var": "box1", "height": 161 }, "compId": 14, "child": [{ "type": "Image", "props": { "var": "logo1", "skin": "tianfu/gongji.png" }, "compId": 9 }, { "type": "Image", "props": { "y": 123, "var": "txtImg", "skin": "tianfu/gongzi.png", "centerX": 0 }, "compId": 11 }, { "type": "Box", "props": { "y": -39.5, "x": -38, "var": "lvBox" }, "compId": 21, "child": [{ "type": "Sprite", "props": { "y": 0.5, "width": 54, "texture": "tianfu/quan.png", "height": 55 }, "compId": 20 }, { "type": "FontClip", "props": { "y": 14.5, "x": 5, "width": 180, "var": "lv", "value": "99", "spaceX": -3, "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:vbnd", "scaleY": 0.25, "scaleX": 0.25, "height": 113, "align": "center" }, "compId": 12 }] }] }], "loadList": ["tianfu/PTkuang.png", "tianfu/touwen.png", "tianfu/xuanzhong1.png", "tianfu/gongji.png", "tianfu/gongzi.png", "tianfu/quan.png", "main/clipshuzi.png"], "loadList3D": [] };
            test.TianFuCellUI = TianFuCellUI;
            REG("ui.test.TianFuCellUI", TianFuCellUI);
            class tianshiUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(tianshiUI.uiView);
                }
            }
            tianshiUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 133.45000000000002, "x": 0, "skin": "bg/tianshiying.png", "scaleY": 1.09, "scaleX": 1.09, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 6 }, { "type": "Box", "props": { "y": 0, "x": 0 }, "compId": 7, "child": [{ "type": "Image", "props": { "y": -68, "x": -77, "skin": "bg/qipaowen.png", "rotation": -12.15, "anchorY": 0.4, "anchorX": 1 }, "compId": 4 }, { "type": "Image", "props": { "y": -68, "x": 100, "skin": "bg/qipaowen.png", "scaleX": -1, "rotation": 12.15, "anchorY": 0.4, "anchorX": 1 }, "compId": 5 }, { "type": "Image", "props": { "y": -75, "x": -12, "skin": "bg/tianshi.png", "scaleY": 1.3, "scaleX": 1.3, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Image", "props": { "y": -228, "x": -115, "var": "tan", "skin": "bg/tantan.jpg", "scaleY": 1.1, "scaleX": 1.1 }, "compId": 8 }] }], "animations": [{ "nodes": [{ "target": 7, "keyframes": { "y": [{ "value": -133.45000000000002, "tweenMethod": "linearNone", "tween": true, "target": 7, "key": "y", "index": 0 }, { "value": -176, "tweenMethod": "linearNone", "tween": true, "target": 7, "key": "y", "index": 20 }, { "value": -133.45000000000002, "tweenMethod": "linearNone", "tween": true, "target": 7, "label": null, "key": "y", "index": 40 }], "x": [{ "value": -8, "tweenMethod": "linearNone", "tween": true, "target": 7, "key": "x", "index": 0 }] } }, { "target": 6, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "y", "index": 0 }], "x": [{ "value": 2, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "x", "index": 0 }], "scaleY": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 20 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleY", "index": 40 }], "scaleX": [{ "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleX", "index": 20 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 6, "key": "scaleX", "index": 40 }] } }, { "target": 4, "keyframes": { "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "rotation", "index": 0 }, { "value": -27, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "rotation", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "rotation", "index": 40 }] } }, { "target": 5, "keyframes": { "rotation": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 0 }, { "value": 27, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 20 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "rotation", "index": 40 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["bg/tianshiying.png", "bg/qipaowen.png", "bg/tianshi.png", "bg/tantan.jpg"], "loadList3D": [] };
            test.tianshiUI = tianshiUI;
            REG("ui.test.tianshiUI", tianshiUI);
            class tianshi_1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(tianshi_1UI.uiView);
                }
            }
            tianshi_1UI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "x": 0, "width": 750, "height": 1700, "bgColor": "#000000", "alpha": 0.7 }, "compId": 23 }, { "type": "Box", "props": { "width": 681, "var": "box", "height": 900, "centerY": 0, "centerX": 0 }, "compId": 22, "child": [{ "type": "Image", "props": { "width": 681, "skin": "main/biaotilan.png", "sizeGrid": "0,23,0,125", "height": 99 }, "compId": 4 }, { "type": "Box", "props": { "y": 254, "x": 164, "width": 287, "var": "box1", "height": 446, "anchorX": 0.5 }, "compId": 25 }, { "type": "Box", "props": { "y": 254, "x": 496, "width": 287, "var": "box2", "height": 446, "anchorX": 0.5 }, "compId": 26 }, { "type": "Sprite", "props": { "y": 28.5, "x": 142, "texture": "main/qing.png" }, "compId": 27 }, { "type": "Button", "props": { "y": 887, "x": 330, "width": 303, "var": "queding", "stateNum": 1, "skin": "main/btn_lv.png", "sizeGrid": "0,32,0,34", "height": 91, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 30, "child": [{ "type": "Image", "props": { "y": 20.5, "x": 89, "skin": "main/action.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 31 }, { "type": "Image", "props": { "y": 22, "x": 131, "skin": "main/shuaxin.png", "scaleY": 0.6, "scaleX": 0.6 }, "compId": 33 }] }] }], "loadList": ["main/biaotilan.png", "main/qing.png", "main/btn_lv.png", "main/action.png", "main/shuaxin.png"], "loadList3D": [] };
            test.tianshi_1UI = tianshi_1UI;
            REG("ui.test.tianshi_1UI", tianshi_1UI);
            class TimeGoldUI extends Laya.Dialog {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TimeGoldUI.uiView);
                }
            }
            TimeGoldUI.uiView = { "type": "Dialog", "props": { "width": 750, "isModal": true, "height": 1100 }, "compId": 2, "child": [{ "type": "Light", "props": { "y": 481.5, "x": 356, "var": "light", "scaleY": 2, "scaleX": 2, "anchorY": 0.5, "anchorX": 0.5, "runtime": "ui.test.LightUI" }, "compId": 30 }, { "type": "Image", "props": { "y": 37, "x": 34, "width": 682, "skin": "main/fuhuodi2.jpg", "sizeGrid": "128,70,76,66", "height": 931 }, "compId": 3 }, { "type": "Image", "props": { "y": 223, "x": 163, "skin": "timegold/jiangbi.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 7 }, { "type": "Image", "props": { "y": 459, "x": 55, "width": 642, "skin": "main/tishilan.png", "sizeGrid": "28,18,26,20", "height": 406, "alpha": 0.3 }, "compId": 9 }, { "type": "FontClip", "props": { "y": 326, "x": 364, "width": 494, "var": "goldFc", "value": "1000", "spaceX": 0, "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:%.ab", "scaleY": 0.4, "scaleX": 0.4, "height": 113, "align": "center" }, "compId": 10 }, { "type": "Button", "props": { "y": 583, "x": 378, "width": 434, "var": "LingBtn", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,19,0,18", "height": 94, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 11, "child": [{ "type": "Sprite", "props": { "y": 17, "x": 62, "texture": "timegold/shenglilingqu.png" }, "compId": 13 }, { "type": "FontClip", "props": { "y": 17, "x": 155, "width": 343, "var": "btn1Fc", "value": "9999", "skin": "main/clipshuzi.png", "sheet": "123456 7890ab cdef", "scaleY": 0.4, "scaleX": 0.4, "height": 113, "align": "center" }, "compId": 14 }, { "type": "Sprite", "props": { "y": 13, "x": 298.5, "texture": "main/jinbi.png" }, "compId": 31 }] }, { "type": "Button", "props": { "y": 732, "x": 380, "width": 439, "var": "AdLingBtn", "stateNum": 1, "skin": "main/btn_zi.png", "sizeGrid": "0,31,0,36", "height": 94, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 15, "child": [{ "type": "FontClip", "props": { "y": 18, "x": 153, "width": 352, "var": "btn2Fc", "value": "9999", "spaceX": -4, "skin": "main/clipshuzi.png", "sheet": "123456 7890ab cdefg", "scaleY": 0.4, "scaleX": 0.4, "height": 113, "align": "center" }, "compId": 17 }, { "type": "Sprite", "props": { "y": 4.5, "x": 79, "texture": "main/action.png" }, "compId": 32 }, { "type": "Sprite", "props": { "y": 14, "x": 299.5, "texture": "main/jinbi.png" }, "compId": 33 }] }, { "type": "Button", "props": { "y": 45.5, "x": 617, "width": 80, "var": "guanbi", "stateNum": 1, "skin": "main/btn_guanbi.png", "name": "close", "height": 80 }, "compId": 21 }, { "type": "Text", "props": { "y": 205, "x": 300, "text": "您赚取了", "fontSize": 36, "color": "#ffffff", "bold": true, "runtime": "laya.display.Text" }, "compId": 22 }, { "type": "Image", "props": { "y": 68, "x": 248, "skin": "timegold/biaoti_jinbi.png" }, "compId": 29 }, { "type": "chengsan", "props": { "y": 619, "x": 497, "var": "v3bei", "runtime": "ui.test.chengsanUI" }, "compId": 34 }], "loadList": ["main/fuhuodi2.jpg", "timegold/jiangbi.png", "main/tishilan.png", "main/clipshuzi.png", "main/btn_huang.png", "timegold/shenglilingqu.png", "main/jinbi.png", "main/btn_zi.png", "main/action.png", "main/btn_guanbi.png", "timegold/biaoti_jinbi.png"], "loadList3D": [] };
            test.TimeGoldUI = TimeGoldUI;
            REG("ui.test.TimeGoldUI", TimeGoldUI);
            class TimeLogoUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TimeLogoUI.uiView);
                }
            }
            TimeLogoUI.uiView = { "type": "View", "props": { "width": 140, "height": 161 }, "compId": 2, "child": [{ "type": "Button", "props": { "y": 0, "x": -1, "width": 140, "var": "goldBtn", "stateNum": 1, "skin": "main/guanjikuang.png", "sizeGrid": "24,20,27,22", "height": 161 }, "compId": 3, "child": [{ "type": "FontClip", "props": { "y": 121, "x": 9, "width": 621, "var": "goldFc", "value": "10000", "spaceX": -4, "skin": "main/clipshuzi.png", "sheet": "123456 7890ab cdefg", "scaleY": 0.2, "scaleX": 0.2, "height": 113, "align": "center" }, "compId": 6 }, { "type": "Box", "props": { "width": 119, "var": "shanbox", "top": 0, "right": 0, "left": 0, "height": 161, "bottom": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 12 }, { "type": "Image", "props": { "y": 48.5, "skin": "main/heiBG.png", "centerX": 0 }, "compId": 15 }, { "type": "Image", "props": { "y": 51.5, "skin": "main/jinbi.png", "centerX": 0 }, "compId": 5 }, { "type": "FontClip", "props": { "y": 18, "x": 15, "width": 540, "var": "timeFc", "value": "11:11", "skin": "main/clipshuzi.png", "sheet": "123456 7890-+ /:%.ab", "scaleY": 0.2, "scaleX": 0.2, "height": 113, "align": "center" }, "compId": 16 }] }], "loadList": ["main/guanjikuang.png", "main/clipshuzi.png", "main/heiBG.png", "main/jinbi.png"], "loadList3D": [] };
            test.TimeLogoUI = TimeLogoUI;
            REG("ui.test.TimeLogoUI", TimeLogoUI);
            class worldUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(worldUI.uiView);
                }
            }
            worldUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "viewbg", "props": { "runtime": "ui.game.viewbgUI" }, "compId": 26 }, { "type": "Box", "props": { "y": 141, "x": 0, "width": 750, "var": "box", "height": 1093 }, "compId": 24 }, { "type": "Box", "props": { "y": 158, "x": 22, "width": 705, "var": "box1", "height": 396 }, "compId": 40, "child": [{ "type": "TimeLogo", "props": { "zOrder": 100, "y": 30, "x": 559.2, "var": "timeLogo", "runtime": "ui.test.TimeLogoUI" }, "compId": 27 }, { "type": "Button", "props": { "zOrder": 100, "y": 277, "x": 63.2, "var": "rankBtn", "stateNum": 1, "skin": "main/btn_paihang.png", "scaleY": 0.8, "scaleX": 0.8, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 33 }, { "type": "Button", "props": { "zOrder": 100, "y": 277, "x": 638.2, "var": "sign7Btn", "stateNum": 1, "skin": "main/btn_qiandao.png", "scaleY": 0.8, "scaleX": 0.8, "gray": true, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 34 }, { "type": "Button", "props": { "zOrder": 100, "y": 86, "x": 63.2, "var": "shareBtn", "stateNum": 1, "skin": "main/btn_fenxiang.png", "scaleY": 0.8, "scaleX": 0.8, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 35 }, { "type": "Sprite", "props": { "zOrder": 101, "y": 223, "x": 608.2, "texture": "main/suo2.png", "scaleY": 0.8, "scaleX": 0.8 }, "compId": 39 }] }], "loadList": ["main/btn_paihang.png", "main/btn_qiandao.png", "main/btn_fenxiang.png", "main/suo2.png"], "loadList3D": [] };
            test.worldUI = worldUI;
            REG("ui.test.worldUI", worldUI);
            class worldCellUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(worldCellUI.uiView);
                }
            }
            worldCellUI.uiView = { "type": "View", "props": { "width": 750, "height": 900 }, "compId": 2, "child": [{ "type": "Box", "props": { "y": 894, "x": 11, "width": 739 }, "compId": 27, "child": [{ "type": "Sprite", "props": { "texture": "main/xuxian.png" }, "compId": 10 }, { "type": "Sprite", "props": { "x": 50, "texture": "main/xuxian.png" }, "compId": 12 }, { "type": "Sprite", "props": { "x": 100, "texture": "main/xuxian.png" }, "compId": 13 }, { "type": "Sprite", "props": { "x": 150, "texture": "main/xuxian.png" }, "compId": 14 }, { "type": "Sprite", "props": { "x": 200, "texture": "main/xuxian.png" }, "compId": 15 }, { "type": "Sprite", "props": { "x": 250, "texture": "main/xuxian.png" }, "compId": 16 }, { "type": "Sprite", "props": { "x": 300, "texture": "main/xuxian.png" }, "compId": 17 }, { "type": "Sprite", "props": { "x": 350, "texture": "main/xuxian.png" }, "compId": 18 }, { "type": "Sprite", "props": { "x": 400, "texture": "main/xuxian.png" }, "compId": 19 }, { "type": "Sprite", "props": { "x": 450, "texture": "main/xuxian.png" }, "compId": 20 }, { "type": "Sprite", "props": { "x": 500, "texture": "main/xuxian.png" }, "compId": 21 }, { "type": "Sprite", "props": { "x": 550, "texture": "main/xuxian.png" }, "compId": 22 }, { "type": "Sprite", "props": { "x": 600, "texture": "main/xuxian.png" }, "compId": 23 }, { "type": "Sprite", "props": { "x": 650, "texture": "main/xuxian.png" }, "compId": 24 }, { "type": "Sprite", "props": { "x": 700, "texture": "main/xuxian.png" }, "compId": 28 }] }, { "type": "Box", "props": { "y": 93, "x": 176 }, "compId": 30, "child": [{ "type": "Image", "props": { "skin": "main/changhong.png" }, "compId": 4 }, { "type": "Image", "props": { "y": 8, "x": 128, "width": 139, "var": "titleTxt", "height": 39 }, "compId": 7 }] }, { "type": "Image", "props": { "y": 184.5, "x": -17, "var": "noOpenImg", "skin": "chapters/wait.png", "scaleY": 1.2, "scaleX": 1.2 }, "compId": 34 }, { "type": "Box", "props": { "y": 208, "x": 40.5, "width": 680, "var": "openBox", "height": 656 }, "compId": 36, "child": [{ "type": "Button", "props": { "y": 355, "x": 342, "width": 684, "var": "mapBtn", "stateNum": 1, "skin": "chapters/chapter_img_1.png", "height": 531, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Image", "props": { "y": 364, "x": 341, "var": "suo", "skin": "main/suo2.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 8 }, { "type": "Image", "props": { "x": 203, "width": 288, "var": "box1", "skin": "main/yuanhei.png", "sizeGrid": "0,28,0,30", "height": 64 }, "compId": 31, "child": [{ "type": "Label", "props": { "y": 0, "x": 1, "width": 286, "var": "cengshuTxt", "valign": "middle", "text": "最高层数", "height": 64, "fontSize": 36, "color": "#f6ecec", "align": "center" }, "compId": 32 }] }, { "type": "Box", "props": { "y": 158, "x": 171, "width": 345, "var": "clickBox", "height": 373 }, "compId": 33 }] }], "loadList": ["main/xuxian.png", "main/changhong.png", "chapters/wait.png", "chapters/chapter_img_1.png", "main/suo2.png", "main/yuanhei.png"], "loadList3D": [] };
            test.worldCellUI = worldCellUI;
            REG("ui.test.worldCellUI", worldCellUI);
            class xiaodaoUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(xiaodaoUI.uiView);
                }
            }
            xiaodaoUI.uiView = { "type": "Scene", "props": { "width": 684, "height": 531 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "dao", "skin": "main/erdao.png" }, "compId": 3 }], "loadList": ["main/erdao.png"], "loadList3D": [] };
            test.xiaodaoUI = xiaodaoUI;
            REG("ui.test.xiaodaoUI", xiaodaoUI);
            class xiongmaoUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(xiongmaoUI.uiView);
                }
            }
            xiongmaoUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": 125, "x": 17, "width": 120, "texture": "bg/tianshiying.png", "height": 58 }, "compId": 4 }, { "type": "Image", "props": { "y": 2.6666666666666665, "x": -1, "skin": "xiongmao/5.png" }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "y": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }, { "value": -0.25, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 3 }, { "value": -0.16666666666666674, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 6 }, { "value": 0.4166666666666665, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 9 }, { "value": 0.2777777777777777, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 10 }, { "value": 0.6388888888888888, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 11 }, { "value": 3, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 12 }, { "value": 2.3333333333333335, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 13 }, { "value": 2.6666666666666665, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 14 }, { "value": -5, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 15 }, { "value": -4.666666666666667, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 16 }, { "value": -4.833333333333334, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 17 }, { "value": -7, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 18 }, { "value": -8, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 21 }, { "value": -7.5, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 24 }, { "value": -7.333333333333334, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 25 }, { "value": -7.166666666666667, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 26 }, { "value": -1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 27 }], "x": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 0 }, { "value": 0.33333333333333326, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 1 }, { "value": 1.166666666666667, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 2 }, { "value": 4, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 3 }, { "value": 3.333333333333333, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 6 }, { "value": 3.166666666666666, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 9 }, { "value": 2.7777777777777777, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 10 }, { "value": 2.888888888888889, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 11 }, { "value": -1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "x", "index": 12 }], "skin": [{ "value": "xiongmao/1.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 0 }, { "value": "xiongmao/2.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 3 }, { "value": "xiongmao/3.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 6 }, { "value": "xiongmao/4.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 9 }, { "value": "xiongmao/5.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 12 }, { "value": "xiongmao/6.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 15 }, { "value": "xiongmao/7.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 18 }, { "value": "xiongmao/8.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 21 }, { "value": "xiongmao/9.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 24 }, { "value": "xiongmao/10.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 27 }, { "value": "xiongmao/11.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 30 }, { "value": "xiongmao/12.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 33 }, { "value": "xiongmao/13.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 36 }, { "value": "xiongmao/14.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 39 }, { "value": "xiongmao/15.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 42 }, { "value": "xiongmao/16.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 45 }, { "value": "xiongmao/17.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 48 }, { "value": "xiongmao/18.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 51 }, { "value": "xiongmao/19.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 54 }, { "value": "xiongmao/20.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 57 }, { "value": "xiongmao/21.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 60 }, { "value": "xiongmao/22.png", "tweenMethod": "linearNone", "tween": false, "target": 3, "key": "skin", "index": 63 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 2 }], "loadList": ["bg/tianshiying.png", "xiongmao/5.png", "xiongmao/1.png", "xiongmao/2.png", "xiongmao/3.png", "xiongmao/4.png", "xiongmao/6.png", "xiongmao/7.png", "xiongmao/8.png", "xiongmao/9.png", "xiongmao/10.png", "xiongmao/11.png", "xiongmao/12.png", "xiongmao/13.png", "xiongmao/14.png", "xiongmao/15.png", "xiongmao/16.png", "xiongmao/17.png", "xiongmao/18.png", "xiongmao/19.png", "xiongmao/20.png", "xiongmao/21.png", "xiongmao/22.png"], "loadList3D": [] };
            test.xiongmaoUI = xiongmaoUI;
            REG("ui.test.xiongmaoUI", xiongmaoUI);
            class xiongmao1UI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(xiongmao1UI.uiView);
                }
            }
            xiongmao1UI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Sprite", "props": { "y": -33.5, "x": -72, "texture": "bg/tianshiying.png" }, "compId": 5 }, { "type": "Sprite", "props": { "y": -161, "x": -72, "texture": "bg/xiongmao.png" }, "compId": 4 }], "loadList": ["bg/tianshiying.png", "bg/xiongmao.png"], "loadList3D": [] };
            test.xiongmao1UI = xiongmao1UI;
            REG("ui.test.xiongmao1UI", xiongmao1UI);
            class yixuanzeUI extends Laya.Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(yixuanzeUI.uiView);
                }
            }
            yixuanzeUI.uiView = { "type": "Scene", "props": { "width": 300, "height": 150 }, "compId": 2, "child": [{ "type": "Image", "props": { "y": 75, "x": 150, "skin": "juese/juese_yixuanze.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }], "animations": [{ "nodes": [{ "target": 3, "keyframes": { "y": [{ "value": 75, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "y", "index": 0 }], "scaleY": [{ "value": 3, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 5 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 9 }, { "value": 0.9, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 12 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 15 }], "scaleX": [{ "value": 3, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 5 }, { "value": 1.1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 9 }, { "value": 0.9, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 12 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 15 }], "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 5 }] } }], "name": "ani1", "id": 1, "frameRate": 24, "action": 1 }], "loadList": ["juese/juese_yixuanze.png"], "loadList3D": [] };
            test.yixuanzeUI = yixuanzeUI;
            REG("ui.test.yixuanzeUI", yixuanzeUI);
            class zhaohuanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(zhaohuanUI.uiView);
                }
            }
            zhaohuanUI.uiView = { "type": "View", "props": {}, "compId": 2, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "zhaohuan/yuandi.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Image", "props": { "y": 8, "x": 0, "skin": "zhaohuan/yun.png", "anchorY": 0.5, "anchorX": 0.5 }, "compId": 4 }, { "type": "Image", "props": { "y": 17, "x": -2, "skin": "zhaohuan/guangzhu.png", "anchorY": 1, "anchorX": 0.5 }, "compId": 5 }], "animations": [{ "nodes": [{ "target": 5, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleY", "index": 0 }, { "value": 4, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleY", "index": 5 }, { "value": 4, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleY", "index": 15 }, { "value": 4, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "scaleY", "index": 18 }], "scaleX": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleX", "index": 0 }, { "value": 0.2, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleX", "index": 5 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "scaleX", "index": 15 }, { "value": 0.8, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "scaleX", "index": 18 }], "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 15 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 5, "label": null, "key": "alpha", "index": 18 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 5, "key": "alpha", "index": 24 }] } }, { "target": 4, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleY", "index": 0 }, { "value": 1.5, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleY", "index": 29 }], "scaleX": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleX", "index": 0 }, { "value": 1.5, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "scaleX", "index": 29 }], "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 8 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 4, "label": null, "key": "alpha", "index": 15 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 4, "key": "alpha", "index": 25 }] } }, { "target": 3, "keyframes": { "scaleY": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleY", "index": 15 }], "scaleX": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 0 }, { "value": 1.2, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "scaleX", "index": 15 }], "alpha": [{ "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 0 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 8 }, { "value": 1, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 15 }, { "value": 0, "tweenMethod": "linearNone", "tween": true, "target": 3, "key": "alpha", "index": 22 }] } }], "name": "ani1", "id": 1, "frameRate": 60, "action": 1 }], "loadList": ["zhaohuan/yuandi.png", "zhaohuan/yun.png", "zhaohuan/guangzhu.png"], "loadList3D": [] };
            test.zhaohuanUI = zhaohuanUI;
            REG("ui.test.zhaohuanUI", zhaohuanUI);
            class zhuanpanUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(zhuanpanUI.uiView);
                }
            }
            zhuanpanUI.uiView = { "type": "View", "props": { "width": 750, "height": 1334 }, "compId": 2, "child": [{ "type": "Box", "props": { "alpha": 0.6 }, "compId": 21, "child": [{ "type": "Rect", "props": { "width": 750, "lineWidth": 1, "height": 1700, "fillColor": "#000000" }, "compId": 22 }] }, { "type": "Box", "props": { "x": 12, "centerY": 0 }, "compId": 20, "child": [{ "type": "Image", "props": { "width": 726, "skin": "main/biaotihuang.png", "sizeGrid": "0,23,0,135", "height": 99 }, "compId": 4 }, { "type": "Sprite", "props": { "y": 32, "x": 279, "texture": "bg/xingyunda.png" }, "compId": 8 }, { "type": "Image", "props": { "y": 497, "x": 354, "var": "pan", "skin": "bg/zhuanpan2.png", "rotation": 31, "anchorY": 0.49, "anchorX": 0.505 }, "compId": 9 }, { "type": "Image", "props": { "y": 269, "x": 353, "var": "zhen", "skin": "bg/zhen.png", "rotation": 0, "anchorY": 0.4, "anchorX": 0.5 }, "compId": 10 }, { "type": "Button", "props": { "y": 1035, "x": 357, "width": 296, "var": "btn_kaishi", "stateNum": 1, "skin": "main/btn_huang.png", "sizeGrid": "0,22,0,22", "height": 157, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 11, "child": [{ "type": "Image", "props": { "y": 43, "x": 98, "skin": "main/kaishi.png" }, "compId": 13 }] }, { "type": "Image", "props": { "y": 550, "x": 249, "var": "pan4", "skin": "bg/zhuan_baoji.png", "rotation": -122, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 14 }, { "type": "Image", "props": { "y": 385, "x": 353, "var": "pan0", "skin": "bg/zhuan_qiansan.png", "rotation": 0, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 15 }, { "type": "Image", "props": { "y": 438, "x": 460, "var": "pan1", "skin": "bg/zhuan_qianer.png", "rotation": 60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 16 }, { "type": "Image", "props": { "y": 438, "x": 249, "var": "pan5", "skin": "bg/zhuan_qianyi.png", "rotation": -60, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 17 }, { "type": "Image", "props": { "y": 609, "x": 353, "var": "pan3", "skin": "bg/zhuan_xixue.png", "rotation": 180, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 18 }, { "type": "Image", "props": { "y": 556, "x": 458, "var": "pan2", "skin": "bg/zhuan_jiaxue.png", "rotation": 120, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 19 }] }], "loadList": ["main/biaotihuang.png", "bg/xingyunda.png", "bg/zhuanpan2.png", "bg/zhen.png", "main/btn_huang.png", "main/kaishi.png", "bg/zhuan_baoji.png", "bg/zhuan_qiansan.png", "bg/zhuan_qianer.png", "bg/zhuan_qianyi.png", "bg/zhuan_xixue.png", "bg/zhuan_jiaxue.png"], "loadList3D": [] };
            test.zhuanpanUI = zhuanpanUI;
            REG("ui.test.zhuanpanUI", zhuanpanUI);
            class ZongjuUI extends Laya.View {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(ZongjuUI.uiView);
                }
            }
            ZongjuUI.uiView = { "type": "View", "props": { "width": 0, "height": 0 }, "compId": 2, "child": [{ "type": "Clip", "props": { "y": 0, "x": 0, "var": "shudianju", "skin": "bg/clip_dianjushu.png", "scaleY": 1.2, "scaleX": 1.2, "clipY": 3, "clipX": 3, "anchorY": 0.5, "anchorX": 0.5 }, "compId": 3 }, { "type": "Clip", "props": { "y": -107, "x": 12, "width": 58, "var": "shuhuoxing", "skin": "bg/clip_huoxing.png", "rotation": 62, "height": 48, "clipY": 2, "clipX": 3, "autoPlay": true }, "compId": 4 }], "loadList": ["bg/clip_dianjushu.png", "bg/clip_huoxing.png"], "loadList3D": [] };
            test.ZongjuUI = ZongjuUI;
            REG("ui.test.ZongjuUI", ZongjuUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class ShakeUtils {
        constructor() {
            this.startPo = new Laya.Point();
            this.flag = false;
            this.arr = [-1, -1, -1, 1, 1, 1, 1, -1];
            this.now = 0;
            this.nowIndex = 0;
        }
        static setShakeUI(ani, box) {
            ShakeUtils.shake.shakeAni = ani;
            ShakeUtils.shake.shakeBox = box;
        }
        static execute(sp, time, moveLen) {
            ShakeUtils.shake.exe(sp, time, moveLen);
        }
        static execute2(sp, time, rotateNum) {
            ShakeUtils.shake.exe2(sp, time, rotateNum);
        }
        exe2(sp, delay, rotateNum) {
            this.flag = false;
            this.rotateNum = rotateNum;
            this.sp = sp;
            Laya.timer.loop(delay, this, this.loopFun2);
            this.now = 0;
        }
        loopFun2() {
            if (this.rotateNum <= 0) {
                Laya.timer.clear(this, this.loopFun2);
                this.sp.rotation = 0;
                this.sp = null;
                return;
            }
            this.flag = !this.flag;
            this.rotateNum--;
            this.sp.rotation = this.rotateNum * (this.flag ? -1 : 1);
        }
        exe(sp, time, moveLen) {
            this.moveLen = moveLen;
            this.time = time;
            this.sp = sp;
            this.startPo.setTo(sp.x, sp.y);
            Laya.timer.clear(this, this.loopFun);
            Laya.timer.frameLoop(1, this, this.loopFun);
            this.startTime = Laya.Browser.now();
            this.now = 0;
        }
        loopFun() {
            if ((Laya.Browser.now() - this.startTime) > this.time) {
                Laya.timer.clear(this, this.loopFun);
                this.sp.pos(this.startPo.x, this.startPo.y);
                this.sp = null;
                return;
            }
            if (this.now >= this.arr.length) {
                this.now = 0;
            }
            this.sp.pos(this.startPo.x + this.arr[this.now] * this.moveLen, this.startPo.y + this.arr[this.now + 1] * this.moveLen);
            this.now += 2;
        }
        static shakeByUI(sp) {
            ShakeUtils.shake.exeByUI(sp);
        }
        exeByUI(sp) {
            this.sp = sp;
            this.startPo.setTo(sp.x, sp.y);
            Laya.timer.frameLoop(1, this, this.enterFun);
        }
        enterFun() {
            if (this.nowIndex >= this.shakeAni.count) {
                this.stopShakeByUI();
                return;
            }
            this.shakeAni.index = this.nowIndex;
            this.sp.pos(this.startPo.x + this.shakeBox.x, this.startPo.y + this.shakeBox.y);
            this.nowIndex++;
        }
        stopShakeByUI() {
            this.sp.pos(this.startPo.x, this.startPo.y);
            Laya.timer.clear(this, this.enterFun);
            this.nowIndex = 0;
        }
    }
    ShakeUtils.shake = new ShakeUtils();

    class DateUtils {
        constructor() {
        }
        static getFormatBySecond(second, type = 1) {
            var str = "";
            switch (type) {
                case 1:
                    str = DateUtils.getFormatBySecond1(second);
                    break;
                case 2:
                    str = DateUtils.getFormatBySecond2(second);
                    break;
                case 3:
                    str = DateUtils.getFormatBySecond3(second);
                    break;
                case 4:
                    str = DateUtils.getFormatBySecond4(second);
                    break;
                case 5:
                    str = DateUtils.getFormatBySecond5(second);
                    break;
            }
            return str;
        }
        static getFormatBySecond1(t = 0) {
            var hourst = Math.floor(t / 3600);
            var hours;
            if (hourst == 0) {
                hours = "00";
            }
            else {
                if (hourst < 10)
                    hours = "0" + hourst;
                else
                    hours = "" + hourst;
            }
            var minst = Math.floor((t - hourst * 3600) / 60);
            var secondt = Math.floor((t - hourst * 3600) % 60);
            var mins;
            var sens;
            if (minst == 0) {
                mins = "00";
            }
            else if (minst < 10) {
                mins = "0" + minst;
            }
            else {
                mins = "" + minst;
            }
            if (secondt == 0) {
                sens = "00";
            }
            else if (secondt < 10) {
                sens = "0" + secondt;
            }
            else {
                sens = "" + secondt;
            }
            return hours + ":" + mins + ":" + sens;
        }
        static getFormatBySecond3(t = 0) {
            var hourst = Math.floor(t / 3600);
            var minst = Math.floor((t - hourst * 3600) / 60);
            var secondt = Math.floor((t - hourst * 3600) % 60);
            var mins;
            var sens;
            if (minst == 0) {
                mins = "00";
            }
            else if (minst < 10) {
                mins = "0" + minst;
            }
            else {
                mins = "" + minst;
            }
            if (secondt == 0) {
                sens = "00";
            }
            else if (secondt < 10) {
                sens = "0" + secondt;
            }
            else {
                sens = "" + secondt;
            }
            return mins + ":" + sens;
        }
        static getFormatBySecond2(time) {
            var date = new Date(time);
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hours = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
        }
        static getFormatBySecond4(time) {
            var t = Math.floor(time / 3600);
            if (t > 0) {
                if (t > 24) {
                    return Math.floor(t / 24) + "天前";
                }
                else {
                    return t + "小时前";
                }
            }
            else {
                return Math.floor(time / 60) + "分钟前";
            }
        }
        static getFormatBySecond5(time) {
            var oneDay = 3600 * 24;
            var oneHourst = 3600;
            var oneMinst = 60;
            var days = Math.floor(time / oneDay);
            var hourst = Math.floor(time % oneDay / oneHourst);
            var minst = Math.floor((time - hourst * oneHourst) / oneMinst);
            var secondt = Math.floor((time - hourst * oneHourst) % oneMinst);
            var dayss = "";
            var hourss = "";
            var minss = "";
            var secss = "";
            if (time > 0) {
                if (days == 0) {
                    dayss = "";
                    if (hourst == 0) {
                        hourss = "";
                        if (minst == 0) {
                            minss = "";
                            if (secondt == 0) {
                                secss = "";
                            }
                            else if (secondt < 10) {
                                secss = "0" + secondt + "秒";
                            }
                            else {
                                secss = "" + secondt + "秒";
                            }
                            return secss;
                        }
                        else {
                            minss = "" + minst + "分";
                            if (secondt == 0) {
                                secss = "";
                            }
                            else if (secondt < 10) {
                                secss = "0" + secondt + "秒";
                            }
                            else {
                                secss = "" + secondt + "秒";
                            }
                        }
                        return minss + secss;
                    }
                    else {
                        hourss = hourst + "小时";
                        if (minst == 0) {
                            minss = "";
                            if (secondt == 0) {
                                secss = "";
                            }
                            else if (secondt < 10) {
                                secss = "0" + secondt + "秒";
                            }
                            else {
                                secss = "" + secondt + "秒";
                            }
                            return secss;
                        }
                        else if (minst < 10) {
                            minss = "0" + minst + "分";
                        }
                        else {
                            minss = "" + minst + "分";
                        }
                        return hourss + minss;
                    }
                }
                else {
                    dayss = days + "天";
                    if (hourst == 0) {
                        hourss = "";
                    }
                    else {
                        if (hourst < 10)
                            hourss = "0" + hourst + "小时";
                        else
                            hourss = "" + hourst + "小时";
                    }
                    return dayss + hourss;
                }
            }
            return "";
        }
    }

    class SysHero {
        constructor() {
            this.id = 0;
            this.roleExp = 0;
            this.blueDiamond = 0;
            this.redDiamond = 0;
            this.gold = 0;
        }
        static getNewLv(exp) {
            let oldExp = Session.homeData.playerExp;
            let oldLv = Session.homeData.playerLv;
            let newExp = oldExp + exp;
            let newLv = oldLv;
            while (true) {
                let sys = App.tableManager.getDataByNameAndId(SysHero.NAME, oldLv);
                if (newExp >= sys.roleExp) {
                    let nowLv = oldLv + 1;
                    if (App.tableManager.getDataByNameAndId(SysHero.NAME, oldLv) == null) {
                        break;
                    }
                    newLv = nowLv;
                    newExp -= sys.roleExp;
                }
                else {
                    break;
                }
            }
            console.log("加经验后的等级", newLv, newExp);
            return [newLv, newExp];
        }
    }
    SysHero.NAME = 'sys_hero.txt';

    class MyEffect {
        constructor() {
        }
        static light(sp) {
            let obj = {};
            obj.v = 100;
            let t = new Laya.Tween();
            let f = new Laya.ColorFilter();
            let farr = [f];
            t.to(obj, { v: 0, update: new Laya.Handler(null, () => {
                    f.reset();
                    f.adjustBrightness(obj.v);
                    sp.filters = farr;
                }) }, 1000);
        }
        static rotation(a, time = 100) {
            let t = new Laya.Tween();
            t.repeat = 0;
            a.once(Laya.Event.DISPLAY, null, () => {
                t.to(a, { rotation: 360 }, time);
            });
            a.once(Laya.Event.UNDISPLAY, null, () => {
                Laya.Tween.clearTween(a);
            });
        }
        static initBtnEffect() {
            Laya.stage.on(Laya.Event.CLICK, null, MyEffect.clickFun);
        }
        static clickFun(e) {
            if (e.target instanceof Laya.Button) {
                if (e.target.anchorX == 0.5 && e.target.anchorY == 0.5) {
                    MyEffect.clickEffect(e.target);
                }
            }
        }
        static clickEffect(sp) {
            let t = new Laya.Tween();
            let s = ((sp.scaleX > 0) ? 1 : -1);
            t.from(sp, { scaleX: 0.9 * s, scaleY: 0.9 }, 80);
        }
        static hide(e, time = 500) {
            let t = new Laya.Tween();
            t.to(e, { alpha: 0 }, time);
        }
        static show(e, time = 500) {
            let t = new Laya.Tween();
            t.to(e, { alpha: 1 }, time);
        }
        static flash(e, time = 500) {
            e.alpha = 0;
            let t = new Laya.TimeLine();
            t.to(e, { alpha: 1 }, time);
            t.to(e, { alpha: 0 }, time);
            t.play(0, true);
            MyEffect.clearTween(e);
        }
        static clearTween(e) {
            e.once(Laya.Event.UNDISPLAY, null, () => {
                Laya.Tween.clearAll(e);
            });
        }
        static scaleEffect(sp) {
            let t = new Laya.TimeLine();
            t.to(sp, { scaleX: 0.7, scaleY: 0.7 }, 100);
            t.to(sp, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.backOut);
            t.play();
        }
        static bigSmall(sp, big, small) {
            let t = new Laya.TimeLine();
            t.to(sp, { scaleX: big, scaleY: big }, 100);
            t.to(sp, { scaleX: small, scaleY: small }, 300, Laya.Ease.backOut);
            t.play();
        }
        static popup(v, s, time, delay) {
            let t = new Laya.Tween();
            v.scale(0, 0);
            t.to(v, { scaleX: s, scaleY: s }, time, Laya.Ease.backOut, null, delay);
        }
    }

    class GuideManager {
        constructor() {
            this.handMv = new ui.test.newhand1UI();
            this.maskLayer = new Laya.Box();
            this.target = null;
            this.nextStat = 0;
            this.autoStop = false;
            this.maskLayer = new Laya.Box();
            this.maskLayer.size(Laya.stage.width, Laya.stage.height);
            this.maskLayer.mouseThrough = false;
            this.maskLayer.zOrder = 1000000;
            this.maskLayer.mouseEnabled = true;
        }
        static getInstance() {
            if (GuideManager.g == null) {
                GuideManager.g = new GuideManager();
            }
            return GuideManager.g;
        }
        hand(target, x = 0, y = 0, nextStat, delay = 0, autoStop = false) {
            Laya.timer.once(delay, this, () => {
                this.autoStop = autoStop;
                this.target = target;
                this.nextStat = nextStat;
                this.handMv.visible = true;
                Laya.stage.addChild(this.handMv);
                this.handMv.zOrder = 1000;
                let p = target.localToGlobal(new Laya.Point(0, 0));
                this.handMv.pos(p.x + x, p.y + y);
                this.handMv.lightClip.interval = 1000 / 15;
                this.handMv.lightClip.play();
                this.handMv.ani1.interval = 1000 / 10;
                this.handMv.ani1.play(0, true);
                Laya.stage.on(Laya.Event.CLICK, this, this.clickFun);
                Laya.stage.addChild(this.maskLayer);
            });
        }
        clickFun(e) {
            let r = this.target.getBounds();
            let p = this.target.localToGlobal(new Laya.Point(0, 0));
            let r1 = new Laya.Rectangle(p.x, p.y, r.width, r.height);
            let cc = r1.contains(Laya.stage.mouseX, Laya.stage.mouseY);
            if (cc) {
                Session.homeData.newStat = this.nextStat;
                Log.log(1000 + this.nextStat);
                Session.saveData();
                this.target.event(Laya.Event.CLICK, e);
                this.handMv.visible = false;
                if (this.autoStop) {
                    this.removeMask();
                }
            }
        }
        removeMask() {
            this.maskLayer.removeSelf();
        }
    }
    GuideManager.g = null;
    var Guide_Type;
    (function (Guide_Type) {
        Guide_Type[Guide_Type["click_talent"] = 1] = "click_talent";
        Guide_Type[Guide_Type["talent_lv_up"] = 2] = "talent_lv_up";
        Guide_Type[Guide_Type["select_talent"] = 3] = "select_talent";
        Guide_Type[Guide_Type["open_role"] = 4] = "open_role";
        Guide_Type[Guide_Type["click_hp"] = 5] = "click_hp";
        Guide_Type[Guide_Type["over"] = 6] = "over";
    })(Guide_Type || (Guide_Type = {}));

    class SysRoleBase {
        constructor() {
            this.id = 0;
            this.roleName = "";
            this.baseAtk = 0;
            this.baseHp = 0;
            this.baseSpeed = 0;
            this.baseCrit = 0;
            this.baseCritHurt = 0;
            this.baseDodge = 0;
            this.baseMove = 0;
            this.baseSkill = 0;
            this.addExp = 0;
            this.addSpeed = 0;
            this.addAttack = 0;
            this.roleLimt = 0;
            this.videoLock = 0;
        }
        static getSys(id) {
            let arr = App.tableManager.getTable(SysRoleBase.NAME);
            for (let k of arr) {
                if (k.id == id) {
                    return k;
                }
            }
            return null;
        }
        getValue(v) {
            if (v == HeroLvType.ATK) {
                return this.baseAtk;
            }
            else if (v == HeroLvType.HP) {
                return this.baseHp;
            }
        }
        static have(id) {
            let arr = App.tableManager.getTable(SysRoleBase.NAME);
            for (let a of arr) {
                if (a.id == id) {
                    return true;
                }
            }
            return false;
        }
    }
    SysRoleBase.NAME = 'sys_rolebase.txt';

    class SysRoleUp {
        constructor() {
            this.id = 0;
            this.roleLevel = 0;
            this.roleId = 0;
            this.addAtk = 0;
            this.costAtk = 0;
            this.addHp = 0;
            this.costHp = 0;
            this.costGold = 0;
        }
        getCost(type) {
            if (type == HeroLvType.ATK) {
                return this.costAtk;
            }
            else if (type == HeroLvType.HP) {
                return this.costHp;
            }
        }
        getCostType(type) {
            if (type == HeroLvType.ATK) {
                return GoldType.BLUE_DIAMONG;
            }
            else if (type == HeroLvType.HP) {
                return GoldType.RED_DIAMONG;
            }
        }
        getValue(type) {
            if (type == HeroLvType.ATK) {
                return this.addAtk;
            }
            else if (type == HeroLvType.HP) {
                return this.addHp;
            }
        }
        static getSysRole(roleId, lv) {
            let sysArr = App.tableManager.getTable(SysRoleUp.NAME);
            for (let k of sysArr) {
                if (k.roleId == roleId && k.roleLevel == lv) {
                    return k;
                }
            }
            return null;
        }
        static getAddHp(heroId, lv) {
            let arr = App.tableManager.getTable(SysRoleUp.NAME);
            let v = 0;
            for (let a of arr) {
                if (a.roleId == heroId) {
                    v += a.addHp;
                    if (a.roleLevel == lv) {
                        return v;
                    }
                }
            }
        }
        static getAddAtk(heroId, lv) {
            let arr = App.tableManager.getTable(SysRoleUp.NAME);
            let v = 0;
            for (let a of arr) {
                if (a.roleId == heroId) {
                    v += a.addAtk;
                    if (a.roleLevel == lv) {
                        return v;
                    }
                }
            }
        }
        static getAddValue(heroId, lv, type) {
            if (type == HeroLvType.ATK) {
                return this.getAddAtk(heroId, lv);
            }
            else if (type == HeroLvType.HP) {
                return this.getAddHp(heroId, lv);
            }
        }
    }
    SysRoleUp.NAME = 'sys_roleup.txt';

    var GOLD_CHANGE_TYPE;
    (function (GOLD_CHANGE_TYPE) {
        GOLD_CHANGE_TYPE[GOLD_CHANGE_TYPE["AD_DIAMOND"] = 0] = "AD_DIAMOND";
        GOLD_CHANGE_TYPE[GOLD_CHANGE_TYPE["HERO_LV_ABILITY"] = 1] = "HERO_LV_ABILITY";
    })(GOLD_CHANGE_TYPE || (GOLD_CHANGE_TYPE = {}));

    class HeroBaseData {
        constructor() {
            this.id = 0;
            this.hpLv = 0;
            this.atkLv = 0;
            this.hpTime = 0;
            this.atkTime = 0;
        }
        getString() {
            return [this.id, this.hpLv, this.atkLv, this.hpTime, this.atkTime].join(",");
        }
        setString(str) {
            let arr = str.split(",");
            this.id = parseInt(arr[0]);
            this.hpLv = parseInt(arr[1]);
            this.atkLv = parseInt(arr[2]);
            this.hpTime = parseInt(arr[3]);
            this.atkTime = parseInt(arr[4]);
        }
        initData() {
            this.hpLv = 1;
            this.atkLv = 1;
        }
        getLv(type) {
            if (type == HeroLvType.ATK) {
                return this.atkLv;
            }
            if (type == HeroLvType.HP) {
                return this.hpLv;
            }
        }
        setLv(type, lv) {
            if (type == HeroLvType.ATK) {
                this.atkLv = lv;
            }
            if (type == HeroLvType.HP) {
                this.hpLv = lv;
            }
        }
    }

    class Equip {
        constructor() {
            this.hp = 0;
            this.atk = 0;
            this.def = 0;
            this.crit = 0;
            this.moveSpeed = 0;
            this.atkSpeed = 0;
            this.initSkillId = 0;
            this.critEffect = 0;
            this.dodge = 0;
        }
        copy() {
            let e = new Equip();
            e.hp = this.hp;
            e.atk = this.atk;
            e.def = this.def;
            e.crit = this.crit;
            e.moveSpeed = this.moveSpeed;
            e.atkSpeed = this.atkSpeed;
            e.critEffect = this.critEffect;
            e.initSkillId = this.initSkillId;
            return e;
        }
        reset0() {
            this.hp = 0;
            this.atk = 0;
            this.def = 0;
            this.crit = 0;
            this.moveSpeed = 0;
            this.atkSpeed = 0;
            this.critEffect = 0;
            this.initSkillId = 0;
        }
    }

    class HeroData {
        constructor() {
            this.heroMap = {};
            this.nowRoleId = 1;
        }
        setData(data) {
            this.initData(null);
            let str = data.heroData;
            let arr = str.split(".");
            for (let v of arr) {
                let hd = new HeroBaseData();
                hd.setString(v);
                this.heroMap[hd.id] = hd;
            }
            this.nowRoleId = (data.nowRoleId ? data.nowRoleId : 1);
        }
        saveData(data) {
            let arr = [];
            for (let k in this.heroMap) {
                let hd = this.heroMap[k];
                arr.push(hd.getString());
            }
            data.heroData = arr.join(".");
            data.nowRoleId = this.nowRoleId;
        }
        initData(data) {
            let arr = App.tableManager.getTable(SysRoleBase.NAME);
            for (let k of arr) {
                let hd = new HeroBaseData();
                hd.id = k.id;
                hd.initData();
                this.heroMap[hd.id] = hd;
            }
            this.nowRoleId = 1;
        }
        getHeroLv(heroId, type) {
            let hd = this.heroMap[heroId];
            return hd.getLv(type);
        }
        getHeroBaseData(heroId) {
            return this.heroMap[heroId];
        }
        getBaseTime(type, heroId) {
            let b = this.getHeroBaseData(heroId);
            if (type == HeroLvType.ATK) {
                return b.atkTime;
            }
            return b.hpTime;
        }
        getHeroData(heroId) {
            let e = new Equip();
            let sysRB = SysRoleBase.getSys(heroId);
            e.atk = sysRB.baseAtk + this.getValue(heroId, HeroLvType.ATK) * (1 + Session.talentData.addCompose) + Session.talentData.equip.atk;
            e.hp = sysRB.baseHp + this.getValue(heroId, HeroLvType.HP) * (1 + Session.talentData.addCompose) + Session.talentData.equip.hp;
            e.atk = parseInt(e.atk + "");
            e.hp = parseInt(e.hp + "");
            console.log(sysRB.baseAtk, this.getValue(heroId, HeroLvType.ATK), Session.talentData.addCompose, Session.talentData.equip.atk);
            console.log(sysRB.baseHp, this.getValue(heroId, HeroLvType.HP), Session.talentData.addCompose, Session.talentData.equip.hp);
            e.dodge = sysRB.baseDodge;
            e.moveSpeed = sysRB.baseMove;
            e.atkSpeed = sysRB.baseSpeed;
            e.crit = sysRB.baseCrit;
            e.critEffect = sysRB.baseCritHurt;
            e.initSkillId = sysRB.baseSkill;
            return e;
        }
        getValue(heroId, type) {
            let lv = this.getHeroLv(heroId, type);
            return SysRoleUp.getAddValue(heroId, lv, type);
        }
        lvUp(heroId, type) {
            let hd = this.heroMap[heroId];
            let lv = hd.getLv(type);
            let sys = SysRoleUp.getSysRole(heroId, lv);
            let cost = sys.getCost(type);
            let goldType = sys.getCostType(type);
            if (Session.homeData.getGoldByType(goldType) < cost) {
                return 2;
            }
            let nowLv = lv + 1;
            let nowSys = SysRoleUp.getSysRole(heroId, nowLv);
            if (nowSys == null) {
                return 3;
            }
            if (Session.homeData.getGoldByType(GoldType.GOLD) < sys.costGold) {
                return 4;
            }
            let sysRB = App.tableManager.getDataByNameAndId(SysRoleBase.NAME, heroId);
            if (nowLv > sysRB.roleLimt) {
                return 5;
            }
            Session.homeData.changeGold(goldType, -cost, GOLD_CHANGE_TYPE.HERO_LV_ABILITY);
            Session.homeData.changeGold(GoldType.GOLD, -sys.costGold, GOLD_CHANGE_TYPE.AD_DIAMOND);
            hd.setLv(type, nowLv);
            Laya.stage.event(GameEvent.HERO_UPDATE);
            Session.saveData();
            return 0;
        }
        canLvUp() {
            let arr = App.tableManager.getTable(SysRoleBase.NAME);
            for (let a of arr) {
                if (this.test(a.id, HeroLvType.HP)) {
                    return true;
                }
                if (this.test(a.id, HeroLvType.ATK)) {
                    return true;
                }
            }
            return false;
        }
        test(heroId, type) {
            let hd = this.heroMap[heroId];
            let lv = hd.getLv(type);
            let sys = SysRoleUp.getSysRole(heroId, lv);
            let cost = sys.getCost(type);
            let goldType = sys.getCostType(type);
            if (Session.homeData.getGoldByType(goldType) < cost) {
                return false;
            }
            let nowLv = lv + 1;
            let nowSys = SysRoleUp.getSysRole(heroId, nowLv);
            if (nowSys == null) {
                return false;
            }
            if (Session.homeData.getGoldByType(GoldType.GOLD) < sys.costGold) {
                return false;
            }
            let sysRB = App.tableManager.getDataByNameAndId(SysRoleBase.NAME, heroId);
            if (nowLv > sysRB.roleLimt) {
                return false;
            }
            return true;
        }
    }
    var HeroLvType;
    (function (HeroLvType) {
        HeroLvType[HeroLvType["ATK"] = 0] = "ATK";
        HeroLvType[HeroLvType["HP"] = 1] = "HP";
    })(HeroLvType || (HeroLvType = {}));

    class RotationEffect {
        constructor() {
        }
        rotation(s, ro) {
            this.s = s;
            this.ro = ro;
            Laya.timer.frameLoop(1, this, this.loopFun);
            s.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            Laya.timer.clear(this, this.loopFun);
        }
        loopFun() {
            this.s.rotation += this.ro;
        }
        static play(s, ro = 1) {
            let a = new RotationEffect();
            a.rotation(s, ro);
        }
    }

    class GetItemCell extends ui.test.GetItemCellUI {
        constructor() {
            super();
            RotationEffect.play(this.light);
            this.anchorX = this.anchorY = 0.5;
        }
        setData(data) {
            this.v1.vs.selectedIndex = data.type;
            this.label.text = "+" + data.value;
        }
    }

    class GetItemDialog extends ui.test.GetItemDialogUI {
        constructor() {
            super();
            this.now = 0;
            this.col = 3;
            this.dArr = [];
            this.cellWid = 500;
            this.cellHei = 500;
        }
        static open(value) {
            let g = new GetItemDialog();
            g.setData(value);
            g.popup(true);
        }
        setData(value) {
            this.now = 0;
            if (value instanceof Array) {
                this.dArr = value;
            }
            else {
                this.dArr = [value];
            }
            let len = this.dArr.length;
            this.box.width = ((len >= this.col) ? 3 : len) * this.cellWid;
            this.box.height = Math.ceil(len / this.col) * this.cellWid;
            let sw = 750 / this.box.width;
            this.box.scale(sw, sw);
            let wid = this.box.width * this.box.scaleX;
            this.rebornBtn.y = this.box.height * sw + 50;
            if (this.rebornBtn.y > (Laya.stage.height - 80)) {
                this.rebornBtn.y = Laya.stage.height - 80;
            }
            this.box.x = (750 - wid) / 2;
            Laya.timer.once(400, this, this.effect);
            this.height = this.box.height * sw + 200;
            this.rebornBtn.visible = false;
        }
        effect() {
            let v = new GetItemCell();
            v.x = this.now % this.col * this.cellWid + this.cellWid / 2;
            v.y = Math.floor(this.now / this.col) * this.cellHei + this.cellHei / 2;
            v.setData(this.dArr[this.now]);
            this.box.addChild(v);
            this.now++;
            let t = new Laya.Tween();
            t.from(v, { scaleX: 3, scaleY: 3, alpha: 0 }, 300);
            if (this.now < this.dArr.length) {
                Laya.timer.once(100, this, this.effect);
            }
            else {
                this.rebornBtn.visible = true;
            }
        }
    }

    class AdDiamond extends ui.test.juese_tishiUI {
        constructor() {
            super();
            this.goldType = 0;
            this.addNum = 0;
            this.bg.height = Laya.stage.height;
            RotationEffect.play(this.light);
            this.rebornBtn.clickHandler = new Laya.Handler(this, this.clickFun);
        }
        clickFun() {
            if (this.check() > 0) {
                return;
            }
            App.sdkManager.playAdVideo(AD_TYPE.AD_DIAMOND, new Laya.Handler(this, this.adFun));
        }
        setGoldType(a) {
            this.goldType = a;
            this.v1.vs.selectedIndex = a;
            let res = this.check();
            if (res < 0) {
                this.fc.visible = false;
            }
            else {
                this.fc.visible = true;
                Laya.timer.frameLoop(1, this, this.loopFun);
            }
            this.on(Laya.Event.UNDISPLAY, this, this.aundisFun);
        }
        aundisFun() {
            Laya.timer.clearAll(this);
        }
        loopFun() {
            let res = this.check();
            if (res < 0) {
                this.fc.visible = false;
                return;
            }
            else {
                this.fc.value = "00:" + this.getV0(Math.ceil(res / 1000));
            }
        }
        getV0(v) {
            return ((v < 10) ? ("0" + v) : ("" + v));
        }
        check() {
            let t = Session.heroData.getBaseTime(this.heroType, Session.heroData.nowRoleId);
            return t - Laya.Browser.now();
        }
        adFun() {
            let v = Math.ceil(Math.random() * 4) + 6;
            this.addNum = v;
            Session.homeData.changeGold(this.goldType, v, GOLD_CHANGE_TYPE.AD_DIAMOND);
            let g = new GetItemDialog();
            g.setData({ type: this.goldType, value: v });
            g.popup(true);
            g.once(Laya.Event.UNDISPLAY, this, this.undisFun);
            let b = Session.heroData.getHeroBaseData(Session.heroData.nowRoleId);
            if (this.heroType == HeroLvType.ATK) {
                b.atkTime = Laya.Browser.now() + 60 * 1000;
            }
            else if (this.heroType == HeroLvType.HP) {
                b.hpTime = Laya.Browser.now() + 60 * 1000;
            }
        }
        undisFun() {
            this.event(AdDiamond.CHANGE_GOLD_EVENT, [this.goldType, this.addNum]);
        }
    }
    AdDiamond.CHANGE_GOLD_EVENT = "CHANGE_GOLD_EVENT";

    class NoResDialog extends ui.test.NoResDialogUI {
        constructor() {
            super();
            this.goldType = 0;
            this.addNum = 0;
        }
        setType(type) {
            if (type == 0) {
                this.vs.selectedIndex = 0;
                this.l1.text = "剩余次数:" + Session.homeData.adPower + "/3";
                this.title.text = "体力不足";
                this.btnView.fuhuo.clickHandler = new Laya.Handler(this, this.playAdFun);
            }
            else {
                this.vs.selectedIndex = 1;
                if (type == NoResDialogType.red) {
                    this.title.text = "红宝石不足";
                    this.dia.vs.selectedIndex = 1;
                    this.setGoldType(GoldType.RED_DIAMONG);
                }
                else if (type == NoResDialogType.blue) {
                    this.title.text = "蓝宝石不足";
                    this.dia.vs.selectedIndex = 2;
                    this.setGoldType(GoldType.BLUE_DIAMONG);
                }
                this.btnView.fuhuo.on(Laya.Event.CLICK, this, this.ad2Fun);
            }
            this.btnView.ani1.play(0, true);
        }
        ad2Fun() {
            if (this.check() > 0) {
                return;
            }
            App.sdkManager.playAdVideo(AD_TYPE.AD_DIAMOND, new Laya.Handler(this, this.adFun));
        }
        adFun() {
            let v = Math.ceil(Math.random() * 4) + 6;
            this.addNum = v;
            Session.homeData.changeGold(this.goldType, v, GOLD_CHANGE_TYPE.AD_DIAMOND);
            let g = new GetItemDialog();
            g.setData({ type: this.goldType, value: v });
            g.popup(true);
            g.once(Laya.Event.UNDISPLAY, this, this.undisFun);
            let b = Session.heroData.getHeroBaseData(Session.heroData.nowRoleId);
            if (this.heroType == HeroLvType.ATK) {
                b.atkTime = Laya.Browser.now() + 60 * 1000;
            }
            else if (this.heroType == HeroLvType.HP) {
                b.hpTime = Laya.Browser.now() + 60 * 1000;
            }
        }
        setGoldType(a) {
            this.goldType = a;
            let res = this.check();
            if (res < 0) {
                this.fc.visible = false;
            }
            else {
                this.fc.visible = true;
                Laya.timer.frameLoop(1, this, this.loopFun);
            }
            this.on(Laya.Event.UNDISPLAY, this, this.aundisFun);
        }
        aundisFun() {
            Laya.timer.clearAll(this);
        }
        loopFun() {
            let res = this.check();
            if (res < 0) {
                this.fc.visible = false;
                return;
            }
            else {
                this.fc.value = "00:" + this.getV0(Math.ceil(res / 1000));
            }
        }
        getV0(v) {
            return ((v < 10) ? ("0" + v) : ("" + v));
        }
        check() {
            let t = Session.heroData.getBaseTime(this.heroType, Session.heroData.nowRoleId);
            return t - Laya.Browser.now();
        }
        undisFun() {
            this.event(AdDiamond.CHANGE_GOLD_EVENT, [this.goldType, this.addNum]);
        }
        playAdFun() {
            if (Session.homeData.adPower == 3) {
                return;
            }
            App.sdkManager.playAdVideo(AD_TYPE.AD_POWER, new Laya.Handler(this, this.overFun));
        }
        overFun() {
            Session.homeData.adPower++;
            this.close();
            Session.saveData();
            Session.homeData.curEnergy = 20;
            Session.homeData.lastTime = 0;
        }
    }
    NoResDialog.CHANGE_GOLD_EVENT = "CHANGE_GOLD_EVENT";
    var NoResDialogType;
    (function (NoResDialogType) {
        NoResDialogType[NoResDialogType["tili"] = 0] = "tili";
        NoResDialogType[NoResDialogType["red"] = 1] = "red";
        NoResDialogType[NoResDialogType["blue"] = 2] = "blue";
    })(NoResDialogType || (NoResDialogType = {}));

    class MainUI extends Laya.Box {
        constructor() {
            super();
            this.height = GameBG.height;
            this.width = 750;
            this.topUI = new TopUI();
            this.addChild(this.topUI);
            Laya.stage.on(GameEvent.AD_UPDATE_POWER, this, this.onUpdatePower);
            this.bottomUI = new BottomUI();
            this.addChild(this.bottomUI);
            this.bottomUI.y = 1334 - 122;
            let img = new Laya.Image();
            img.skin = "main/jianhei.png";
            this.addChild(img);
            img.width = 800;
            img.anchorX = 0.5;
            img.y = this.bottomUI.y - 50;
            img.x = 375;
            img.height = 50;
            this.addChild(this.bottomUI);
            this.mouseThrough = true;
        }
        onUpdatePower() {
            this.topUI.removeSelf();
            this.addChild(this.topUI);
        }
        appEnergy() {
            this.topUI.appEnergy();
        }
        get selectIndex() {
            return this.bottomUI.selectIndex;
        }
    }
    class TopUI extends ui.test.mainUIUI {
        constructor() {
            super();
            this._remainingTime = 0;
            this.maskSpr = new Laya.Sprite();
            this._isInit = false;
            this.lastWidth = 0;
            this.isTwo = false;
            this.timerClip.visible = false;
            this.appEnergyClip.visible = false;
            this.headImg.skin = Game.userHeadUrl;
            this.nameTxt.text = Game.userName;
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            Laya.stage.on(GameEvent.WX_ON_SHOW, this, this.onDis);
            this.jia.on(Laya.Event.CLICK, this, this.addTiFun);
        }
        addTiFun() {
            let d = new NoResDialog();
            d.setType(NoResDialogType.tili);
            d.popup();
        }
        onDis() {
            this.homeData = Session.homeData;
            if (Date.now() >= this.homeData.lastTime) {
                this._remainingTime = 0;
            }
            else {
                let deltaTime = Session.homeData.lastTime - Date.now();
                let time = Math.floor(deltaTime / 1000);
                this._remainingTime = Math.floor(time % TopUI.TOTAL_TIME);
                if (this._remainingTime == 0) {
                    this._remainingTime = TopUI.TOTAL_TIME;
                }
            }
            this.updateEnergy();
            this.dengji.value = "" + Session.homeData.playerLv;
            this.coinClip.value = "" + Session.homeData.coins;
            let sys = App.tableManager.getDataByNameAndId(SysHero.NAME, Session.homeData.battleLv);
            let vv = Session.homeData.playerExp / sys.roleExp;
            Laya.timer.frameLoop(1, this, this.onLoopExp, [vv]);
            Laya.stage.on(GameEvent.GOLD_CHANGE, this, this.goldFun);
        }
        goldFun() {
            this.coinClip.value = "" + Session.homeData.coins;
        }
        onLoopExp(vv) {
            this.lastWidth += 15;
            if (this.isTwo) {
                if (this.lastWidth >= this.jingyantiao.width) {
                    this.lastWidth = 0;
                    this.isTwo = false;
                }
            }
            else {
                if (this.lastWidth >= this.jingyantiao.width * vv) {
                    this.lastWidth = this.jingyantiao.width * vv;
                    Laya.timer.clear(this, this.onLoopExp);
                }
            }
            this.lastWidth = Math.max(1, this.lastWidth);
            this.maskSpr.graphics.clear();
            this.maskSpr.graphics.drawRect(0, 0, this.lastWidth, this.jingyantiao.height, "#fff000");
            this.jingyantiao.mask = this.maskSpr;
        }
        appEnergy() {
            if (this.homeData.curEnergy < TopUI.xiaohao) {
                FlyUpTips.setTips("体力不足！");
                return;
            }
            Laya.MouseManager.enabled = false;
            Game.isStartBattle = true;
            this.homeData.curEnergy -= TopUI.xiaohao;
            App.sendEvent(GameEvent.APP_ENERGY, TopUI.xiaohao);
            this.updateEnergy();
            Laya.timer.once(800, this, this.onStart);
        }
        onStart() {
            Laya.MouseManager.enabled = true;
            this._remainingTime = TopUI.TOTAL_TIME;
            this.updateEnergy();
            this.homeData.lastTime = Date.now() + (this.homeData.totalEnergy - this.homeData.curEnergy) * TopUI.TOTAL_TIME * 1000;
            Session.saveData();
            Game.battleLoader.load();
        }
        updateEnergy() {
            this.tiliClip.value = this.homeData.curEnergy + "/" + this.homeData.maxEngergy;
            let value = this.homeData.curEnergy / this.homeData.maxEngergy;
            value = Math.max(0.1, value);
            if (this.homeData.curEnergy < this.homeData.totalEnergy) {
                Laya.timer.loop(1000, this, this.onLoop);
                this.onLoop();
            }
            else {
                this.timerClip.visible = false;
                Laya.timer.clear(this, this.onLoop);
            }
        }
        onLoop() {
            this.timerClip.visible = true;
            this.timerClip.value = DateUtils.getFormatBySecond3(this._remainingTime);
            this._remainingTime--;
            if (this._remainingTime < 0) {
                this.homeData.curEnergy++;
                if (this.homeData.curEnergy == this.homeData.totalEnergy) {
                    Laya.timer.clear(this, this.onLoop);
                    this.timerClip.visible = false;
                }
                else {
                    this._remainingTime = TopUI.TOTAL_TIME;
                }
                this.updateEnergy();
            }
        }
    }
    TopUI.TOTAL_TIME = 12 * 60;
    TopUI.MAX_ENERGY = 20;
    TopUI.xiaohao = 2;
    class BottomUI extends Laya.Box {
        constructor() {
            super();
            this.bgBox = new Laya.Box();
            this.curBg = new Laya.Image();
            this.btnBox = new Laya.Box();
            this.bgs = [];
            this.btns = [];
            this._selectIndex = 0;
            this.opens = Session.homeData.openBtn;
            this.size(750, 122);
            this.addChild(this.bgBox);
            this.curBg.skin = 'main/dazhao.png';
            this.addChild(this.curBg);
            this.addChild(this.btnBox);
            for (let i = 0; i < 5; i++) {
                let bg = new Laya.Image();
                bg.skin = 'main/xiaobiao.png';
                bg.width = 127;
                bg.height = 122;
                this.bgBox.addChild(bg);
                bg.x = i * bg.width;
                this.bgs.push(bg);
                let btn = new Laya.Button();
                this.makeBtn(btn);
                btn.tag = this.opens[i];
                if (this.opens[i] == "1") {
                    btn.stateNum = 2;
                    btn.width = 132;
                    btn.height = 136;
                    btn.skin = 'main/btn_' + i + '.png';
                    btn.y = bg.y + 55;
                }
                else {
                    btn.stateNum = 1;
                    btn.width = 38;
                    btn.height = 55;
                    btn.skin = 'main/suo.png';
                    btn.y = bg.y + 61;
                    btn.scale(1.2, 1.2);
                }
                this.btnBox.addChild(btn);
                btn.anchorX = 0.5;
                btn.anchorY = 0.5;
                btn.x = bg.x + 63;
                btn.clickHandler = new Laya.Handler(this, this.onClick, [btn]);
                this.btns.push(btn);
            }
            this.onClick(this.btns[this._selectIndex], 10);
            Laya.stage.on(GameEvent.RED_UPDATE, this, this.updateRed);
            Laya.stage.on(GameEvent.GOLD_CHANGE, this, this.updateRed);
            Laya.stage.on(GameEvent.PLAYER_INFO_UPDATE, this, this.updateRed);
            this.updateRed();
        }
        updateRed() {
            this.setBtn(this.btns[1], Session.heroData.canLvUp(), 1);
            this.setBtn(this.btns[2], Session.talentData.canLvUp2(), 2);
        }
        setBtn(b, v, index) {
            if (Session.homeData.openBtn[index] != "1") {
                return;
            }
            let r = b.getChildByName("red");
            r.visible = v;
            if (r.visible) {
                r.ani1.play(0, true);
            }
        }
        makeBtn(b) {
            let r = new ui.test.RedPointViewUI();
            r.scale(0.8, 0.8);
            b.addChild(r);
            r.name = "red";
            r.pos(90, -20);
            r.zOrder = 100;
            r.visible = false;
        }
        updateBtns() {
            let len = this.btns.length;
            for (let i = 0; i < len; i++) {
                let btn = this.btns[i];
                btn.tag = this.opens[i];
                if (this.opens[i] == "1") {
                    btn.stateNum = 2;
                    btn.width = 132;
                    btn.height = 136;
                    btn.scale(1, 1);
                    btn.skin = 'main/btn_' + i + '.png';
                }
                else {
                    btn.stateNum = 1;
                    btn.width = 38;
                    btn.height = 55;
                    btn.skin = 'main/suo.png';
                    btn.scale(1.2, 1.2);
                }
            }
        }
        open(v) {
            let a = this.btns[v];
            let t = new Laya.Tween();
            t.to(a, { alpha: 0, scaleX: 4, scaleY: 4 }, 200, Laya.Ease.strongOut);
        }
        onClick(clickBtn, delay = 500) {
            if (clickBtn.tag == "-1") {
                clickBtn.mouseEnabled = false;
                ShakeUtils.execute(clickBtn, 300, 2);
                FlyUpTips.setTips("敬请期待");
                setTimeout(() => {
                    clickBtn.mouseEnabled = true;
                }, 300);
                return;
            }
            var ww = 0;
            let tmp;
            for (let i = 0; i < this.btns.length; i++) {
                let btn = this.btns[i];
                let bg = this.bgs[i];
                bg.width = 127;
                btn.selected = false;
                if (btn == clickBtn) {
                    btn.selected = true;
                    bg.skin = 'main/dabiao.png';
                    bg.width = 242;
                    this._selectIndex = i;
                    tmp = bg;
                }
                bg.x = ww;
                ww += bg.width;
                btn.x = bg.x + bg.width * 0.5;
            }
            Laya.Tween.to(this.curBg, { x: tmp.x }, delay, Laya.Ease.cubicInOut);
            Laya.stage.event("switchView");
        }
        get selectIndex() {
            return this._selectIndex;
        }
        fly(s, v) {
            s.selected = false;
            let t = new Laya.Tween();
            let b = this.btns[v];
            this.btns[v] = s;
            Session.homeData.openBtn[v] = "1";
            let p = b.localToGlobal(new Laya.Point(b.width / 2, b.height / 2));
            t.to(s, { x: p.x, y: p.y }, 600, Laya.Ease.strongOut, new Laya.Handler(this, this.flyFun, [s, b, v]));
        }
        flyFun(s, b, flyNum) {
            MyEffect.bigSmall(s, 3, 1);
            b.parent.addChild(s);
            s.pos(b.x, b.y);
            this.makeBtn(s);
            b.removeSelf();
            s.clickHandler = new Laya.Handler(this, this.onClick, [s]);
            if (Session.homeData.newStat == Guide_Type.click_talent) {
                GuideManager.getInstance().hand(s, s.width / 2, s.height / 2, Guide_Type.talent_lv_up, 1000);
            }
            else if (Session.homeData.newStat == Guide_Type.open_role) {
                GuideManager.getInstance().hand(s, s.width / 2, s.height / 2, Guide_Type.click_hp, 1000);
            }
            Laya.timer.once(1000, null, () => {
                Laya.MouseManager.enabled = true;
            });
        }
    }

    class HomeData {
        constructor() {
            this.redDiamond = 0;
            this.blueDiamond = 0;
            this.playerExp = 0;
            this.isPass = false;
            this.newStat = 0;
            this.openId = -1;
            this.loginTime = 0;
            this.adTimes = 0;
            this.adPower = 0;
            this.openBtn = [];
            Laya.stage.on(GameEvent.NEW_DAY, this, this.newDayFun);
            Laya.stage.on(GameEvent.AD_OVER, this, this.adOverFun);
            Laya.stage.on(GameEvent.PASS_CHAPTER, this, this.openFun);
        }
        setNewStat(value) {
            Log.log(value);
        }
        openFun() {
            this.openId = Session.homeData.chapterId;
        }
        adOverFun() {
            this.adTimes++;
        }
        newDayFun() {
            this.adPower = 0;
        }
        setChapterId(value, index) {
            this.chapterId = value;
            Session.rankData.saveWorldRank();
            Session.rankData.saveFriendRank();
        }
        setData(data) {
            this.totalEnergy = data.totalEnergy;
            this.maxEngergy = data.maxEngergy;
            this.lastTime = data.lastTime;
            this.curEnergy = data.curEnergy;
            this.chapterId = data.chapterId;
            this.mapIndex = data.mapIndex;
            this.battleLv = data.battleLv;
            this.playerLv = data.playerLv;
            this.coins = data.coins;
            this.blueDiamond = (data.blueDiamond ? data.blueDiamond : 0);
            this.redDiamond = (data.redDiamond ? data.redDiamond : 0);
            this.playerExp = data.playerExp;
            this.isGuide = data.isGuide;
            if (this.playerExp == null) {
                this.playerExp = 0;
            }
            if (Date.now() >= this.lastTime) {
                this.curEnergy = this.totalEnergy;
            }
            else {
                let deltaTime = this.lastTime - Date.now();
                let time = Math.floor(deltaTime / 1000);
                let delta = Math.ceil(time / TopUI.TOTAL_TIME);
                this.curEnergy = this.totalEnergy - delta;
                console.log("Session剩余的时间", time, this.curEnergy);
            }
            this.curEnergy = 20;
            this.newStat = (data.newStat ? data.newStat : Guide_Type.over);
            if (data.openBtn == null) {
                this.openBtn = ["1", "1", "1", "-1", "1"];
            }
            else {
                this.openBtn = data.openBtn.split(",");
            }
            this.adPower = (data.adPower ? data.adPower : 0);
            if (data.loginTime == null) {
                App.sendEvent(GameEvent.NEW_DAY);
            }
            else {
                let last = new Date(data.loginTime);
                let now = new Date();
                if (now.getDate() != last.getDate()) {
                    App.sendEvent(GameEvent.NEW_DAY);
                }
            }
            this.timeFun(0);
            data.loginTime = Date.now();
            this.adTimes = (data.adTimes ? data.adTimes : 0);
        }
        timeFun(send) {
            if (send == 1) {
                App.sendEvent(GameEvent.NEW_DAY);
            }
            let now = new Date();
            let h = 60 * 60 * 1000;
            let time = 24 * h - now.getHours() * h - now.getMinutes() * 60 * 1000 - now.getSeconds() * 1000;
            Laya.timer.once(time + 1000, this, this.timeFun, [1]);
        }
        saveData(data) {
            data.curEnergy = this.curEnergy;
            data.maxEngergy = this.maxEngergy;
            data.lastTime = this.lastTime;
            data.totalEnergy = this.totalEnergy;
            data.battleLv = this.battleLv;
            data.playerLv = this.playerLv;
            data.coins = this.coins;
            data.blueDiamond = this.blueDiamond;
            data.redDiamond = this.redDiamond;
            data.playerExp = this.playerExp;
            data.chapterId = this.chapterId;
            data.mapIndex = this.mapIndex;
            console.log("当前的层数", data.mapIndex);
            if (Game.battleLoader.chapterId >= this.chapterId) {
                if (Game.battleLoader.index > this.mapIndex) {
                    data.mapIndex = Game.battleLoader.index - 1;
                    data.mapIndex = Math.max(0, data.mapIndex);
                    console.log("存储最高层数", data.mapIndex);
                }
            }
            data.isGuide = this.isGuide;
            data.newStat = this.newStat;
            data.openBtn = this.openBtn.join(",");
            data.adPower = this.adPower;
            data.adTimes = this.adTimes;
        }
        initData(data) {
            this.totalEnergy = TopUI.MAX_ENERGY;
            this.maxEngergy = TopUI.MAX_ENERGY;
            this.curEnergy = this.totalEnergy;
            this.lastTime = 0;
            this.isGuide = true;
            this.chapterId = 0;
            this.mapIndex = 0;
            this.battleLv = 1;
            this.playerLv = 1;
            this.coins = 0;
            this.redDiamond = 10;
            this.playerExp = 0;
            this.blueDiamond = 10;
            this.coins = 1000;
            this.newStat = 1;
            this.openBtn = ["1", "-1", "-1", "-1", "1"];
            this.adPower = 0;
            this.adTimes = 0;
        }
        changeGold(type, value, useType = 0) {
            let num = this.getGoldByType(type);
            if ((num + value) < 0) {
                return false;
            }
            this.setGoldByType(type, value);
            Laya.stage.event(GameEvent.GOLD_CHANGE);
            return true;
        }
        getGoldByType(type) {
            if (type == GoldType.GOLD) {
                return this.coins;
            }
            else if (type == GoldType.RED_DIAMONG) {
                return this.redDiamond;
            }
            else if (type == GoldType.BLUE_DIAMONG) {
                return this.blueDiamond;
            }
        }
        setGoldByType(type, value) {
            if (type == GoldType.GOLD) {
                this.coins += value;
            }
            else if (type == GoldType.RED_DIAMONG) {
                this.redDiamond += value;
            }
            else if (type == GoldType.BLUE_DIAMONG) {
                this.blueDiamond += value;
            }
        }
        addPlayerExp(exp) {
            this.playerExp += exp;
            while (true) {
                let sys = App.tableManager.getDataByNameAndId(SysHero.NAME, this.playerLv);
                if (this.playerExp >= sys.roleExp) {
                    let nowLv = this.playerLv + 1;
                    if (App.tableManager.getDataByNameAndId(SysHero.NAME, this.playerLv) == null) {
                        break;
                    }
                    this.playerLv = nowLv;
                    this.playerExp -= sys.roleExp;
                }
                else {
                    break;
                }
            }
            App.sendEvent(GameEvent.PLAYER_INFO_UPDATE);
        }
    }
    var GoldType;
    (function (GoldType) {
        GoldType[GoldType["GOLD"] = 0] = "GOLD";
        GoldType[GoldType["RED_DIAMONG"] = 1] = "RED_DIAMONG";
        GoldType[GoldType["BLUE_DIAMONG"] = 2] = "BLUE_DIAMONG";
    })(GoldType || (GoldType = {}));

    var HttpRequest = Laya.HttpRequest;
    class Http {
        constructor() {
            this.xhr = new HttpRequest();
            this.xhr.http.timeout = 10000;
        }
        static create() {
            return new Http();
        }
        success(func, thisObj) {
            this.xhr.once(Laya.Event.COMPLETE, thisObj, function (data) {
                Laya.Handler.create(thisObj, func).runWith(data);
            });
            return this;
        }
        error(func, thisObj = null) {
            this.xhr.once(Laya.Event.ERROR, thisObj, function (data) {
                Laya.Handler.create(thisObj, func).runWith(data);
            });
            return this;
        }
        send(url, data, method, responseType) {
            this.xhr.send(url, data, method, responseType);
        }
    }

    class BaseHttp {
        constructor(hand) {
            this.handler = hand;
            this._http = Http.create().success(this.onSuccess, this).error(this.onErro, this);
        }
        onSuccess(data) {
            this.handler && this.handler.runWith(data);
        }
        onErro(e) {
            console.error(e);
        }
        send(url, data, method, responseType) {
            this._http.send(url, data, method, responseType);
        }
    }

    class SenderHttp extends BaseHttp {
        constructor() {
            super(null);
        }
        static create() {
            return new SenderHttp();
        }
        send() {
            let obj = Session.gameData;
            super.send(App.serverIP + "gamex3/save2", "skey=" + Session.SKEY + "&type=0&num=0&gamedata=" + JSON.stringify(obj), "post", "text");
        }
        onSuccess(data) {
            super.onSuccess(data);
            console.log("save success", data);
        }
    }

    class SysTalentInfo {
        constructor() {
            this.id = 0;
            this.idName = "";
            this.talentName = "";
            this.talentInfo = "";
            this.talentSort = 0;
            this.talentType = 0;
        }
        static getSys() {
            let arr = App.tableManager.getTable(SysTalentInfo.NAME);
            arr.sort(function (a, b) {
                return a.talentSort - b.talentSort;
            });
            return arr;
        }
        getHou() {
            if (this.talentType == 1) {
                return "";
            }
            else if (this.talentType == 2) {
                return "%";
            }
        }
    }
    SysTalentInfo.NAME = "sys_talentinfo.txt";

    class SysTalentCost {
        constructor() {
            this.id = 0;
            this.talentCost = 0;
        }
    }
    SysTalentCost.NAME = "sys_talentcost.txt";

    class SysTalent {
        constructor() {
            this.id = 0;
            this.addAttack = 0.1;
            this.addHp = 0.1;
            this.addItemhp = 0.1;
            this.addDefense = 0.1;
            this.addAtkspeed = 0.1;
            this.dropLevelhp = 0.1;
            this.addCompose = 0.1;
            this.lineGold = 0.1;
            this.offlineGold = 0.1;
        }
    }
    SysTalent.NAME = "sys_talent.txt";

    class TalentData {
        constructor() {
            this.talentArr = [];
            this.lvTimes = 0;
            this.imgArr = [];
            this.talentLvMap = {};
            this.atk = 0;
            this.hp = 0;
            this.def = 0;
            this.equip = new Equip();
            this.offlineGold = 0;
            this.lineGold = 0;
            this.addCompose = 0;
            this.dropLevelhp = 0;
            this.addItemhp = 0;
            this.addData("tianfu/PTkuang.png", "tianfu/gongji.png", "tianfu/gongzi.png", 1);
            this.addData("tianfu/PTkuang.png", "tianfu/baoji.png", "tianfu/baozi.png", 2);
            this.addData("tianfu/PTkuang.png", "tianfu/xingyun.png", "tianfu/xingzi.png", 3);
            this.addData("tianfu/JYkuang.png", "tianfu/fangyu.png", "tianfu/fangzi.png", 4);
            this.addData("tianfu/JYkuang.png", "tianfu/sudu.png", "tianfu/yizi.png", 5);
            this.addData("tianfu/JYkuang.png", "tianfu/shengming.png", "tianfu/shengzi.png", 6);
            this.addData("tianfu/SSkuang.png", "tianfu/tiejiang.png", "tianfu/tiezi.png", 7);
            this.addData("tianfu/SSkuang.png", "tianfu/jinbi.png", "tianfu/diaozi.png", 8);
            this.addData("tianfu/SSkuang.png", "tianfu/lixian.png", "tianfu/lizi.png", 9);
        }
        addData(bg, logo, font, id) {
            this.imgArr.push({ bg: bg, logo: logo, font: font, id: id });
        }
        getImgData(id) {
            return this.imgArr[id - 1];
        }
        setData(data) {
            if (data.talent == null) {
                this.initData(data);
            }
            let arr = data.talent.split(",");
            for (let i = 0; i < arr.length; i += 2) {
                let tId = parseInt(arr[i]);
                let tLv = parseInt(arr[i + 1]);
                this.talentLvMap[tId] = tLv;
            }
            this.lvTimes = (data.lvTimes ? data.lvTimes : 0);
            this.updateAttribute();
        }
        saveData(data) {
            let arr = [];
            for (let k in this.talentLvMap) {
                arr.push(k);
                arr.push(this.talentLvMap[k]);
            }
            data.talent = arr.join(",");
            data.lvTimes = this.lvTimes;
        }
        initData(data) {
            let sysArr = App.tableManager.getTable(SysTalentInfo.NAME);
            for (let k of sysArr) {
                this.talentLvMap[k.id] = 0;
            }
        }
        getLv(id) {
            return this.talentLvMap[id];
        }
        getTxt(index) {
            return "";
        }
        updateAttribute() {
            this.equip.reset0();
            this.equip.atk = this.getAtt(1);
            this.equip.hp = this.getAtt(2);
            this.equip.def = this.getAtt(4);
            this.equip.atkSpeed = this.getAtt(5);
            this.addItemhp = this.getAtt(3);
            this.dropLevelhp = this.getAtt(6);
            this.addCompose = this.getAtt(7);
            this.lineGold = this.getAtt(8);
            this.offlineGold = this.getAtt(9);
        }
        getAtt(tid) {
            let lv = this.getLv(tid);
            if (lv == 0) {
                return 0;
            }
            let sysInfo = App.tableManager.getDataByNameAndId(SysTalentInfo.NAME, tid);
            let sysT = App.tableManager.getDataByNameAndId(SysTalent.NAME, lv);
            let v = sysT[sysInfo.idName];
            if (sysInfo.talentType == 1) {
                return v;
            }
            else if (sysInfo.talentType == 2) {
                return v / 100;
            }
            return v;
        }
        lvUp(id) {
            let res = this.canLvUp();
            if (res != 0) {
                return res;
            }
            this.lvTimes++;
            let sys = App.tableManager.getDataByNameAndId(SysTalentCost.NAME, (this.lvTimes + 1));
            Session.homeData.changeGold(GoldType.GOLD, -sys.talentCost);
            this.talentLvMap[id] = this.getLv(id) + 1;
            App.sendEvent(GameEvent.TALENT_UPDATE);
            Session.saveData();
            this.updateAttribute();
            return res;
        }
        getGold() {
            let sys = App.tableManager.getDataByNameAndId(SysTalentCost.NAME, (this.lvTimes + 1));
            return sys.talentCost;
        }
        haveGold() {
            let g = Session.homeData.getGoldByType(GoldType.GOLD);
            let sys = App.tableManager.getDataByNameAndId(SysTalentCost.NAME, (this.lvTimes + 1));
            return g >= sys.talentCost;
        }
        canLvUp() {
            if (this.haveGold() == false) {
                return -1;
            }
            if (this.lvTimes >= Session.homeData.playerLv) {
                return -2;
            }
            return 0;
        }
        canLvUp2() {
            return this.canLvUp() == 0;
        }
    }

    class UserData {
        constructor() {
        }
        setData(data) {
        }
        saveData(data) {
        }
        initData(data) {
        }
    }

    class TaskData {
        constructor() {
        }
        setData(data) {
        }
        saveData(data) {
        }
        initData(data) {
        }
    }

    class TimeGoldData {
        constructor() {
            this.gold = 0;
            this.reward_min = 0;
            this.endTime = 0;
            this.startTime = 0;
        }
        setData(data) {
            this.endTime = data.endTime;
            this.reward_min = data.reward_min;
            this.gold = data.gold;
            this.dataServerFun();
        }
        saveData(data) {
            data.endTime = this.endTime;
            data.reward_min = this.reward_min;
            data.gold = this.gold;
        }
        initData(data) {
            this.startNewDay();
            this.goldTimeStart();
        }
        initFun() {
            this.startNewDay();
            this.goldTimeStart();
        }
        loopFun() {
            let ctime = Math.min(Laya.Browser.now(), this.endTime);
            let now_min_time = this.getMinByTime(ctime);
            if (this.reward_min != now_min_time) {
                this.addGoldOnce();
                this.reward_min = now_min_time;
            }
        }
        dataServerFun() {
            this.startTime = this.endTime - TimeGoldData.ONE_DAY;
            let nowMin = 0;
            if (this.endTime < Laya.Browser.now()) {
                nowMin = this.getMinByTime(this.endTime);
            }
            else {
                nowMin = this.getMinByTime(Laya.Browser.now());
            }
            let rgold = (nowMin - this.reward_min) * this.getOneGold();
            this.reward_min = nowMin;
            this.setGold(this.gold + rgold);
            this.goldTimeStart();
        }
        goldTimeStart() {
            Laya.timer.frameLoop(1, this, this.loopFun);
        }
        rewardGold(useAd) {
            let agold = this.gold;
            if (useAd) {
                agold = this.gold * 3;
            }
            Session.homeData.changeGold(GoldType.GOLD, agold);
            this.setGold(0);
            if (this.endTime <= Laya.Browser.now()) {
                this.startNewDay();
            }
            Session.saveData();
        }
        startNewDay() {
            this.endTime = Laya.Browser.now() + TimeGoldData.ONE_DAY;
            this.startTime = this.endTime - TimeGoldData.ONE_DAY;
            this.reward_min = 0;
        }
        getMinByTime(time) {
            let t = time - this.startTime;
            return Math.floor(t / (60 * 1000));
        }
        getNowTime() {
            if (this.endTime < Laya.Browser.now()) {
                return [0, 0, 0, 0];
            }
            let t = this.endTime - Laya.Browser.now();
            let arr = this.getLeft(t, 3600 * 1000);
            let hour = arr[0];
            arr = this.getLeft(arr[1], 60 * 1000);
            let min = arr[0];
            arr = this.getLeft(arr[1], 1000);
            let second = arr[0];
            arr = this.getLeft(arr[1], 1);
            let ms = arr[0];
            return [hour, min, second, ms];
        }
        addGoldOnce() {
            this.setGold(this.gold + this.getOneGold());
            this.reward_min = this.getMinByTime(Laya.Browser.now());
            Session.saveData();
        }
        getOneGold() {
            let max = Session.homeData.chapterId;
            let addGold = Math.ceil(max / 2 + 1);
            addGold = 2;
            addGold = addGold * (1 + Session.talentData.offlineGold);
            addGold = parseInt(addGold + "");
            return addGold;
        }
        setGold(value) {
            this.gold = value;
        }
        getLeft(t, v) {
            let a = parseInt((t / v) + "");
            let b = t - a * v;
            return [a, b];
        }
    }
    TimeGoldData.ONE_DAY = 24 * 60 * 60 * 1000;

    class SysMap {
        constructor() {
            this.id = 0;
            this.stageId = 0;
            this.stageGroup = '';
            this.numEnemy = 0;
            this.mixEnemy = 0;
            this.maxEnemy = 0;
            this.enemyGroup = '';
        }
        static getData(chaterId, mapId) {
            let arr = SysMap.dic[chaterId];
            let size = arr.length;
            for (var i = 0; i < size; i++) {
                if ((i + 1) == mapId) {
                    return arr[i];
                }
            }
            return null;
        }
        static getTotal(chaterId) {
            let arr = SysMap.dic[chaterId];
            return arr.length;
        }
    }
    SysMap.NAME = 'sys_stageinfo.txt';
    SysMap.dic = {};

    class RankData {
        constructor() {
        }
        setData(data) {
        }
        saveData(data) {
        }
        initData(data) {
        }
        saveWorldRank() {
            let obj = {};
            obj.skey = Session.SKEY;
            obj.name = "荒野女枪";
            obj.scorestr = this.getStageNum();
            obj.url = "main/suo.png";
            obj.item = 0;
            if (Laya.Browser.onMiniGame == false) {
                App.http(App.serverIP + "gamex3/saveRank", obj, "post");
                return;
            }
            if (App.sdkManager.haveRight == false) {
                return;
            }
            obj.name = App.sdkManager.wxName;
            obj.url = App.sdkManager.wxHead;
            App.http(App.serverIP + "gamex3/saveRank", obj, "post");
        }
        getStageNum() {
            let t = 0;
            for (let i = 1; i < Session.homeData.chapterId; i++) {
                t += SysMap.getTotal(i);
            }
            t += Session.homeData.mapIndex;
            return t;
        }
        getRank(caller, listener) {
            let obj = {};
            obj.skey = Session.SKEY;
            obj.st = 0;
            obj.et = 50;
            App.http(App.serverIP + "gamex3/getRank", obj, "GET", caller, listener);
        }
        saveFriendRank() {
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            var obj = {};
            var o1 = {};
            o1.key = "stageNum";
            o1.value = Session.homeData.chapterId + "";
            obj["KVDataList"] = [o1];
            obj.success = (res) => {
                console.log("存储好友排行榜成功", res);
            };
            obj.fail = (res) => {
                console.log("存储好友排行榜失败", res);
            };
            Laya.Browser.window.wx.setUserCloudStorage(obj);
        }
    }

    class Session {
        static init() {
            Session.homeData = new HomeData();
            Session.talentData = new TalentData();
            Session.taskData = new TaskData();
            Session.userData = new UserData();
            Session.heroData = new HeroData();
            Session.timeGoldData = new TimeGoldData();
            Session.rankData = new RankData();
            Session.IDataArr.push(Session.homeData);
            Session.IDataArr.push(Session.talentData);
            Session.IDataArr.push(Session.taskData);
            Session.IDataArr.push(Session.userData);
            Session.IDataArr.push(Session.heroData);
            Session.IDataArr.push(Session.timeGoldData);
        }
        static saveData() {
            for (let i of Session.IDataArr) {
                i.saveData(Session.gameData);
            }
            SenderHttp.create().send();
        }
        static parseData(str) {
            if (str != "" && str != "0") {
                Session.gameData = JSON.parse(str);
                for (let i of Session.IDataArr) {
                    i.setData(Session.gameData);
                }
                Log.log(LOG_TYPE.LOGIN);
            }
            else {
                for (let i of Session.IDataArr) {
                    i.initData(Session.gameData);
                }
                Session.saveData();
                Log.log(LOG_TYPE.REG);
            }
        }
        static configFun() {
            for (let i of Session.IDataArr) {
                i.initData(Session.gameData);
            }
            Session.saveData();
        }
    }
    Session.gameData = {};
    Session.homeData = null;
    Session.talentData = null;
    Session.userData = null;
    Session.taskData = null;
    Session.heroData = null;
    Session.timeGoldData = null;
    Session.rankData = null;
    Session.IDataArr = [];

    class Log {
        constructor() {
        }
        static init() {
        }
        static log(type, content = "") {
            var arr = [];
            arr.push(Laya.Browser.now());
            arr.push(Game.codeVer);
            arr.push(Session.SKEY);
            arr.push(0);
            arr.push(Log.onlyid);
            arr.push(type);
            arr.push(content);
            arr.push(App.sdkManager.wxName);
            let str = arr.join("\t");
            App.http(App.serverIP + "gamex2/gamelog", "log=" + str, "post");
        }
    }
    Log.onlyid = Math.random();
    var LOG_TYPE;
    (function (LOG_TYPE) {
        LOG_TYPE[LOG_TYPE["REG"] = 0] = "REG";
        LOG_TYPE[LOG_TYPE["LOGIN"] = 1] = "LOGIN";
    })(LOG_TYPE || (LOG_TYPE = {}));

    class SdkManager {
        constructor() {
            this.haveRight = false;
            this.wxName = null;
            this.wxHead = null;
            this.adMap = {};
            this.lastAdSucTime = 0;
            this.currentAdType = 0;
            this.adHandler = null;
            this.adStat = 0;
            this.errCode = 0;
            this.shareStartTime = 0;
            this.shareTimes = 0;
            this.shareTime = 0;
            this.bannerArray = [];
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            Laya.Browser.window.wx.updateShareMenu({});
            Laya.Browser.window.wx.showShareMenu({});
            Laya.Browser.window.wx.onShareAppMessage(() => {
                return this.getShareObject();
            });
            Laya.Browser.window.wx.getSetting({
                success: res => {
                    if (res.authSetting["scope.userInfo"] == true) {
                        console.log("已经有授权了");
                        this.getUserInfo();
                    }
                    else {
                        this.haveRight = false;
                        console.log("没有授权");
                    }
                }
            });
            Laya.Browser.window.wx.setKeepScreenOn({ keepScreenOn: true });
            Laya.Browser.window.wx.onShow((res) => {
                App.sendEvent(GameEvent.WX_ON_SHOW);
            });
            Laya.Browser.window.wx.onHide((res) => {
                App.sendEvent(GameEvent.WX_ON_HIDE);
            });
            const updateManager = Laya.Browser.window.wx.getUpdateManager();
            updateManager.onCheckForUpdate(function (res) {
                console.log("版本更新回调:", res.hasUpdate);
            });
            updateManager.onUpdateReady(function () {
                Laya.Browser.window.wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好，是否重启应用？',
                    success: function (res) {
                        if (res.confirm) {
                            updateManager.applyUpdate();
                        }
                    }
                });
            });
            updateManager.onUpdateFailed(function () {
            });
            let btn = {};
            btn.type = "image";
            let sty = {};
            sty.left = 0;
            sty.top = 400;
            sty.width = 44;
            sty.height = 44;
            sty.textAlign = "center";
            sty.fontSize = 28;
            sty.lineHeight = 30;
            btn.style = sty;
            btn.icon = "green";
            this.gameClubButton = Laya.Browser.window.wx.createGameClubButton(btn);
            Laya.timer.callLater(this, this.callLaterFun);
        }
        getUserInfo() {
            Laya.Browser.window.wx.getUserInfo({
                success: (res) => {
                    var userInfo = res.userInfo;
                    this.wxName = userInfo.nickName;
                    this.wxHead = userInfo.avatarUrl;
                    var gender = userInfo.gender;
                    var province = userInfo.province;
                    var city = userInfo.city;
                    var country = userInfo.country;
                    console.log("已经授权了:", this.wxName, this.wxHead);
                    this.haveRight = true;
                }
            });
        }
        callLaterFun() {
            this.initAd();
        }
        log(type, content = "") {
            Log.log(type, content);
        }
        initAd() {
            if (Laya.Browser.onMiniGame) {
                this.adMap[AD_TYPE.AD_REBORTH] = "adunit-dd859bd89e519faa";
                this.adMap[AD_TYPE.AD_BATTLE10] = "adunit-fb55742c910f9809";
                this.adMap[AD_TYPE.AD_CHANGE_SKILL] = "adunit-dd78193a76256a8b";
            }
            this.ad = Laya.Browser.window.wx.createRewardedVideoAd({ adUnitId: this.adMap[AD_TYPE.AD_REBORTH] });
            this.ad.onClose((res) => {
                console.log("广告 观看结果返回");
                if (res && res.isEnded || res === undefined) {
                    this.lastAdSucTime = Laya.Browser.now();
                    this.exeHandler();
                    this.log(LogType.AD_SUC_OVER, this.currentAdType + "");
                    App.sendEvent(GameEvent.AD_OVER);
                }
            });
            this.ad.onError(err => {
                this.adStat = 2;
                this.errCode = err.errCode;
                console.log("广告 加载错误:", err);
                if (this.errCode == 1004) {
                    console.log("加载视频失败,30秒后重试");
                    Laya.timer.once(30 * 1000, this, this.retryAdFun);
                }
                this.log(LogType.AD_FAIL, this.errCode + "");
            });
            this.ad.onLoad(() => {
                this.adStat = 1;
                console.log("广告 加载成功-----------------");
            });
        }
        retryAdFun() {
            this.ad.load();
        }
        playAdVideo(code, h) {
            this.currentAdType = code;
            if (Laya.Browser.onMiniGame == false) {
                h.runWith(1);
                App.sendEvent(GameEvent.AD_OVER);
                return;
            }
            if (this.adStat == 2 || this.ad == null) {
                this.share2(h);
                return;
            }
            this.adHandler = h;
            let adid = this.adMap[code];
            Laya.Browser.window.wx.createRewardedVideoAd({ adUnitId: adid });
            this.tryShowAD();
        }
        initAdBtn(sp, type) {
            sp.gray = (this.adStat == 2);
            sp.once(Laya.Event.UNDISPLAY, this, this.adUndisFun, [type]);
        }
        adUndisFun(type) {
        }
        tryShowAD() {
            this.log(LogType.AD_SUC);
            this.ad.show().catch(() => {
                this.ad.load().then(() => this.ad.show()).catch(err => {
                    console.log('广告再加载失败');
                    console.log(err);
                    this.adStat = 2;
                    this.log(LogType.AD_FAIL_2);
                });
            });
        }
        exeHandler() {
            this.adHandler.runWith(1);
        }
        exeHandler2() {
            this.share(this.adHandler);
        }
        share2(h) {
            var obj = this.getShareObject();
            obj.query = "";
            obj.imageUrlId = "";
            Laya.Browser.window.wx.shareAppMessage(obj);
            this.shareStartTime = Laya.Browser.now();
            Laya.stage.once(GameEvent.WX_ON_SHOW, this, this.showFun, [h]);
        }
        share(h, type = 0) {
            this.checkShare();
            if (Laya.Browser.onMiniGame == false) {
                this.shareTimes++;
                h.runWith(1);
                return;
            }
            var obj = this.getShareObject();
            obj.query = "";
            obj.imageUrlId = "";
            Laya.Browser.window.wx.shareAppMessage(obj);
            this.shareStartTime = Laya.Browser.now();
            let chao = this.shareTimes >= SdkManager.SHARE_MAX_TIMES;
            Laya.stage.once(GameEvent.WX_ON_SHOW, this, this.showFun, [chao ? null : h]);
        }
        onlyShare() {
            var obj = this.getShareObject();
            obj.query = "";
            Laya.Browser.window.wx.shareAppMessage(obj);
        }
        showFun(h) {
            if (h == null) {
                FlyUpTips.setTips("分享成功");
                return;
            }
            if ((Laya.Browser.now() - this.shareStartTime) > 2000) {
                this.shareTimes++;
                h.runWith(1);
            }
            else {
                FlyUpTips.setTips("请分享到不同群获得奖励");
            }
        }
        checkShare() {
            let now = new Date();
            let last = new Date(this.shareTime);
            if (now.getDate() != last.getDate()) {
                this.shareTimes = 0;
            }
            this.shareTime = Date.now();
        }
        getShareObject() {
            var arr = ["亲手打造更多的神兵利器，来与恶龙们抗争到底。", "只有我一个，我是独一份、我是限量款、我是天选之子。", "今年只玩骑马合成冲，对抗恶龙，拯救你的大陆。"];
            var obj = {};
            obj.title = App.RandomByArray(arr);
            obj.imageUrl = "https://img.kuwan511.com/arrowLegend/shareImg.jpg";
            return obj;
        }
        savePlayerData(stageNum) {
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            var obj = {};
            var o1 = {};
            o1.key = "stageNum";
            o1.value = stageNum + "";
            obj["KVDataList"] = [o1];
            obj.success = (res) => {
                console.log("存储数据成功", res);
            };
            obj.fail = (res) => {
                console.log("失败", res);
            };
            Laya.Browser.window.wx.setUserCloudStorage(obj);
        }
        showBanner(code) {
            let obj = {};
            obj.adUnitId = code;
            let l = (Laya.Browser.clientWidth - 300) / 2;
            obj.style = { left: l, top: 0, width: 300, height: 125 };
            let b = Laya.Browser.window.wx.createBannerAd(obj);
            b.onResize(res => {
                b.style.top = Laya.Browser.clientHeight - res.height - 20;
            });
            b.show();
            this.bannerArray.push(b);
        }
        hideBanner() {
            for (let i = 0; i < this.bannerArray.length; i++) {
                this.bannerArray[i].hide();
                this.bannerArray[i].destroy();
            }
            this.bannerArray.length = 0;
        }
        addUserInfoBtn(sp, h) {
            var s = Laya.Browser.clientWidth / Laya.stage.width;
            var p = sp.localToGlobal(new Laya.Point(0, 0));
            var btnX = p.x * s;
            var btnY = p.y * s;
            var btnwid = sp.width * s;
            var btnhei = sp.height * s;
            this.userInfoButton = Laya.Browser.window.wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: btnX,
                    top: btnY,
                    width: btnwid,
                    height: btnhei,
                    lineHeight: 40,
                    backgroundColor: '#ffffff00',
                    color: '',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 0,
                    borderColor: "#ffffff"
                }
            });
            this.userInfoButton.onTap((res) => {
                if (res.errMsg == "getUserInfo:ok") {
                    this.wxName = res.userInfo.nickName;
                    this.wxHead = res.userInfo.avatarUrl;
                    this.haveRight = true;
                    h.run();
                    this.undisFun();
                }
            });
            sp.once(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            if (this.userInfoButton) {
                this.userInfoButton.destroy();
                this.userInfoButton = null;
            }
        }
        chaPingAd(type, handler) {
            if (Laya.Browser.window.wx.createInterstitialAd == null) {
                handler.run();
                return;
            }
            if ((Laya.Browser.now() - this.lastAdSucTime) < 3 * 60 * 1000) {
                handler.run();
                return;
            }
            if (this.canUse("2.6.0") == false) {
                handler.run();
                return;
            }
            let code = this.adMap[type];
            if (code == null) {
                handler.run();
                return;
            }
            let obj = {};
            obj.adUnitId = code;
            let ad = Laya.Browser.window.wx.createInterstitialAd(obj);
            ad.show().catch((err) => {
                console.error("插屏广告:", err);
            });
            ad.onClose(() => {
                handler.run();
            });
        }
        canUse(str) {
            return this.compareVersion(str) >= 0;
        }
        compareVersion(v) {
            let now = Laya.Browser.window.wx.getSystemInfoSync().SDKVersion;
            let v1 = v.split('.');
            let v2 = now.split('.');
            const len = Math.max(v1.length, v2.length);
            while (v1.length < len) {
                v1.push('0');
            }
            while (v2.length < len) {
                v2.push('0');
            }
            for (let i = 0; i < len; i++) {
                const num1 = parseInt(v1[i]);
                const num2 = parseInt(v2[i]);
                if (num1 > num2) {
                    return 1;
                }
                else if (num1 < num2) {
                    return -1;
                }
            }
            return 0;
        }
    }
    SdkManager.FLY_BOX = 0;
    SdkManager.GAME_OVER = 1;
    SdkManager.GET_PET = 2;
    SdkManager.TIME_GOLD = 3;
    SdkManager.TREASURE = 4;
    SdkManager.ZHUAN = 5;
    SdkManager.AD_DIALOG = 7;
    SdkManager.NEXT_STAGE_CHAPING = 6;
    SdkManager.REBORTH = 11;
    SdkManager.SHARE_MAX_TIMES = 6;
    var AD_STAT;
    (function (AD_STAT) {
        AD_STAT[AD_STAT["DIALOG_OPEN"] = 0] = "DIALOG_OPEN";
        AD_STAT[AD_STAT["DIALOG_CLOSE"] = 1] = "DIALOG_CLOSE";
        AD_STAT[AD_STAT["VEDIO_CLICK"] = 2] = "VEDIO_CLICK";
        AD_STAT[AD_STAT["VEDIO_FAIL"] = 3] = "VEDIO_FAIL";
        AD_STAT[AD_STAT["VEDIO_SUC"] = 4] = "VEDIO_SUC";
        AD_STAT[AD_STAT["REWARD"] = 5] = "REWARD";
        AD_STAT[AD_STAT["NO_HAVE"] = 6] = "NO_HAVE";
    })(AD_STAT || (AD_STAT = {}));

    class DialogManager {
        constructor() {
            this.dialogMap = {};
        }
        register(dialogName, dialogClass, res = null) {
            this.dialogMap[dialogName] = [dialogClass, res];
        }
        open(dialogName) {
            let arr = this.dialogMap[dialogName];
            Laya.loader.load(arr[1], new Laya.Handler(this, this.loaderFun, [dialogName]));
        }
        loaderFun(dialogName) {
            let arr = this.dialogMap[dialogName];
            let dc = arr[0];
            let a = new dc();
            a.popup(true, a.isShowEffect);
            a.once(Laya.Event.UNDISPLAY, this, this.undisFun, [a]);
        }
        undisFun(a) {
            a.destroy(true);
        }
    }

    class GameSoundManager {
        constructor() {
            this.bgmMap = {};
            this.currentWxSound = null;
            this.bgmUrl = null;
            this.noBgm = false;
            this.noEff = false;
            Laya.timer.callLater(this, this.initEvent);
        }
        onWX_ON_SHOW() {
            if (Laya.Browser.onMiniGame && this.currentWxSound) {
                this.currentWxSound.play();
            }
        }
        onWX_ON_HIDE() {
            if (Laya.Browser.onMiniGame && this.currentWxSound) {
                this.currentWxSound.pause();
            }
        }
        initEvent() {
            Laya.stage.once(GameEvent.WX_ON_SHOW, this, this.onWX_ON_SHOW);
            Laya.stage.once(GameEvent.WX_ON_HIDE, this, this.onWX_ON_HIDE);
            Laya.stage.once(GameEvent.AD_OVER, this, this.onWX_ON_SHOW);
        }
        openSceneFun(url) {
            if (this.bgmMap[url]) {
                this.playBgm(this.bgmMap[url]);
            }
        }
        reg(url, bgm) {
            this.bgmMap[url] = bgm;
            if (url == GameSoundManager.BTN) {
                Laya.stage.on(Laya.Event.CLICK, this, this.clickFun);
            }
        }
        clickFun(e) {
            if (e.target instanceof Laya.Button) {
                this.playEffect(this.bgmMap[GameSoundManager.BTN]);
            }
        }
        playBgm(url) {
            this.bgmUrl = url;
            if (Laya.Browser.onMiniGame) {
                if (this.currentWxSound) {
                    this.currentWxSound.stop();
                    this.currentWxSound.destroy();
                    this.currentWxSound = null;
                }
                let wxSound = Laya.Browser.window.wx.createInnerAudioContext();
                wxSound.autoplay = true;
                wxSound.loop = true;
                wxSound.src = Laya.URL.basePath + url;
                this.currentWxSound = wxSound;
                this.setBgmMuted(this.noBgm);
            }
            else {
                Laya.SoundManager.playMusic(url);
            }
        }
        setBgmMuted(v) {
            this.noBgm = v;
            if (Laya.Browser.onMiniGame && this.currentWxSound) {
                if (v) {
                    this.currentWxSound.volume = 0;
                }
                else {
                    this.currentWxSound.volume = 0.5;
                }
            }
            else {
                Laya.SoundManager.musicMuted = v;
            }
        }
        setEffMuted(v) {
            this.noEff = v;
        }
        stopBgm() {
            if (Laya.Browser.onMiniGame) {
                if (this.currentWxSound) {
                    this.currentWxSound.stop();
                    this.currentWxSound.destroy();
                    this.currentWxSound = null;
                    console.log("音频已经销毁");
                }
            }
            else {
                Laya.SoundManager.stopMusic();
            }
        }
        playEffect(url) {
            if (this.noEff) {
                return;
            }
            if (Laya.Browser.onMiniGame) {
                let b = Laya.Pool.getItem(url);
                if (b == null) {
                    new WXSound(url);
                }
                else {
                    b.play();
                }
            }
            else {
                Laya.SoundManager.playSound(url);
            }
        }
    }
    GameSoundManager.BTN = "BTN";
    class WXSound {
        constructor(url) {
            this.url = url;
            this.wxSound = Laya.Browser.window.wx.createInnerAudioContext();
            this.wxSound.autoplay = true;
            this.wxSound.loop = false;
            this.wxSound.src = Laya.URL.basePath + url;
            this.wxSound.onEnded(() => {
                Laya.Pool.recover(this.url, this.wxSound);
            });
        }
    }

    class App {
        static init() {
            App.layerManager = new LayerManager();
            App.tableManager = new TableManager();
            App.soundManager = new SoundManager();
            App.sdkManager = new SdkManager();
            App.gameSoundManager = new GameSoundManager();
        }
        static sendEvent(event, data) {
            Laya.stage.event(event, data);
        }
        static isSimulator() {
            if (Laya.Browser.onMiniGame) {
                return Laya.Browser.window.wx.getSystemInfoSync().brand == "devtools";
            }
            else {
                return false;
            }
        }
        static RandomByArray(arr, deleteArr = false) {
            let value = Math.random() * arr.length;
            let index = Math.floor(value);
            let resvalue = arr[index];
            if (deleteArr) {
                arr.splice(index, 1);
            }
            return resvalue;
        }
        static http(url, data, method, caller = null, listener = null, args = null) {
            var http = new Laya.HttpRequest();
            let arr = [];
            let str = "";
            if (typeof data === 'string') {
                str = data;
            }
            else {
                for (let k in data) {
                    arr.push(k + "=" + data[k]);
                }
                str = arr.join("&");
            }
            if (method == "GET") {
                url = url + "?" + str;
                data = null;
            }
            http.send(url, str, method);
            if (caller && listener) {
                http.once(Laya.Event.COMPLETE, caller, listener, args);
            }
            return http;
        }
    }
    App.top = 10;
    App.platformId = 0;
    App.layerManager = null;
    App.tableManager = null;
    App.soundManager = null;
    App.sdkManager = null;
    App.eventManager = new Laya.EventDispatcher();
    App.dialogManager = new DialogManager();
    App.gameSoundManager = null;

    class SysEnemy {
        constructor() {
            this.id = 0;
            this.moveType = 0;
            this.moveSpeed = 0;
            this.zoomMode = 0;
            this.zoomShadow = 0;
            this.enemyHp = 0;
            this.enemyAttack = 0;
            this.enemyBlack = 0;
            this.enemySpeed = 0;
            this.normalAttack = 0;
            this.skillId = '';
            this.isBoss = 0;
            this.enemymode = 0;
            this.enemyAi = 0;
            this.txt = '';
            this.enemyLevel = 0;
            this.dropGold = 0;
            this.dropExp = 0;
            this.heroExp = 0;
            this.dropItem = 0;
        }
    }
    SysEnemy.NAME = 'sys_enemy.txt';

    class BattleFlagID {
    }
    BattleFlagID.GUIDE = 10000;
    BattleFlagID.HERO = 9999;
    BattleFlagID.DOOR = 9998;
    BattleFlagID.ANGLE = 9997;
    BattleFlagID.OTHER_NPC = 9996;

    class GridType {
        static isRiverPoint(type) {
            return type >= 100 && type < 200;
        }
        static isRiverScale9Grid(type) {
            return type > 200 && type < 300;
        }
        static isRiverScale9Grid2(type) {
            return type > 900 && type < 1000;
        }
        static isRiverRow(type) {
            return type > 400 && type < 500;
        }
        static isRiverCol(type) {
            return type > 300 && type < 400;
        }
        static isThorn(type) {
            return type >= 500 && type < 600;
        }
        static isFlower(type) {
            return type >= 801 && type <= 804;
        }
        static isWall(type) {
            return (type >= 1000 && type <= 5500);
        }
        static isCube(type) {
            return (type >= 1000 && type <= 5500) || (type >= 1 && type <= 10);
        }
        static isFence(type) {
            return type >= 700 && type < 800;
        }
        static isRiverCube(type) {
            return type == 900;
        }
        static isMonster(type) {
            return type > 10000;
        }
        static isSawHeng(type) {
            return type >= 50 && type < 60;
        }
        static isSawZong(type) {
            return type >= 60 && type < 70;
        }
        static isNpc(type) {
            return type == BattleFlagID.ANGLE || type == BattleFlagID.OTHER_NPC;
        }
    }

    class SysBullet {
        constructor() {
            this.id = 0;
            this.nameTxt = '';
            this.txt = '';
            this.bulletCd = 0;
            this.bulletType = 0;
            this.bulletMode = 0;
            this.boomEffect = 0;
            this.mixNum = 0;
            this.maxNum = 0;
            this.bulletAngle = 0;
            this.bulletNum = 0;
            this.bulletSpeed = 0;
            this.bulletBlock = 0;
            this.bulletEjection = 0;
            this.ejectionNum = 0;
            this.bulletsAoe = 0;
            this.attackAngle = 0;
            this.bulletSplit = 0;
            this.splitNum = 0;
            this.triggerComparison = 0;
            this.skilltarget = 0;
            this.callInfo = '';
            this.damagePercent = 0;
            this.skillEffect1 = 0;
            this.attackDistance = 0;
        }
    }
    SysBullet.NAME = 'sys_bullet.txt';

    class GameShaderObj extends Laya.EventDispatcher {
        constructor() {
            super();
            if (GameShaderObj.init_) {
                this.initShader();
                GameShaderObj.init_ = true;
            }
        }
        setShader0(sp3d, type) {
            if (type == 8000 && !GameShaderObj.sp) {
                GameShaderObj.sp = sp3d;
            }
        }
        initShader() {
            var attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0,
                'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
                'a_Texcoord': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
                'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0,
                'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0
            };
            var uniformMap = {
                'u_Bones': Laya.Shader3D.PERIOD_CUSTOM,
                'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
                'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
                'u_texture': Laya.Shader3D.PERIOD_MATERIAL,
                'u_marginalColor': Laya.Shader3D.PERIOD_MATERIAL,
                'u_DirectionLight.Direction': Laya.Shader3D.PERIOD_SCENE,
                'u_DirectionLight.Color': Laya.Shader3D.PERIOD_SCENE
            };
            var vs = `
        #include "Lighting.glsl";
        attribute vec4 a_Position;
        attribute vec2 a_Texcoord;
        attribute vec3 a_Normal;
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        varying vec2 v_Texcoord;
        varying vec3 v_Normal;
        #ifdef BONE
        attribute vec4 a_BoneIndices;
        attribute vec4 a_BoneWeights;
        const int c_MaxBoneCount = 24;
        uniform mat4 u_Bones[c_MaxBoneCount];
        #endif
        #if defined(DIRECTIONLIGHT)
        varying vec3 v_PositionWorld;
        #endif
        void main()
        {
        #ifdef BONE
        mat4 skinTransform=mat4(0.0);
        skinTransform += u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
        skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
        skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
        skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
        vec4 position = skinTransform * a_Position;
        gl_Position=u_MvpMatrix * position;
        mat3 worldMat=mat3(u_WorldMat * skinTransform);
        #else
        gl_Position=u_MvpMatrix * a_Position;
        mat3 worldMat=mat3(u_WorldMat);
        #endif
        v_Texcoord=a_Texcoord;
        v_Normal=worldMat*a_Normal;
        #if defined(DIRECTIONLIGHT)
        #ifdef BONE
        v_PositionWorld=(u_WorldMat*position).xyz;
        #else
        v_PositionWorld=(u_WorldMat*a_Position).xyz;
        #endif
        #endif
        gl_Position=remapGLPositionZ(gl_Position); 
        }`;
            var ps = `
        #ifdef FSHIGHPRECISION
        precision highp float;
        #else
        precision mediump float;
        #endif
        #include "Lighting.glsl";
        varying vec2 v_Texcoord;
        uniform sampler2D u_texture;
        uniform vec3 u_marginalColor;
        varying vec3 v_Normal;
        #if defined(DIRECTIONLIGHT)
        uniform vec3 u_CameraPos;
        varying vec3 v_PositionWorld;
        uniform DirectionLight u_DirectionLight;
        #endif
        void main()
        {
        gl_FragColor=texture2D(u_texture,v_Texcoord);
        vec3 normal=normalize(v_Normal);
        vec3 toEyeDir = normalize(u_CameraPos-v_PositionWorld);
        float Rim = 1.0 - max(0.0,dot(toEyeDir, normal));
        vec3 Emissive = 15.0 * u_DirectionLight.Color * u_marginalColor * pow(Rim,3.0); 
        gl_FragColor = texture2D(u_texture, v_Texcoord) + vec4(Emissive,1.0);
        }`;
            var customShader = Laya.Shader3D.add("CustomShader");
            var subShader = new Laya.SubShader(attributeMap, uniformMap, Laya.SkinnedMeshSprite3D.shaderDefines);
            customShader.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }
    GameShaderObj.init_ = true;

    class CustomMaterial extends Laya.BaseMaterial {
        constructor() {
            super();
            this._addReference(3);
            this.setShaderName("CustomShader");
        }
        get diffuseTexture() {
            return this._shaderValues.getTexture(CustomMaterial.DIFFUSETEXTURE);
        }
        set diffuseTexture(value) {
            this._shaderValues.setTexture(CustomMaterial.DIFFUSETEXTURE, value);
        }
        set marginalColor(value) {
            this._shaderValues.setVector(CustomMaterial.MARGINALCOLOR, value);
        }
    }
    CustomMaterial.DIFFUSETEXTURE = Laya.Shader3D.propertyNameToID("u_texture");
    CustomMaterial.MARGINALCOLOR = Laya.Shader3D.propertyNameToID("u_marginalColor");

    class MonsterShader extends GameShaderObj {
        constructor(sp) {
            super();
            this.spArr = [];
            this.cpArr = [];
            this.sp = sp;
            for (let i = 0; i < 1; i++) {
                if (sp.getChildAt(i) instanceof Laya.Sprite3D) {
                    var ssp = sp.getChildAt(i);
                    for (let j = 0; j < ssp._children.length; j++) {
                        if (ssp._children[j] instanceof Laya.SkinnedMeshSprite3D) {
                            var sm = ssp._children[j];
                            if (!this.spArr[i]) {
                                this.spArr[i] = [];
                                this.cpArr[i] = [];
                            }
                            this.spArr[i][j] = sm.skinnedMeshRenderer.sharedMaterials;
                            this.cpArr[i][j] = sm.skinnedMeshRenderer.sharedMaterials;
                            this.initShander(i, j);
                        }
                    }
                }
            }
        }
        initShander(i, j) {
            var sms = this.spArr[i][j];
            var cms = [];
            this.cpArr[i][j] = cms;
            for (let k = 0; k < sms.length; k++) {
                var bm = sms[k];
                let cm = new CustomMaterial();
                cms.push(cm);
                var bdata = bm._shaderValues.getData();
                var tx;
                for (let key in bdata) {
                    var data = bdata[key];
                    if (data instanceof Laya.Texture2D) {
                        tx = data;
                        cm.diffuseTexture = tx;
                    }
                }
                cm.marginalColor = new Laya.Vector3(1, 1, 1);
            }
        }
        clearShader() {
            if (!this.sp) {
                return;
            }
            for (let i = 0; i < 1; i++) {
                if (this.sp.getChildAt(i) instanceof Laya.Sprite3D) {
                    var ssp = this.sp.getChildAt(i);
                    for (let j = 0; j < ssp._children.length; j++) {
                        if (ssp._children[j] instanceof Laya.SkinnedMeshSprite3D) {
                            var sm = ssp._children[j];
                            var sms = sm.skinnedMeshRenderer.sharedMaterials;
                            for (let k = 0; k < sms.length; k++) {
                                let cm = sms[k];
                                var bdata = cm._shaderValues.getData();
                                for (let key in bdata) {
                                    var data = bdata[key];
                                    if (data instanceof Laya.Texture2D) {
                                        data && data.destroy();
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.cpArr.length = this.spArr.length = 0;
        }
        setShader0(sp, k) {
            for (let i = 0; i < 1; i++) {
                if (sp.getChildAt(i) instanceof Laya.Sprite3D) {
                    var ssp = sp.getChildAt(i);
                    for (let j = 0; j < ssp._children.length; j++) {
                        if (ssp._children[j] instanceof Laya.SkinnedMeshSprite3D) {
                            var sm = ssp._children[j];
                            if (k == 0) {
                                sm.skinnedMeshRenderer.sharedMaterials = this.spArr[i][j];
                            }
                            else {
                                sm.skinnedMeshRenderer.sharedMaterials = this.cpArr[i][j];
                            }
                        }
                    }
                }
            }
        }
    }
    MonsterShader.map = {};

    var Point = Laya.Point;
    class MaoLineTest {
        static intersectionP(u1, u2, v1, v2) {
            var ret = new Point(u1.x, u1.y);
            var t = ((u1.x - v1.x) * (v1.y - v2.y) - (u1.y - v1.y) * (v1.x - v2.x)) / ((u1.x - u2.x) * (v1.y - v2.y) - (u1.y - u2.y) * (v1.x - v2.x));
            ret.x += (u2.x - u1.x) * t;
            ret.y += (u2.y - u1.y) * t;
            return ret;
        }
        static intersectionMao(u, v) {
            return MaoLineTest.intersectionP(u.p0, u.p1, v.p0, v.p1);
        }
        static simpleLineTestXY(l1p1x, l1p1y, l1p2x, l1p2y, l2p1x, l2p1y, l2p2x, l2p2y, u, v) {
            var line1p1;
            line1p1 = (l1p2x - l1p1x) * (l2p1y - l1p1y) - (l2p1x - l1p1x) * (l1p2y - l1p1y);
            var line1p2;
            line1p2 = (l1p2x - l1p1x) * (l2p2y - l1p1y) - (l2p2x - l1p1x) * (l1p2y - l1p1y);
            var line2p1;
            line2p1 = (l2p2x - l2p1x) * (l1p1y - l2p1y) - (l1p1x - l2p1x) * (l2p2y - l2p1y);
            var line2p2;
            line2p2 = (l2p2x - l2p1x) * (l1p2y - l2p1y) - (l1p2x - l2p1x) * (l2p2y - l2p1y);
            if ((line1p1 * line1p2 <= 0) && (line2p1 * line2p2 <= 0)) {
                return MaoLineTest.intersectionMao(u, v);
            }
            else {
                return null;
            }
        }
        static simpleLineTestMao(u, v) {
            return MaoLineTest.simpleLineTestXY(u.p0.x, u.p0.y, u.p1.x, u.p1.y, v.p0.x, v.p0.y, v.p1.x, v.p1.y, u, v);
        }
    }

    var Point$1 = Laya.Point;
    class MaoLineData {
        constructor(x0, y0, x1, y1) {
            this.p0_ = new Point$1();
            this.p1_ = new Point$1();
            this.p0_.x = x0;
            this.p0_.y = y0;
            this.p1_.x = x1;
            this.p1_.y = y1;
        }
        reset(x0, y0, x1, y1) {
            this.p0_.x = x0;
            this.p0_.y = y0;
            this.p1_.x = x1;
            this.p1_.y = y1;
        }
        reset00(x0, y0) {
            var l = this.getlen();
            var rad = this.atan2();
            this.p0_.x = x0;
            this.p0_.y = y0;
            this.p1_.x = x0 + Math.cos(rad) * l;
            this.p1_.y = y0 + Math.sin(rad) * l;
        }
        resetlen(len) {
            var l = len;
            var rad = this.atan2();
            this.p1_.x = this.p0_.x + Math.cos(rad) * l;
            this.p1_.y = this.p0_.y + Math.sin(rad) * l;
        }
        draw(g, linecolor, lw = 1) {
            g.drawLine(this.p0_.x, this.p0_.y, this.p1_.x, this.p1_.y, linecolor, lw);
        }
        get p0() {
            return this.p0_;
        }
        get p1() {
            return this.p1_;
        }
        set x0(value) {
            this.p0_.x = value;
        }
        get x0() {
            return this.p0_.x;
        }
        set y0(value) {
            this.p0_.y = value;
        }
        get y0() {
            return this.p0_.y;
        }
        set x1(value) {
            this.p1_.x = value;
        }
        get x1() {
            return this.p1_.x;
        }
        set y1(value) {
            this.p1_.y = value;
        }
        get y1() {
            return this.p1_.y;
        }
        get x_len() {
            return (this.x1 - this.x0);
        }
        get y_len() {
            return (this.y1 - this.y0);
        }
        getlen() {
            var xl = this.x_len;
            var yl = this.y_len;
            return Math.sqrt((xl * xl) + (yl * yl));
        }
        getF0() {
            var xl = this.x_len;
            var yl = this.y_len;
            return new MaoLineData(this.x0, this.y0, this.x0 - yl, this.y0 + xl);
        }
        getF1() {
            var xl = this.x_len;
            var yl = this.y_len;
            return new MaoLineData(this.x0, this.y0, this.x0 + yl, this.y0 - xl);
        }
        lineTest(other) {
            return MaoLineTest.simpleLineTestMao(this, other);
        }
        atan2() {
            return Math.atan2((this.y1 - this.y0), (this.x1 - this.x0));
        }
        rad(rad) {
            var len = this.getlen();
            this.p1.x = this.p0.x + (len * Math.cos(rad));
            this.p1.y = this.p0.y + (len * Math.sin(rad));
            return rad;
        }
        getCenter() {
            var rad = this.atan2();
            var len = this.getlen() / 2;
            return new Laya.Point(this.p0.x + (len * Math.cos(rad)), this.p0.y + (len * Math.sin(rad)));
        }
        rebound(line0) {
            var line0 = line0;
            var linev = this;
            var p = linev.lineTest(line0);
            if (!p) {
                return null;
            }
            var f0 = line0.getF0();
            var f = f0;
            var lengthN = Math.sqrt(f.x_len * f.x_len + f.y_len * f.y_len);
            var n0x = f.x_len / lengthN;
            var n0y = f.y_len / lengthN;
            var nx = -(linev.x_len * n0x + linev.y_len * n0y) * n0x;
            var ny = -(linev.x_len * n0x + linev.y_len * n0y) * n0y;
            var Tx = linev.x_len + nx;
            var Ty = linev.y_len + ny;
            var Fx = 2 * Tx - linev.x_len;
            var Fy = 2 * Ty - linev.y_len;
            var nv = new MaoLineData(p.x, p.y, p.x + Fx, p.y + Fy);
            return nv;
        }
        rebound_error(line0) {
            var linev = this;
            var p = linev.lineTest(line0);
            if (!p) {
                return null;
            }
            var v = new MaoLineData(linev.x0, linev.y0, p.x, p.y);
            var f0l = line0.getlen();
            var n0x = line0.x_len / f0l;
            var n0y = line0.y_len / f0l;
            var nx = -(v.x_len * n0x + v.y_len * n0y) * n0x;
            var ny = -(v.x_len * n0x + v.y_len * n0y) * n0y;
            var Tx = v.x_len + nx;
            var Ty = v.y_len + ny;
            var Fx = 2 * Tx - v.x_len;
            var Fy = 2 * Ty - v.y_len;
            v.reset(p.x, p.y, p.x + Fx, p.y + Fy);
            return v;
        }
        static len(x0, y0, x1, y1) {
            var xx = x1 - x0;
            var yy = y1 - y0;
            return Math.sqrt(xx * xx + yy * yy);
        }
    }

    class GameHitBox {
        constructor(ww, hh) {
            this.x_ = 0;
            this.y_ = 0;
            this.ww_ = 2;
            this.hh_ = 2;
            this.cx_ = 1;
            this.cy_ = 1;
            this.h2_ = 1;
            this.w2_ = 1;
            this.top_ = 0;
            this.left_ = 0;
            this.right_ = 0;
            this.bottom_ = 0;
            this.value = -1;
            this.cdTime = 0;
            this.ww_ = ww;
            this.hh_ = hh;
            this.h2_ = this.hh_ / 2;
            this.w2_ = this.ww_ / 2;
            this.setXY(0, 0);
        }
        setVV(x0, y0, vx, vy) {
            var ax = Math.abs(vx);
            var ay = Math.abs(vy);
            if (ax > 0 && ay > 0) {
                this.ww_ = ax;
                this.hh_ = ay;
                this.h2_ = this.hh_ / 2;
                this.w2_ = this.ww_ / 2;
                this.setXY(Math.min(x0, x0 + vx), Math.min(y0, y0 + vy));
            }
            else if (ax == 0 && ay > 0) {
                this.ww_ = 2;
                this.hh_ = ay;
                this.h2_ = this.hh_ / 2;
                this.w2_ = this.ww_ / 2;
                this.setXY(x0 - 1, Math.min(y0, y0 + vy));
            }
            else if (ax > 0 && ay == 0) {
                this.ww_ = ax;
                this.hh_ = 2;
                this.h2_ = this.hh_ / 2;
                this.w2_ = this.ww_ / 2;
                this.setXY(Math.min(x0, x0 + vx), y0 - 1);
            }
            else {
                this.ww_ = 2;
                this.hh_ = 2;
                this.h2_ = this.hh_ / 2;
                this.w2_ = this.ww_ / 2;
                this.setXY(x0 - 1, y0 - 1);
            }
            return this;
        }
        get ww() {
            return this.ww_;
        }
        get hh() {
            return this.hh_;
        }
        setXY(xx, yy) {
            this.x_ = xx;
            this.y_ = yy;
            this.cx_ = this.x_ + this.w2_;
            this.cy_ = this.y_ + this.h2_;
            this.update();
        }
        setCenter(xx, yy) {
            this.cx_ = xx;
            this.cy_ = yy;
            this.x_ = this.cx_ - this.w2_;
            this.y_ = this.cy_ - this.h2_;
            this.update();
        }
        setRq(x, y, ww, hh) {
            this.ww_ = ww;
            this.hh_ = hh;
            this.h2_ = this.hh_ / 2;
            this.w2_ = this.ww_ / 2;
            this.setXY(x, y);
            return this;
        }
        update() {
            this.top_ = this.y_;
            this.left_ = this.x_;
            this.bottom_ = this.y_ + this.hh_;
            this.right_ = this.x_ + this.ww_;
        }
        get cx() {
            return this.cx_;
        }
        get cy() {
            return this.cy_;
        }
        get x() {
            return this.x_;
        }
        get y() {
            return this.y_;
        }
        get top() {
            return this.top_;
        }
        get bottom() {
            return this.bottom_;
        }
        get left() {
            return this.left_;
        }
        get right() {
            return this.right_;
        }
        hit(b0, b1) {
            return b0.x < b1.right &&
                b0.right > b1.x &&
                b0.y < b1.bottom &&
                b0.bottom > b1.y;
        }
        static faceTo(my, target) {
            var xx = target.cx - my.cx;
            var yy = target.cy - my.cy;
            return Math.atan2(yy, xx);
        }
        static faceTo3D(my, target) {
            var xx = target.cx - my.cx;
            var yy = my.cy - target.cy;
            return Math.atan2(yy, xx);
        }
        static faceToLenth(my, target) {
            var vx = my.x - target.x;
            var vy = my.y - target.y;
            return Math.sqrt(vx * vx + vy * vy);
        }
        getLeft(l_ = null) {
            return this.getLine(this.left, this.top, this.left, this.bottom, l_);
        }
        getRight(l_ = null) {
            return this.getLine(this.right, this.top, this.right, this.bottom, l_);
        }
        getTop(l_ = null) {
            return this.getLine(this.left, this.top, this.right, this.top, l_);
        }
        getBottom(l_ = null) {
            return this.getLine(this.left, this.bottom, this.right, this.bottom, l_);
        }
        getLine(x0, y0, x1, y1, l_) {
            var l = l_;
            if (!l) {
                l = new MaoLineData(x0, y0, x1, y1);
            }
            else {
                l.reset(x0, y0, x1, y1);
            }
            return l;
        }
    }

    class GameData {
        constructor() {
            this._bounce = 0;
            this.proType_ = 0;
            this.damage = 10;
            this.ammoClip = -1;
            this.attackCD = 1000;
            this.rspeed = 20;
        }
        set bounce(v) {
            this._bounce = v;
        }
        get bounce() {
            return this._bounce;
        }
        set proType(pt) {
            this.proType_ = pt;
            if (this.proType_ <= 800) {
                this.rspeed = 0;
            }
            else {
                this.rspeed = 20;
            }
        }
        get proType() {
            return this.proType_;
        }
    }

    class FootCircle extends ui.test.HeroFootUI {
        constructor() { super(); }
    }

    class GameProType {
    }
    GameProType.Hero = 9999;
    GameProType.RockGolem_Blue = 8000;
    GameProType.Rock = 801;
    GameProType.HeroArrow = 799;
    GameProType.MonstorArrow = 798;

    class HeroBlood extends ui.test.BloodUIUI {
        constructor() {
            super();
            this._rect = new Laya.Rectangle();
            this.shape = new Laya.Sprite();
            this.shape.y = this.bar.y + 2;
        }
        init(data) {
            this.gameData = data;
            this._rect.x = 0;
            this._rect.y = 0;
            this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
            this._rect.height = 17;
            this.bar.scrollRect = this._rect;
            this.txt.text = "" + this.gameData.hp;
            this.colBox.removeChildren();
            var size = this.gameData.maxhp / 200;
            var ww = this.width / size;
            for (var i = 1; i < size; i++) {
                var gang = new Laya.Image();
                gang.skin = "bg/xuetiaogang.png";
                this.colBox.addChild(gang);
                gang.y = 2;
                gang.x = ww * i;
            }
        }
        update(hurt) {
            this.gameData.hp -= hurt;
            this.gameData.hp = Math.max(this.gameData.hp, 0);
            this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
            this.bar.scrollRect = this._rect;
            this.txt.text = "" + this.gameData.hp;
            Laya.Tween.clearTween(this.shape);
            this.shape.graphics.clear();
            this.shape.graphics.drawRect(0, 0, hurt / this.gameData.maxhp * this.width, 13, "#ffffff");
            this.addChild(this.shape);
            this.shape.x = this._rect.width;
            Laya.Tween.to(this.shape, { width: 0 }, 300, null, new Laya.Handler(this, this.onCom));
            if (this.gameData.hp == 0) {
                this.removeSelf();
            }
        }
        onCom() {
            this.shape.removeSelf();
        }
    }

    class MonsterBlood extends ui.test.Blood2UIUI {
        constructor() {
            super();
            this._rect = new Laya.Rectangle();
            this.shape = new Laya.Sprite();
            this.shape.y = this.bar.y + 2;
            this.txt.visible = false;
        }
        init(data) {
            this.gameData = data;
            this._rect.x = 0;
            this._rect.y = 0;
            this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
            this._rect.height = 17;
            this.bar.scrollRect = this._rect;
            this.txt.text = "" + this.gameData.hp;
        }
        update(hurt) {
            this.gameData.hp -= hurt;
            this.gameData.hp = Math.max(this.gameData.hp, 0);
            this._rect.width = this.gameData.hp / this.gameData.maxhp * this.width;
            this.bar.scrollRect = this._rect;
            this.txt.text = "" + this.gameData.hp;
            Laya.Tween.clearTween(this.shape);
            this.shape.graphics.clear();
            this.shape.graphics.drawRect(0, 0, hurt / this.gameData.maxhp * this.width, 13, "#ffffff");
            this.addChild(this.shape);
            this.shape.x = this._rect.width;
            Laya.Tween.to(this.shape, { width: 0 }, 300, null, new Laya.Handler(this, this.onCom));
            if (this.gameData.hp == 0) {
                this.removeSelf();
            }
        }
        onCom() {
            this.shape.removeSelf();
        }
    }

    class Blood extends Laya.Sprite {
        constructor() {
            super();
            this.bloodCount = 0;
        }
        init(data) {
            this._data = data;
            if (this._data.proType == GameProType.Hero) {
                if (!this.ui) {
                    this.ui = new HeroBlood();
                }
                this.ui.init(this._data);
                this.addChild(this.ui);
            }
            else if (this._data.proType == GameProType.RockGolem_Blue) {
                if (!this.ui2) {
                    this.ui2 = new MonsterBlood();
                }
                this.ui2.init(this._data);
                this.addChild(this.ui2);
            }
        }
        update(hurt) {
            if (this._data.proType == GameProType.Hero) {
                this.ui.update(hurt);
            }
            else if (this._data.proType == GameProType.RockGolem_Blue) {
                this.ui2.update(hurt);
            }
        }
    }
    Blood.TAG = "Blood";

    class GameAI {
        constructor() {
            this.run_ = false;
        }
        die() { }
        ;
    }
    GameAI.closeCombat = "Attack1";
    GameAI.NormalAttack = "Attack";
    GameAI.Idle = "Idle";
    GameAI.Die = "Die";
    GameAI.Run = "Run";
    GameAI.TakeDamage = "TakeDamage";
    GameAI.SkillStart = "SkillStart";
    GameAI.SkillLoop = "SkillLoop";
    GameAI.SkillEnd = "SkillEnd";

    class BitmapNumber extends Laya.FontClip {
        constructor() {
            super();
        }
        onInit(skin, sheet) {
            if (this.imgUrl) {
                return;
            }
            this.imgUrl = skin;
            this.skin = skin;
            this.sheet = sheet;
            this.anchorX = this.anchorY = 0.5;
        }
        static getFontClip(tScale = 1, skin = "main/clipshuzi.png", sheet) {
            let bn = Laya.Pool.getItemByClass(BitmapNumber.TAG + skin, BitmapNumber);
            bn.onInit(skin, sheet ? sheet : "123456 7890-+ /:cdef");
            bn.scale(tScale ? tScale : 1, tScale ? tScale : 1);
            return bn;
        }
        recover() {
            this.removeSelf();
            Laya.Pool.recover(BitmapNumber.TAG + this.imgUrl, this);
        }
    }
    BitmapNumber.TAG = "BitmapNumber";

    class BloodEffect {
        constructor() { }
        static add(value, sprite, isCrit, skin) {
            let bitNum = BitmapNumber.getFontClip(0.05, skin);
            if (isCrit) {
                Game.shakeBattle();
            }
            bitNum.value = value;
            let xx = -GameBG.ww2 + Math.random() * GameBG.ww;
            let yy = Math.random() * GameBG.ww;
            sprite.addChild(bitNum);
            bitNum.pos(xx, yy);
            sprite.bloodCount++;
            let tscale = 0.3;
            if (isCrit) {
                tscale = 0.4;
            }
            Laya.Tween.to(bitNum, { y: yy - 100, scaleX: tscale, scaleY: tscale }, 300, Laya.Ease.circOut);
            Laya.timer.once(500, this, () => {
                bitNum.recover();
            });
        }
    }

    class GamePro extends Laya.EventDispatcher {
        constructor(proType_, hp = 600) {
            super();
            this.buffAry = [];
            this.tScale = 1;
            this.isIce = false;
            this.unBlocking = false;
            this.hurtValue = 0;
            this.speed_ = 6;
            this._pos2 = new Laya.Vector3(0, 0, 0);
            this.moven2d_ = 0;
            this.facen2d_ = 0;
            this.facen3d_ = 0;
            this.acstr_ = "";
            this.rotationEulerY = 0;
            this.keyNum = -1;
            this.gamedata_ = new GameData();
            this.gamedata_.hp = this.gamedata_.maxhp = hp;
            this.gamedata_.proType = proType_;
            this.rotationEulerY = 0;
        }
        checkBlackList(ee) {
            if (this.hit_blacklist) {
                let arr = this.hit_blacklist;
                for (let i = 0; i < arr.length; i++) {
                    let e = arr[i];
                    if (e == ee) {
                        return true;
                    }
                }
            }
            return false;
        }
        setShadowSize(ww) {
            this._bulletShadow && this._bulletShadow.img.size(ww, ww);
        }
        removeShodow() {
            this._bulletShadow && this._bulletShadow.removeSelf();
        }
        get bloodUI() {
            return this._bloodUI;
        }
        setKeyNum(n) {
            this.keyNum = n;
        }
        initBlood(hp, maxhp) {
            this.gamedata.hp = hp;
            this.gamedata.maxhp = maxhp;
            if (!this._bloodUI) {
                this._bloodUI = Laya.Pool.getItemByClass(Blood.TAG, Blood);
            }
            this._bloodUI.init(this.gamedata_);
            Game.bloodLayer.addChild(this._bloodUI);
            this._bloodUI && this._bloodUI.pos(this.hbox_.cx, this.hbox_.cy - 120);
        }
        addFootCircle() {
            if (!this._footCircle) {
                this._footCircle = new FootCircle();
            }
            Game.footLayer.addChild(this._footCircle);
            this._footCircle && this._footCircle.pos(this.hbox_.cx, this.hbox_.cy);
        }
        hurt(hurt, isCrit) {
            this._bloodUI && this._bloodUI.update(hurt);
            if (hurt > 0) {
                BloodEffect.add("-" + hurt, this._bloodUI, isCrit, isCrit ? "main/redFont.png" : "main/clipshuzi.png");
            }
        }
        die() {
            this.play(GameAI.Die);
            this.stopAi();
            this._bulletShadow && this._bulletShadow.removeSelf();
            this._bulletShadow = null;
            if (Game.map0.Eharr.indexOf(this.hbox) >= 0) {
                Game.map0.Eharr.splice(Game.map0.Eharr.indexOf(this.hbox), 1);
            }
        }
        setSp3d(sp, ww) {
            this.hbox_ = new GameHitBox(ww ? ww : GameBG.mw, ww ? ww : GameBG.mw);
            this.hbox_.linkPro_ = this;
            this.hbox_.setCenter(GameBG.mcx, GameBG.mcy);
            if (sp) {
                this.sp3d_ = sp;
                this.sp3d_.transform.localRotationEulerY = this.rotationEulerY = 0;
                let aniSprite3d = sp.getChildAt(0);
                if (aniSprite3d) {
                    this.ani_ = aniSprite3d.getComponent(Laya.Animator);
                }
                this.on(Game.Event_Hit, this, this.hit);
            }
        }
        get animator() {
            return this.ani_;
        }
        addSprite3DToChild(childName, sprite3d) {
            var ss = this.sp3d.getChildAt(0).getChildByName(childName);
            return ss.addChild(sprite3d);
        }
        addWeapon() {
            this.weapon = Laya.loader.getRes("h5/gong/hero.lh");
            this.addSprite3DToAvatarNode("joint14", this.weapon);
        }
        addSprite3DToAvatarNode(nodeName, sprite3d) {
            var bool = this.ani_.linkSprite3DToAvatarNode(nodeName, sprite3d);
        }
        removeSprite3DToAvatarNode(s3d) {
            this.ani_ && this.ani_.unLinkSprite3DToAvatarNode(s3d);
        }
        hit(pro, isBuff = false) {
            if (this.gameAI) {
                this.gameAI.hit(pro, isBuff);
            }
        }
        closeCombat(pro) {
        }
        get acstr() {
            return this.acstr_;
        }
        set acstr(s) {
            this.acstr_ = s;
        }
        get face2d() {
            return this.facen2d_;
        }
        get face3d() {
            return this.facen3d_;
        }
        get speed() {
            return this.speed_;
        }
        setSpeed(speed) {
            this.speed_ = speed;
        }
        setGameMove(gamemove) {
            this.movef = gamemove;
        }
        getGameMove() {
            return this.movef;
        }
        setGameAi(gameAI) {
            this.gameAI = gameAI;
            return this.gameAI;
        }
        getGameAi() {
            return this.gameAI;
        }
        get hbox() {
            if (!this.hbox_) {
                this.hbox_ = new GameHitBox(GameBG.mw, GameBG.mw);
                this.hbox_.setXY(GameBG.mcx, GameBG.mcy);
            }
            return this.hbox_;
        }
        get sp2d() {
            if (!this.sp2d_) {
                this.sp2d_ = new Laya.Sprite();
                this.sp2d_.graphics.drawRect(0, 0, GameBG.mw, GameBG.mw, null, 0xfff000);
                this.sp2d_.x = this.hbox.x;
                this.sp2d_.y = this.hbox.y;
            }
            return this.sp2d_;
        }
        get sp3d() {
            return this.sp3d_;
        }
        play(actionstr) {
            if (this.acstr == GameAI.Die) {
                return;
            }
            this.acstr_ = actionstr;
            this.ani_.play(actionstr);
            if (this.acstr != GameAI.Run && this.acstr != GameAI.Idle && this.acstr != GameAI.Die) {
                Laya.stage.frameLoop(1, this, this.ac0);
            }
            else {
                Laya.stage.timer.clear(this, this.ac0);
            }
        }
        ac0() {
            if (this.normalizedTime >= 1) {
                var str = this.acstr_;
                Laya.stage.timer.clear(this, this.ac0);
                this.event(Game.Event_PlayStop, str);
                if (str == GameAI.SkillStart) {
                    this.play(GameAI.SkillLoop);
                }
                else if (str == GameAI.SkillLoop) {
                    this.play(GameAI.SkillLoop);
                }
                else {
                    this.play(GameAI.Idle);
                }
            }
        }
        ac1() {
            if (this.keyNum >= 0 && this.normalizedTime >= this.keyNum) {
                this.event(Game.Event_KeyNum, this.keyNum);
                this.keyNum = -1;
            }
        }
        get normalizedTime() {
            return this.ani_.getCurrentAnimatorPlayState().normalizedTime;
        }
        rotation(n) {
            if (!n) {
                return;
            }
            if (this.gamedata.hp <= 0) {
                return;
            }
            this.facen3d_ = n;
            this.facen2d_ = (2 * Math.PI - n);
            let aa = Math.sin(n) / Game.cameraCN.cos0;
            let bb = Math.cos(n);
            let nn = Math.atan2(aa, bb);
            nn = ((nn + Math.PI / 2) / Math.PI * 180);
            let ey = Math.round(nn);
            if (ey >= 360) {
                while (ey >= 360) {
                    ey -= 360;
                }
            }
            else if (ey < 0) {
                while (ey < 0) {
                    ey += 360;
                }
            }
            if (this.gamedata_.rspeed <= 0) {
                this.sp3d_.transform.localRotationEulerY = ey;
                this.rotationEulerY = this.sp3d_.transform.localRotationEulerY;
                return;
            }
            if (this.rotationEulerY != ey) {
                this.rotationEulerY = ey;
                if (this.sp3d_.transform.localRotationEulerY >= 360) {
                    while (this.sp3d_.transform.localRotationEulerY >= 360) {
                        this.sp3d_.transform.localRotationEulerY -= 360;
                    }
                }
                else if (this.sp3d_.transform.localRotationEulerY < 0) {
                    while (this.sp3d_.transform.localRotationEulerY < 0) {
                        this.sp3d_.transform.localRotationEulerY += 360;
                    }
                }
            }
        }
        ai() {
            this.ac1();
            if (this.ani_ && this.ani_.speed > 0 && this.gamedata_.proType == GameProType.Hero) {
                if (this.acstr_ == GameAI.Run) {
                    if (this.animator.speed == 1) {
                        this.animator.speed = (this.speed_ / 6);
                    }
                }
                if (this.acstr_ == GameAI.NormalAttack || this.acstr_ == GameAI.closeCombat) {
                    this.ani_.speed = 2;
                }
                else {
                    if (this.ani_.speed != 1) {
                        this.ani_.speed = 1;
                    }
                }
            }
            if (this.gameAI) {
                this.gameAI.exeAI(this);
            }
            if (this.isDie) {
                return;
            }
            if (this.sp3d_ == null) {
                return;
            }
            if (this.sp3d_ && this.rotationEulerY == this.sp3d_.transform.localRotationEulerY) {
                return;
            }
            for (let i = 0; i < this.gamedata_.rspeed; i++) {
                var n = this.rotationEulerY - this.sp3d_.transform.localRotationEulerY;
                if (n == 0) {
                    break;
                }
                else if ((n > 0 && n <= 180) || (n < -180)) {
                    this.sp3d_.transform.localRotationEulerY += 1;
                }
                else {
                    this.sp3d_.transform.localRotationEulerY -= 1;
                }
                while (this.sp3d_.transform.localRotationEulerY >= 360) {
                    this.sp3d_.transform.localRotationEulerY -= 360;
                }
                while (this.sp3d_.transform.localRotationEulerY < 0) {
                    this.sp3d_.transform.localRotationEulerY += 360;
                }
            }
        }
        get pos2() {
            return this._pos2;
        }
        pos2To3d() {
            if (!this.sp3d_) {
                return;
            }
            this.sp3d_.transform.localPositionX = this._pos2.x / GameBG.ww;
            this.sp3d_.transform.localPositionZ = this._pos2.z / Game.cameraCN.cos0 / GameBG.ww;
            this.hbox_.setXY(GameBG.mcx + this._pos2.x, GameBG.mcy + this._pos2.z);
            if (this.sp2d_) {
                this.sp2d_.x = this.hbox_.x;
                this.sp2d_.y = this.hbox_.y;
                Game.footLayer.addChild(this.sp2d_);
            }
            this.updateUI();
        }
        updateUI() {
            this._bloodUI && this._bloodUI.pos(this.hbox_.cx, this.hbox_.cy - 90);
            this._footCircle && this._footCircle.pos(this.hbox_.cx, this.hbox_.cy);
            this._bulletShadow && this._bulletShadow.pos(this.hbox_.cx, this.hbox_.cy);
        }
        get z() {
            return this.sp3d_.transform.localPositionZ;
        }
        get x() {
            return this.sp3d_.transform.localPositionX;
        }
        move2D(n, hd = true) {
            if (this.gamedata.proType == GameProType.RockGolem_Blue) {
                if (this.gamedata.hp <= 0) {
                    return;
                }
            }
            if (this.isIce) {
                return;
            }
            this.moven2d_ = n;
            if (this.movef) {
                return this.movef.move2d(n, this, this.speed, false);
            }
            return false;
        }
        setXY2D(xx, yy) {
            this.pos2.x = xx;
            this.pos2.z = yy;
            this.pos2To3d();
        }
        setcXcY2DBox(xx, yy) {
            this.hbox_.setCenter(xx, yy);
            this.pos2.x = this.hbox_.x - GameBG.mcx;
            this.pos2.z = this.hbox_.y - GameBG.mcy;
            this.pos2To3d();
        }
        setXY2DBox(xx, yy) {
            this.hbox_.setXY(xx, yy);
            this.pos2.x = this.hbox_.x - GameBG.mcx;
            this.pos2.z = this.hbox_.y - GameBG.mcy;
            this.pos2To3d();
        }
        startAi() {
            if (this.gameAI) {
                this.gameAI.starAi();
                if (Game.AiArr.indexOf(this) < 0) {
                    Game.AiArr.push(this);
                }
            }
        }
        stopAi() {
            if (this.gameAI) {
                this.gameAI.stopAi();
            }
            var index = Game.AiArr.indexOf(this);
            if (index > -1) {
                Game.AiArr.splice(index, 1);
            }
            else {
                console.error("为什么没有这个");
            }
        }
        get gamedata() {
            return this.gamedata_;
        }
    }

    class FootRotateScript extends Laya.Script3D {
        constructor() {
            super();
        }
        onAwake() {
            this.box = this.owner;
        }
        onStart() {
        }
        onUpdate() {
            if (!Game.executor.isRun) {
                return;
            }
            this.box.transform.localRotationEulerY += 5;
        }
        onDisable() {
        }
    }

    class CoinsAI extends GameAI {
        constructor() { super(); }
        starAi() {
            this.run_ = true;
        }
        stopAi() {
            this.run_ = false;
        }
        hit(pro) {
        }
        exeAI(pro) {
            if (!this.run_) {
                return false;
            }
            var a = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
            if (pro.move2D(pro.face2d)) {
                pro.clear();
                this.run_ = false;
            }
            return false;
        }
    }

    class GameMove {
        move2d(n, pro, speed, hitStop) { return false; }
        Blocking(pro, vx, vz) {
            return true;
        }
    }

    class CoinsMove extends GameMove {
        constructor() { super(); }
        move2d(n, pro, speed) {
            if (pro.status == 0) ;
            else if (pro.status == 1) {
                var vx = Math.cos(n) * speed;
                var vz = Math.sin(n) * speed;
                if (pro.curLen >= 0 && pro.moveLen >= 0) {
                    pro.curLen += speed;
                    if (pro.curLen >= pro.moveLen) {
                        pro.curLen = pro.moveLen;
                    }
                    var nn = pro.curLen / pro.moveLen;
                    var dy = Math.sin((Math.PI * nn)) * 2;
                    pro.sp3d.transform.localPositionY = 0.1 + dy;
                }
                if (pro.curLen >= pro.moveLen) {
                    pro.status = 0;
                }
                pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            }
            else if (pro.status == 2) {
                var a = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
                pro.rotation(a);
                if (speed <= 0) {
                    return false;
                }
                if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) < GameBG.ww2) {
                    return true;
                }
                var vx = Math.cos(n) * speed;
                var vz = Math.sin(n) * speed;
                pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            }
            return false;
        }
    }

    class SysChapter {
        constructor() {
            this.id = 0;
            this.stageName = '';
            this.stageImage = '';
            this.beforeId = 0;
            this.npcDamagescale = 0;
            this.npcHealthscale = 0;
            this.description = 0;
            this.blueDiamond = '';
            this.redDiamond = '';
        }
        static randomDiamond(chapterId) {
            let totolNum = SysMap.getTotal(chapterId);
            SysChapter.dropIndex = Math.ceil(totolNum * Math.random());
            console.log("钻石掉落的关卡数", SysChapter.dropIndex);
            let sys = App.tableManager.getDataByNameAndId(SysChapter.NAME, chapterId);
            let blueArr = sys.blueDiamond.split(',');
            let blueRate = Number(blueArr[0]);
            let blueNum = Number(blueArr[1]);
            let redArr = sys.redDiamond.split(',');
            let redRate = Number(redArr[0]);
            let redNum = Number(redArr[1]);
            blueRate = blueRate / 1000 * 360;
            redRate = redRate / 1000 * 360;
            let rand = Math.random();
            rand = rand * 360;
            SysChapter.blueNum = SysChapter.redNum = 0;
            if (rand <= blueRate && blueRate >= 0) {
                SysChapter.blueNum = blueNum;
                console.log("掉落蓝钻", SysChapter.blueNum);
            }
            else if (rand > blueRate && rand <= blueRate + redRate) {
                SysChapter.redNum = redNum;
                console.log("掉落红钻", SysChapter.redNum);
            }
            SysChapter.heartIndex = -1;
            let heartRate = 1 - Math.random();
            if (heartRate >= 0.1) {
                SysChapter.heartIndex = Math.ceil(totolNum * Math.random());
                SysChapter.heartNum = 1;
                console.log("红心掉落的关卡", SysChapter.heartIndex);
            }
        }
    }
    SysChapter.NAME = 'sys_stagemap.txt';
    SysChapter.heartIndex = -1;

    class SysItem {
        constructor() {
            this.id = 0;
            this.name = '';
            this.type = 0;
            this.subType = 0;
            this.buyGod = 0;
            this.addHp = 0;
            this.iteamTxt = '';
        }
    }
    SysItem.NAME = 'sys_iteam.txt';

    class Coin extends GamePro {
        constructor() {
            super(0, 1);
            this.curLen = 0;
            this.moveLen = 0;
            this.status = 0;
            this.setSpeed(0);
            this.setGameAi(new CoinsAI());
            this.setGameMove(new CoinsMove());
            this._bulletShadow = new ui.test.BulletShadowUI();
            Game.footLayer.addChild(this._bulletShadow);
            this.setShadowSize(20);
        }
        static getOne(id) {
            let coin = Laya.Pool.getItemByClass(Coin.TAG + id, Coin);
            coin.id = id;
            if (!coin.sp3d) {
                var sp;
                sp = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/coins/" + id + "/monster.lh"));
                coin.setSp3d(sp);
                if (id == Coin.TYPE_COIN) {
                    coin.sp3d.transform.localScale = Coin.tScale;
                }
                else {
                    coin.sp3d.transform.localScale = Coin.tScale2;
                }
                if (sp) {
                    coin.sp3d.addComponent(FootRotateScript);
                }
            }
            return coin;
        }
        setPos(monster, r, id) {
            this.status = 1;
            this.curLen = 0;
            if (id == Coin.TYPE_COIN) {
                this.moveLen = 20 + Math.random() * GameBG.ww;
            }
            else if (id == Coin.TYPE_HEART) {
                this.moveLen = Math.random() * GameBG.ww;
            }
            else {
                this.moveLen = 50 + Math.random() * GameBG.ww;
            }
            this.setXY2D(monster.pos2.x, monster.pos2.z);
            this.setSpeed(2);
            this.rotation(r);
            this.startAi();
            Game.layer3dCoins.addChild(this.sp3d);
            Game.footLayer.addChild(this._bulletShadow);
        }
        updateUI() {
            super.updateUI();
            this._bulletShadow && this._bulletShadow.pos(this.hbox.cx + 10, this.hbox.cy + 10);
        }
        onCom() {
            this.setShadowSize(20);
            let xx = GameBG.ww * this.sp3d.transform.localPositionX;
            let yy = GameBG.ww * this.sp3d.transform.localPositionZ * Game.cameraCN.cos0;
            this.setXY2D(xx, yy);
            this._bulletShadow && this._bulletShadow.pos(this.hbox.cx + 10, this.hbox.cy);
        }
        fly() {
            var a = GameHitBox.faceTo3D(this.hbox, Game.hero.hbox);
            this.rotation(a);
            this.status = 2;
            this.curLen = 0;
            this.moveLen = 0;
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.setSpeed(GameBG.ww * 0.5);
        }
        clear() {
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.stopAi();
            this.sp3d && this.sp3d.removeSelf();
            if (this.id == Coin.TYPE_COIN) {
                Game.showCoinsNum += 2;
                Laya.stage.event(Game.Event_COINS);
            }
            else if (this.id == Coin.TYPE_BLUE) {
                Game.showBlueNum++;
                SysChapter.blueNum--;
            }
            else if (this.id == Coin.TYPE_RED) {
                Game.showRedNum++;
                SysChapter.redNum--;
            }
            else if (this.id == Coin.TYPE_HEART) {
                let sys = App.tableManager.getDataByNameAndId(SysItem.NAME, Coin.TYPE_HEART);
                let addValue = sys.addHp + Session.talentData.addItemhp;
                Game.hero.addBlood(addValue);
                SysChapter.heartNum--;
            }
            this.curLen = 0;
            this.moveLen = 0;
            this.status = 0;
            if (SysChapter.blueNum <= 0 && SysChapter.redNum <= 0) {
                SysChapter.dropIndex = -1;
            }
            if (SysChapter.heartNum <= 0) {
                SysChapter.heartIndex = -1;
            }
            Laya.Pool.recover(Coin.TAG, this);
        }
    }
    Coin.TYPE_COIN = 1001;
    Coin.TYPE_BLUE = 1002;
    Coin.TYPE_RED = 1003;
    Coin.TYPE_HEART = 1004;
    Coin.TAG = "Coin";
    Coin.tScale = new Laya.Vector3(1.5, 1.5, 1.5);
    Coin.tScale2 = new Laya.Vector3(0.5, 0.5, 0.5);

    class CoinEffect {
        constructor() {
        }
        static addEffect(monster, goldNum, id) {
            for (let i = 0; i < goldNum; i++) {
                let coin = Coin.getOne(id);
                coin.setPos(monster, 2 * Math.PI / goldNum * i, id);
                if (id == Coin.TYPE_HEART) {
                    CoinEffect.hearAry.push(coin);
                }
                else {
                    CoinEffect.coinsAry.push(coin);
                }
            }
        }
        static fly() {
            let len = CoinEffect.coinsAry.length;
            if (len > 0) {
                Game.playSound("fx_goldget.wav");
            }
            for (let i = 0; i < len; i++) {
                let coin = CoinEffect.coinsAry.shift();
                coin && coin.fly();
            }
        }
        static flyHeart() {
            let len = CoinEffect.hearAry.length;
            for (let i = 0; i < len; i++) {
                let coin = CoinEffect.hearAry.shift();
                coin && coin.fly();
            }
        }
    }
    CoinEffect.coinsAry = [];
    CoinEffect.hearAry = [];

    class DieEffect {
        constructor() {
        }
        static addEffect(player) {
            let effect = Laya.Pool.getItemByClass(DieEffect.TAG, DieEffect);
            if (!effect.sp3d) {
                effect.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/monsterDie/monster.lh"));
            }
            effect.sp3d.transform.localRotationEulerY = 45;
            Game.layer3d.addChild(effect.sp3d);
            effect.sp3d.transform.localPosition = player.sp3d.transform.localPosition;
            effect.sp3d.transform.localScaleX = 0.3;
            effect.sp3d.transform.localScaleY = 0.3;
            effect.sp3d.transform.localScaleZ = 0.3;
            Laya.timer.once(1000, this, () => {
                effect.recover();
            });
            return effect;
        }
        recover() {
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(DieEffect.TAG, this);
            if (Game.map0.Eharr.length == 0) {
                CoinEffect.fly();
                Laya.stage.event(Game.Event_EXP);
            }
        }
    }
    DieEffect.TAG = "DieEffect";

    class MonsterBoomEffect {
        constructor() {
            this.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/boom/monster.lh"));
        }
        static addEffect(pro, tScale = 1) {
            let effect = Laya.Pool.getItemByClass(MonsterBoomEffect.TAG, MonsterBoomEffect);
            effect.player = pro;
            effect.player.sp3d.addChild(effect.sp3d);
            Laya.timer.once(500, this, () => {
                effect.recover();
            });
            return effect;
        }
        recover() {
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(MonsterBoomEffect.TAG, this);
        }
    }
    MonsterBoomEffect.TAG = "MonsterBoomEffect";

    class GameCube {
        constructor() {
        }
        init(type) {
            if (!this.sp3d) {
                this.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/wall/" + type + "/monster.lh"));
                if (type != 3000 && type != 3500 && type != 4000) {
                    this.sp3d.transform.setWorldLossyScale(Game.cameraCN.boxscale);
                }
            }
            Game.layer3dCube.addChild(this.sp3d);
        }
        static recover() {
            while (GameCube.arr.length > 0) {
                let rube = GameCube.arr.shift();
                rube.sp3d.removeSelf();
                Laya.Pool.recover(GameCube.TAG + rube.type, rube);
            }
            GameCube.arr.length = 0;
        }
        static getOne(v3, type) {
            type = GameCube.getType(type);
            let tag = GameCube.TAG + type;
            Game.poolTagArr[tag] = tag;
            let rube = Laya.Pool.getItemByClass(tag, GameCube);
            rube.init(type);
            rube.sp3d.transform.position = v3;
            GameCube.arr.push(rube);
            return rube;
        }
        static getType(type) {
            if (type == 1 || (type >= 1000 && type < 1500)) {
                return 1000;
            }
            if (type == 2 || (type >= 1500 && type < 2000)) {
                return 1500;
            }
            if (type == 3 || (type >= 2000 && type < 2500)) {
                return 2000;
            }
            if (type == 4 || (type >= 2500 && type < 3000)) {
                return 2500;
            }
            if (type == 5 || (type >= 3000 && type < 3500)) {
                return 3000;
            }
            if (type == 6 || (type >= 3500 && type < 4000)) {
                return 3500;
            }
            if (type == 7 || (type >= 4000 && type < 4500)) {
                return 4000;
            }
            if (type == 8 || (type >= 4500 && type < 5000)) {
                return 4500;
            }
            if (type == 9 || (type >= 5000 && type < 5500)) {
                return 5000;
            }
            if (type == 10 || (type >= 5500 && type < 6000)) {
                return 5500;
            }
        }
    }
    GameCube.TAG = "GameCube_";
    GameCube.arr = [];

    class BattleLoader {
        constructor() {
            this.chapterId = 0;
            this._index = 1;
            this.resAry = [];
            this.pubResAry = [];
            this.isLoadPub = false;
            this._isHeroLoaded = false;
            this._isMonsterLoaded = false;
            this.monsterRes = {};
            this.cubeRes = {};
            this.monsterId = 0;
            this.curBoTimes = 0;
            this.maxBoTimes = 0;
            this.bgRes = {};
        }
        get index() {
            return this._index;
        }
        set index(v) {
            this._index = v;
        }
        get mapId() {
            return this._mapId;
        }
        onRelease() {
        }
        clearMonster(isOpenDoor = false) {
            for (let key in MonsterShader.map) {
                let shader = MonsterShader.map[key];
                if (shader) {
                    delete MonsterShader.map[key];
                }
            }
            for (let key in this.monsterRes) {
                if (key != '') {
                    let sp = Laya.loader.getRes(key);
                    if (sp) {
                        sp.destroy(true);
                    }
                }
            }
            if (!isOpenDoor) {
                for (let key in this.cubeRes) {
                    if (key != '') {
                        let sp = Laya.loader.getRes(key);
                        if (sp) {
                            sp.destroy(true);
                        }
                    }
                }
            }
            let tagArr = [DieEffect.TAG, Coin.TAG, MonsterBoomEffect.TAG];
            for (let key in Game.poolTagArr) {
                tagArr.push(key);
            }
            for (let i = 0; i < tagArr.length; i++) {
                let arr = Laya.Pool.getPoolBySign(tagArr[i]);
                for (let j = 0; j < arr.length; j++) {
                    let sp3d = arr[j].sp3d;
                    if (sp3d) {
                        sp3d.destroy(true);
                        sp3d = null;
                    }
                    arr[j] = null;
                }
                if (arr.length > 0) {
                    Laya.Pool.clearBySign(tagArr[i]);
                }
            }
            Laya.Resource.destroyUnusedResources();
        }
        load(res) {
            GameCube.recover();
            this.clearMonster();
            this.continueRes = res;
            Game.scenneM.battle && Game.scenneM.battle.up(null);
            Game.ro && Game.ro.removeSelf();
            if (!this._loading) {
                this._loading = new ui.test.LoadingUI();
                this._loading.mouseEnabled = false;
            }
            App.layerManager.alertLayer.addChild(this._loading);
            Game.bg && Game.bg.clear();
            this._loading.txt.text = "0%";
            if (this.continueRes) {
                this.chapterId = this.continueRes.chapterId;
                this._mapId = this.continueRes.mapId;
                this._index = this.continueRes.index;
                this._configId = this.continueRes.configId;
                Game.battleCoins = this.continueRes.coins;
            }
            else {
                let maxCeng = SysMap.getTotal(this.chapterId);
                if (this._index > maxCeng) {
                    this._index = 1;
                }
                this._mapId = this.chapterId * 1000 + this._index;
                let configId;
                if (Session.homeData.isGuide) {
                    configId = 100000;
                }
                else {
                    this.sysMap = SysMap.getData(this.chapterId, this._index);
                    this.curBoTimes = 0;
                    this.maxBoTimes = this.sysMap.numEnemy;
                    this.monsterGroup = this.sysMap.enemyGroup.split(",");
                    let configArr = this.sysMap.stageGroup.split(',');
                    configId = Number(configArr[Math.floor(configArr.length * Math.random())]);
                }
                this._configId = configId;
            }
            console.log("当前地图", this._mapId, this._configId);
            Laya.loader.load("h5/mapConfig/" + this._configId + ".json", new Laya.Handler(this, this.loadBg));
        }
        preload() {
            let arr = [
                "res/atlas/shengli.atlas",
                "res/atlas/texiao/jiaxue.atlas",
                "res/atlas/bg.atlas",
                "res/atlas/jiesuan.atlas"
            ];
            Laya.loader.load(arr, Laya.Handler.create(this, this.onCompletePre));
        }
        onCompletePre() {
            console.log("2D资源加载完毕");
            this.loadHeroRes();
        }
        loadHeroRes() {
            let pubRes = [
                "h5/effects/door/monster.lh",
                "h5/effects/foot/hero.lh", "h5/effects/head/monster.lh", "h5/bulletsEffect/20000/monster.lh",
                "h5/bullets/skill/5009/monster.lh", "h5/bullets/20000/monster.lh"
            ];
            pubRes.push("h5/hero/" + Session.heroData.nowRoleId + "/hero.lh");
            if (Session.homeData.isGuide) {
                pubRes.push("h5/effects/guide/monster.lh");
            }
            Laya.loader.create(pubRes, Laya.Handler.create(this, this.onCompleteHero), new Laya.Handler(this, this.onProgress));
        }
        onCompleteHero() {
            console.log("主角所需资源加载完毕");
            this._isHeroLoaded = true;
            this.allLoadCom();
        }
        loadBg() {
            let map = Laya.loader.getRes("h5/mapConfig/" + this._configId + ".json");
            GameBG.MAP_ROW = map.rowNum;
            GameBG.MAP_COL = map.colNum;
            GameBG.MAP_ROW2 = Math.floor(GameBG.MAP_ROW * 0.5);
            GameBG.MAP_COL2 = Math.floor(GameBG.MAP_COL * 0.5);
            GameBG.bgId = map.bgId;
            GameBG.bgWW = map.bgWidth;
            GameBG.bgHH = map.bgHeight;
            GameBG.bgHHReal = map.bgHeight;
            GameBG.bgCellWidth = map.cellWidth;
            if (GameBG.bgHH < 1700) {
                GameBG.bgHH = 1700;
            }
            GameBG.arr0 = map.arr;
            let bgType = this.chapterId;
            bgType = Math.max(bgType, 1);
            GameBG.BG_TYPE_NUM = bgType;
            GameBG.BG_TYPE = "map_" + bgType;
            Laya.loader.clearRes("h5/mapConfig/" + this._configId + ".json");
            this.bgRes[GameBG.BG_TYPE_NUM] = GameBG.BG_TYPE_NUM;
            Laya.loader.load("res/atlas/map_" + bgType + ".atlas", new Laya.Handler(this, this.onLoadMonster));
        }
        onLoadMonster() {
            this.resAry.length = 0;
            this.monsterRes = {};
            this.cubeRes = {};
            let res;
            let k = 0;
            for (let j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    let type = GameBG.arr0[k];
                    if (k < GameBG.arr0.length) {
                        if (this.continueRes == null && GridType.isMonster(type)) {
                            this.getMonsterRes(type);
                        }
                        else if (GridType.isCube(type)) {
                            this.getSceneRes(type);
                        }
                    }
                    k++;
                }
            }
            for (let key in this.monsterRes) {
                if (key != '') {
                    this.resAry.push(key);
                }
            }
            if (this.resAry.length > 0) {
                let pubResAry = ["h5/effects/monsterDie/monster.lh", "h5/coins/1001/monster.lh", "h5/effects/boom/monster.lh"];
                for (let j = 0; j < pubResAry.length; j++) {
                    res = pubResAry[j];
                    this.monsterRes[res] = res;
                    this.resAry.push(res);
                }
            }
            if (this.index == SysChapter.dropIndex) {
                let key;
                if (SysChapter.blueNum > 0) {
                    key = "h5/coins/1002/monster.lh";
                    this.monsterRes[key] = key;
                    this.resAry.push(key);
                }
                else if (SysChapter.redNum > 0) {
                    key = "h5/coins/1003/monster.lh";
                    this.monsterRes[key] = key;
                    this.resAry.push(key);
                }
            }
            if (this.index == SysChapter.heartIndex) {
                if (SysChapter.heartNum > 0) {
                    res = "h5/coins/1004/monster.lh";
                    this.monsterRes[res] = res;
                    this.resAry.push(res);
                }
            }
            for (let key in this.cubeRes) {
                if (key != '') {
                    this.resAry.push(key);
                }
            }
            if (Laya.loader.getRes("h5/hero/" + Session.heroData.nowRoleId + "/hero.lh") == null) {
                this.resAry.push("h5/hero/" + Session.heroData.nowRoleId + "/hero.lh");
            }
            this._isMonsterLoaded = false;
            console.log('资源列表', this.resAry);
            if (this.resAry.length > 0) {
                Laya.loader.create(this.resAry, Laya.Handler.create(this, this.onCompleteMonster), new Laya.Handler(this, this.onProgress));
            }
            else {
                this.onCompleteMonster();
            }
        }
        getSceneRes(type) {
            let cubeType = GameCube.getType(type);
            let res = "h5/wall/" + cubeType + "/monster.lh";
            this.cubeRes[res] = res;
        }
        onCompleteMonster() {
            console.log("怪物所需资源加载完毕");
            this._isMonsterLoaded = true;
            this.allLoadCom();
        }
        onProgress(value) {
            if (!this._loading) {
                return;
            }
            value = Math.ceil(value * 100);
            value = Math.min(value, 100);
            this._loading.txt.text = value + "%";
        }
        allLoadCom() {
            if (this._isHeroLoaded && this._isMonsterLoaded) {
                console.log("所有资源都加载完毕");
                CoinEffect.coinsAry.length = 0;
                CoinEffect.hearAry.length = 0;
                Game.scenneM.showBattle();
                Game.scenneM.battle.init();
                this._loading.removeSelf();
            }
        }
        getMonsterRes(id) {
            console.log("怪物id", id);
            let res = '';
            let sysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, id);
            res = "h5/monsters/" + sysEnemy.enemymode + "/monster.lh";
            this.monsterRes[res] = res;
            if (sysEnemy.normalAttack > 0) {
                let sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, sysEnemy.normalAttack);
                if (sysBullet.bulletMode > 0) {
                    res = "h5/bullets/" + sysBullet.bulletMode + "/monster.lh";
                    this.monsterRes[res] = res;
                }
                if (sysBullet.boomEffect > 0) {
                    res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                    this.monsterRes[res] = res;
                }
            }
            if (sysEnemy.skillId.length > 0 && sysEnemy.skillId != '0') {
                var skillarr = sysEnemy.skillId.split(',');
                for (var m = 0; m < skillarr.length; m++) {
                    let id = Number(skillarr[m]);
                    if (id > 0) {
                        let sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, Number(id));
                        if (sysBullet.bulletMode > 0) {
                            res = "h5/bullets/" + sysBullet.bulletMode + "/monster.lh";
                            this.monsterRes[res] = res;
                        }
                        if (sysBullet.boomEffect > 0) {
                            res = "h5/bulletsEffect/" + sysBullet.boomEffect + "/monster.lh";
                            this.monsterRes[res] = res;
                        }
                        if (sysBullet.callInfo != '0') {
                            let infoAry = sysBullet.callInfo.split('|');
                            for (let i = 0; i < infoAry.length; i++) {
                                let info = infoAry[i].split(',');
                                if (info.length == 3) {
                                    let monsterId = Number(info[0]);
                                    this.getMonsterRes(monsterId);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    class HeadTranslateScript extends Laya.Script3D {
        constructor() {
            super();
            this.flag = false;
            this.v3 = new Laya.Vector3(0, -0.05, 0);
            this.v33 = new Laya.Vector3(0, 0.05, 0);
        }
        onAwake() {
            this.box = this.owner;
        }
        onStart() {
        }
        onUpdate() {
            if (!Game.executor.isRun) {
                return;
            }
            if (this.flag) {
                this.box.transform.translate(this.v3, false);
            }
            else {
                this.box.transform.translate(this.v33, false);
            }
            if (this.box.transform.localPositionY >= 1) {
                this.flag = true;
            }
            else if (this.box.transform.localPositionY <= 0) {
                this.flag = false;
            }
        }
        onDisable() {
        }
    }

    class MoveType {
    }
    MoveType.TAG = "MOVE";
    MoveType.FLY = 1;
    MoveType.MOVE = 2;
    MoveType.FIXED = 3;
    MoveType.JUMP = 4;
    MoveType.BACK = 5;
    MoveType.BOOM = 6;

    class AttackType {
    }
    AttackType.TAG = "ATTACK";
    AttackType.NORMAL_BULLET = 1;
    AttackType.RANDOM_BULLET = 2;
    AttackType.AOE = 3;
    AttackType.FLY_HIT = 4;
    AttackType.SPLIT = 5;
    AttackType.CALL_MONSTER = 6;

    class HitEffect {
        constructor() {
            let ss = Laya.loader.getRes("h5/bulletsEffect/20000/monster.lh");
            this.sp3d = Laya.Sprite3D.instantiate(ss);
        }
        static addEffect(player) {
            let effect = Laya.Pool.getItemByClass(HitEffect.TAG, HitEffect);
            effect.player = player;
            if (effect.player && effect.player.sp3d && effect.sp3d && effect.sp3d.transform) {
                effect.player.sp3d.addChild(effect.sp3d);
            }
            Laya.timer.once(500, this, () => {
                effect.recover();
            });
            return effect;
        }
        recover() {
            this.sp3d && this.sp3d.removeSelf();
            this.player = null;
            Laya.Pool.recover(HitEffect.TAG, this);
        }
    }
    HitEffect.TAG = "HitEffect";

    class SysBuff {
        constructor() {
            this.id = 0;
            this.buffName = '';
            this.bufflInfo = '';
            this.buffDot = 0;
            this.buffCD = 0;
            this.times = 0;
            this.damagePercent = 0;
            this.addExp = 0;
            this.addAttack = 0;
            this.addSpeed = 0;
            this.addCrit = 0;
            this.addHurt = 0;
            this.addHp = 0;
            this.hpLimit = 0;
            this.addMiss = 0;
        }
    }
    SysBuff.NAME = 'sys_rolebuff.txt';

    class MemoryManager {
        constructor() {
            this.res = {};
        }
        add(url) {
            let data = this.res[url];
            if (data == null) {
                data = new ResourceData();
                data.url = url;
                data.time = Date.now();
                this.res[data.url] = data;
            }
            data.count++;
        }
        app(url) {
            let data = this.res[url];
            if (data) {
                data.count--;
            }
        }
        release() {
            for (let key in this.res) {
                let data = this.res[key];
                if (data.count <= 0) {
                    let sp = Laya.loader.getRes(key);
                    sp && sp.destroy(true);
                    console.log("释放资源", key);
                }
            }
        }
    }
    MemoryManager.ins = new MemoryManager();
    class ResourceData {
        constructor() {
            this.url = '';
            this.time = 0;
            this.count = 0;
        }
    }

    class Monster extends GamePro {
        constructor() {
            super(GameProType.RockGolem_Blue, 0);
            this._bulletShadow = new ui.test.BulletShadowUI();
            Game.footLayer.addChild(this._bulletShadow);
        }
        onCie() {
            if (!this.isIce) {
                this.isIce = true;
                this.animator.speed = 0;
            }
        }
        offCie() {
            if (this.isIce) {
                this.isIce = false;
                this.animator.speed = 1;
            }
        }
        startAi() {
            super.startAi();
        }
        stopAi() {
            super.stopAi();
        }
        setShadowSize(ww) {
            super.setShadowSize(ww);
            Game.footLayer.addChild(this._bulletShadow);
        }
        updateUI() {
            super.updateUI();
            this._bulletShadow && this._bulletShadow.pos(this.hbox.cx - (this._bulletShadow.img.width - GameBG.mw) * 0.5, this.hbox.cy - (this._bulletShadow.img.height - GameBG.mw) * 0.5);
        }
        init() {
            let sysBullet;
            if (this.sysEnemy.normalAttack > 0) {
                sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, this.sysEnemy.normalAttack);
                this.aiType = sysBullet.bulletType;
            }
            if (this.sysEnemy.skillId != '0') {
                var arr = this.sysEnemy.skillId.split(',');
                for (var m = 0; m < arr.length; m++) {
                    let id = Number(arr[m]);
                    if (id > 0) {
                        sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                        this.aiType = sysBullet.bulletType;
                    }
                }
            }
        }
        show() {
            Game.layer3d.addChild(this.sp3d);
            Game.bloodLayer.addChild(this._bloodUI);
            Game.footLayer.addChild(this._bulletShadow);
        }
        hide() {
            this.sp3d && this.sp3d.removeSelf();
            this._bloodUI && this._bloodUI.removeSelf();
            this._bulletShadow && this._bulletShadow.removeSelf();
        }
        initBlood(hp) {
            super.initBlood(hp, hp);
            this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 90);
        }
        hurt(hurt, isCrit, isBuff = false) {
            Game.playSound("monsterHit.mp3");
            super.hurt(hurt, isCrit);
            if (this.sysEnemy.isBoss) {
                Laya.stage.event(GameEvent.BOOS_BLOOD_UPDATE, hurt);
            }
            if (isBuff) {
                return;
            }
            let he = HitEffect.addEffect(this);
            let mbe = MonsterBoomEffect.addEffect(this, this.tScale);
            if (hurt == 0) {
                he.sp3d && he.sp3d.removeSelf();
                mbe.sp3d && mbe.sp3d.removeSelf();
            }
        }
        die() {
            this.setKeyNum(1);
            this.once(Game.Event_KeyNum, this, this.onDie);
            this.play(GameAI.Die);
            if (Game.map0.Eharr.indexOf(this.hbox) >= 0) {
                Game.map0.Eharr.splice(Game.map0.Eharr.indexOf(this.hbox), 1);
            }
            if (Game.level <= 10) {
                if (this.sysEnemy.dropExp > 0) {
                    let skill3001 = Game.skillManager.isHas(3001);
                    let addNum = 0;
                    if (skill3001) {
                        let buff3001 = App.tableManager.getDataByNameAndId(SysBuff.NAME, skill3001.skillEffect1);
                        addNum = Math.ceil(this.sysEnemy.dropExp * buff3001.addExp / 1000);
                    }
                    Game.battleExp += this.sysEnemy.dropExp + addNum;
                }
            }
            if (this.sysEnemy.heroExp > 0) {
                Game.heroExp += this.sysEnemy.dropExp;
            }
            let skill4001 = Game.skillManager.isHas(4001);
            if (skill4001) {
                let buff4001 = App.tableManager.getDataByNameAndId(SysBuff.NAME, skill4001.skillEffect1);
                Game.hero.addBlood(Math.floor(Game.hero.gamedata.maxhp * buff4001.addHp / 1000));
            }
            Game.dropDiamond(this);
        }
        onDie(key) {
            Game.selectHead.removeSelf();
            Game.selectFoot.removeSelf();
            this.stopAi();
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(Monster.TAG + this.sysEnemy.enemymode, this);
            DieEffect.addEffect(this);
            MemoryManager.ins.app(this.sp3d.url);
        }
        clear() {
            Game.selectHead.removeSelf();
            Game.selectFoot.removeSelf();
            this.stopAi();
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(Monster.TAG + this.sysEnemy.enemymode, this);
            MemoryManager.ins.app(this.sp3d.url);
        }
        static getMonster(enemyId, xx, yy, mScale, hp) {
            let sysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, enemyId);
            let now = Game.executor.getWorldNow();
            if (!MonsterShader.map[sysEnemy.enemymode]) ;
            if (!hp) {
                hp = sysEnemy.enemyHp;
                if (sysEnemy.skillId != '0') {
                    var arr = sysEnemy.skillId.split(',');
                    for (var m = 0; m < arr.length; m++) {
                        let id = Number(arr[m]);
                        if (id > 0) {
                            let sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                            if (sysBullet.bulletType == AttackType.SPLIT) {
                                hp = sysEnemy.enemyHp / sysBullet.splitNum;
                            }
                        }
                    }
                }
            }
            let tag = Monster.TAG + sysEnemy.enemymode;
            Game.poolTagArr[tag] = tag;
            var gpro = Laya.Pool.getItemByClass(tag, Monster);
            gpro.curLen = gpro.moveLen = 0;
            gpro.sysEnemy = sysEnemy;
            gpro.init();
            if (!gpro.sp3d) {
                var sp = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/monsters/" + sysEnemy.enemymode + "/monster.lh"));
                MemoryManager.ins.add(sp.url);
                gpro.setSp3d(sp, GameBG.ww * 0.8);
            }
            gpro.hurtValue = sysEnemy.enemyAttack;
            var MOVE;
            if (sysEnemy.moveType > 0) {
                MOVE = Laya.ClassUtils.getClass(MoveType.TAG + sysEnemy.moveType);
                gpro.setGameMove(new MOVE());
            }
            let tScale = sysEnemy.zoomMode / 100;
            tScale = mScale ? mScale : tScale;
            gpro.tScale = tScale;
            gpro.sp3d.transform.localScaleX = tScale;
            gpro.sp3d.transform.localScaleY = tScale;
            gpro.sp3d.transform.localScaleZ = tScale;
            Game.map0.Eharr.push(gpro.hbox);
            Game.map0.Fharr.push(gpro.hbox);
            gpro.setShadowSize(sysEnemy.zoomShadow);
            gpro.setXY2DBox(xx, yy);
            gpro.initBlood(hp);
            var MonAI = Laya.ClassUtils.getClass(AttackType.TAG + sysEnemy.enemyAi);
            console.log("当前怪的AI", sysEnemy.id, sysEnemy.enemymode, sysEnemy.txt, sysEnemy.enemyAi, MonAI, MOVE);
            gpro.setGameAi(new MonAI(gpro));
            gpro.startAi();
            Game.layer3d.addChild(gpro.sp3d);
            return gpro;
        }
    }
    Monster.TAG = "Monster_";

    class BaseSkill {
        constructor(sys) {
            this.cd = 0;
            this.sysBullet = sys;
        }
        exeSkill(now, pro) {
            return false;
        }
    }

    class SplitSkill extends BaseSkill {
        constructor(sys) { super(sys); }
        exeSkill(now, pro) {
            this.pro = pro;
            if (pro.splitTimes < this.sysBullet.splitNum) {
                this.onDieSplit();
                return true;
            }
            return false;
        }
        onDieSplit() {
            console.log("分裂");
            let flag = this.pro.splitTimes + 1;
            let hp = this.pro.gamedata.maxhp / 2;
            let toArr = Game.getRandPos(this.pro, 1);
            let toX = toArr[0] * GameBG.ww;
            let toY = toArr[1] * GameBG.ww;
            let monster1 = Monster.getMonster(this.pro.sysEnemy.id, toX, toY, 1, hp);
            monster1.splitTimes = flag;
            let toArr1 = Game.getRandPos(this.pro, 1);
            let toX1 = toArr1[0] * GameBG.ww;
            let toY1 = toArr1[1] * GameBG.ww;
            let monster2 = Monster.getMonster(this.pro.sysEnemy.id, toX1, toY1, 1, hp);
            monster2.splitTimes = flag;
        }
    }

    class BaseAI extends GameAI {
        constructor(ms) {
            super();
            this.skillISbs = [];
            this.now = 0;
            this.shaders = 0;
            this.collisionCd = 0;
            this.stiff = 500;
            this.pro = ms;
            this.sysEnemy = this.pro.sysEnemy;
            this.normalSb = null;
            if (this.sysEnemy.normalAttack > 0) {
                this.normalSb = App.tableManager.getDataByNameAndId(SysBullet.NAME, this.sysEnemy.normalAttack);
            }
            this.skillISbs = [];
            if (this.sysEnemy.skillId != '0') {
                var arr = this.sysEnemy.skillId.split(',');
                for (var m = 0; m < arr.length; m++) {
                    let id = Number(arr[m]);
                    if (id > 0) {
                        let sysBullet = App.tableManager.getDataByNameAndId(SysBullet.NAME, id);
                        this.skillISbs.push(sysBullet);
                        if (sysBullet.bulletType == AttackType.SPLIT) {
                            this.splitSkill = new SplitSkill(sysBullet);
                        }
                    }
                }
            }
            if (this.sysEnemy.enemyBlack > 0) {
                let HIT = Laya.ClassUtils.getClass("HIT_" + this.sysEnemy.enemyBlack);
                this.g2 = new HIT();
            }
        }
        checkHeroCollision() {
            if (this.pro.gamedata.hp <= 0) {
                return;
            }
            var now = Game.executor.getWorldNow();
            if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) < GameBG.ww2) {
                if (now > this.collisionCd) {
                    if (Game.hero.hbox.linkPro_) {
                        this.pro.hurtValue = 150;
                        Game.hero.hbox.linkPro_.event(Game.Event_Hit, this.pro);
                        this.collisionCd = now + 2000;
                    }
                }
            }
        }
        setShader() {
            if (this.shaders > 0 && this.now >= this.shaders) {
                this.shaders = 0;
                var ms = this.pro;
                if (MonsterShader.map[ms.sysEnemy.enemymode]) {
                    var shader = MonsterShader.map[ms.sysEnemy.enemymode];
                    shader.setShader0(this.pro.sp3d, 0);
                }
            }
        }
        exeAI(pro) {
            if (this.pro.gamedata.hp <= 0) {
                return false;
            }
            if (!this.run_)
                return false;
            this.now = Game.executor.getWorldNow();
            this.setShader();
            this.hitEffect();
            return false;
        }
        hitEffect() {
            if (this.g2) {
                this.g2.ai(this.pro);
            }
        }
        starAi() {
            this.run_ = true;
            this.pro.play(GameAI.Idle);
        }
        stopAi() {
            this.run_ = false;
        }
        setCrit(pro, id) {
            let critSkill = Game.skillManager.isHas(id);
            if (critSkill) {
                let critBuff = App.tableManager.getDataByNameAndId(SysBuff.NAME, critSkill.skillEffect1);
                if (critBuff) {
                    let rate3006 = critBuff.addCrit / 1000;
                    if ((1 - Math.random()) > rate3006) {
                        pro.hurtValue = Math.floor(pro.hurtValue * 1.5 + pro.hurtValue * (critBuff.addHurt / 1000));
                        return true;
                    }
                }
            }
            return false;
        }
        setBoomHead() {
            let dieSkill = Game.skillManager.isHas(1007);
            if (dieSkill) {
                let arr = dieSkill.skillcondition.split(",");
                let hpRate = Number(arr[0]);
                let rate = Number(arr[1]);
                if (this.pro.gamedata.hp / this.pro.gamedata.maxhp < hpRate / 100) {
                    if ((1 - Math.random()) > rate / 100) {
                        this.pro.hurtValue = this.pro.gamedata.hp;
                        console.log("爆头了");
                    }
                }
            }
        }
        hit(pro, isBuff = false) {
            if (this.pro.gamedata.hp <= 0) {
                return;
            }
            let crit3006 = this.setCrit(pro, 3006);
            let crit3007 = this.setCrit(pro, 3007);
            this.setBoomHead();
            if (pro.buffAry.length > 0) {
                for (let i = 0; i < pro.buffAry.length; i++) {
                    let buffId = pro.buffAry[i];
                    if (this.pro.buffAry.indexOf(buffId) == -1) {
                        Game.buffM.addBuff(pro.buffAry[i], this.pro, pro);
                        this.pro.buffAry.push(buffId);
                    }
                }
            }
            this.pro.hurt(pro.hurtValue, crit3006 || crit3007, isBuff);
            if (this.pro.gamedata.hp <= 0) {
                this.die();
            }
            else {
                if (this.sysEnemy.enemyAi != 0) {
                    if (this.pro.acstr == GameAI.Idle || this.pro.acstr == GameAI.Run) {
                        this.pro.play(GameAI.TakeDamage);
                    }
                }
                if (isBuff) {
                    return;
                }
                this.stiffTime = this.now;
                if (this.g2 && this.g2.isOk() && !this.pro.unBlocking) {
                    if (this.sysEnemy.moveType != 5) {
                        var a = pro.face3d + Math.PI;
                        this.pro.rotation(a);
                    }
                    if (this.g2.starttime == 0) {
                        this.g2.starttime = this.now;
                        this.g2.now = this.now;
                        this.g2.playtime = 200;
                    }
                }
                var ms = this.pro;
                if (MonsterShader.map[ms.sysEnemy.enemymode]) {
                    var shader = MonsterShader.map[ms.sysEnemy.enemymode];
                    shader.setShader0(this.pro.sp3d, 1);
                    var now = Game.executor.getWorldNow();
                    this.shaders = now + 250;
                }
            }
        }
        die() {
            this.setShader();
            let goldNum = this.sysEnemy.dropGold;
            if (goldNum > 0) {
                CoinEffect.addEffect(this.pro, Math.floor(goldNum * 0.5), Coin.TYPE_COIN);
            }
            Game.battleCoins += goldNum;
            this.splitSkill && this.splitSkill.exeSkill(this.now, this.pro);
            this.pro.die();
            this.g2 = null;
        }
    }

    class RandMoveAI extends BaseAI {
        constructor(pro) {
            super(pro);
            this.cd = 0;
            this.status = 0;
            pro.setSpeed(this.sysEnemy.moveSpeed);
            if (RandMoveAI.timdex >= 3) {
                RandMoveAI.timdex = 0;
            }
            this.cd = Game.executor.getWorldNow() + RandMoveAI.timdex * 500;
            RandMoveAI.timdex++;
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            if (this.pro.isIce) {
                return;
            }
            if (this.status == 0 && this.now >= this.cd) {
                this.status = 1;
                this.cd = this.now + this.sysEnemy.enemySpeed;
                let randIndex = Math.floor(Math.random() * 12);
                this.pro.rotation((Math.PI / 8) * RandMoveAI.dirs[randIndex]);
                this.pro.play(GameAI.Run);
            }
            else if (this.status == 1 && this.now >= this.cd) {
                this.status = 0;
                this.cd = this.now + this.sysEnemy.enemySpeed;
                this.pro.play(GameAI.Idle);
            }
            if (this.status == 1) {
                this.pro.move2D(this.pro.face2d);
            }
        }
        exeAI0(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            if (this.status == 0 && this.now >= this.cd) {
                this.cd = this.now + this.sysEnemy.enemySpeed;
                this.status = 1;
                let toArr = Game.getRandPos(this.pro);
                let toX = toArr[0] * GameBG.ww;
                let toY = toArr[1] * GameBG.ww;
                this.pro.curLen = 0;
                this.pro.moveLen = Math.sqrt((this.pro.hbox.y - toY) * (this.pro.hbox.y - toY) + (this.pro.hbox.x - toX) * (this.pro.hbox.x - toX));
                var xx = toX - this.pro.hbox.x;
                var yy = this.pro.hbox.y - toY;
                this.pro.rotation(Math.atan2(yy, xx));
            }
            else if (this.status == 1 && this.now >= this.cd) {
                this.cd = this.now + this.sysEnemy.enemySpeed;
                this.status = 0;
            }
            if (this.status == 1) {
                this.pro.move2D(this.pro.face2d);
            }
        }
    }
    RandMoveAI.timdex = 0;
    RandMoveAI.dirs = [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15];

    class PlaneGameMove extends GameMove {
        move2d(n, pro, speed) {
            if (pro.gamedata.hp <= 0) {
                return;
            }
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            if (pro instanceof Monster) {
                if (Game.map0.chechHit(pro, vx, vz)) {
                    if (vz != 0 && Game.map0.chechHit(pro, vx, 0)) {
                        vx = 0;
                        vz = (vz < 0 ? -1 : 1) * pro.speed;
                        if (pro.getGameAi() instanceof RandMoveAI) {
                            let randIndex = Math.floor(Math.random() * 12);
                            pro.rotation((Math.PI / 8) * RandMoveAI.dirs[randIndex]);
                        }
                    }
                    if (vx != 0 && Game.map0.chechHit(pro, 0, vz)) {
                        vz = 0;
                        vx = (vx < 0 ? -1 : 1) * pro.speed;
                        if (pro.getGameAi() instanceof RandMoveAI) {
                            let randIndex = Math.floor(Math.random() * 12);
                            pro.rotation((Math.PI / 8) * RandMoveAI.dirs[randIndex]);
                        }
                    }
                    if (Game.map0.chechHit(pro, vx, vz)) {
                        if (pro.getGameAi() instanceof RandMoveAI) {
                            let randIndex = Math.floor(Math.random() * 12);
                            pro.rotation((Math.PI / 8) * RandMoveAI.dirs[randIndex]);
                        }
                        return false;
                    }
                }
            }
            else {
                if (Game.map0.chechHit(pro, vx, vz)) {
                    if (vz != 0 && Game.map0.chechHit(pro, vx, 0)) {
                        vx = 0;
                        vz = (vz < 0 ? -1 : 1) * pro.speed;
                    }
                    if (vx != 0 && Game.map0.chechHit(pro, 0, vz)) {
                        vz = 0;
                        vx = (vx < 0 ? -1 : 1) * pro.speed;
                    }
                    if (Game.map0.chechHit(pro, vx, vz)) {
                        return false;
                    }
                }
            }
            if (!this.Blocking(pro, vx, vz)) {
                return false;
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    class HeroArrowAI extends GameAI {
        constructor(pro) {
            super();
            this.i = 0;
            this.pro = pro;
        }
        hit(pro) {
            this.pro.die();
        }
        exeAI(pro) {
            if (pro.isDie) {
                return false;
            }
            if (this.i == 0 && !pro.move2D(pro.face2d)) {
                this.i = 1;
                return false;
            }
            if (this.i > 0) {
                this.i++;
                if (this.i > 30) ;
            }
        }
        starAi() {
            this.i = 0;
        }
        stopAi() {
            this.i = 0;
        }
    }

    class ArrowGameMove0 extends GameMove {
        constructor() {
            super(...arguments);
            this.future = new GameHitBox(2, 2);
            this.speed = 0;
            this.sp = new Laya.Point();
            this.st = 0;
            this.n = 0;
            this.cos = 0;
            this.sin = 0;
            this.arrowlen = 10;
            this.line = new MaoLineData(0, 0, 0, this.arrowlen);
            this.vv = new MaoLineData(0, 0, 0, 1);
            this.fv = null;
            this.ii = 1;
        }
        move2d(n, pro, speed, hitStop) {
            if (pro.isDie) {
                return false;
            }
            if (speed == 0)
                return false;
            if (this.fv != null) {
                pro.rotation(2 * Math.PI - this.fv.atan2());
                n = pro.face2d;
                pro.setcXcY2DBox(this.fv.x1, this.fv.y1);
                this.fv = null;
            }
            var now = Game.executor.getWorldNow();
            if (this.speed != speed || this.n != n) {
                this.sp.x = pro.hbox.x;
                this.sp.y = pro.hbox.y;
                this.st = now;
                this.n = n;
                this.sin = Math.sin(n);
                this.cos = Math.cos(n);
                this.speed = speed;
            }
            var hits = Game.map0.Eharr;
            if (pro.hit_blacklist) {
                var tem = [];
                for (let i = 0; i < hits.length; i++) {
                    var e = hits[i];
                    if (!pro.checkBlackList(e)) {
                        tem.push(e);
                    }
                }
                hits = tem;
            }
            var box = pro.hbox;
            var line = this.line;
            line.reset00(box.cx, box.cy);
            line.rad(n);
            var vv = this.vv;
            box = this.future.setRq(line.x1 - GameBG.mw4, line.y1 - GameBG.mw4, GameBG.mw2, GameBG.mw2);
            var enemy = Game.map0.chechHit_arr(this.future, hits);
            if (enemy) {
                if (this.hitEnemy(enemy, pro) == 0) {
                    return false;
                }
                else {
                    return true;
                }
            }
            box = this.future.setVV(line.x0, line.y0, line.x_len, line.y_len);
            var all = Game.map0.chechHit_arr_all(this.future, hits);
            if (all) {
                vv.reset(line.x0, line.y0, line.x1, line.y1);
                var rs = Game.map0.getPointAndLine(vv, all);
                if (rs) {
                    enemy = rs[2];
                    if (enemy) {
                        if (this.hitEnemy(enemy, pro) == 0) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                }
                box = this.future.setVV(line.x1, line.y1, vx, vz);
                var all = Game.map0.chechHit_arr_all(this.future, hits);
                if (all) {
                    vv.reset(line.x0, line.y0, line.x1, line.y1);
                    var rs = Game.map0.getPointAndLine(vv, all);
                    if (rs) {
                        enemy = rs[2];
                        if (enemy) {
                            if (this.hitEnemy(enemy, pro) == 0) {
                                return false;
                            }
                            else {
                                return true;
                            }
                        }
                    }
                }
            }
            hits = Game.map0.Aharr;
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            box = this.future.setVV(line.x1, line.y1, vx, vz);
            vv.reset(line.x1, line.y1, line.x1 + vx, line.y1 + vz);
            var all = Game.map0.chechHit_arr_all(this.future, hits);
            if (all) {
                var rs = Game.map0.getPointAndLine(vv, all);
                if (rs) {
                    var p = rs[0];
                    var l = rs[1];
                    vv.reset(vv.x0, vv.y0, p.x, p.y);
                    pro.setXY2D(pro.pos2.x + vv.x_len, pro.pos2.z + vv.y_len);
                    l = vv.rebound(l);
                    if (l) {
                        l.resetlen(this.arrowlen);
                    }
                }
                pro.fcount--;
                if (pro.fantanSkill) {
                    pro.hurtValue = Math.floor(pro.hurtValue * pro.fantanSkill.damagePercent / 100);
                }
                this.fv = l;
                if (pro.fcount <= 0) {
                    pro.die();
                    return false;
                }
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            if (Math.abs(pro.pos2.x) > GameBG.ww * GameBG.MAP_COL || Math.abs(pro.pos2.z) > GameBG.ww * GameBG.MAP_ROW) {
                pro.die();
            }
            return true;
        }
        sore0(g0, g1) {
            if (!this.he_)
                return 0;
            return GameHitBox.faceToLenth(this.he_, g0) - GameHitBox.faceToLenth(this.he_, g1);
        }
        hitEnemy(enemy, pro) {
            enemy.linkPro_.event(Game.Event_Hit, pro);
            if (pro.tansheSkill && this.ii > 0) {
                if (!pro.hit_blacklist) {
                    pro.hit_blacklist = [];
                }
                pro.hit_blacklist.push(enemy);
                this.ii--;
                if (pro.tansheSkill) {
                    pro.hurtValue = Math.floor(pro.hurtValue * pro.tansheSkill.damagePercent / 100);
                }
                else if (pro.chuantouSkill) {
                    pro.hurtValue = Math.floor(pro.hurtValue * pro.chuantouSkill.damagePercent / 100);
                }
                let arr = Game.map0.Eharr;
                for (let i = 0; i < arr.length; i++) {
                    let e = arr[i];
                    if (e != enemy) {
                        pro.setXY2D(enemy.linkPro_.pos2.x, enemy.linkPro_.pos2.z);
                        var a = GameHitBox.faceTo3D(pro.hbox, e);
                        pro.rotation(a);
                        return 1;
                    }
                }
                pro.die();
                return 0;
            }
            if (!pro.chuantouSkill) {
                if (!pro.hit_blacklist) {
                    pro.hit_blacklist = [];
                }
                pro.hit_blacklist.push(enemy);
                pro.die();
                return 0;
            }
            pro.die();
            return 0;
        }
    }

    class HeroBullet extends GamePro {
        constructor() {
            super(GameProType.HeroArrow);
            this.buffAry = [];
            this.fcount = 0;
            this.setGameMove(new ArrowGameMove0());
            this.setGameAi(new HeroArrowAI(this));
        }
        setBullet(id) {
            if (!this.sp3d) {
                this.setSp3d(Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + id + "/monster.lh")));
                console.log("创建主角的子弹");
            }
            if (Game.skillManager.arrowHeadId > 0) {
                if (!this.head) {
                    let ss = Laya.loader.getRes("h5/bullets/skill/" + Game.skillManager.arrowHeadId + "/monster.lh");
                    if (ss) {
                        this.head = Laya.Sprite3D.instantiate(ss);
                        this.head.transform.localRotationEulerY = -180;
                        this.addSprite3DToChild("Gua", this.head);
                    }
                }
            }
        }
        static getBullet(id) {
            let bullet = Laya.Pool.getItemByClass(HeroBullet.TAG, HeroBullet);
            bullet.hit_blacklist = null;
            bullet.getGameMove().fv = null;
            bullet.getGameMove().ii = 1;
            bullet.chuantouSkill = null;
            bullet.fantanSkill = null;
            bullet.fcount = 0;
            bullet.tansheSkill = null;
            bullet.buffAry.length = 0;
            bullet.isDie = false;
            bullet.setBullet(id);
            bullet.chuantouSkill = Game.skillManager.isHas(1006);
            bullet.fantanSkill = Game.skillManager.isHas(1008);
            bullet.fcount = bullet.fantanSkill ? 2 : 0;
            bullet.tansheSkill = Game.skillManager.isHas(1009);
            let arr = [2001, 2002, 2003, 5001, 5002, 5003, 5004];
            for (let i = 0; i < arr.length; i++) {
                if (Game.skillManager.isHas(arr[i])) {
                    bullet.buffAry.push(arr[i]);
                }
            }
            return bullet;
        }
        die() {
            if (this.isDie) {
                return;
            }
            this.isDie = true;
            this.stopAi();
            this.setSpeed(0);
            this.sp3d.parent && this.sp3d.parent.removeChild(this.sp3d);
            Laya.Pool.recover(HeroBullet.TAG, this);
        }
    }
    HeroBullet.TAG = 'HeroBullet';

    class SysSkill {
        constructor() {
            this.id = 0;
            this.skillName = '';
            this.skillInfo = '';
            this.skillType = 0;
            this.triggerComparison = 0;
            this.skilltarget = 0;
            this.skillcondition = '';
            this.damagePercent = 0;
            this.skillEffect1 = 0;
            this.upperLimit = 0;
            this.curTimes = 0;
        }
        static reset() {
            let ary = App.tableManager.getTable(SysSkill.NAME);
            for (let i = 0; i < ary.length; i++) {
                ary[i].curTimes = 0;
            }
        }
    }
    SysSkill.NAME = 'sys_roleskill.txt';

    class Shooting {
        constructor() {
            this.scd = 0;
            this.st = 0;
            this.et = 0;
            this.now = 0;
            this.at = 0;
            this.future = new GameHitBox(2, 2);
        }
        short_arrow(speed_, r_, pro, attackPower, bulletId = 20000) {
            let bo = HeroBullet.getBullet(bulletId);
            for (let i = 0; i < bo.buffAry.length; i++) {
                let sys = App.tableManager.getDataByNameAndId(SysSkill.NAME, bo.buffAry[i]);
                attackPower = attackPower * sys.damagePercent / 100;
            }
            bo.hurtValue = Math.floor(attackPower);
            bo.sp3d.transform.localPositionY = 0.8;
            bo.setXY2D(pro.pos2.x, pro.pos2.z);
            bo.setSpeed(speed_);
            bo.rotation(r_);
            bo.gamedata.bounce = pro.gamedata.bounce;
            bo.startAi();
            Game.layer3d.addChild(bo.sp3d);
            return bo;
        }
        attackOk() {
            this.now = Game.executor.getWorldNow();
            return this.now >= this.st;
        }
        starAttack(pro, acstr) {
            this.pro = pro;
            this.curAttack = acstr;
            if (this.attackOk()) {
                this.st = Game.executor.getWorldNow() + Hero.curHeroData.atkSpeed;
                this.scd = 0;
                this.pro.play(acstr);
                if (this.at > 0) {
                    Laya.stage.timer.frameLoop(this.at, this, this.ac0);
                }
                else {
                    this.ac0();
                }
                return true;
            }
            return false;
        }
        cancelAttack() {
            this.st = this.et;
            this.scd = 0;
            Laya.stage.timer.clear(this, this.ac0);
        }
        ac0() {
            if (this.pro.normalizedTime >= this.at) {
                if (this.pro.normalizedTime >= 1) {
                    Laya.stage.timer.clear(this, this.ac0);
                    this.pro.play(GameAI.Idle);
                }
                if (this.scd == 0) {
                    this.scd = 1;
                    this.st = Game.executor.getWorldNow() + Hero.curHeroData.atkSpeed;
                    this.pro.event(Game.Event_Short, this.curAttack);
                    this.et = this.st;
                }
            }
        }
        checkBallistic(n, pro, ero) {
            var vx = GameBG.mw2 * Math.cos(n);
            var vz = GameBG.mw2 * Math.sin(n);
            var x0 = pro.hbox.cx;
            var y0 = pro.hbox.cy;
            var ebh;
            for (let i = 0; i < 6000; i++) {
                ebh = null;
                this.future.setVV(x0, y0, vx, vz);
                if (ero.hbox.hit(ero.hbox, this.future)) {
                    return ero;
                }
                var hits = Game.map0.Aharr;
                ebh = Game.map0.chechHit_arr(this.future, hits);
                if (ebh) {
                    return null;
                }
                x0 += vx;
                y0 += vz;
            }
            return null;
        }
    }

    class ArrowRoateMove extends GameMove {
        constructor() {
            super(...arguments);
            this.future = new GameHitBox(2, 2);
            this.angle = 0;
            this.zhuanLine = new MaoLineData(0, 0, GameBG.ww * 3, 0);
            this.cd = 0;
        }
        move2d(n, pro, speed) {
            this.angle += 5;
            if (this.angle > 360) {
                this.angle = 0;
            }
            let hudu = this.angle / 180 * Math.PI;
            this.zhuanLine.rad(n + hudu);
            pro.setXY2D(Game.hero.pos2.x + this.zhuanLine.x_len, Game.hero.pos2.z + this.zhuanLine.y_len);
            if (Game.executor.getWorldNow() > this.cd) {
                var ebh = Game.map0.chechHit_arr(pro.hbox, Game.map0.Eharr);
                if (ebh) {
                    if (ebh.linkPro_) {
                        ebh.linkPro_.event(Game.Event_Hit, pro);
                        pro.event(Game.Event_Hit, ebh.linkPro_);
                        this.cd = Game.executor.getWorldNow() + 1000;
                    }
                }
            }
            return true;
        }
    }

    class BulletRotate extends GamePro {
        constructor() {
            super(GameProType.HeroArrow);
            this.setGameMove(new ArrowRoateMove());
        }
        static getBullet(id) {
            let bullet = new BulletRotate();
            bullet.setSp3d(Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + id + "/monster.lh")));
            bullet.sp3d.transform.localPositionY = 1;
            bullet.sp3d.transform.localRotationEulerX = 45;
            return bullet;
        }
    }
    BulletRotate.TAG = 'HeroBullet';

    class GameThorn extends Laya.Box {
        constructor() {
            super();
            this.lastTime = 0;
            this.hbox = new GameHitBox(GameBG.ww, GameBG.ww);
            this.inDanger = false;
            this.cd = 1500;
            this.diciPro = new GamePro(8, 0);
            this.diciPro.hurtValue = 150;
            this.img1 = new Laya.Image();
            this.img1.skin = "bg/500.png";
            this.img0 = new Laya.Image();
            this.img0.skin = "bg/500_0.png";
            this.addChild(this.img1);
            this.addChild(this.img0);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            this.on(Laya.Event.UNDISPLAY, this, this.onUnDis);
        }
        static getOne() {
            let one = Laya.Pool.getItemByClass(GameThorn.TAG, GameThorn);
            GameThorn.arr.push(one);
            return one;
        }
        static recover() {
            while (GameThorn.length > 0) {
                let one = GameThorn.arr.shift();
                one.removeSelf();
                Laya.Pool.recover(GameThorn.TAG, one);
            }
        }
        onDis() {
            this.inDanger = false;
            this.img1.removeSelf();
            this.img0.removeSelf();
            this.addChild(this.img0);
            Laya.timer.frameLoop(1, this, this.onLoop);
            this.onLoop();
        }
        onLoop() {
            let now = Game.executor.getWorldNow();
            if (now > this.lastTime) {
                this.inDanger = !this.inDanger;
                this.lastTime = now + this.cd;
                if (this.inDanger) {
                    this.img0.removeSelf();
                    this.addChild(this.img1);
                }
                else {
                    this.img1.removeSelf();
                    this.addChild(this.img0);
                }
            }
        }
        onUnDis() {
            this.inDanger = false;
            Laya.timer.clear(this, this.onLoop);
            this.img1.removeSelf();
            this.img0.removeSelf();
        }
    }
    GameThorn.TAG = "GameThorn";
    GameThorn.arr = [];

    class HeroAI extends GameAI {
        constructor() {
            super();
            this.shootin = HeroAI.shoot;
            this.skillDic = {};
        }
        set run(b) {
            if (this.run_ != b) {
                this.run_ = b;
                if (this.run_) {
                    this.stopAi();
                    Game.hero.play(GameAI.Run);
                }
                else {
                    Game.hero.play(GameAI.Idle);
                    this.starAi();
                }
            }
        }
        hit(pro) {
            if (Game.hero.isWudi) {
                return;
            }
            if (Game.hero.gamedata.hp > 0) {
                Game.hero.hurt(pro.hurtValue, false);
            }
            if (Game.hero.gamedata.hp <= 0) {
                Game.hero.die();
                this.run_ = false;
            }
        }
        starAi() {
            if (Game.hero.gamedata.hp <= 0) {
                return;
            }
            if (Game.map0.Eharr.length > 1) {
                Game.map0.Eharr.sort(this.sore0);
            }
            if (Game.map0.Eharr.length > 0) {
                Game.selectEnemy(Game.map0.Eharr[0].linkPro_);
            }
            Game.hero.on(Game.Event_Short, this, this.short);
            this.shootin.at = 0.6;
            this.shootin.now = Game.executor.getWorldNow();
        }
        rotateBullet() {
            let skillIds = Game.skillManager.getRotateSkills();
            let br;
            let hudu = Math.PI / skillIds.length;
            let skillId;
            for (let i = 0; i < skillIds.length; i++) {
                skillId = skillIds[i];
                br = this.skillDic[skillId + "_1"];
                if (!br) {
                    this.skillDic[skillId + "_1"] = BulletRotate.getBullet(skillId);
                }
                br = this.skillDic[skillId + "_1"];
                Game.layer3d.addChild(br.sp3d);
                br.move2D(hudu * i);
                br = this.skillDic[skillId + "_2"];
                if (!br) {
                    this.skillDic[skillId + "_2"] = BulletRotate.getBullet(skillId);
                }
                br = this.skillDic[skillId + "_2"];
                Game.layer3d.addChild(br.sp3d);
                br.move2D(Math.PI + hudu * i);
            }
        }
        short(ac) {
            if (Game.e0_) {
                var a = GameHitBox.faceTo3D(Game.hero.hbox, Game.e0_.hbox);
                Game.hero.rotation(a);
            }
            if (ac == GameAI.closeCombat) {
                Game.playSound("fx_hit.wav");
                if (Game.e0_) {
                    Game.hero.hurtValue = Math.floor(Hero.curHeroData.atk * 1.5);
                    Game.e0_.hbox.linkPro_.event(Game.Event_Hit, Game.hero);
                }
                return;
            }
            Game.playSound("fx_shoot.wav");
            let basePower = Hero.curHeroData.atk;
            let angerSkill = Game.skillManager.isHas(3008);
            if (angerSkill) {
                let rate = (Game.hero.gamedata.maxhp - Game.hero.gamedata.hp) / Game.hero.gamedata.maxhp;
                basePower = Math.floor(Game.skillManager.addAttack() * (1 + rate));
            }
            this.onShoot(basePower);
            let skill1005 = Game.skillManager.isHas(1005);
            if (skill1005) {
                if (skill1005.curTimes == 1) {
                    Laya.timer.frameOnce(15, this, () => {
                        this.onShoot(basePower * skill1005.damagePercent / 100);
                    });
                }
                else {
                    Laya.timer.frameOnce(15, this, () => {
                        this.onShoot(basePower * skill1005.damagePercent / 100);
                    });
                    Laya.timer.frameOnce(30, this, () => {
                        this.onShoot(basePower * skill1005.damagePercent / 100);
                    });
                }
            }
        }
        onShoot(basePower) {
            let moveSpeed = GameBG.ww / 2;
            let skillLen = Game.skillManager.skillList.length;
            let skill1001 = Game.skillManager.isHas(1001);
            if (skill1001) {
                if (!this.line)
                    this.line = new MaoLineData(0, 0, GameBG.mw2, 0);
                this.line.rad(Game.hero.face2d + Math.PI / 2);
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower * skill1001.damagePercent / 100).setXY2D(Game.hero.pos2.x + this.line.x_len, Game.hero.pos2.z + this.line.y_len);
                this.line.rad(Game.hero.face2d - Math.PI / 2);
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower * skill1001.damagePercent / 100).setXY2D(Game.hero.pos2.x + this.line.x_len, Game.hero.pos2.z + this.line.y_len);
                if (skill1001.curTimes >= 2) {
                    this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower * skill1001.damagePercent / 100);
                }
            }
            else {
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d, Game.hero, basePower);
            }
            let skill1002 = Game.skillManager.isHas(1002);
            if (skill1002) {
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d + Math.PI, Game.hero, basePower * skill1002.damagePercent / 100);
            }
            let skill1003 = Game.skillManager.isHas(1003);
            if (skill1003) {
                let angle = skill1003.curTimes == 1 ? 90 : 120;
                let num = 2 * skill1003.curTimes;
                angle = angle / num;
                let hudu = angle / 180 * Math.PI;
                let count = Math.floor(num / 2);
                for (var i = 1; i <= count; i++) {
                    this.shootin.short_arrow(moveSpeed, Game.hero.face3d + hudu * i, Game.hero, basePower * skill1003.damagePercent / 100);
                    this.shootin.short_arrow(moveSpeed, Game.hero.face3d - hudu * i, Game.hero, basePower * skill1003.damagePercent / 100);
                }
            }
            let skill1004 = Game.skillManager.isHas(1004);
            if (skill1004) {
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d + Math.PI * 0.5, Game.hero, basePower * skill1004.damagePercent / 100);
                this.shootin.short_arrow(moveSpeed, Game.hero.face3d - Math.PI * 0.5, Game.hero, basePower * skill1004.damagePercent / 100);
            }
        }
        stopAi() {
            this.shootin.cancelAttack();
            Game.hero.off(Game.Event_Short, this, this.short);
        }
        exeAI(pro) {
            if (Session.guideId == 1 || Session.guideId == 2) {
                return;
            }
            var now = Game.executor.getWorldNow();
            Game.bg.checkNpc();
            if (Game.hero.isIce) {
                return;
            }
            this.rotateBullet();
            let chuanqiangSkill = Game.skillManager.isHas(5007);
            if (!chuanqiangSkill) {
                if (GameThorn.arr.length > 0) {
                    for (var i = 0; i < GameThorn.arr.length; i++) {
                        let thorn = GameThorn.arr[i];
                        let thornBox = thorn.hbox;
                        if (thorn.inDanger && Game.hero.hbox.hit(Game.hero.hbox, thornBox)) {
                            if (now > thornBox.cdTime) {
                                pro.event(Game.Event_Hit, thorn.diciPro);
                                thornBox.cdTime = now + 2000;
                            }
                        }
                    }
                }
            }
            if (Session.homeData.isGuide) {
                if (Session.guideId == 3) {
                    if (Game.map0.guideHitBox && Game.hero.hbox.hit(Game.hero.hbox, Game.map0.guideHitBox)) {
                        Game.scenneM.battle && Game.scenneM.battle.up(null);
                        Game.scenneM.battle.setGuide("主角会自动攻击，移动中不会攻击。", 2);
                        App.sdkManager.log(LogType.BATTLE_GUIDE, "主角会自动攻击，移动中不会攻击。");
                        Game.map0.guideHitBox = null;
                        return false;
                    }
                }
            }
            if (this.run_) {
                this.moves();
                return;
            }
            if (Session.homeData.isGuide) {
                if (Session.guideId == 3) {
                    return false;
                }
            }
            if (Game.map0.Eharr.length > 0) {
                if (this.shootin.attackOk()) {
                    var a = GameHitBox.faceTo3D(pro.hbox, Game.e0_.hbox);
                    var facen2d_ = (2 * Math.PI - a);
                    if (Game.e0_.gamedata.hp > 0 && this.shootin.checkBallistic(facen2d_, Game.hero, Game.e0_)) {
                        pro.rotation(a);
                        return this.starAttack();
                    }
                    if (Game.map0.Eharr.length > 1) {
                        Game.map0.Eharr.sort(this.sore0);
                        var arr = Game.map0.Eharr;
                        for (let i = 0; i < arr.length; i++) {
                            var ero = arr[i];
                            if (ero.linkPro_ != Game.e0_) {
                                var a = GameHitBox.faceTo3D(pro.hbox, ero);
                                var facen2d_ = (2 * Math.PI - a);
                                if (this.shootin.checkBallistic(facen2d_, Game.hero, ero.linkPro_)) {
                                    Game.selectEnemy(ero.linkPro_);
                                    pro.rotation(a);
                                    return this.starAttack();
                                }
                            }
                        }
                    }
                    Game.selectEnemy(Game.map0.Eharr[0].linkPro_);
                    var a = GameHitBox.faceTo3D(pro.hbox, Game.e0_.hbox);
                    pro.rotation(a);
                    this.starAttack();
                }
            }
            else if (Game.TestShooting == 1 && this.shootin.attackOk()) {
                this.starAttack();
            }
            return true;
        }
        starAttack() {
            let isCloseCombat = GameHitBox.faceToLenth(Game.hero.hbox, Game.e0_.hbox) <= GameBG.ww * 3;
            let ac = "";
            if (isCloseCombat) {
                ac = GameAI.closeCombat;
            }
            else {
                ac = GameAI.NormalAttack;
            }
            return this.shootin.starAttack(Game.hero, ac);
        }
        sore0(g0, g1) {
            return GameHitBox.faceToLenth(Game.hero.hbox, g0) - GameHitBox.faceToLenth(Game.hero.hbox, g1);
        }
        move2d(n) {
            Game.hero.move2D(n);
            Game.bg.updateY();
        }
        moves() {
            let n;
            var speed = Game.ro.getSpeed();
            n = Game.ro.getA3d();
            Game.ro.rotate(n);
            if (speed > 0) {
                Game.hero.rotation(n);
                this.move2d(Game.ro.getA());
            }
        }
    }
    HeroAI.shoot = new Shooting();

    class WudiRotateScript extends Laya.Script3D {
        constructor() {
            super();
        }
        onAwake() {
            this.box = this.owner;
        }
        onStart() {
        }
        onUpdate() {
            if (!Game.executor.isRun) {
                return;
            }
            this.box.transform.localRotationEulerY += 3;
        }
        onDisable() {
        }
    }

    class Hero extends GamePro {
        constructor() {
            super(GameProType.Hero, 0);
            this.isWudi = false;
            this.isNew = true;
            this.busi = false;
            this.lastTime = 0;
            this.resetBlood();
            this.resetSkill();
            this.unBlocking = true;
            this.setGameMove(new PlaneGameMove());
            this.setGameAi(new HeroAI());
        }
        static udpateHeroData() {
            Hero.curHeroData = Session.heroData.getHeroData(Session.heroData.nowRoleId);
        }
        addBuff(buffId) {
            if (this.buffAry.indexOf(buffId) == -1) {
                Game.buffM.addBuff(buffId, this);
                this.buffAry.push(buffId);
            }
        }
        lossBlood() {
            return (this.gamedata.maxhp - this.gamedata.hp) / this.gamedata.maxhp;
        }
        changeBlood(sys) {
            let buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys.skillEffect1);
            if (buff) {
                if (sys.id == 4002 || sys.id == 4004) {
                    this.addBlood(Math.floor(this.gamedata.maxhp * buff.addHp / 1000));
                    return true;
                }
                else if (sys.id == 4003) {
                    this.changeMaxBlood(buff.hpLimit / 1000);
                    return true;
                }
            }
            return false;
        }
        changeMaxBlood(changeValue) {
            if (changeValue > 0) {
                this.gamedata.hp = this.gamedata.hp + Math.floor(this.gamedata.maxhp * changeValue);
            }
            this.gamedata.maxhp = Math.floor(this.gamedata.maxhp * (1 + changeValue));
            if (this.gamedata.hp >= this.gamedata.maxhp) {
                this.gamedata.hp = this.gamedata.maxhp;
            }
            this.initBlood(this.gamedata.hp);
        }
        addBlood(addValue) {
            this.gamedata.hp = this.gamedata.hp + addValue;
            this.gamedata.hp = Math.min(this.gamedata.hp, this.gamedata.maxhp);
            this.initBlood(this.gamedata.hp);
            BloodEffect.add("+" + addValue, this._bloodUI, false, "main/greenFont.png");
            if (!this._addEff) {
                this._addEff = new ui.game.addBloodEffUI();
            }
            this._bloodUI.addChild(this._addEff);
            this._addEff.ani.play(0, false);
            setTimeout(() => {
                this._addEff && this._addEff.removeSelf();
            }, 300);
        }
        resetBlood() {
            this.gamedata.hp = this.gamedata.maxhp = Hero.curHeroData.hp;
        }
        resetSkill() {
            this.buffAry.length = 0;
            Game.skillManager.clear();
            Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME, Hero.curHeroData.initSkillId));
        }
        resetAI() {
            this.getGameAi().run = false;
        }
        setWudi(bool) {
            if (this.isWudi == bool) {
                return;
            }
            this.isWudi = bool;
            if (bool) {
                if (!this.wudi) {
                    let sp = Laya.loader.getRes("h5/bullets/skill/5009/monster.lh");
                    if (sp) {
                        this.wudi = sp;
                        this.wudi.transform.localPositionY = -0.5;
                        this.wudi.addComponent(WudiRotateScript);
                    }
                }
                this.sp3d.addChild(this.wudi);
            }
            else {
                this.wudi && this.wudi.removeSelf();
            }
        }
        init() {
            if (Game.battleLoader.continueRes) {
                Game.hero.gamedata.hp = Game.battleLoader.continueRes.curhp;
                Game.hero.gamedata.maxhp = Game.battleLoader.continueRes.maxhp;
                let skills = Game.battleLoader.continueRes.skills;
                if (skills.length > 0) {
                    let arr = skills.split(",");
                    for (let i = 0; i < arr.length; i++) {
                        let info = arr[i].split("_");
                        if (info.length == 2) {
                            let sysSkill = App.tableManager.getDataByNameAndId(SysSkill.NAME, Number(info[0]));
                            sysSkill.curTimes = Number(info[1]);
                            Game.skillManager.addSkill(sysSkill);
                        }
                    }
                }
            }
            this.isDie = false;
            this.setKeyNum(1);
            this.acstr = "";
            let sp = Laya.loader.getRes("h5/hero/" + Session.heroData.nowRoleId + "/hero.lh");
            Game.layer3d.addChild(sp);
            var scale = 1.4;
            sp.transform.localScaleX = scale;
            sp.transform.localScaleY = scale;
            sp.transform.localScaleZ = scale;
            this.setSp3d(sp);
            this.play("Idle");
            this.setSpeed(Hero.curHeroData.moveSpeed);
            console.log("玩家移动速度", Hero.curHeroData.moveSpeed);
            this.pos2.x = this.pos2.z = 0;
            this.sp3d.transform.localPositionX = 0;
            this.sp3d.transform.localPositionY = 0;
            this.sp3d.transform.localPositionZ = 0;
            console.log("出生位置", Hero.bornX, Hero.bornY);
            this.setXY2DBox(Hero.bornX, Hero.bornY);
            this.initBlood(this.gamedata.hp);
            this.addFootCircle();
            Game.map0.Hharr.push(this.hbox);
            this.gamedata.rspeed = 0;
            this.rotation(90 / 180 * Math.PI);
            setTimeout(() => {
                this.onJumpDown();
            }, 600);
            Laya.stage.on(Game.Event_ADD_HP, this, this.addBlood);
            this.updateUI();
        }
        initBlood(hp) {
            super.initBlood(hp, this.gamedata.maxhp);
            this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 120);
        }
        updateUI() {
            super.updateUI();
            this._bloodUI && this._bloodUI.pos(this.hbox.cx, this.hbox.cy - 120);
            this._footCircle && this._footCircle.pos(this.hbox.cx, this.hbox.cy);
            if (this._footCircle) {
                this._footCircle.dir.rotation = this.face2d * 180 / Math.PI + 90;
            }
        }
        onJumpDown() {
            this.gamedata.rspeed = 20;
            this.startAi();
            Game.executor.start();
            console.log("主角调下来", Game.AiArr.length);
        }
        hurt(hurt, isCrit) {
            if (this.busi) {
                return;
            }
            hurt = Math.floor(hurt * (1 - Hero.curHeroData.def));
            let isMiss = false;
            let missSkill = Game.skillManager.isHas(5006);
            if (missSkill) {
                let missBuff = App.tableManager.getDataByNameAndId(SysBuff.NAME, missSkill.skillEffect1);
                if (missBuff) {
                    let missRate = missBuff.addMiss / 1000;
                    if ((1 - Math.random()) > missRate) {
                        isMiss = true;
                        console.log(missSkill.skillName);
                    }
                }
            }
            if (!isMiss) {
                super.hurt(hurt, isCrit);
                HitEffect.addEffect(this);
            }
        }
        die() {
            if (this.isDie) {
                return;
            }
            this.isDie = true;
            this.setKeyNum(1);
            this.once(Game.Event_KeyNum, this, this.onDie);
            setTimeout(() => {
                this.play(GameAI.Die);
            }, 300);
        }
        reborn() {
            Game.rebornTimes--;
            Game.skillManager.removeSkill(4005);
            this.isDie = false;
            this.setKeyNum(1);
            this.acstr = "";
            this.resetBlood();
            this.initBlood(Game.hero.gamedata.hp);
            this.play("Idle");
            this.startAi();
            Game.executor && Game.executor.start();
            this.setWudi(true);
            setTimeout(() => {
                this.setWudi(false);
            }, 2000);
            App.sdkManager.log(LogType.REBORTH_TIMES, Game.rebornTimes + "");
        }
        onDie(key) {
            let skill4005 = Game.skillManager.isHas(4005);
            if (skill4005) {
                setTimeout(() => {
                    this.reborn();
                }, 800);
            }
            else {
                this.stopAi();
                Game.executor && Game.executor.stop_();
                console.log("全部暂停");
                Laya.stage.event(Game.Event_MAIN_DIE);
            }
        }
        pos2To3d() {
            super.pos2To3d();
            if (Laya.Browser.now() - this.lastTime >= 300) {
                var runSmog = RunSmog.create(this.hbox.cx, this.hbox.cy);
                Laya.Tween.to(runSmog, { scaleX: 0, scaleY: 0, alpha: 0 }, 600, null, new Laya.Handler(this, this.onClear, [runSmog]));
                this.lastTime = Laya.Browser.now();
            }
        }
        onClear(runSmog) {
            RunSmog.recover(runSmog);
        }
    }
    class RunSmog extends Laya.Image {
        constructor() {
            super();
            this.skin = "bg/renyan.png";
            this.size(64, 64);
            this.anchorX = 0.5;
            this.anchorY = 0.5;
        }
        static create(xx, yy) {
            var smog = Laya.Pool.getItemByClass(RunSmog.flag, RunSmog);
            smog.pos(xx, yy);
            Game.footLayer.addChild(smog);
            return smog;
        }
        static recover(smog) {
            smog.removeSelf();
            smog.alpha = 1;
            smog.scale(1, 1);
            Laya.Pool.recover(RunSmog.flag, smog);
        }
    }
    RunSmog.flag = "RunSmog";

    class WorldCell extends ui.test.worldCellUI {
        constructor() {
            super();
            this.sys1 = null;
            this.clickBox.on(Laya.Event.CLICK, this, this.onClick);
            this.suo.visible = false;
            WorldCell.clickCell = this;
        }
        onClick() {
            WorldCell.clickCell = this;
            if (!this.suo.visible) {
                Game.battleLoader.chapterId = this.sys.id;
                SysChapter.randomDiamond(Game.battleLoader.chapterId);
                Game.battleCoins = 0;
                Game.battleExp = Game.heroExp = 0;
                Hero.udpateHeroData();
                MyEffect.scaleEffect(this.mapBtn);
                Laya.stage.event(GameEvent.START_BATTLE);
                App.sdkManager.log(LogType.CHAPTER_INDEX, this.sys.id + "");
            }
            else {
                FlyUpTips.setTips("未开启");
            }
        }
        update(sysChapter, force = false) {
            this.sys1 = sysChapter;
            if (sysChapter == null) {
                this.openBox.visible = false;
                this.noOpenImg.visible = true;
                this.titleTxt.skin = "chapters/wait_title.png";
                return;
            }
            else {
                this.openBox.visible = true;
                this.noOpenImg.visible = false;
            }
            this.sys = sysChapter;
            this.suo.visible = Session.homeData.chapterId < sysChapter.id;
            if (force) {
                this.suo.visible = false;
            }
            this.mapBtn.gray = this.suo.visible;
            this.cengshuTxt.text = "";
            this.titleTxt.skin = "chapters/chapter_title_" + this.sys.id + ".png";
            this.mapBtn.skin = "chapters/chapter_img_" + this.sys.id + ".png";
            this.box1.visible = !this.suo.visible;
            if (!this.suo.visible) {
                let maxCeng = SysMap.getTotal(this.sys.id);
                if (sysChapter.id == Session.homeData.chapterId) {
                    this.cengshuTxt.text = "最高层数:" + Session.homeData.mapIndex + "/" + maxCeng;
                }
                else {
                    this.cengshuTxt.text = "最高层数:" + maxCeng + "/" + maxCeng;
                }
            }
        }
        open() {
            let t = new Laya.Tween();
            t.to(this.suo, { scaleX: 5, scaleY: 5, alpha: 0 }, 600, null, new Laya.Handler(this, this.comfun));
        }
        comfun() {
            this.update(this.sys1);
        }
    }
    WorldCell.clickCell = null;

    class SysLevel {
        constructor() {
            this.id = 0;
            this.roleExp = 0;
        }
        static getMaxExpByLv(lv) {
            var sys = App.tableManager.getDataByNameAndId(SysLevel.NAME, lv);
            return sys == null ? 0 : sys.roleExp;
        }
        static getLv(exp) {
            var sum = 0;
            for (var i = 1; i <= 10; i++) {
                var sys = App.tableManager.getDataByNameAndId(SysLevel.NAME, i);
                sum += sys.roleExp;
                if (exp < sum) {
                    return sys.id;
                }
            }
            return 10;
        }
        static getExpSum(lv) {
            var sum = 0;
            for (var i = 1; i <= lv; i++) {
                sum += SysLevel.getMaxExpByLv(i);
            }
            return sum;
        }
    }
    SysLevel.NAME = 'sys_rolelevel.txt';

    class SysNpc {
        constructor() {
            this.id = 0;
            this.npcTxt = '';
            this.skillId = 0;
            this.skillRandom = '';
        }
    }
    SysNpc.NAME = 'sys_npc.txt';

    class GameAlert extends ui.test.alertUI {
        constructor() {
            super();
            this.cancelBtn.clickHandler = new Laya.Handler(this, this.onCancel);
            this.sureBtn.clickHandler = new Laya.Handler(this, this.onSure);
        }
        onCancel() {
            this.removeSelf();
            this.handler2 && this.handler2.run();
        }
        onSure() {
            this.handler && this.handler.run();
            this.removeSelf();
        }
        onShow(content, sureHandler, cancelHandler = null, content2 = "", title = "提示") {
            this.txt.text = content;
            this.txt2.text = content2;
            this.handler = sureHandler;
            this.handler2 = cancelHandler;
            App.layerManager.alertLayer.addChild(this);
        }
    }

    class CookieKey {
    }
    CookieKey.CURRENT_BATTLE = "CURRENT_BATTLE";
    CookieKey.MUSIC_SWITCH = "MUSIC_SWITCH";
    CookieKey.SOUND_SWITCH = "SOUND_SWITCH";
    CookieKey.USER_ID = "USER_ID";

    class TimeGoldDialog extends ui.test.TimeGoldUI {
        constructor() {
            super();
            MyEffect.rotation(this.light, 5000);
            this.LingBtn.on(Laya.Event.CLICK, this, this.normalClick);
            this.AdLingBtn.on(Laya.Event.CLICK, this, this.adClick);
            this.init();
            this.v3bei.ani1.play(0, true);
        }
        adClick() {
            if (Session.timeGoldData.gold == 0) {
                this.close();
                return;
            }
            App.sdkManager.playAdVideo(AD_TYPE.AD_DIAMOND, new Laya.Handler(this, this.adFun));
        }
        normalClick() {
            if (Session.timeGoldData.gold == 0) {
                this.close();
                return;
            }
            GetItemDialog.open({ type: GoldType.GOLD, value: Session.timeGoldData.gold });
            Session.timeGoldData.rewardGold(false);
            this.init();
        }
        adFun(stat) {
            if (Session.timeGoldData.gold == 0) {
                this.close();
                return;
            }
            if (stat == 1) {
                GetItemDialog.open({ type: GoldType.GOLD, value: Session.timeGoldData.gold * 3 });
                Session.timeGoldData.rewardGold(true);
                this.init();
            }
        }
        init() {
            this.goldFc.value = Session.timeGoldData.gold + "";
            this.btn1Fc.value = Session.timeGoldData.gold + "";
            this.btn2Fc.value = Session.timeGoldData.gold * 3 + "";
        }
    }

    class RankDialog extends ui.test.paihangUI {
        constructor() {
            super();
            this.rankSkin = ["paihang/yiming.png", "paihang/erming.png", "paihang/sanming.png"];
            this.list.vScrollBarSkin = "";
            this.tab.selectHandler = new Laya.Handler(this, this.selectFun);
            this.tab.selectedIndex = -1;
            this.tab.selectedIndex = 0;
            this.list.renderHandler = new Laya.Handler(this, this.renderFun);
            this.list.selectEnable = true;
            this.list.selectHandler = new Laya.Handler(this, this.listSelectFun);
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            if (App.sdkManager.haveRight) {
                return;
            }
            else {
                this.tab.disabled = true;
                Laya.timer.callLater(this, this.shouQuan);
            }
        }
        shouQuan() {
            App.sdkManager.addUserInfoBtn(this.tab, new Laya.Handler(this, this.useFun));
        }
        useFun() {
            Session.rankData.saveWorldRank();
            this.tab.disabled = false;
            this.tab.selectedIndex = 1;
        }
        listSelectFun(index) {
            if (index == -1) {
                return;
            }
        }
        renderFun(cell, index) {
            let obj = this.list.getItem(index);
            cell.goldFc.value = parseInt(obj.score + "") + "";
            cell.mingzi.text = obj.name;
            let rank = parseInt(obj.rank);
            cell.touxiang.skin = obj.url;
            if (rank < 3) {
                cell.fc1.visible = false;
                cell.paiming.visible = true;
                cell.paiming.skin = this.rankSkin[rank];
            }
            else {
                cell.fc1.visible = true;
                cell.paiming.visible = false;
                cell.fc1.value = (rank + 1) + "";
            }
        }
        selectFun(index) {
            if (index == -1) {
                return;
            }
            this["tab" + index]();
        }
        tab0() {
            this.wxOpen.visible = true;
            this.list.visible = false;
            this.myText.visible = false;
            if (Laya.Browser.onMiniGame == false) {
                return;
            }
            var obj = {};
            obj.type = 0;
            obj.openId = Session.SKEY;
            Laya.Browser.window.wx.getOpenDataContext().postMessage(obj);
        }
        tab1() {
            this.list.array = [];
            this.wxOpen.visible = false;
            this.list.visible = true;
            this.myText.visible = true;
            Session.rankData.getRank(this, this.rankFun);
        }
        rankFun(str) {
            if (this.tab.selectedIndex != 1) {
                return;
            }
            let obj = JSON.parse(str);
            let myobj = obj.my;
            let arr = obj.list;
            this.list.array = arr;
            let rank = parseInt(myobj.rank) + 1;
            this.myText.text = "当前排名:" + rank;
        }
        sortList(arr) {
            arr.sort(this.sortFun);
            for (let i = 0; i < arr.length; i++) {
                arr[i].rank = i;
            }
        }
        sortFun(a, b) {
            return parseInt(b.score) - parseInt(a.score);
        }
    }

    class GameMain {
        constructor() {
            this.zipFun();
        }
        zipFun() {
            Game.alert = new GameAlert();
            if (Session.homeData.isGuide) {
                Game.battleLoader.preload();
                App.sdkManager.log(LogType.START_LOADING_GUIDE, "加载进来显示主界面");
                Game.battleLoader.load();
            }
            else {
                Game.showMain();
                Game.battleLoader.preload();
                App.sdkManager.log(LogType.SHOW_MAIN, "加载进来显示主界面");
                if (Session.homeData.newStat != Guide_Type.over) {
                    return;
                }
                Game.cookie.getCookie(CookieKey.CURRENT_BATTLE, (res) => {
                    if (res) {
                        Game.alert.onShow("是否继续未完成的战斗?", new Laya.Handler(this, this.onContinue, [res]), new Laya.Handler(this, this.onCancel));
                    }
                });
            }
        }
        onCancel() {
            Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
        }
        onContinue(res) {
            Game.battleLoader.load(res);
            console.log("继续战斗", res);
        }
        static initTable(arr) {
            App.tableManager.register(SysChapter.NAME, SysChapter);
            App.tableManager.register(SysMap.NAME, SysMap);
            App.tableManager.register(SysEnemy.NAME, SysEnemy);
            App.tableManager.register(SysBullet.NAME, SysBullet);
            App.tableManager.register(SysLevel.NAME, SysLevel);
            App.tableManager.register(SysSkill.NAME, SysSkill);
            App.tableManager.register(SysBuff.NAME, SysBuff);
            App.tableManager.register(SysNpc.NAME, SysNpc);
            App.tableManager.register(SysRoleBase.NAME, SysRoleBase);
            App.tableManager.register(SysItem.NAME, SysItem);
            App.tableManager.register(SysRoleUp.NAME, SysRoleUp);
            App.tableManager.register(SysHero.NAME, SysHero);
            App.tableManager.register(SysTalentCost.NAME, SysTalentCost);
            App.tableManager.register(SysTalentInfo.NAME, SysTalentInfo);
            App.tableManager.register(SysTalent.NAME, SysTalent);
            App.tableManager.onParse(arr);
            let mapArr = App.tableManager.getTable(SysMap.NAME);
            let len = mapArr.length;
            for (let i = 0; i < len; i++) {
                let sysMap = mapArr[i];
                if (SysMap.dic[sysMap.stageId] == null) {
                    SysMap.dic[sysMap.stageId] = [];
                }
                SysMap.dic[sysMap.stageId].push(sysMap);
            }
            for (let key in SysMap.dic) {
                let tArr = SysMap.dic[key];
                tArr.sort((a, b) => {
                    return a.id - b.id;
                });
            }
        }
        static initDialog() {
            App.dialogManager.register(GameMain.TIME_GOLD, TimeGoldDialog, ["res/atlas/timegold.atlas"]);
            App.dialogManager.register(GameMain.RANK_DIALOG, RankDialog, ["res/atlas/paihang.atlas"]);
        }
    }
    GameMain.TIME_GOLD = "TIME_GOLD";
    GameMain.RANK_DIALOG = "RANK_DIALOG";

    class MyTimeGold {
        constructor() {
            this.disView = null;
        }
        setUI(a) {
            this.disView = a;
            this.disView.on(Laya.Event.UNDISPLAY, this, this.undisFun);
            this.disView.on(Laya.Event.DISPLAY, this, this.disFun);
            this.disFun();
        }
        disFun() {
            Laya.timer.frameLoop(1, this, this.loopFun);
        }
        undisFun() {
            Laya.timer.clear(this, this.loopFun);
        }
        loopFun() {
            let arr = Session.timeGoldData.getNowTime();
            this.disView.timeFc.value = this.getString(arr[0]) + ":" + this.getString(arr[1]);
            this.disView.goldFc.value = Session.timeGoldData.gold + "";
            let ms = arr[2] * 1000 + arr[3];
            let endA = 360 * ((60000 - ms) / 60000) - 90;
            let a = this.disView.shanbox;
            a.graphics.clear();
            a.graphics.drawPie(a.width / 2, a.height / 2 - 2, 35, -90, endA, "#ffec1d");
        }
        getString(value) {
            return value < 10 ? 0 + "" + value : value + "";
        }
    }

    class FlyEffect {
        constructor() {
            this.flyNum = 30;
            this.flySkin = "main/jinbi.png";
            this.flyTargetHandler = null;
            this.x1 = 0;
            this.y1 = 0;
            this.ex = 0;
            this.ey = 0;
            this.goldEvery = 0;
            this.nowGold = 0;
            this.endOffX = 0;
            this.endOffY = 1;
        }
        static getP00() {
            if (FlyEffect.p00Array.length == 0) {
                for (let i = 0; i < 50; i++) {
                    let p = new Laya.Point(0, 0);
                    FlyEffect.p00Array.push(p);
                }
            }
            if (FlyEffect.p00Index > 49) {
                FlyEffect.p00Index = 0;
            }
            return FlyEffect.p00Array[FlyEffect.p00Index++].setTo(0, 0);
        }
        fly(start, end) {
            this.start = start;
            this.end = end;
            let p = this.start.localToGlobal(new Laya.Point(0, 0));
            this.flyGold(p.x, p.y, 1);
        }
        flyFromP(x1, y1, end, gold, nowGold, fc) {
            this.fc = fc;
            this.end = end;
            this.x1 = x1;
            this.y1 = y1;
            this.nowGold = nowGold;
            let p = end.localToGlobal(new Laya.Point(0, 0));
            this.ex = p.x + this.endOffX;
            this.ey = p.y + this.endOffY;
            this.flyGold(0, 0, gold);
        }
        flyGold(x1, y1, gold) {
            let flyGoldNum = this.flyNum;
            this.goldEvery = gold / flyGoldNum;
            for (let i = 0; i < flyGoldNum; i++) {
                let img = null;
                img = new Laya.Image(this.flySkin);
                Laya.stage.addChild(img);
                img.scaleX = 1;
                img.scaleY = 1;
                img.anchorX = img.anchorY = 0.5;
                img.x = this.x1 + Math.random() * 300 - 150;
                img.y = this.y1 + Math.random() * 100 - 50;
                img.alpha = 0;
                this.flyEffect(img, this.goldEvery);
            }
        }
        flyEffect(img, gold) {
            let p = new Laya.Point(this.x1, this.y1);
            let t = new Laya.Tween();
            let delayTime = Math.random() * 1000;
            t.to(img, { x: this.ex, y: this.ey, scaleX: 0.5, scaleY: 0.5 }, 700, Laya.Ease.backIn, new Laya.Handler(this, this.flyGoldOverFun, [img, gold]), delayTime + 300);
            let t1 = new Laya.Tween();
            img.scaleX = img.scaleY = 0;
            img.alpha = 0.0;
            t1.to(img, { scaleX: 1, scaleY: 1, alpha: 1 }, 300, Laya.Ease.backOut, null, delayTime);
        }
        dFun(img) {
            FlyEffect.BigSmallEffect(img);
        }
        static BigSmallEffect(s) {
            let t = new Laya.Tween();
            s.scaleX = s.scaleY = 0;
            s.alpha = 0.0;
            t.to(s, { scaleX: 1, scaleY: 1, alpha: 1 }, 300, Laya.Ease.backOut);
        }
        flyGoldOverFun(img, gold) {
            img.removeSelf();
            let t = new Laya.Tween();
            t.to(this.end, { scaleX: 0.7, scaleY: 0.7 }, 80);
            let t1 = new Laya.Tween();
            t1.to(this.end, { scaleX: 1, scaleY: 1 }, 60, null, null, 80);
            this.nowGold += gold;
            if (this.flyTargetHandler == null) {
                this.fc.value = parseInt(Math.ceil(this.nowGold) + "") + "";
            }
            else {
                this.flyTargetHandler.runWith([this.fc, this.nowGold]);
            }
        }
    }
    FlyEffect.p00Array = [];
    FlyEffect.p00Index = 0;

    class OpenIconDialog extends ui.test.OpenIconUI {
        constructor(openIndex) {
            super();
            this.openIndex = 0;
            this.light.cacheAs = "bitmap";
            Laya.MouseManager.enabled = false;
            this.openIndex = openIndex;
            this.icon.skin = null;
            if (this.openIndex == 1) {
                this.icon.skin = "main/btn_1.png";
            }
            else if (this.openIndex == 2) {
                this.icon.skin = "main/btn_2.png";
            }
            this.icon.anchorX = this.icon.anchorY = 0.5;
            MyEffect.rotation(this.light, 4000);
            this.light.alpha = 0;
            MyEffect.show(this.light, 800);
            MyEffect.popup(this.title, 1, 300, 600);
            Laya.timer.once(1400, this, this.cFun);
            let p = this.icon.localToGlobal(new Laya.Point(this.icon.width / 2, this.icon.height / 2));
            this.icon.x = p.x;
            this.icon.y = p.y + Game.scenneM.main.y;
            Laya.stage.addChild(this.icon);
            this.icon.zOrder = 1000;
            MyEffect.popup(this.icon, 1.5, 300, 1100);
        }
        cFun() {
            Laya.timer.once(100, this, this.clickFun);
        }
        clickFun() {
            let time = 600;
            MyEffect.hide(this.light, time);
            MyEffect.hide(this.title, time);
            MyEffect.hide(this.closeText, time);
            MyEffect.hide(Laya.Dialog.manager.maskLayer, time);
            Laya.timer.once(time + 100, this, this.tFun);
        }
        tFun() {
            this.close();
            Laya.Dialog.manager.maskLayer.alpha = 0.8;
            Game.scenneM.main.mainUI.bottomUI.fly(this.icon, this.openIndex);
        }
    }

    class WorldView extends ui.test.worldUI {
        constructor() {
            super();
            this.box1.y = this.box1.y + App.top;
            this.box1.mouseThrough = true;
            this.list = new Laya.List();
            this.list.pos(this.box.x, this.box.y);
            this.addChild(this.list);
            this.list.itemRender = WorldCell;
            this.list.size(Laya.stage.width, this.box.height);
            this.list.vScrollBarSkin = "";
            this.list.renderHandler = new Laya.Handler(this, this.updateItem);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            let myTime = new MyTimeGold();
            myTime.setUI(this.timeLogo);
            this.timeLogo.on(Laya.Event.CLICK, this, this.timeClickFun);
            this.rankBtn.on(Laya.Event.CLICK, this, this.rankClickFun);
            this.sign7Btn.on(Laya.Event.CLICK, this, this.sign7clickFun);
            this.shareBtn.on(Laya.Event.CLICK, this, this.shareFun);
            Laya.stage.on(GameEvent.ADD_COIN, this, this.addCoinFun);
            Laya.stage.on(GameEvent.APP_ENERGY, this, this.reducePowerFun);
            this.addChild(this.box1);
            Laya.stage.on(GameEvent.SHOW_MAIN, this, this.showMain);
        }
        showMain() {
            Laya.timer.once(600, null, () => {
                if (Session.homeData.newStat == Guide_Type.click_talent) {
                    let dp = new OpenIconDialog(2);
                    dp.popup(false, false);
                }
                else if (Session.homeData.newStat == Guide_Type.open_role) {
                    let dp = new OpenIconDialog(1);
                    dp.popup(false, false);
                }
            });
        }
        reducePowerFun(v) {
            let r = new ui.test.ReducePowerUI();
            this.addChild(r);
            r.fc.value = "-" + v;
            let sp = WorldCell.clickCell.mapBtn;
            let p = sp.localToGlobal(new Laya.Point(0, 0), true, this);
            r.x = p.x + sp.width / 2;
            r.y = p.y + sp.height / 2;
            let t = new Laya.Tween();
            t.to(r, { y: r.y - 200 }, 700, null, new Laya.Handler(this, this.rFun, [r]));
        }
        rFun(a) {
            a.removeSelf();
        }
        shareFun() {
            App.sdkManager.onlyShare();
        }
        sign7clickFun() {
            FlyUpTips.setTips("敬请期待");
        }
        addCoinFun(v) {
            let last = Session.homeData.coins - v;
            let fc = Game.scenneM.main.mainUI.topUI.coinClip;
            fc.value = last + "";
            let cell = this.list.getCell(0);
            let fly = new FlyEffect();
            fly.flyFromP(Laya.stage.width / 2, Laya.stage.height / 2, Game.scenneM.main.mainUI.topUI.goldImg, v, last, fc);
        }
        rankClickFun() {
            App.dialogManager.open(GameMain.RANK_DIALOG);
        }
        timeClickFun() {
            App.dialogManager.open(GameMain.TIME_GOLD);
        }
        updateItem(cell, index) {
            let sysChapter = this.list.getItem(index);
            if (sysChapter && sysChapter.id == Session.homeData.openId) {
                cell.update(sysChapter, true);
                cell.open();
            }
            else {
                cell.update(sysChapter);
            }
        }
        onDis() {
            let indexTo = Session.homeData.chapterId - 1;
            indexTo = Math.max(indexTo, 0);
            let arr = App.tableManager.getTable(SysChapter.NAME);
            let arr1 = arr.concat();
            arr1.length = 3;
            arr1.push(null);
            this.list.array = arr1;
            this.list.scrollTo(indexTo);
            let cell = this.list.getCell(indexTo);
            cell.mapBtn.scale(0.0, 0.0);
            let t = new Laya.Tween();
            t.to(cell.mapBtn, { scaleX: 1, scaleY: 1 }, 500, Laya.Ease.backOut, null, 200);
            Session.homeData.openId = -1;
        }
    }

    class AcheievementCell extends ui.test.chengjiu_1UI {
        constructor() {
            super();
        }
    }

    class AchievementsView extends ui.test.chengjiuUI {
        constructor() {
            super();
            this.list = new Laya.List();
            this.list.pos(this.listBox.x, this.listBox.y);
            this.addChild(this.list);
            this.list.itemRender = AcheievementCell;
            this.list.repeatX = 1;
            this.list.repeatY = 4;
            this.list.vScrollBarSkin = "";
            this.list.renderHandler = new Laya.Handler(this, this.updateItem);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            this.list.array = [, , , , , , , , ,];
            this.refresh();
            this.effect();
        }
        refresh() {
        }
        effect() {
            this.list.mouseEnabled = false;
            let len = this.list.cells.length;
            for (let i = 0; i < len; i++) {
                this.tw(this.list.cells[i], i * 100);
            }
            Laya.timer.once(len * 100 + 800, this, this.mouseFun);
        }
        mouseFun() {
            this.list.mouseEnabled = true;
        }
        tw(cell, delay) {
            let t = new Laya.Tween();
            t.from(cell, { y: cell.y + this.list.height - cell.height }, 800 + delay, Laya.Ease.backIn, null);
        }
        updateItem() {
        }
    }

    class SettingView extends ui.test.settingUI {
        constructor() {
            super();
            this.yuyan.clickHandler = new Laya.Handler(this, this.onLanguage);
            this.yinxiao.clickHandler = new Laya.Handler(this, this.onSound);
            this.yinyue.clickHandler = new Laya.Handler(this, this.onMusic);
            if (Laya.Browser.onMiniGame) {
                this.zuobi.visible = false;
            }
            this.zuobi.clickHandler = new Laya.Handler(this, this.zuobiFun);
            this.ver.text = "VER:" + Game.resVer;
            this.id.text = "ID:" + Session.SKEY.substring(Session.SKEY.length - 6);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        zuobiFun() {
            Session.homeData.changeGold(0, 100000);
            Session.homeData.curEnergy = 20;
            Session.homeData.lastTime = 0;
            Session.saveData();
        }
        onDis() {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                this.musicImg.skin = res.state == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
                this.yinyue.skin = res.state == 1 ? "main/btn_lv.png" : "main/btn_hong.png";
            });
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                this.soundImg.skin = res.state == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
                this.yinxiao.skin = res.state == 1 ? "main/btn_lv.png" : "main/btn_hong.png";
            });
        }
        onLanguage() {
        }
        onSound() {
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                if (res.state == 1) {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 0 });
                    this.soundImg.skin = "shezhi/guan.png";
                    App.soundManager.setSoundVolume(0);
                    this.yinxiao.skin = "main/btn_hong.png";
                }
                else {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
                    this.soundImg.skin = "shezhi/kai.png";
                    App.soundManager.setSoundVolume(1);
                    this.yinxiao.skin = "main/btn_lv.png";
                }
            });
        }
        onMusic() {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                if (res.state == 1) {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 0 });
                    this.musicImg.skin = "shezhi/guan.png";
                    App.soundManager.setMusicVolume(0);
                    this.yinyue.skin = "main/btn_hong.png";
                }
                else {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
                    this.musicImg.skin = "shezhi/kai.png";
                    App.soundManager.setMusicVolume(1);
                    Game.playBgMusic();
                    this.yinyue.skin = "main/btn_lv.png";
                }
            });
        }
    }

    class SelectTalent extends ui.test.TalentViewUI {
        constructor() {
            super();
            this.arr = [];
            this.height = Laya.stage.height;
            this.arr.push(this.b0, this.b1, this.b2, this.b3, this.b4, this.b5);
            for (let k of this.arr) {
                k.wenhao.box1.visible = false;
                k.wenhao.select.visible = false;
                k.back.select.visible = false;
                k.back.box2.visible = false;
                k.back.lvBox.visible = false;
                k.on(Laya.Event.CLICK, this, this.clickFun, [k]);
            }
            this.nameImg.alpha = 0;
            this.clickClose.alpha = 0;
            this.box1.visible = false;
            if (Session.homeData.newStat == Guide_Type.select_talent) {
                GuideManager.getInstance().hand(this.b1, this.b1.width / 2, this.b1.height / 2 + 10, Guide_Type.open_role, 400, true);
            }
        }
        tFun() {
        }
        clickFun(e) {
            Game.playSound("fx_card.wav");
            let now = Math.floor(Math.random() * 9) + 1;
            if (Session.homeData.newStat == 4) {
                now = 1;
            }
            let tid = now;
            let obj = Session.talentData.getImgData(now);
            e.back.logo1.skin = obj.logo;
            e.back.bg1.skin = obj.bg;
            e.back.txtImg.skin = obj.font;
            let lv = Session.talentData.getLv(now);
            let oldLv = lv;
            let newLv = lv + 1;
            e.back.lv.value = (lv + 1) + "";
            Session.talentData.lvUp(now);
            e.back.select.visible = true;
            this.mouseEnabled = false;
            let t = new Laya.Tween();
            t.to(e, { scaleX: -1, update: new Laya.Handler(this, this.upFun, [e]) }, 600);
            for (let a of this.arr) {
                a.mouseEnabled = false;
                if (a != e) {
                    a.back.visible = false;
                    MyEffect.hide(a);
                }
            }
            let ty = this.arr[1].y - 100;
            let tx = this.arr[1].x;
            let tw = new Laya.Tween();
            tw.to(e, { x: tx, y: ty }, 800, Laya.Ease.strongOut);
            this.nameImg.skin = e.back.txtImg.skin;
            this.nameImg.y = ty - 200;
            this.l1.visible = false;
            MyEffect.show(this.nameImg);
            this.clickClose.alpha = 1;
            MyEffect.flash(this.clickClose);
            this.timer.once(1000, this, this.timeFun);
            let sysInfo = App.tableManager.getDataByNameAndId(SysTalentInfo.NAME, tid);
            this.l11.text = sysInfo.talentInfo;
            let oldSys = App.tableManager.getDataByNameAndId(SysTalent.NAME, oldLv);
            let newSys = App.tableManager.getDataByNameAndId(SysTalent.NAME, newLv);
            let hou = "%";
            if (sysInfo.talentType == 1) {
                hou = "";
            }
            else if (sysInfo.talentType == 2) {
                hou = "%";
            }
            if (oldSys == null) {
                this.f1.value = "+0" + hou;
            }
            else {
                let oldValue = oldSys[sysInfo.idName];
                this.f1.value = "+" + oldValue + hou;
            }
            let newValue = newSys[sysInfo.idName];
            this.f2.value = "+" + newValue + hou;
            Laya.timer.once(500, this, this.boxFun);
        }
        boxFun() {
            this.box1.visible = true;
            let t3 = new Laya.Tween();
            t3.from(this.box1, { scaleX: 0, scaleY: 0 }, 200, Laya.Ease.backInOut);
        }
        timeFun() {
            Laya.stage.once(Laya.Event.CLICK, this, this.clickFun2);
        }
        clickFun2() {
            this.close();
        }
        upFun(e) {
            if (e.scaleX <= 0) {
                e.wenhao.visible = false;
                e.back.lvBox.visible = true;
            }
        }
    }

    class TalentCell2 extends ui.test.TianFuCellUI {
        constructor() {
            super();
        }
    }

    class TalentView extends ui.test.talentUI {
        constructor() {
            super();
            this.imgArr = ["tianfu/PTkuang.png", "tianfu/PTkuang.png", "tianfu/PTkuang.png",
                "tianfu/JYkuang.png", "tianfu/JYkuang.png", "tianfu/JYkuang.png",
                "tianfu/SSkuang.png", "tianfu/SSkuang.png", "tianfu/SSkuang.png"];
            this.list.itemRender = TalentCell2;
            this.on(Laya.Event.DISPLAY, this, this.disFun);
            this.shengmingniu.clickHandler = new Laya.Handler(this, this.btnFun);
            Laya.stage.on(GameEvent.TALENT_UPDATE, this, this.tFun);
            this.list.renderHandler = new Laya.Handler(this, this.renderFun);
        }
        selectFun(index) {
            if (index == -1) {
                this.tipBox.visible = false;
                return;
            }
            this.tipBox.visible = true;
            let b = this.list.getCell(index);
            this.tipBox.x = this.list.x + b.x - 130;
            this.tipBox.y = this.list.y + b.y + 200;
            let arr = SysTalentInfo.getSys();
            let sys = arr[index];
            let tlv = Session.talentData.getLv(sys.id);
            let sysT = App.tableManager.getDataByNameAndId(SysTalent.NAME, tlv);
            let vv = sysT[sys.idName];
            this.txt5.text = sys.talentInfo + ":" + vv + "%";
        }
        renderFun(cell, index) {
            let sys = this.list.getItem(index);
            let obj = Session.talentData.getImgData(sys.id);
            cell.logo1.skin = obj.logo;
            cell.bg1.skin = this.imgArr[index];
            cell.txtImg.skin = obj.font;
            let lv = Session.talentData.getLv(sys.id);
            cell.lv.value = lv + "";
            cell.box1.visible = cell.box2.visible = false;
            if (lv == 0) {
                cell.box2.visible = true;
            }
            else {
                cell.box1.visible = true;
            }
            cell.select.visible = (this.list.selectedIndex == index);
            cell.on(Laya.Event.CLICK, this, this.cellClickFun, [cell, sys.id]);
        }
        cellClickFun(cell, tid) {
            let lv = Session.talentData.getLv(tid);
            if (lv == 0) {
                this.tipBox.visible = false;
                return;
            }
            this.tipBox.visible = true;
            this.tipBox.x = this.list.x + cell.x - 60;
            this.tipBox.y = this.list.y + cell.y + 200;
            let sys = App.tableManager.getDataByNameAndId(SysTalentInfo.NAME, tid);
            let sysT = App.tableManager.getDataByNameAndId(SysTalent.NAME, lv);
            let vv = sysT[sys.idName];
            this.txt5.text = sys.talentInfo + ":" + vv + sys.getHou();
        }
        tFun() {
            this.refresh();
        }
        btnFun() {
            if (Session.talentData.canLvUp() == -2) {
                FlyUpTips.setTips("请您提升君主等级");
                return;
            }
            if (Session.talentData.canLvUp() == -1) {
                FlyUpTips.setTips("金币不够");
                App.dialogManager.open(GameMain.TIME_GOLD);
                return;
            }
            Laya.MouseManager.enabled = false;
            Laya.timer.once(300, null, () => {
                Laya.MouseManager.enabled = true;
            });
            let d = new SelectTalent();
            d.popup(false);
        }
        disFun() {
            if (Session.homeData.newStat == Guide_Type.talent_lv_up) {
                GuideManager.getInstance().hand(this.shengmingniu, this.shengmingniu.width / 2, this.shengmingniu.height / 2, Guide_Type.select_talent, 600);
            }
            this.tipBox.visible = false;
            this.refresh();
        }
        refresh() {
            let sysArr = SysTalentInfo.getSys();
            this.list.array = sysArr;
            this.shengmingniu.disabled = !Session.talentData.haveGold();
            this.qianshu.value = Session.talentData.getGold() + "";
            this.lvTime.text = "已升级" + Session.talentData.lvTimes + "次";
        }
        effect() {
            this.list.mouseEnabled = false;
            let len = this.list.cells.length;
            for (let i = 0; i < len; i++) {
                this.tw(this.list.cells[i], i * 100);
            }
            Laya.timer.once(len * 100 + 800, this, this.mouseFun);
        }
        mouseFun() {
            this.list.mouseEnabled = true;
        }
        tw(cell, delay) {
            let t = new Laya.Tween();
            t.from(cell, { y: cell.y + this.list.height - cell.height }, 800 + delay, Laya.Ease.backIn, null);
        }
    }

    class AutoEvent {
        constructor() {
            this.arr = [];
        }
        setSprite(sp) {
            sp.on(Laya.Event.DISPLAY, this, this.disFun);
            sp.on(Laya.Event.UNDISPLAY, this, this.undisFun);
        }
        undisFun() {
            for (let i = 0; i < this.arr.length; i += 3) {
                Laya.stage.off(this.arr[i], this.arr[i + 1], this.arr[i + 2]);
            }
        }
        disFun() {
            for (let i = 0; i < this.arr.length; i += 3) {
                Laya.stage.on(this.arr[i], this.arr[i + 1], this.arr[i + 2]);
            }
        }
        onEvent(e, caller, listener) {
            this.arr.push(e, caller, listener);
            Laya.stage.on(e, caller, listener);
        }
    }

    class RollCell {
        setValue(now, max) {
            let vv = now / max;
            this.progressBarImg.scrollRect = new Laya.Rectangle(0, 0, this.progressBarImg.width * vv, this.progressBarImg.height);
            this.progressBarImg.visible = (vv != 0);
            this.goldFc.value = now + "/" + max;
        }
        effect1() {
            this.vs2.selectedIndex = 1;
            this.lvUpBtn.scale(0, 0);
            let t = new Laya.Tween();
            t.to(this.lvUpBtn, { scaleX: 1, scaleY: 1 }, 400, Laya.Ease.backOut);
        }
        setData(roleId) {
            let haveRold = SysRoleBase.have(roleId);
            let sys = SysRoleBase.getSys(roleId);
            let isLock = false;
            if (sys && Session.homeData.adTimes < sys.videoLock) {
                haveRold = false;
                isLock = true;
            }
            if (haveRold) {
                this.vs2.visible = true;
                this.vs1.visible = true;
                this.heroAddFc.visible = true;
                if (Session.heroData.test(roleId, this.heroLvType)) {
                    this.lv.ani1.play(0, true);
                    this.lv.visible = true;
                }
                else {
                    this.lv.visible = false;
                }
            }
            else {
                this.vs2.visible = false;
                this.vs1.visible = false;
                this.heroBaseFc.value = "0";
                this.heroAddFc.visible = false;
                this.nowLvAddfc.value = "+0";
                this.lv.visible = false;
                if (isLock == false) {
                    return;
                }
            }
            let lv = Session.heroData.getHeroLv(roleId, this.heroLvType);
            let sysRoleBase = SysRoleBase.getSys(roleId);
            let sysRoleUp = SysRoleUp.getSysRole(roleId, lv);
            let cost = sysRoleUp.getCost(this.heroLvType);
            let costType = sysRoleUp.getCostType(this.heroLvType);
            let have = Session.homeData.getGoldByType(costType);
            this.heroBaseFc.value = sysRoleBase.getValue(this.heroLvType) + "";
            this.heroAddFc.value = "+" + SysRoleUp.getAddValue(roleId, lv, this.heroLvType);
            this.heroAddFc.x = this.heroBaseFc.x + this.heroBaseFc.value.length * 23 + 10;
            if (isLock) {
                return;
            }
            this.lvUpBtnGoldText.text = sysRoleUp.costGold + "";
            this.setValue(have, cost);
            this.nowLvAddfc.value = "+" + sysRoleUp.getValue(this.heroLvType);
            this.lvFc.value = lv + "";
            if (lv >= sysRoleBase.roleLimt) {
                this.vs1.selectedIndex = 1;
                this.vs2.visible = false;
                return;
            }
            this.vs2.visible = true;
            this.vs1.selectedIndex = 0;
            if (have >= cost) {
                this.vs2.selectedIndex = 1;
            }
            else {
                this.vs2.selectedIndex = 0;
            }
        }
    }

    class RoleView extends ui.test.jueseUI {
        constructor() {
            super();
            this.nowRoleId = 1;
            this.autoEvent = new AutoEvent();
            this.heroLvTypeMap = {};
            this.oldNum = 0;
            this._gameScene = new Laya.Scene3D();
            this.roleBox.addChild(this._gameScene);
            this._layer3d = new Laya.Sprite3D();
            this._gameScene.addChild(this._layer3d);
            let camera = new Laya.Camera(0, 0.1, 100);
            this._gameScene.addChild(camera);
            camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
            camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
            let directionLight = new Laya.DirectionLight();
            this._gameScene.addChild(directionLight);
            directionLight.color = new Laya.Vector3(1, 1, 1);
            directionLight.transform.rotate(new Laya.Vector3(-3.14 / 3, 0, 0));
            this.autoEvent.setSprite(this);
            this.shengmingniu.clickHandler = new Laya.Handler(this, this.hpFun, [this.shengmingniu]);
            this.gongjiniu.clickHandler = new Laya.Handler(this, this.atkFun, [this.gongjiniu]);
            this.on(Laya.Event.DISPLAY, this, this.disFun);
            this.jia.clickHandler = new Laya.Handler(this, this.jiaFun, [GoldType.RED_DIAMONG, this.redImg, this.xueshu, HeroLvType.HP]);
            this.jia2.clickHandler = new Laya.Handler(this, this.jiaFun, [GoldType.BLUE_DIAMONG, this.blueImg, this.gongshu, HeroLvType.ATK]);
            this.autoEvent.onEvent(GameEvent.GOLD_CHANGE, this, this.goldChangeFun);
            this.autoEvent.onEvent(GameEvent.HERO_UPDATE, this, this.heroFun);
            Laya.stage.on(GameEvent.HERO_UPDATE, this, this.heroLvUpFun);
            this.lvEff.visible = false;
            this.a1.ani1.interval = this.a2.ani1.interval = 1000 / 60;
            this.a1.ani1.stop();
            this.a2.ani1.stop();
            this.a1.visible = this.a2.visible = false;
            Laya.timer.loop(4000, this, this.ani1tFun);
            let r = new RollCell();
            r.heroLvType = HeroLvType.HP;
            r.goldType = GoldType.RED_DIAMONG;
            r.vs1 = this.vs1;
            r.vs2 = this.vs11;
            r.goldImg = this.redImg;
            r.goldFc = this.xueshu;
            r.lvUpBtnGoldText = this.hpGold;
            r.progressBarImg = this.tiao;
            r.lvFc = this.hpLv;
            r.goldAddBtn = this.jia;
            r.goldBox = this.box1;
            r.nowLvAddfc = this.shengmingjia;
            r.heroBaseFc = this.shengmingshu;
            r.heroAddFc = this.hpAddFc;
            r.lvUpBtn = this.shengmingniu;
            r.lv = this.lv1;
            let r1 = new RollCell();
            r1.heroLvType = HeroLvType.ATK;
            r1.goldType = GoldType.BLUE_DIAMONG;
            r1.vs1 = this.vs2;
            r1.vs2 = this.vs12;
            r1.goldImg = this.blueImg;
            r1.goldFc = this.gongshu;
            r1.lvUpBtnGoldText = this.atkGold;
            r1.progressBarImg = this.tiao2;
            r1.lvFc = this.atkLv;
            r1.goldAddBtn = this.jia2;
            r1.goldBox = this.box2;
            r1.nowLvAddfc = this.gongjijia;
            r1.heroBaseFc = this.gongjishu;
            r1.heroAddFc = this.atkAddFc;
            r1.lvUpBtn = this.gongjiniu;
            r1.lv = this.lv2;
            this.heroLvTypeMap[r.heroLvType] = r;
            this.heroLvTypeMap[r1.heroLvType] = r1;
            this.zuo.clickHandler = new Laya.Handler(this, this.turnFun, [-1]);
            this.you.clickHandler = new Laya.Handler(this, this.turnFun, [1]);
            this.updateAll();
            Laya.stage.on(GameEvent.AD_OVER, this, this.adOverFun);
        }
        adOverFun() {
            Laya.timer.callLater(this, this.clFun);
        }
        clFun() {
            this.setNowRoleId(this.nowRoleId);
        }
        turnFun(v) {
            let now = this.nowRoleId;
            if (v <= 0) {
                now = Math.max(now + v, 1);
            }
            else {
                now = Math.min(now + v, 3);
            }
            this.setNowRoleId(now);
        }
        setNowRoleId(now) {
            this.nowRoleId = now;
            this.showRoleById(now);
            this.zuo.visible = !(now == 1);
            this.you.visible = !(now == 3);
            this.updateAll();
            this.fuhuo.mouseEnabled = false;
            if (now == 3) {
                this.vs109.visible = false;
            }
            else {
                if (Session.heroData.nowRoleId == now) {
                    this.vs109.visible = true;
                    this.vs109.selectedIndex = 0;
                }
                else {
                    this.vs109.visible = true;
                    let sys = SysRoleBase.getSys(now);
                    if (Session.homeData.adTimes >= sys.videoLock) {
                        this.vs109.selectedIndex = 2;
                        this.fuhuo.mouseEnabled = true;
                        this.fuhuo.clickHandler = new Laya.Handler(this, this.seleHeroFun, [now]);
                    }
                    else {
                        this.vs109.selectedIndex = 1;
                        this.hongzuan.value = Session.homeData.adTimes + "/" + sys.videoLock;
                        let per = Session.homeData.adTimes / sys.videoLock;
                        this.zitiao.scrollRect = new Laya.Rectangle(0, 0, this.zitiao.width * per, this.zitiao.height);
                        if (per == 0) {
                            this.zitiao.visible = false;
                        }
                    }
                }
            }
        }
        seleHeroFun(now) {
            Session.heroData.nowRoleId = now;
            this.setNowRoleId(now);
            this.xuan.ani1.interval = 1000 / 45;
            this.xuan.ani1.play(0, false);
        }
        showRoleById(roleId) {
            this._layer3d.removeChildren();
            if (roleId == 3) {
                this.qidai.visible = true;
                return;
            }
            this.qidai.visible = false;
            Laya.Sprite3D.load("h5/heroview/" + roleId + "/hero.lh", new Laya.Handler(this, (sp3d) => {
                sp3d.transform.localRotationEulerY = 0;
                var scale = 0.85;
                var xx = 0;
                if (roleId == 2) {
                    xx = 0.05;
                    sp3d.transform.localRotationEulerY = 15;
                }
                sp3d.transform.localScale = new Laya.Vector3(scale, scale, scale);
                sp3d.transform.localPositionZ = -3;
                sp3d.transform.localPositionY = -0.4;
                sp3d.transform.localPositionX = xx;
                let aniSprite3d = sp3d.getChildAt(0);
                this._layer3d.addChild(sp3d);
                if (aniSprite3d) {
                    let ani_ = aniSprite3d.getComponent(Laya.Animator);
                    ani_.speed = 0.5;
                    ani_.play("Idle");
                }
                Hero.udpateHeroData();
            }));
        }
        showLayer(isLeft) {
            this._layer3d.transform.localPositionX = isLeft ? 2 : -2;
            Laya.Tween.to(this._layer3d.transform, { localPositionX: 0 }, 300);
        }
        hideLayer(isLeft) {
            this._layer3d.transform.localPositionX = 0;
            Laya.Tween.to(this._layer3d.transform, { localPositionX: isLeft ? -2 : 2 }, 300);
        }
        ani1tFun() {
            this.a1.visible = true;
            this.a1.ani1.play(0, false);
            Laya.timer.once(1000, this, this.ani2tFun);
        }
        ani2tFun() {
            this.a2.visible = true;
            this.a2.ani1.play(0, false);
        }
        heroLvUpFun() {
            this.lvEff.visible = true;
            this.lvEff.sk1.play(0, false, false, 0);
            Laya.timer.frameLoop(1, this, this.floopFun, [this.lvEff.sk1]);
        }
        floopFun(sk) {
            if (sk.index == sk.total) {
                sk.stop();
                this.lvEff.visible = false;
                Laya.timer.clear(this, this.floopFun);
            }
        }
        efFun() {
            this.lvEff.visible = false;
        }
        heroFun() {
            this.updateAll();
        }
        goldChangeFun() {
        }
        jiaFun(goldType, flyTarget, fc, type) {
            let dia = new NoResDialog();
            dia.heroType = type;
            if (goldType == GoldType.RED_DIAMONG) {
                dia.setType(NoResDialogType.red);
            }
            else {
                dia.setType(NoResDialogType.blue);
            }
            dia.popup();
            this.oldNum = Session.homeData.getGoldByType(goldType);
            dia.on(AdDiamond.CHANGE_GOLD_EVENT, this, this.flyGoldFun, [flyTarget, fc, type]);
        }
        flyGoldFun(flyTarget, fc, type, y, v) {
            let fly = new FlyEffect();
            fly.flyNum = v;
            fly.flySkin = flyTarget.skin;
            fly.endOffX = flyTarget.width / 2;
            fly.endOffY = flyTarget.height / 2;
            fly.flyTargetHandler = new Laya.Handler(this, this.flyFun, [type]);
            fly.flyFromP(Laya.stage.width / 2, Laya.stage.height / 2, flyTarget, v, this.oldNum, fc);
        }
        flyFun(type, fc, now) {
            let lv = Session.heroData.getHeroLv(this.nowRoleId, type);
            let sysRB = SysRoleBase.getSys(this.nowRoleId);
            let sys = SysRoleUp.getSysRole(this.nowRoleId, lv);
            let cost = sys.getCost(type);
            let rc = this.heroLvTypeMap[type];
            rc.setValue(now, cost);
            if (now == cost) {
                Laya.timer.once(800, this, this.tttFun, [rc]);
            }
        }
        tttFun(rc) {
            rc.effect1();
        }
        disFun() {
            this.updateAll();
            this.setNowRoleId(Session.heroData.nowRoleId);
            if (Session.homeData.newStat == Guide_Type.click_hp) {
                GuideManager.getInstance().hand(this.shengmingniu, this.shengmingniu.width / 2, this.shengmingniu.height / 2, Guide_Type.over, 600, true);
            }
        }
        hpFun(btn) {
            if (btn.visible == false) {
                return;
            }
            let res = Session.heroData.lvUp(this.nowRoleId, HeroLvType.HP);
            this.tip(res);
        }
        atkFun(btn) {
            if (btn.visible == false) {
                return;
            }
            let res = Session.heroData.lvUp(this.nowRoleId, HeroLvType.ATK);
            this.tip(res);
        }
        tip(res) {
            if (res == 2) {
                FlyUpTips.setTips("钻石不够");
            }
            else if (res == 3) {
                FlyUpTips.setTips("升级到头了");
            }
            else if (res == 4) {
                FlyUpTips.setTips("金币不够");
                App.dialogManager.open(GameMain.TIME_GOLD);
            }
            else if (res == 5) {
                FlyUpTips.setTips("升级到头了");
            }
            else if (res == 0) {
                Game.playSound("fx_slot_lucky.wav");
            }
        }
        updateAll() {
            for (let k in this.heroLvTypeMap) {
                let cell = this.heroLvTypeMap[k];
                cell.setData(this.nowRoleId);
            }
            this.setSkill(this.nowRoleId);
        }
        setSkill(roleId) {
            if (SysRoleBase.have(roleId) == false) {
                this.skillLabel.text = "";
                this.jinengming.text = "";
                this.jinengtubiao.skin = "main/kawen.png";
                return;
            }
            let sys = SysRoleBase.getSys(roleId);
            let sysSkill = App.tableManager.getDataByNameAndId(SysSkill.NAME, sys.baseSkill);
            this.skillLabel.text = sysSkill.skillInfo;
            this.jinengming.text = sysSkill.skillName;
            this.jinengtubiao.skin = null;
            this.jinengtubiao.skin = "icons/skill/" + sysSkill.id + ".png";
        }
    }

    class MainView extends Laya.Box {
        constructor() {
            super();
            this.views = [];
            this.skins = [null, "juese", "tianfu", "chengjiu", "shezhi"];
            this.VIEW_CLAS = [WorldView, RoleView, TalentView, AchievementsView, SettingView];
            this.initUI();
        }
        initUI() {
            this.content = new Laya.Box();
            this.addChild(this.content);
        }
        set selectIndex(index) {
            let view = this.views[index];
            if (!view) {
                let skinName = this.skins[index];
                if (skinName) {
                    Laya.loader.load("res/atlas/" + skinName + ".atlas", new Laya.Handler(this, () => {
                        let CLA = this.VIEW_CLAS[index];
                        this.views[index] = new CLA();
                        this.setView(index);
                    }));
                }
                else {
                    let CLA = this.VIEW_CLAS[index];
                    this.views[index] = new CLA();
                    this.setView(index);
                }
            }
            else {
                this.setView(index);
            }
        }
        setView(index) {
            this.lastView = this.views[this.curIndex];
            let view = this.views[index];
            Laya.Tween.clearTween(this.content);
            if (this.curIndex == 1) {
                this.views[this.curIndex].hideLayer(index > this.curIndex);
            }
            this.content.addChild(view);
            let xx;
            if (this.curIndex != null) {
                xx = index > this.curIndex ? GameConfig.width : -GameConfig.width;
                view.x = xx;
                Laya.Tween.to(this.content, { x: -xx }, 300, null, new Laya.Handler(this, this.onCom, [view]));
            }
            this.curIndex = index;
            if (this.curIndex == 1) {
                this.views[1].showLayer(xx > 0);
            }
        }
        onCom(view) {
            this.content.x = 0;
            view.x = 0;
            this.lastView && this.lastView.removeSelf();
        }
    }

    class MainScene extends Laya.Sprite {
        constructor() {
            super();
            this.verLabel = new Laya.Label();
            this.height = GameBG.height;
            this.initUI();
        }
        initUI() {
            this.mainView = new MainView();
            this.mainUI = new MainUI();
            this.addChild(this.mainView);
            this.addChild(this.mainUI);
            this.coinClip = this.mainUI.topUI.coinClip;
            this.addChild(this.verLabel);
            this.verLabel.fontSize = 16;
            this.verLabel.color = "#ffffff";
            Laya.stage.on("switchView", this, this.switchView);
            this.switchView();
            Laya.stage.on(GameEvent.START_BATTLE, this, this.onStartBattle);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis(e) {
        }
        onStartBattle() {
            if (Game.isStartBattle) {
                return;
            }
            Game.isStartBattle = true;
            this.mainUI.appEnergy();
        }
        switchView() {
            this.mainView.selectIndex = this.mainUI.selectIndex;
        }
    }

    class Rocker extends ui.test.RockerViewUI {
        constructor() {
            super();
            this.a = 0;
            this.a3d = 0;
            this.speed = 0;
        }
        reset() {
            this.sp0.x = 0;
            this.sp0.y = 0;
        }
        resetPos() {
            this.x = Laya.stage.width / 2;
            this.y = Laya.stage.height - 200;
        }
        getA() {
            return this.a;
        }
        getA3d() {
            return this.a3d;
        }
        getSpeed() {
            return this.speed;
        }
        setSp0(xx, yy) {
            let n = xx - this.x;
            let m = yy - this.y;
            this.a = Math.atan2(m, n);
            this.a3d = Math.atan2(this.y - yy, xx - this.x);
            let l = Math.sqrt(n * n + m * m);
            if (l > 4) {
                if (l > 80) {
                    l = 80;
                    this.sp0.x = Math.cos(this.a) * l;
                    this.sp0.y = Math.sin(this.a) * l;
                }
                else {
                    this.sp0.x = n;
                    this.sp0.y = m;
                }
                this.speed = 1;
            }
            else {
                this.reset();
                this.speed = 0;
            }
        }
        setSp1(xx, yy) {
            let n = xx - this.x;
            let m = Math.abs(n);
            if (m > 35) {
                n = 35 * (m / n);
            }
            this.sp0.x = n;
            n = yy - this.y;
            m = Math.abs(n);
            if (m > 35) {
                n = 35 * (m / n);
            }
            this.sp0.y = n;
        }
        rotate(n) {
            this.dir.rotation = (2 * Math.PI - n) / Math.PI * 180 + 90;
        }
    }

    class GameMap0 extends Laya.Sprite {
        constructor() {
            super();
            this.info = {};
            this.endRowNum = 0;
            this.map = {};
            this.Amap = {};
            this.futureBox = new GameHitBox(1, 1);
            this._isNext = false;
            this._isNpc = false;
            this.fcount = 0;
            this.sp = new Laya.Point();
            this.ep = new Laya.Point();
            this.ballistic = new Laya.Sprite();
            this.arrhb = new GameHitBox(2, 2);
        }
        reset() {
            this.Aharr = [];
            this.Wharr = [];
            this.Eharr = [];
            this.Hharr = [];
            this.Fharr = [];
            this.Flyharr = [];
            this.info = {};
            this.map = {};
            this.Amap = {};
            this.graphics.clear();
        }
        drawMap() {
            this.info = {};
            this.npcHitBox = null;
            this._isNext = false;
            let hb = null;
            this.reset();
            hb = new GameHitBox(GameBG.ww * GameBG.MAP_COL, GameBG.ww * 3);
            hb.setXY(0, 0);
            this.Wharr.push(hb);
            this.Aharr.push(hb);
            this.Flyharr.push(hb);
            hb = new GameHitBox(GameBG.ww, GameBG.ww * GameBG.MAP_ROW);
            hb.setXY(0, 0);
            this.Wharr.push(hb);
            this.Aharr.push(hb);
            this.Flyharr.push(hb);
            hb = new GameHitBox(GameBG.ww, GameBG.ww * GameBG.MAP_ROW);
            hb.setXY(GameBG.ww * (GameBG.MAP_COL - 1), 0);
            this.Wharr.push(hb);
            this.Aharr.push(hb);
            this.Flyharr.push(hb);
            hb = new GameHitBox(GameBG.ww * GameBG.MAP_COL, GameBG.ww * 3);
            hb.setXY(0, GameBG.ww * (GameBG.MAP_ROW - 3));
            this.Wharr.push(hb);
            this.Aharr.push(hb);
            this.Flyharr.push(hb);
            this.endRowNum = GameBG.MAP_ROW - 3;
            var k = 0;
            for (var j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    var ww = GameBG.ww;
                    var x = i * ww;
                    var y = j * ww;
                    let key = GameBG.arr0[k];
                    if (k < GameBG.arr0.length) {
                        this.info[j + "_" + i] = key;
                        if (GridType.isWall(key)) {
                            if (this.map[key]) {
                                hb = this.map[key];
                                hb.setRq(hb.x, hb.y, x + GameBG.ww - hb.x, y + GameBG.ww - hb.y);
                            }
                            else {
                                hb = new GameHitBox(GameBG.ww, GameBG.ww);
                                hb.value = key;
                                hb.setXY(x, y);
                                this.Wharr.push(hb);
                                this.map[key] = hb;
                            }
                        }
                        else if (GridType.isRiverPoint(key)
                            || GridType.isRiverScale9Grid(key)
                            || GridType.isRiverScale9Grid2(key)
                            || GridType.isRiverRow(key)
                            || GridType.isRiverCol(key)
                            || GridType.isRiverPoint(key)) {
                            hb = new GameHitBox(GameBG.ww, GameBG.ww);
                            hb.setXY(x, y);
                            this.Wharr.push(hb);
                        }
                        else if (GridType.isFence(key)) {
                            hb = new GameHitBox(GameBG.ww * 3, GameBG.ww);
                            hb.value = key;
                            hb.setXY(x - GameBG.ww, y);
                            this.Wharr.push(hb);
                        }
                        else if (GridType.isNpc(key)) {
                            this.npcHitBox = new GameHitBox(GameBG.ww * 4, GameBG.ww * 4);
                            this.npcHitBox.setXY(x, y);
                        }
                        if (key == BattleFlagID.DOOR) {
                            this.doorHitBox = new GameHitBox(GameBG.ww * 2, GameBG.ww * 2);
                            this.doorHitBox.setXY(x - GameBG.ww2, y - GameBG.ww2);
                        }
                        else if (key == BattleFlagID.GUIDE) {
                            this.guideHitBox = new GameHitBox(GameBG.ww * GameBG.MAP_COL, GameBG.ww);
                            this.guideHitBox.setXY(x, y);
                        }
                        k++;
                    }
                }
            }
            k = 0;
            for (var j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    var ww = GameBG.ww;
                    var x = i * ww;
                    var y = j * ww;
                    let key = GameBG.arr0[k];
                    if (GridType.isWall(GameBG.arr0[k])) {
                        if (this.Amap[key]) {
                            hb = this.Amap[key];
                            hb.setVV(hb.x, hb.y, x + GameBG.ww - hb.x, y + GameBG.ww - hb.y);
                        }
                        else {
                            hb = new GameHitBox(GameBG.ww, GameBG.ww);
                            hb.setXY(x, y);
                            this.Aharr.push(hb);
                            this.Amap[key] = hb;
                        }
                    }
                    else if (GridType.isFence(GameBG.arr0[k])) {
                        hb = new GameHitBox(GameBG.ww * 3, GameBG.ww);
                        hb.setXY(x - GameBG.ww, y);
                        this.Aharr.push(hb);
                    }
                    k++;
                }
            }
            this.addChild(this.ballistic);
            this.setDoor(false);
        }
        clearNpc() {
            this._isNpc = false;
            this.npcHitBox = null;
            this.graphics.clear();
            for (let i = 0; i < this.Wharr.length; i++) {
                var hb = this.Wharr[i];
                this.graphics.drawRect(hb.left, hb.top, hb.ww, hb.hh, null, 0xff0000);
            }
        }
        checkNpc() {
            let bool = false;
            if (this.npcHitBox && Game.hero.hbox.hit(Game.hero.hbox, this.npcHitBox)) {
                bool = true;
                this._isNpc = true;
                this.npcHitBox = null;
                App.sendEvent(Game.Event_NPC);
                console.log("碰到npc了=-===================");
            }
            return bool;
        }
        checkDoor() {
            let bool = false;
            if (this.doorHitBox && Game.hero.hbox.hit(Game.hero.hbox, this.doorHitBox)) {
                bool = true;
                this.doorHitBox = null;
                if (Session.homeData.isPass) {
                    Laya.stage.event(GameEvent.PASS_CHAPTER);
                }
                else {
                    Game.battleLoader.load();
                }
            }
            return bool;
        }
        setDoor(isOpen) {
            this.graphics.clear();
            for (let i = 0; i < this.Wharr.length; i++) {
                var hb = this.Wharr[i];
                this.graphics.drawRect(hb.left, hb.top, hb.ww, hb.hh, null, 0xff0000);
            }
        }
        chechHitHero_(vx, vy) {
            return this.chechHit(Game.hero, vx, vy);
        }
        chechHit(gamepro, vx, vy) {
            if (this._isNext) {
                return true;
            }
            let chuanqiangSkill = Game.skillManager.isHas(5007);
            let waterSkill = Game.skillManager.isHas(5008);
            var hb = gamepro.hbox;
            var fb = this.futureBox;
            fb.setRq(hb.x + vx, hb.y + vy, hb.ww, hb.hh);
            for (let i = 0; i < this.Wharr.length; i++) {
                let ehb = this.Wharr[i];
                if (gamepro == Game.hero) {
                    if (i == 0 && ehb.hit(ehb, fb)) ;
                    if (chuanqiangSkill && (GridType.isWall(ehb.value) || GridType.isFence(ehb.value))) {
                        continue;
                    }
                    if (waterSkill && ehb.value == 7777) {
                        continue;
                    }
                }
                if (ehb.hit(ehb, fb)) {
                    return true;
                }
            }
            return false;
        }
        chechHitArrs(gamepro, vx, vy, thbArr) {
            var hb = gamepro.hbox;
            var fb = this.futureBox;
            fb.setRq(hb.x + vx, hb.y + vy, hb.ww, hb.hh);
            for (let i = 0; i < thbArr.length; i++) {
                let ehb = thbArr[i];
                if (ehb == hb) {
                    continue;
                }
                if (ehb.hit(ehb, fb)) {
                    return true;
                }
            }
            return false;
        }
        chechHit_arr(thb, thbArr) {
            let ehb = null;
            for (let i = 0; i < thbArr.length; i++) {
                ehb = thbArr[i];
                if (ehb.hit(ehb, thb)) {
                    return ehb;
                }
            }
            return null;
        }
        chechHit_arr_all(thb, thbArr) {
            let arr = null;
            let ehb = null;
            for (let i = 0; i < thbArr.length; i++) {
                ehb = thbArr[i];
                if (ehb.hit(ehb, thb)) {
                    if (!arr)
                        arr = [];
                    arr.push(ehb);
                }
            }
            return arr;
        }
        lineTest(arr, vv) {
            var ebh;
            var ebs = [];
            let l;
            var sp;
            for (let i = 0; i < arr.length; i++) {
                ebh = arr[i];
                l = ebh.getBottom();
                sp = vv.lineTest(l);
                if (sp) {
                    ebs.push(sp);
                    ebs.push(l);
                    ebs.push(ebh);
                }
                l = ebh.getTop();
                sp = vv.lineTest(l);
                if (sp) {
                    ebs.push(sp);
                    ebs.push(l);
                    ebs.push(ebh);
                }
                l = ebh.getLeft();
                sp = vv.lineTest(l);
                if (sp) {
                    ebs.push(sp);
                    ebs.push(l);
                    ebs.push(ebh);
                }
                l = ebh.getRight();
                sp = vv.lineTest(l);
                if (sp) {
                    ebs.push(sp);
                    ebs.push(l);
                    ebs.push(ebh);
                }
            }
            return ebs;
        }
        getPointAndLine(vv, arr) {
            var ebs = this.lineTest(arr, vv);
            if (ebs.length <= 0)
                return null;
            if (ebs.length == 3)
                return ebs;
            var x0 = vv.x0;
            var y0 = vv.y0;
            var rs0 = null;
            var rs1 = null;
            var rs2 = null;
            var len = -1;
            for (let i = 0; i < ebs.length; i += 3) {
                var p = ebs[i];
                var tlen = MaoLineData.len(x0, y0, p.x, p.y);
                if (len == -1) {
                    rs0 = p;
                    rs1 = ebs[i + 1];
                    rs2 = ebs[i + 2];
                    len = tlen;
                }
                else if (tlen < len) {
                    rs0 = p;
                    rs1 = ebs[i + 1];
                    rs2 = ebs[i + 2];
                    len = tlen;
                }
            }
            ebs.length = 2;
            ebs[0] = rs0;
            ebs[1] = rs1;
            ebs[2] = rs2;
            return ebs;
        }
        drawBallistic(heron) {
            Game.hero.hbox.setXY(Game.hero.sp2d.x, Game.hero.sp2d.y);
            var vx = Math.cos(heron) * GameBG.mw2;
            var vy = Math.sin(heron) * GameBG.mw2;
            var x0 = Game.hero.hbox.cx;
            var y0 = Game.hero.hbox.cy;
            this.sp.x = x0;
            this.sp.y = y0;
            this.fcount = 0;
            var g = this.ballistic.graphics;
            g.clear();
            for (let i = 0; i < 6000; i++) {
                this.arrhb.setVV(x0, y0, vx, vy);
                var ebh;
                ebh = this.chechHit_arr(this.arrhb, this.Wharr);
                if (ebh) {
                    g.drawRect(this.arrhb.x, this.arrhb.y, this.arrhb.ww, this.arrhb.hh, null, "#ff0000");
                    g.drawRect(ebh.x, ebh.y, ebh.ww, ebh.hh, "#00ff00", "#00ff00");
                    g.drawLine(this.sp.x, this.sp.y, x0, y0, "#ff0000");
                    this.sp.x = x0;
                    this.sp.y = y0;
                    if (this.fcount < 4) {
                        if (!this.chechHit_arr(this.arrhb.setVV(x0, y0, -1 * vx, vy), this.Wharr)) {
                            vx = -1 * vx;
                            this.fcount++;
                        }
                        else if (!this.chechHit_arr(this.arrhb.setVV(x0, y0, vx, -1 * vy), this.Wharr)) {
                            vy = -1 * vy;
                            this.fcount++;
                        }
                        else {
                            break;
                        }
                    }
                    else {
                        break;
                    }
                }
                else {
                    g.drawRect(this.arrhb.x, this.arrhb.y, this.arrhb.ww, this.arrhb.hh, null, "#0000ff");
                    x0 += vx;
                    y0 += vy;
                }
            }
        }
    }

    class GameExecut extends Laya.EventDispatcher {
        constructor() {
            super();
            this.now = 0;
            this.st = 0;
            this.stopt = 0;
            this.startt = 0;
            this.dt = 0;
            this.isRun = false;
            this.now = Laya.Browser.now();
            this.st = this.now;
            this.stop_();
        }
        start() {
            this.now = Laya.Browser.now();
            this.dt += (this.now - this.stopt);
            var arr = Game.AiArr;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].animator)
                    arr[i].animator.speed = 1;
            }
            this.isRun = true;
            Laya.stage.frameLoop(1, this, this.ai);
        }
        stop_() {
            this.now = Laya.Browser.now();
            this.stopt = this.now;
            Laya.timer.clear(this, this.ai);
            var arr = Game.AiArr;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].animator)
                    arr[i].animator.speed = 0;
            }
            this.isRun = false;
        }
        getWorldNow() {
            this.now = Laya.Browser.now();
            return (this.now - this.dt);
        }
        ai() {
            var arr = Game.AiArr;
            for (let i = 0; i < arr.length; i++) {
                arr[i].ai();
            }
            if (arr.length == 1) {
                if (Game.bg.npcId == 0) {
                    if (Game.state == 0 && Game.lastLevel != Game.level && Game.isPopupSkill == 0) {
                        Laya.stage.event(Game.Event_SELECT_NEWSKILL, Game.level);
                    }
                }
                if (arr[0] instanceof Hero) {
                    if (Game.state == 0) {
                        Game.openDoor();
                        Game.map0.checkDoor();
                    }
                }
            }
            var farr = Game.map0.Fharr;
            for (let i = 0; i < farr.length; i++) {
                var fhit = farr[i];
                var pro = fhit.linkPro_;
                if (fhit.hit(fhit, Game.hero.hbox)) {
                    pro.closeCombat(Game.hero);
                    if (pro.gamedata.ammoClip == 0) {
                        farr.slice(farr.indexOf(fhit), 1);
                    }
                }
            }
            Game.buffM.exe(this.getWorldNow());
        }
    }

    class GameCameraNum {
        constructor(a, y) {
            this.a = a;
            this.n = a * Math.PI / 180;
            this.abs = Math.abs(a);
            this.a0 = 90 - this.abs;
            this.n0 = this.a0 * Math.PI / 180;
            this.tan0 = Math.tan(this.n0);
            this.cos0 = Math.cos(this.n0);
            this.y = y;
            this.z = y * this.tan0;
            this.boxscale = new Laya.Vector3(1, 1, 1 / this.cos0);
            this.boxscale0 = new Laya.Vector3(1, 1, (0.5) / this.cos0);
        }
    }

    class TopUI$1 extends ui.test.battleUI {
        constructor() {
            super();
            this.maskSpr = new Laya.Sprite();
            this._indexBox = new IndexBox();
            this.lastWidth = 0;
            this.isTwo = false;
            Laya.stage.on(Game.Event_COINS, this, this.updateCoins);
            Laya.stage.on(Game.Event_EXP, this, this.updateExp);
            this.indexBox.addChild(this._indexBox);
            this.y = App.top + 60;
            Laya.stage.on(GameEvent.BOOS_BLOOD_UPDATE, this, this.onUpdate);
        }
        onUpdate(hurt) {
            this._curBlood -= hurt;
            this._curBlood = Math.max(1, this._curBlood);
            this.bossxue.scrollRect = new Laya.Rectangle(0, 0, this.bossxue.width * this._curBlood / this._bossEnemy.enemyHp, this.bossxue.height);
        }
        setBoss(isBoss, sys) {
            this.boss.visible = isBoss;
            this.bossxuetiao.visible = isBoss;
            this._bossEnemy = sys;
            if (!this._bossEnemy) {
                return;
            }
            this._curBlood = this._bossEnemy.enemyHp;
            if (this.bossxuetiao.visible) {
                this.bossxue.scrollRect = new Laya.Rectangle(0, 0, this.bossxue.width, this.bossxue.height);
            }
        }
        reset() {
            this._indexBox.init();
        }
        updateIndex(index) {
            this._indexBox.update(index);
        }
        updateExp() {
            let lv = SysLevel.getLv(Game.battleExp);
            let maxExp = SysLevel.getMaxExpByLv(lv);
            let curExpSum = SysLevel.getExpSum(lv - 1);
            let curExp = Game.battleExp - curExpSum;
            let vv = curExp / maxExp;
            this.isTwo = lv > Game.level;
            Laya.timer.frameLoop(1, this, this.onLoop, [vv]);
            Game.level = lv;
            if (!this.isTwo) ;
        }
        onLoop(vv) {
            this.lastWidth += 15;
            if (this.isTwo) {
                if (this.lastWidth >= this.lvBar.height) {
                    this.lastWidth = 0;
                    this.isTwo = false;
                }
            }
            else {
                if (this.lastWidth >= this.lvBar.height * vv) {
                    this.lastWidth = this.lvBar.height * vv;
                    Laya.timer.clear(this, this.onLoop);
                }
            }
            this.lastWidth = Math.max(1, this.lastWidth);
            this.maskSpr.graphics.clear();
            this.maskSpr.graphics.drawRect(0, this.lvBar.height - this.lastWidth, this.lvBar.width, this.lastWidth, "#fff000");
            this.lvBar.mask = this.maskSpr;
        }
        updateCoins() {
            this.jinbishu.value = "" + Game.showCoinsNum;
        }
        removeSelf() {
            Game.state = 0;
            return super.removeSelf();
        }
    }
    class IndexBox extends ui.game.battleIndexBoxUI {
        constructor() {
            super();
            this._cellList = [];
            this._isInit = false;
            this.scrollRect = new Laya.Rectangle(0, 0, this.width, this.height);
        }
        init() {
            this._cellList.length = 0;
            if (Game.battleLoader.chapterId == 0) {
                return;
            }
            let max = SysMap.getTotal(Game.battleLoader.chapterId);
            for (let i = 0; i < max; i++) {
                let cell = Laya.Pool.getItemByClass(IndexCell.TAG, IndexCell);
                cell.update(i + 1);
                this.box.addChild(cell);
                cell.x = 185 + i * 150;
                cell.y = 55;
                cell.gray = true;
                this._cellList.push(cell);
                cell.visible = false;
            }
        }
        update(index) {
            if (Game.battleLoader.chapterId == 0) {
                return;
            }
            for (let i = 0; i < this._cellList.length; i++) {
                this._cellList[i].visible = false;
                if (index >= 2) {
                    if (i == index - 1 || i == index - 2 || i == index) {
                        this._cellList[i].visible = true;
                    }
                }
                else {
                    this._cellList[0].visible = true;
                    this._cellList[1].visible = true;
                    this._cellList[2].visible = true;
                }
            }
            let max = SysMap.getTotal(Game.battleLoader.chapterId);
            if (index > max) {
                index = max;
            }
            this.pbox1.visible = index != 1;
            this.pbox2.visible = index != max;
            if (!this._isInit) {
                this.box.x = -(index - 1) * 150;
                this._cellList[index - 1].scale(1.5, 1.5);
                this._cellList[index - 1].gray = false;
                this._isInit = true;
                for (let i = 0; i < index - 1; i++) {
                    this._cellList[i].gray = false;
                }
                return;
            }
            Laya.Tween.to(this.box, { x: -(index - 1) * 150 }, 300, null, null, 100);
            if (index == 1) {
                Laya.Tween.to(this._cellList[index - 1], { scaleX: 1.5, scaleY: 1.5 }, 300, null, null, 100);
            }
            else {
                Laya.Tween.to(this._cellList[index - 2], { scaleX: 1, scaleY: 1 }, 300, null, null, 100);
                Laya.Tween.to(this._cellList[index - 1], { scaleX: 1.5, scaleY: 1.5 }, 300, null, null, 100);
            }
            this._cellList[index - 1].gray = false;
        }
    }
    class IndexCell extends ui.test.battleLvUIUI {
        constructor() {
            super();
            this.on(Laya.Event.UNDISPLAY, this, this.onUndis);
        }
        onUndis() {
            Laya.Pool.recover(IndexCell.TAG, this);
        }
        set gray(value) {
            this.btn.gray = value;
        }
        update(index) {
            this.shuziyou.text = "" + index;
        }
    }
    IndexCell.TAG = "IndexCell";

    class PauseUI extends ui.test.battlestop2UI {
        constructor() {
            super();
            this.btnHome.clickHandler = new Laya.Handler(this, this.onHome);
            this.btnSound.clickHandler = new Laya.Handler(this, this.onSound);
            this.btnPlay.clickHandler = new Laya.Handler(this, this.onBattle);
            this.btnMusic.clickHandler = new Laya.Handler(this, this.onMusic);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                this.musicImg.skin = res.state == 1 ? "bg/zhanting_1.png" : "bg/zhanting_0.png";
            });
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                this.soundImg.skin = res.state == 1 ? "bg/zhanting_1.png" : "bg/zhanting_0.png";
            });
        }
        onSound() {
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                if (res.state == 1) {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 0 });
                    this.soundImg.skin = "bg/zhanting_0.png";
                    App.soundManager.setSoundVolume(0);
                }
                else {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
                    this.soundImg.skin = "bg/zhanting_1.png";
                    App.soundManager.setSoundVolume(1);
                }
            });
        }
        onMusic() {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                if (res.state == 1) {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 0 });
                    this.musicImg.skin = "bg/zhanting_0.png";
                    App.soundManager.setMusicVolume(0);
                }
                else {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
                    this.musicImg.skin = "bg/zhanting_1.png";
                    App.soundManager.setMusicVolume(1);
                    Game.playBattleMusic();
                }
            });
        }
        onHome() {
            Game.alert.onShow("确定返回主页吗?", new Laya.Handler(this, this.onGo), null, "本局将不会产生任何收益。");
        }
        onGo() {
            Game.showCoinsNum = 0;
            Game.showMain();
            this.removeSelf();
        }
        onBattle() {
            this.removeSelf();
            Game.executor.start();
        }
        removeSelf() {
            Game.state = 0;
            return super.removeSelf();
        }
    }

    class GameOverView extends ui.test.GameOverUI {
        constructor() {
            super();
            this.maskSpr = new Laya.Sprite();
            this.delayTime = 200;
            this.lastWidth = 0;
            App.sdkManager.initAdBtn(this.fuhuoBtn.fuhuo, AD_TYPE.AD_BATTLE10);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            this.on(Laya.Event.CLICK, this, this.onClick);
        }
        onRewardSuccess() {
            Game.showCoinsNum = Game.showCoinsNum * 2;
            Game.showBlueNum = Game.showBlueNum * 2;
            Game.showRedNum = Game.showRedNum * 2;
            this.lanzuan.value = "+" + Game.showBlueNum;
            this.hongzuan.value = "+" + Game.showRedNum;
            this.coinClip.value = "+" + Game.showCoinsNum;
            let deltaNum = Math.floor(Game.showCoinsNum * Session.talentData.lineGold / 100);
            this.deltaCoin.value = "+" + deltaNum;
            this.deltaCoin.visible = deltaNum > 0;
            Session.homeData.changeGold(GoldType.GOLD, Game.showCoinsNum);
            Session.homeData.changeGold(GoldType.BLUE_DIAMONG, Game.showBlueNum);
            Session.homeData.changeGold(GoldType.RED_DIAMONG, Game.showRedNum);
            console.log("5倍奖励", Game.showCoinsNum, Game.showBlueNum, Game.showRedNum);
            Session.saveData();
            setTimeout(() => {
                this.onCloseView();
            }, 300);
        }
        onCloseView() {
            this.removeSelf();
            Game.showMain();
        }
        onClick(e) {
            if (e.target == this.fuhuoBtn.fuhuo) {
                App.sdkManager.playAdVideo(AD_TYPE.AD_BATTLE10, new Laya.Handler(this, this.onRewardSuccess));
            }
            else {
                this.removeSelf();
                Game.showMain();
            }
        }
        onDis() {
            this.closeTxt.alpha = 0;
            Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
            Laya.timer.frameLoop(1, this, this.onLoop);
            Laya.MouseManager.enabled = false;
            this.oldLv = Session.homeData.playerLv;
            let sys = App.tableManager.getDataByNameAndId(SysHero.NAME, this.oldLv);
            this.oldPercent = Session.homeData.playerExp / sys.roleExp;
            this.oldPercent = Math.min(1, this.oldPercent);
            this.lastWidth = this.expBar.width * this.oldPercent;
            this.setmask();
            let arr = SysHero.getNewLv(Game.heroExp);
            this.newLv = arr[0];
            this.newExp = arr[1];
            sys = App.tableManager.getDataByNameAndId(SysHero.NAME, this.newLv);
            this.newPercent = this.newExp / sys.roleExp;
            this.newPercent = Math.min(1, this.newPercent);
            this.bigBox.y = Laya.stage.height / 2;
            this.lanBox.removeSelf();
            this.ziBox.removeSelf();
            this.coinBox.removeSelf();
            this.lightView.visible = false;
            this.topBox.visible = false;
            this.expBox.visible = false;
            this.lingqu.visible = false;
            this.fuhuo.visible = false;
            this.topBox.visible = true;
            this.topBox.scale(2.5, 2.5);
            this.topBox.alpha = 0;
            Laya.Tween.to(this.topBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext));
            this.cengshu.value = this.oldLv + "";
            this.dengji.value = this.oldLv + "";
        }
        onNext() {
            this.lightView.visible = true;
            this.lightView.scale(2.5, 2.5);
            this.lightView.alpha = 0;
            Laya.Tween.to(this.lightView, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext1));
        }
        onNext1() {
            this.expBox.visible = true;
            this.updateExp();
        }
        updateExp() {
            if (this.newLv == this.oldLv) {
                Laya.Tween.to(this.bigBox, { y: 366 }, this.delayTime, null, new Laya.Handler(this, () => {
                    Laya.timer.frameLoop(1, this, this.onLoopExp);
                }));
            }
            else {
                Laya.timer.frameLoop(1, this, this.onLoopLv);
            }
        }
        onLoopLv() {
            this.lastWidth += 5;
            if (this.lastWidth >= this.expBar.width) {
                this.lastWidth = 0;
                this.oldLv++;
                this.cengshu.value = this.oldLv + "";
                this.dengji.value = this.oldLv + "";
                Laya.timer.clear(this, this.onLoopLv);
                Laya.stage.event(GameEvent.LV_UP_VIEW);
            }
            this.setmask();
        }
        onLoopExp(vv) {
            this.lastWidth += 5;
            if (this.lastWidth >= this.expBar.width * this.newPercent) {
                this.lastWidth = this.expBar.width * this.newPercent;
                Laya.timer.clear(this, this.onLoopExp);
                this.hh = 800;
                this.lingqu.visible = true;
                this.lingqu.scale(2.5, 2.5);
                this.lingqu.alpha = 0;
                Laya.Tween.to(this.lingqu, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext2));
            }
            this.setmask();
        }
        onNext2() {
            if (Game.showBlueNum > 0) {
                this.addChild(this.lanBox);
                this.lanzuan.value = "+" + Game.showBlueNum;
                this.lanBox.x = 375;
                this.lanBox.y = this.hh;
                this.hh += 100;
                this.lanBox.visible = true;
                this.lanBox.scale(2.5, 2.5);
                this.lanBox.alpha = 0;
                Laya.Tween.to(this.lanBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext3));
            }
            else {
                this.onNext3();
            }
        }
        onNext3() {
            if (Game.showRedNum > 0) {
                this.hongzuan.value = "+" + Game.showRedNum;
                this.addChild(this.ziBox);
                this.ziBox.x = 375;
                this.ziBox.y = this.hh;
                this.hh += 100;
                this.ziBox.visible = true;
                this.ziBox.scale(2.5, 2.5);
                this.ziBox.alpha = 0;
                Laya.Tween.to(this.ziBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext4));
            }
            else {
                this.onNext4();
            }
        }
        onNext4() {
            if (Game.showCoinsNum > 0) {
                this.coinClip.value = "+" + Game.showCoinsNum;
                let deltaNum = Math.floor(Game.showCoinsNum * Session.talentData.lineGold / 100);
                this.deltaCoin.value = "+" + deltaNum;
                this.deltaCoin.visible = deltaNum > 0;
                this.addChild(this.coinBox);
                this.coinBox.x = 375;
                this.coinBox.y = this.hh;
                this.hh += 100;
                this.coinBox.visible = true;
                this.coinBox.scale(2.5, 2.5);
                this.coinBox.alpha = 0;
                Laya.Tween.to(this.coinBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext5));
            }
            else {
                this.onNext5();
            }
        }
        onNext5() {
            this.fuhuo.y = this.hh - 30;
            this.fuhuo.visible = true;
            this.fuhuo.scale(2.5, 2.5);
            this.fuhuo.alpha = 0;
            Laya.Tween.to(this.fuhuo, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext6));
        }
        onNext6() {
            Session.homeData.addPlayerExp(Game.heroExp);
            Session.saveData();
            Laya.MouseManager.enabled = true;
            this.closeTxt.alpha = 1;
            MyEffect.flash(this.closeTxt);
        }
        setmask() {
            this.lastWidth = Math.max(1, this.lastWidth);
            this.maskSpr.graphics.clear();
            this.maskSpr.graphics.drawRect(0, 0, this.lastWidth, this.expBar.height, "#fff000");
            this.expBar.mask = this.maskSpr;
        }
        onLoop() {
            this.lightView.rotation++;
        }
        removeSelf() {
            Laya.timer.clear(this, this.onLoop);
            Game.state = 0;
            return super.removeSelf();
        }
    }

    class CustomShaderff00 extends Laya.BaseMaterial {
        static get ff00() {
            if (!CustomShaderff00.ff00_) {
                return new CustomShaderff00;
            }
            return CustomShaderff00.ff00_;
        }
        constructor() {
            super();
            if (!CustomShaderff00.ff00_) {
                this.initShader();
                this.setShaderName("CustomShaderff00");
                CustomShaderff00.ff00_ = this;
            }
            else {
                this.setShaderName("CustomShaderff00");
            }
        }
        initShader() {
            let attributeMap = {
                'a_Position': Laya.VertexMesh.MESH_POSITION0
            };
            let uniformMap = {
                'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE
            };
            let vs = `
            attribute vec4 a_Position;
            uniform mat4 u_MvpMatrix;
            void main()
            {
            gl_Position = u_MvpMatrix * a_Position;
            }`;
            let ps = `
            #ifdef FSHIGHPRECISION
            precision highp float;
            #else
            precision mediump float;
            #endif            
            void main()
            {           
            gl_FragColor=vec4(1.0,0.0,0.0,1.0);
            }`;
            let CustomShaderff00 = Laya.Shader3D.add("CustomShaderff00");
            let subShader = new Laya.SubShader(attributeMap, uniformMap);
            CustomShaderff00.addSubShader(subShader);
            subShader.addShaderPass(vs, ps);
        }
    }

    class SkillGrid extends ui.test.SkillGridUI {
        constructor(handler) {
            super();
            this.handler = handler;
            this.imgBox.addChild(this.img);
            this.imgBox.on(Laya.Event.CLICK, this, this.onClick);
        }
        onClick() {
            this.handler && this.handler.runWith(this.sys);
        }
        update(skillId) {
            this.txt.text = "****";
            this.shuoming.text = "****";
            this.img.skin = "main/kawen.png";
            Laya.Tween.to(this.parent, { scaleX: 0.1 }, 150, null, new Laya.Handler(this, this.onFan, [skillId]));
        }
        onFan(skillId) {
            this.sys = App.tableManager.getDataByNameAndId(SysSkill.NAME, skillId);
            this.txt.text = this.sys.skillName;
            this.shuoming.text = this.sys.skillInfo;
            this.img.skin = 'icons/skill/' + this.sys.id + ".png";
            Laya.Tween.to(this.parent, { scaleX: 1 }, 150);
        }
    }

    class SelectNewSkill extends ui.test.battlestopUI {
        constructor() {
            super();
            this.grid1 = new SkillGrid(new Laya.Handler(this, this.onClick));
            this.grid2 = new SkillGrid(new Laya.Handler(this, this.onClick));
            this.box1.addChild(this.grid1);
            this.box2.addChild(this.grid2);
            this.queding.deshuliang.text = "刷新";
            App.sdkManager.initAdBtn(this.queding.fuhuo, AD_TYPE.AD_CHANGE_SKILL);
            this.queding.fuhuo.clickHandler = new Laya.Handler(this, this.showAD);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        showAD() {
            App.sdkManager.playAdVideo(AD_TYPE.AD_CHANGE_SKILL, new Laya.Handler(this, this.onChangeSkill));
        }
        onClick(sys) {
            console.log(sys.skillName);
            if (!Game.hero.changeBlood(sys)) {
                Game.skillManager.addSkill(sys);
            }
            Game.bg.clearNpc();
            this.removeSelf();
        }
        onDis() {
            Game.executor.stop_();
            this.box1.scaleX = 1;
            this.box2.scaleX = 1;
            this.setSkill();
        }
        onChangeSkill() {
            this.setSkill();
        }
        setSkill() {
            let id = Game.battleLoader.chapterId == 1 ? 1005 : 1004;
            this.grid1.update(Game.skillManager.getRandomSkillByNpcId(id));
            this.grid2.update(Game.skillManager.getRandomSkillByNpcId(id));
        }
        removeSelf() {
            if (Session.talentData.dropLevelhp > 0) {
                Game.hero.addBlood(Session.talentData.dropLevelhp);
            }
            console.log("战斗内升级回血", Session.talentData.dropLevelhp);
            Game.executor.start();
            Game.state = 0;
            return super.removeSelf();
        }
    }

    class RebornView extends ui.test.ReborthUI {
        constructor() {
            super();
            this.bgv.cBtn.clickHandler = new Laya.Handler(this, this.onClose);
            this.fuhuo.clickHandler = new Laya.Handler(this, this.onFuhuo);
            App.sdkManager.initAdBtn(this.fuhuo, AD_TYPE.AD_REBORTH);
            this.shape = new Laya.Sprite();
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onFuhuo() {
            Laya.timer.clear(this, this.onLoop2);
            App.sdkManager.playAdVideo(AD_TYPE.AD_REBORTH, new Laya.Handler(this, this.onReborn));
        }
        onDis() {
            this.txt.text = "" + Game.rebornTimes;
            this._curTime = 5;
            this.daojishi.text = "" + this._curTime;
            Laya.timer.loop(1000, this, this.onLoop2);
        }
        onLoop2() {
            this._curTime--;
            this.daojishi.text = "" + this._curTime;
            if (this._curTime <= 0) {
                Laya.timer.clear(this, this.onLoop2);
                this.onClose();
            }
        }
        onClose() {
            Laya.timer.clear(this, this.onLoop2);
            this.removeSelf();
            Game.rebornTimes = 0;
            Laya.stage.event(Game.Event_MAIN_DIE);
        }
        onReborn() {
            Laya.timer.clear(this, this.onLoop2);
            this.removeSelf();
            Game.hero.reborn();
        }
        removeSelf() {
            Game.state = 0;
            return super.removeSelf();
        }
    }

    class GameFence {
        constructor() {
            this.box = Laya.Sprite3D.instantiate(Game.fence);
        }
        setPos(v3) {
            this.box.transform.position = v3;
            Game.layer3d.addChild(this.box);
        }
        static recover() {
            while (GameFence.arr.length > 0) {
                let rube = GameFence.arr.shift();
                rube.box.removeSelf();
                Laya.Pool.recover(GameFence.TAG, rube);
            }
            GameFence.arr.length = 0;
        }
        static getOne(v3) {
            let rube = Laya.Pool.getItemByClass(GameFence.TAG, GameFence);
            rube.setPos(v3);
            GameFence.arr.push(rube);
            return rube;
        }
    }
    GameFence.TAG = "GameFence";
    GameFence.arr = [];

    class GuideTalk extends ui.game.newGuide2UI {
        constructor() {
            super();
            this.on(Laya.Event.CLICK, this, this.onClick);
        }
        onClick() {
            this.removeSelf();
        }
        setContent(str, guideId) {
            this._guideId = guideId;
            this.contents = str.split("");
            this.txt.text = "";
            Laya.timer.loop(80, this, this.onLoop);
        }
        onLoop() {
            if (this.contents.length > 0) {
                let char = this.contents.shift();
                this.txt.text += char;
            }
            else {
                Laya.timer.clear(this, this.onLoop);
            }
        }
        removeSelf() {
            Laya.stage.event(GameEvent.SHOW_ACTION_RECT, this._guideId);
            return super.removeSelf();
        }
    }

    class GuideActionArea extends ui.game.newGuideUI {
        constructor() {
            super();
        }
    }

    class LvUpView extends ui.test.shengjiUI {
        constructor() {
            super();
            this.delayTime = 200;
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            this.on(Laya.Event.CLICK, this, this.onCloseView);
        }
        onCloseView() {
            this.removeSelf();
            Laya.timer.clear(this, this.onLoop);
            App.sendEvent(GameEvent.LV_UP_VIEW_2);
        }
        onDis() {
            Laya.MouseManager.enabled = false;
            let newLv = Session.homeData.playerLv;
            this.lvClip.value = "" + newLv;
            this.lvLabel.text = "" + newLv;
            this.sysHero = App.tableManager.getDataByNameAndId(SysHero.NAME, newLv);
            Session.homeData.changeGold(GoldType.GOLD, this.sysHero.gold);
            Session.homeData.changeGold(GoldType.BLUE_DIAMONG, this.sysHero.blueDiamond);
            Session.homeData.changeGold(GoldType.RED_DIAMONG, this.sysHero.redDiamond);
            Laya.timer.frameLoop(1, this, this.onLoop);
            this.dunpaiBox.visible = false;
            this.lvBox.visible = false;
            this.lingqu.visible = false;
            this.lanBox.visible = false;
            this.ziBox.visible = false;
            this.coinBox.visible = false;
            this.rebornBtn.visible = false;
            this.hh = 800;
            this.dunpaiBox.visible = true;
            this.dunpaiBox.scale(2.5, 2.5);
            this.dunpaiBox.alpha = 0;
            Laya.Tween.to(this.dunpaiBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext));
        }
        onNext() {
            this.lvBox.visible = true;
            this.lvBox.scale(2.5, 2.5);
            this.lvBox.alpha = 0;
            Laya.Tween.to(this.lvBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext1));
        }
        onNext1() {
            this.lingqu.visible = true;
            this.lingqu.scale(2.5, 2.5);
            this.lingqu.alpha = 0;
            Laya.Tween.to(this.lingqu, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext2));
        }
        onNext2() {
            if (this.sysHero.blueDiamond > 0) {
                this.lanzuan.value = "+" + this.sysHero.blueDiamond;
                this.addChild(this.lanBox);
                this.lanBox.x = 353;
                this.lanBox.y = this.hh;
                this.hh += 100;
                this.lanBox.visible = true;
                this.lanBox.scale(2.5, 2.5);
                this.lanBox.alpha = 0;
                Laya.Tween.to(this.lanBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext3));
            }
            else {
                this.onNext3();
            }
        }
        onNext3() {
            if (this.sysHero.redDiamond > 0) {
                this.hongzuan.value = "+" + this.sysHero.redDiamond;
                this.addChild(this.ziBox);
                this.ziBox.x = 353;
                this.ziBox.y = this.hh;
                this.hh += 100;
                this.ziBox.visible = true;
                this.ziBox.scale(2.5, 2.5);
                this.ziBox.alpha = 0;
                Laya.Tween.to(this.ziBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext4));
            }
            else {
                this.onNext3();
            }
        }
        onNext4() {
            if (this.sysHero.gold > 0) {
                this.coinClip.value = "+" + this.sysHero.gold;
                this.deltaCoin.visible = false;
                this.addChild(this.coinBox);
                this.coinBox.x = 353;
                this.coinBox.y = this.hh;
                this.hh += 100;
                this.coinBox.visible = true;
                this.coinBox.scale(2.5, 2.5);
                this.coinBox.alpha = 0;
                Laya.Tween.to(this.coinBox, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext5));
            }
            else {
                this.onNext5();
            }
        }
        onNext5() {
            this.rebornBtn.y = this.hh + 30;
            this.rebornBtn.visible = true;
            this.rebornBtn.scale(2.5, 2.5);
            this.rebornBtn.alpha = 0;
            Laya.Tween.to(this.rebornBtn, { scaleX: 1, scaleY: 1, alpha: 1 }, this.delayTime, null, new Laya.Handler(this, this.onNext6));
        }
        onNext6() {
            Laya.MouseManager.enabled = true;
        }
        onLoop() {
            this.lightView.rotation++;
        }
    }

    class BattleScene extends Laya.Sprite {
        constructor() {
            super();
            this.npcViewDic = {};
            this.nullGridList = [];
            var bg = new GameBG();
            this.addChild(bg);
            Game.bg = bg;
            var map0 = new GameMap0();
            Game.map0 = map0;
            this.addChild(Game.footLayer);
            Game.footLayer.cacheAs = "bitmap";
            var scene = this.addChild(new Laya.Scene3D());
            scene.addChild(Game.layer3d);
            Game.scene3d = scene;
            scene.addChild(Game.layer3dCube);
            scene.addChild(Game.layer3dCoins);
            this.addChild(Game.bloodLayer);
            this.addChild(Game.topLayer);
            var camera = (scene.addChild(new Laya.Camera(0, 0.1, 100)));
            Game.cameraCN = new GameCameraNum(-45, 10);
            camera.transform.translate(new Laya.Vector3(0, Game.cameraCN.y, Game.cameraCN.z));
            camera.transform.rotate(new Laya.Vector3(Game.cameraCN.a, 0, 0), true, false);
            camera.orthographic = true;
            Game.camera = camera;
            GameBG.orthographicVerticalSize = GameBG.wnum * Laya.stage.height / Laya.stage.width;
            camera.orthographicVerticalSize = GameBG.orthographicVerticalSize;
            camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
            var directionLight = scene.addChild(new Laya.DirectionLight());
            directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
            directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));
            this._top = new TopUI$1();
            this.addChild(this._top);
            this._top.zanting.clickHandler = new Laya.Handler(this, this.showPause);
            Laya.stage.on(Game.Event_SELECT_NEWSKILL, this, this.onShowSelect);
            Laya.stage.on(Game.Event_MAIN_DIE, this, this.showDieView1);
            Laya.stage.on(GameEvent.PASS_CHAPTER, this, this.onOver);
            Laya.stage.on(GameEvent.LV_UP_VIEW, this, this.onLvup);
            Laya.stage.on(GameEvent.LV_UP_VIEW_2, this, this.onLvup2);
            Laya.stage.on(GameEvent.MEMORY_WARNING, this, this.onRelease);
            Laya.stage.on(Game.Event_NPC, this, this.showNpcView);
        }
        onLvup2() {
            this._gameOver && this._gameOver.updateExp();
        }
        onLvup() {
            if (!this._lvupView) {
                this._lvupView = new LvUpView();
            }
            this.addChild(this._lvupView);
        }
        onRelease() {
            Game.battleLoader.onRelease();
        }
        onShowSelect(lv) {
            if (lv > 10) {
                return;
            }
            this.up(null);
            if (!this._selectSkill) {
                this._selectSkill = new SelectNewSkill();
            }
            this.addChild(this._selectSkill);
            Game.isPopupSkill = 1;
            Game.state = 1;
        }
        onOver() {
            if (!this._gameOver) {
                this._gameOver = new GameOverView();
            }
            this.addChild(this._gameOver);
            Game.state = 1;
        }
        onReborn() {
            if (!this._rebornView) {
                this._rebornView = new RebornView();
            }
            this.addChild(this._rebornView);
            Game.state = 1;
        }
        showDieView1() {
            if (Game.rebornTimes <= 0) {
                this.onOver();
            }
            else {
                this.onReborn();
            }
        }
        showPause() {
            if (!this._pauseUI) {
                this._pauseUI = new PauseUI();
            }
            this.addChild(this._pauseUI);
            Game.executor.stop_();
            Game.state = 1;
        }
        showNpcView() {
            this.up(null);
            let npcId = Game.bg.npcId;
            console.log("显示npc", npcId);
            if (npcId > 0) {
                if (this.npcViewDic[npcId] == null) {
                    let NPCVIEW = Laya.ClassUtils.getClass("NPCVIEW" + npcId);
                    if (NPCVIEW) {
                        this.npcViewDic[npcId] = new NPCVIEW();
                    }
                }
                this.addChild(this.npcViewDic[npcId]);
                Game.state = 1;
            }
        }
        init() {
            Session.homeData.isPass = false;
            BattleScene.npcPro = null;
            this._top.reset();
            if (!Game.hero) {
                Hero.udpateHeroData();
                Game.hero = new Hero();
            }
            GameFence.recover();
            GameThorn.recover();
            Session.saveData();
            Game.reset();
            this._top.updateCoins();
            this._top.updateExp();
            this._top.updateIndex(Game.battleLoader.index);
            if (!Game.executor) {
                Game.executor = new GameExecut();
            }
            this._top._indexBox.visible = !Session.homeData.isGuide;
            this._top.zanting.visible = !Session.homeData.isGuide;
            Game.map0.drawMap();
            GameBG.mcx = 13 * GameBG.ww / 2 - GameBG.mw2;
            GameBG.mcy = GameBG.bgHH * 0.5 - GameBG.mw2;
            Game.setSelectEffect();
            var aa = Laya.loader.getRes("h5/zhalan/hero.lh");
            Game.fence = aa;
            this.nullGridList.length = 0;
            var isHasBoss = false;
            var bossEnemy;
            var monster;
            let k = 0;
            for (let j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    let type = GameBG.arr0[k];
                    if (GridType.isCube(type)) {
                        GameCube.getOne(GameBG.get3D(i, j), type);
                    }
                    else if (GridType.isFence(type)) {
                        GameFence.getOne(GameBG.get3D(i, j));
                    }
                    else if (GridType.isNpc(type)) {
                        BattleScene.npcPro = new GamePro(0, 1);
                        BattleScene.npcPro.setSp3d(null, GameBG.ww * 0.8);
                        BattleScene.npcPro.setXY2DBox(GameBG.ww * i + (GameBG.ww - GameBG.mw) / 2, j * GameBG.ww + (GameBG.ww - GameBG.mw) / 2);
                    }
                    else if (Game.battleLoader.continueRes == null && GridType.isMonster(type)) {
                        if (Game.battleLoader.monsterId > 0) {
                            type = Game.battleLoader.monsterId;
                        }
                        monster = Monster.getMonster(type, GameBG.ww * i + (GameBG.ww - GameBG.mw) / 2, j * GameBG.ww + (GameBG.ww - GameBG.mw) / 2);
                        monster.splitTimes = 1;
                        if (!isHasBoss) {
                            isHasBoss = monster.sysEnemy.isBoss == 1;
                            bossEnemy = monster.sysEnemy;
                        }
                        if (Session.homeData.isGuide) {
                            this.guideMonster = monster;
                            this.guideMonster.hide();
                        }
                    }
                    if (type == BattleFlagID.DOOR) {
                        let v3 = GameBG.get3D(i, j);
                        if (!Game.door) {
                            Game.door = Laya.loader.getRes("h5/effects/door/monster.lh");
                            Game.layer3d.addChild(Game.door);
                            Game.door.transform.translate(v3);
                        }
                        Game.door.transform.localPositionX = v3.x;
                        Game.door.transform.localPositionZ = v3.z;
                    }
                    else if (type == BattleFlagID.GUIDE) {
                        let v3 = GameBG.get3D(i, j);
                        this.guideCircle = Laya.loader.getRes("h5/effects/guide/monster.lh");
                        this.guideCircle.transform.translate(v3);
                        this.guideCircle.transform.localPositionX = v3.x;
                        this.guideCircle.transform.localPositionZ = v3.z;
                    }
                    k++;
                }
            }
            this._top.setBoss(isHasBoss, bossEnemy);
            Game.closeDoor();
            if (monster) {
                monster.hurt(0, false);
                Game.e0_ = monster;
            }
            Game.bg.drawR(isHasBoss);
            Game.ro = new Rocker();
            Game.ro.resetPos();
            this.addChild(Game.ro);
            Game.hero.init();
            Game.lastLevel = Game.level;
            Game.bg.updateY();
            if (BattleScene.npcPro) {
                Game.dropDiamond(BattleScene.npcPro);
            }
            this.setGuide("滑动摇杆，控制角色到达指定位置。", 1);
            App.sdkManager.log(LogType.BATTLE_GUIDE, "滑动摇杆，控制角色到达指定位置。");
            Laya.MouseManager.multiTouchEnabled = false;
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
            Laya.stage.on(Laya.Event.KEY_PRESS, this, this.onOpenDoor);
        }
        setGuide(str, guideId) {
            this._guideTalk && this._guideTalk.removeSelf();
            if (!Session.homeData.isGuide) {
                return;
            }
            Session.guideId = guideId;
            if (!this._guideTalk) {
                this._guideTalk = new GuideTalk();
            }
            this.addChild(this._guideTalk);
            this._guideTalk.setContent(str, guideId);
            Laya.stage.on(GameEvent.SHOW_ACTION_RECT, this, this.showActionRect);
        }
        showActionRect(guideId) {
            this._guideArea && this._guideArea.removeSelf();
            if (!Session.homeData.isGuide) {
                return;
            }
            if (Session.guideId == 1) {
                if (!this._guideArea) {
                    this._guideArea = new GuideActionArea();
                }
                this.addChild(this._guideArea);
                this._guideArea.y = Laya.stage.height - this._guideArea.height;
                Game.layer3d.addChild(this.guideCircle);
                Session.guideId = 3;
                App.sdkManager.log(LogType.BATTLE_GUIDE, "最佳控制区域");
            }
            else if (Session.guideId == 2) {
                let zhaohuan = new ui.test.zhaohuanUI();
                Game.bloodLayer.addChild(zhaohuan);
                zhaohuan.pos(this.guideMonster.hbox.cx, this.guideMonster.hbox.cy);
                setTimeout(() => {
                    zhaohuan.removeSelf();
                    this.guideMonster.show();
                    Session.guideId = 4;
                    this.guideCircle && this.guideCircle.removeSelf();
                    App.sdkManager.log(LogType.BATTLE_GUIDE, "显示引导怪");
                }, 800);
            }
        }
        onOpenDoor(e) {
            if (e.nativeEvent.keyCode == 111) {
                Game.hero.busi = true;
            }
        }
        kd(eve) {
            if (Game.executor.isRun) {
                Game.executor.stop_();
            }
            else {
                Game.executor.start();
            }
        }
        md(eve) {
            if (Game.state > 0) {
                return;
            }
            if (Session.guideId == 1 || Session.guideId == 2) {
                return;
            }
            Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.md);
            Laya.stage.on(Laya.Event.MOUSE_UP, this, this.up);
            let xx = Laya.stage.mouseX;
            let yy = Laya.stage.mouseY;
            Game.ro.x = xx;
            Game.ro.y = yy;
            this.addChild(Game.ro);
            Laya.stage.frameLoop(1, this, this.moves);
            if (Game.executor.isRun) {
                Game.hero.getGameAi().run = true;
            }
        }
        up(eve) {
            Laya.stage.off(Laya.Event.MOUSE_UP, this, this.up);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
            if (Game.ro && Game.ro.parent) {
                Game.ro.resetPos();
                Game.ro.reset();
            }
            Laya.stage.clearTimer(this, this.moves);
            if (Game.executor.isRun) {
                Game.hero.getGameAi().run = false;
            }
        }
        moves() {
            if (Game.state > 0) {
                return;
            }
            let xx = Laya.stage.mouseX;
            let yy = Laya.stage.mouseY;
            Game.ro.setSp0(xx, yy);
        }
    }

    class SceneManager {
        constructor() { }
        ;
        showMain() {
            if (!this.main) {
                this.main = new MainScene();
                Game.battleLoader.preload();
            }
            Game.isStartBattle = false;
            App.layerManager.sceneLayer.removeChildren();
            App.layerManager.sceneLayer.addChild(this.main);
            this.main.y = (Laya.stage.height - Laya.stage.designHeight) / 2;
            this.battle && this.battle._top && this.battle._top.reset();
            this.battle && this.battle.up(null);
        }
        showBattle() {
            if (!this.battle) {
                this.battle = new BattleScene();
            }
            App.layerManager.sceneLayer.removeChildren();
            App.layerManager.sceneLayer.addChild(this.battle);
            Game.playBattleMusic();
        }
    }

    class BuffID {
    }
    BuffID.WUDI_5009 = 5009;
    BuffID.FIRE_2001 = 2001;
    BuffID.FIRE_5001 = 5001;
    BuffID.DU_2002 = 2002;
    BuffID.DU_5002 = 5002;
    BuffID.ICE_2003 = 2003;
    BuffID.ICE_5003 = 5003;

    class PlayerSkillManager {
        constructor() {
            this.skillList = [];
            this.arrowHeadId = 0;
            this.skinsHeads = [2001, 2002, 2003, 2004];
            this.skinSkills = [5001, 5002, 5003, 5004, 5005, 5009];
        }
        clear() {
            this.skillList.length = 0;
            this.arrowHeadId = 0;
            SysSkill.reset();
        }
        get skills() {
            let ss = "";
            for (let i = 0; i < this.skillList.length; i++) {
                ss += "," + this.skillList[i].id + "_" + this.skillList[i].curTimes;
            }
            ss = ss.substring(1);
            return ss;
        }
        addArrowHead(id) {
            this.arrowHeadId = id;
            Laya.loader.create(["h5/bullets/skill/" + id + "/monster.lh"]);
        }
        addSkill(data) {
            if (data == null) {
                return;
            }
            if (this.skinsHeads.indexOf(data.id) != -1) {
                this.addArrowHead(data.id);
            }
            if (data) {
                let sys = this.isHas(data.id);
                if (sys) {
                    if (sys.curTimes < sys.upperLimit) {
                        sys.curTimes++;
                    }
                }
                else {
                    this.skillList.push(data);
                    data.curTimes++;
                }
            }
            if (this.skinSkills.indexOf(data.id) != -1) {
                Laya.loader.create(["h5/bullets/skill/" + data.id + "/monster.lh"]);
            }
            if (data.id == BuffID.WUDI_5009) {
                Game.hero.addBuff(BuffID.WUDI_5009);
            }
            this.addAttack();
            this.addAttackSpeed();
        }
        addAttack() {
            let buff;
            let attackNum = Hero.curHeroData.atk;
            let sys3002 = this.isHas(3002);
            if (sys3002) {
                buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3002.skillEffect1);
                if (buff) {
                    attackNum += sys3002.curTimes * buff.addAttack;
                }
            }
            buff = null;
            let sys3003 = this.isHas(3003);
            if (sys3003) {
                buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3003.skillEffect1);
                if (buff) {
                    attackNum += sys3003.curTimes * buff.addAttack;
                }
            }
            return attackNum;
        }
        addAttackSpeed() {
            let buff;
            let attackSpeed = Hero.curHeroData.atkSpeed;
            let sys3004 = this.isHas(3004);
            if (sys3004) {
                buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3004.skillEffect1);
                if (buff) {
                    for (let i = 0; i < sys3004.curTimes; i++) {
                        attackSpeed = attackSpeed * (1 - buff.addSpeed / 1000);
                    }
                }
            }
            buff = null;
            let sys3005 = this.isHas(3005);
            if (sys3005) {
                buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys3005.skillEffect1);
                if (buff) {
                    let rate = 1;
                    for (let i = 0; i < sys3005.curTimes; i++) {
                        rate = rate * (buff.addSpeed / 1000);
                    }
                    attackSpeed = attackSpeed * (1 - rate);
                }
            }
            return attackSpeed;
        }
        isHas(id) {
            for (let i = 0; i < this.skillList.length; i++) {
                if (this.skillList[i].id == id) {
                    return this.skillList[i];
                }
            }
            return null;
        }
        removeSkill(id) {
            let sys = this.isHas(id);
            if (sys) {
                let index = this.skillList.indexOf(sys);
                if (index >= 0) {
                    this.skillList.splice(index, 1);
                }
            }
        }
        getRotateSkills() {
            let skillIds = [5001, 5002, 5003, 5004];
            let rt = [];
            for (let i = 0; i < skillIds.length; i++) {
                if (this.isHas(skillIds[i])) {
                    rt.push(skillIds[i]);
                }
            }
            return rt;
        }
        getRandomSkillByNpcId(npcId) {
            let sysNpc = App.tableManager.getDataByNameAndId(SysNpc.NAME, npcId);
            let ary = sysNpc.skillRandom.split(",");
            for (let i = 0; i < this.skillList.length; i++) {
                let sys = this.skillList[i];
                if (sys) {
                    if (sys.curTimes >= sys.upperLimit) {
                        let flag = ary.indexOf(sys.id + "");
                        if (flag != -1) {
                            ary.splice(flag, 1);
                        }
                    }
                }
            }
            let rand = Math.floor(Math.random() * ary.length);
            return Number(ary[rand]);
        }
    }

    class BuffManager {
        constructor() {
            this.buffArr = [];
        }
        exe(now) {
            for (let i = 0; i < this.buffArr.length; i++) {
                this.buffArr[i].exe(now);
            }
        }
        addBuff(buffId, to, bullet) {
            let BUFF = Laya.ClassUtils.getRegClass("BUFF" + buffId);
            let buff = new BUFF(buffId);
            buff.to = to;
            this.buffArr.push(buff);
            if (bullet) {
                buff.bullet = bullet;
                buff.hurtValue = bullet.hurtValue;
                buff.startTime += Game.executor.getWorldNow();
                let buffIndex = bullet.buffAry.indexOf(buffId);
                if (buffIndex > -1) {
                    bullet.buffAry.splice(buffIndex, 1);
                }
            }
        }
        removeBuff(buff) {
            let buffIndex = buff.to.buffAry.indexOf(buff.skill.id);
            if (buffIndex != -1) {
                buff.to.buffAry.splice(buffIndex, 1);
            }
            let index = this.buffArr.indexOf(buff);
            if (index > -1) {
                this.buffArr.splice(index, 1);
            }
        }
    }

    var Sprite3D = Laya.Sprite3D;
    class Game {
        constructor() {
        }
        static selectEnemy(pro) {
            Game.e0_ = pro;
            let curScale = pro.sysEnemy.zoomMode / 100;
            curScale = 1 / curScale;
            if (Game.e0_.sp3d && Game.e0_.sp3d.transform) {
                Game.e0_.sp3d.addChild(Game.selectFoot);
                Game.e0_.addSprite3DToChild("guadian", Game.selectHead);
                Game.selectHead.transform.localScaleX = curScale;
                Game.selectHead.transform.localScaleY = curScale;
                Game.selectHead.transform.localScaleZ = curScale;
                Game.selectFoot.transform.localScaleX = curScale;
                Game.selectFoot.transform.localScaleY = curScale;
                Game.selectFoot.transform.localScaleZ = curScale;
            }
        }
        static updateMap() {
            if (Game.map0) {
                if (Game.bg) {
                    Game.bloodLayer.pos(Game.bg.x, Game.bg.y);
                    Game.frontLayer.pos(Game.bg.x, Game.bg.y);
                    Game.footLayer.pos(Game.bg.x, Game.bg.y);
                    Game.topLayer.pos(Game.bg.x, Game.bg.y);
                    Game.map0.pos(Game.bg.x, Game.bg.y);
                }
            }
        }
        static openDoor() {
            if (Game.isOpen) {
                return;
            }
            App.sdkManager.log(LogType.CHAPTER_INDEX, Game.battleLoader.index + "");
            console.log("开门");
            if (Game.battleLoader.index >= SysMap.getTotal(Game.battleLoader.chapterId) && Game.battleLoader._configId != 100000) {
                console.log("通关了");
                Session.homeData.isPass = true;
                if (Game.battleLoader.chapterId >= Session.homeData.chapterId) {
                    Session.homeData.chapterId++;
                    Session.homeData.setChapterId(Session.homeData.chapterId, 0);
                }
                Game.battleLoader.index = 0;
                Session.homeData.mapIndex = 0;
            }
            Game.cookie.setCookie(CookieKey.CURRENT_BATTLE, {
                "mapId": Game.battleLoader.mapId,
                "index": Game.battleLoader.index,
                "configId": Game.battleLoader._configId,
                "curhp": Game.hero.gamedata.hp,
                "maxhp": Game.hero.gamedata.maxhp,
                "skills": Game.skillManager.skills,
                "coins": Game.battleCoins,
                "chapterId": Game.battleLoader.chapterId
            });
            Game.isOpen = true;
            if (Session.homeData.isGuide) {
                Session.homeData.chapterId = 1;
                Game.scenneM.battle.setGuide("通过传送进入下一关。", 5);
                App.sdkManager.log(LogType.BATTLE_GUIDE, "通过传送进入下一关");
                Session.homeData.isGuide = false;
                Game.battleLoader.index = 1;
                Game.battleLoader.chapterId = 1;
                SysChapter.randomDiamond(Game.battleLoader.chapterId);
                Session.homeData.setChapterId(Session.homeData.chapterId, 1);
            }
            else {
                if (!Session.homeData.isPass) {
                    Game.battleLoader.index++;
                    if (Game.battleLoader.chapterId == Session.homeData.chapterId) {
                        if (Session.homeData.mapIndex < Game.battleLoader.index) {
                            Session.homeData.mapIndex = Game.battleLoader.index - 1;
                            Session.homeData.setChapterId(Session.homeData.chapterId, Session.homeData.mapIndex);
                        }
                    }
                }
            }
            Game.bg.setDoor(1);
            Game.layer3d.addChild(Game.door);
            Game.map0.setDoor(true);
            Game.shakeBattle();
            Game.battleLoader.clearMonster(true);
            Session.saveData();
        }
        static shakeBattle() {
            Game.scenneM.battle.pos(0, 0);
            ShakeUtils.execute(Game.scenneM.battle, 75, 4);
        }
        static closeDoor() {
            console.log("关门====================");
            Game.isOpen = false;
            Game.door && Game.door.removeSelf();
            Game.map0.setDoor(false);
            Game.bg.setDoor(0);
        }
        static setSelectEffect() {
            if (!Game.selectHead) {
                Game.selectHead = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/head/monster.lh"));
                Game.selectHead.addComponent(HeadTranslateScript);
            }
            if (!Game.selectFoot) {
                Game.selectFoot = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/foot/hero.lh"));
                Game.selectFoot.addComponent(FootRotateScript);
            }
        }
        static reset() {
            Game.state = 0;
            Game.isPopupSkill = 0;
            Game.bloodLayer.removeChildren();
            Game.frontLayer.removeChildren();
            Game.footLayer.removeChildren();
            Game.layer3d.removeChildren();
            Game.topLayer.removeChildren();
            Game.selectHead && Game.selectHead.removeSelf();
            Game.selectFoot && Game.selectFoot.removeSelf();
            Game.map0.reset();
            Game.e0_ = null;
            Game.executor && Game.executor.stop_();
            if (Game.ro) {
                Game.ro.destroy();
            }
        }
        static getRandPos(pro, range1 = 4) {
            let mRow = Math.floor(pro.hbox.y / GameBG.ww);
            let mCol = Math.floor(pro.hbox.x / GameBG.ww);
            let range = range1;
            var info = Game.map0.info;
            var arr = [];
            for (let i = mRow - range; i <= mRow + range; i++) {
                if (i <= 3 || i >= GameBG.MAP_ROW - 3) {
                    continue;
                }
                for (let j = mCol - range; j <= mCol + range; j++) {
                    if (j == mRow && i == mCol) {
                        continue;
                    }
                    if (j <= 1 || j >= GameBG.MAP_COL - 1) {
                        continue;
                    }
                    var key = info[i + "_" + j];
                    if (key == null) {
                        continue;
                    }
                    if (key == 0) {
                        let aaa = [j, i];
                        arr.push(aaa);
                    }
                }
            }
            var toArr = [];
            if (arr.length > 0) {
                var rand = Math.floor(arr.length * Math.random());
                toArr = arr[rand];
            }
            if (toArr.length == 0) {
                toArr = [mRow, mCol];
            }
            return toArr;
        }
        static showMain() {
            GameCube.recover();
            Game.selectFoot && Game.selectFoot.removeSelf();
            Game.selectHead && Game.selectHead.removeSelf();
            Game.skillManager.clear();
            Game.battleLoader.index = 1;
            Game.rebornTimes = 2;
            if (Game.hero) {
                Game.hero.resetBlood();
                Game.hero.resetSkill();
                Game.hero.resetAI();
            }
            Game.battleExp = Game.heroExp = 0;
            Game.battleLoader.clearMonster();
            Game.scenneM.showMain();
            if (Game.map0) {
                Game.map0.Eharr.length = 0;
            }
            Game.AiArr.length = 0;
            Game.playBgMusic();
            if (Game.showCoinsNum > 0) {
                Game.showCoinsNum = Game.showCoinsNum + Math.floor(Game.showCoinsNum * Session.talentData.lineGold / 100);
                Laya.stage.event(GameEvent.ADD_COIN, Game.showCoinsNum);
                Game.showCoinsNum = 0;
            }
            Game.showBlueNum = Game.showRedNum = 0;
            Laya.stage.event(GameEvent.SHOW_MAIN);
        }
        static playBgMusic() {
            Game.playMusic("menu.mp3");
        }
        static playBattleMusic() {
            Game.playMusic("state_fight.mp3");
        }
        static playMusic(str) {
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                if (res == null || res.state == 1) {
                    App.soundManager.play(str, true);
                }
            });
        }
        static playSound(str) {
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                if (res.state == 1) {
                    App.soundManager.play(str);
                }
            });
        }
        static dropDiamond(pro) {
            Game.showBlueNum = Game.showRedNum = 0;
            if (Game.map0.Eharr.length == 0) {
                if (Game.battleLoader.index == SysChapter.dropIndex) {
                    if (SysChapter.blueNum > 0) {
                        CoinEffect.addEffect(pro, SysChapter.blueNum, Coin.TYPE_BLUE);
                    }
                    else if (SysChapter.redNum > 0) {
                        CoinEffect.addEffect(pro, SysChapter.redNum, Coin.TYPE_RED);
                    }
                }
                if (Game.battleLoader.index == SysChapter.heartIndex) {
                    if (SysChapter.heartNum > 0) {
                        CoinEffect.addEffect(pro, SysChapter.heartNum, Coin.TYPE_HEART);
                        setTimeout(() => {
                            CoinEffect.flyHeart();
                        }, 1000);
                    }
                }
            }
        }
    }
    Game.codeVer = "2.1.1.1012";
    Game.resVer = "2.1.1.1012";
    Game.nativefiles = [
        "loading/jianduxia.png",
        "loading/jiandushang.png",
        "loading/jiazai.jpg",
        "loading/btn_kaishi.png",
        "loading/dan.png",
        "loading/loadingClip.png",
        "loading/logo.png",
        "loading/shouci.png",
        "loading/zhudi.jpg"
    ];
    Game.userHeadUrl = "";
    Game.userName = "";
    Game.poolTagArr = {};
    Game.isStartBattle = false;
    Game.TestShooting = 0;
    Game.BigMapMode = 1;
    Game.state = 0;
    Game.isPopupSkill = 0;
    Game.rebornTimes = 2;
    Game.Event_MAIN_DIE = "Event_MAIN_DIE";
    Game.Event_PlayStop = "Game.Event_PlayStop";
    Game.Event_Short = "Game.Event_Short";
    Game.Event_Hit = "Game.Event_Hit";
    Game.Event_KeyNum = "Game.Event_KeyNum";
    Game.Event_ADD_HP = "Event_ADD_HP";
    Game.Event_UPDATE_ATTACK_SPEED = "Event_UPDATE_ATTACK_SPEED";
    Game.Event_NPC = "Event_NPC";
    Game.Event_COINS = "Event_COINS";
    Game.Event_EXP = "Event_EXP";
    Game.Event_LEVEL = "Event_LEVEL";
    Game.Event_SELECT_NEWSKILL = "Event_SELECT_NEWSKILL";
    Game.skillManager = new PlayerSkillManager();
    Game.AiArr = [];
    Game.HeroArrows = [];
    Game.layer3d = new Sprite3D();
    Game.layer3dCube = new Sprite3D();
    Game.layer3dCoins = new Sprite3D();
    Game.cameraY = 10;
    Game.sqrt3 = 10 * Math.sqrt(3);
    Game.footLayer = new Laya.Sprite();
    Game.bloodLayer = new Laya.Sprite();
    Game.frontLayer = new Laya.Sprite();
    Game.topLayer = new Laya.Sprite();
    Game.scenneM = new SceneManager();
    Game.buffM = new BuffManager();
    Game.battleLoader = new BattleLoader();
    Game.isOpen = false;
    Game.battleCoins = 0;
    Game.battleExp = 0;
    Game.heroExp = 0;
    Game.showCoinsNum = 0;
    Game.showBlueNum = 0;
    Game.showRedNum = 0;

    class SawHeng extends ui.test.SawHengUI {
        constructor(xx, yy, vv) {
            super();
            this.line = new LineData();
            this.bg.width = vv;
            this.pos(xx, yy);
            this.line.startX = xx;
            this.line.startY = yy;
            this.line.endX = xx + vv;
            this.line.endY = yy;
        }
    }
    class HengJu extends ui.test.HengjuUI {
        constructor(xx, yy, vv) {
            super();
            this.hbox = new GameHitBox(56, 56);
            this.cd = 0;
            this.status = 0;
            this.ww = vv;
            this.ww -= GameBG.ww;
            this.pos(xx + GameBG.ww2 + 5, yy + GameBG.ww2);
            this.startX = this.x;
            this.on(Laya.Event.UNDISPLAY, this, this.onUnDis);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
            this.box.scrollRect = new Laya.Rectangle(0, 0, 58, 35);
        }
        onUnDis() {
            this.clearTimer(this, this.onLoop);
            this.huoxing.stop();
        }
        onDis() {
            this.frameLoop(1, this, this.onLoop);
            this.huoxing.play();
        }
        onLoop() {
            this.dianju.rotation += 20;
            if (this.status == 0) {
                this.x += 4;
            }
            else {
                this.x -= 4;
            }
            if (this.x >= this.startX + this.ww) {
                this.status = 1;
                this.scaleX = -1;
            }
            else if (this.x <= this.startX) {
                this.status = 0;
                this.scaleX = 1;
            }
            this.hbox.setXY(this.x, this.y);
            this.checkHero();
        }
        checkHero() {
            if (Game.executor.getWorldNow() >= this.cd) {
                if (GameHitBox.faceToLenth(this.hbox, Game.hero.hbox) < GameBG.ww2) {
                    if (Game.hero.hbox.linkPro_) {
                        Game.hero.hbox.linkPro_.event(Game.Event_Hit, Game.bg.saw.pro);
                        this.cd = Game.executor.getWorldNow() + 1000;
                    }
                }
            }
        }
    }

    class SawZong extends ui.test.SawZongUI {
        constructor(xx, yy, vv) {
            super();
            this.line = new LineData();
            this.bg.height = vv;
            this.pos(xx, yy);
            this.line.startX = xx;
            this.line.startY = yy;
            this.line.endX = xx;
            this.line.endY = yy + vv;
        }
    }
    class ZongJu extends ui.test.ZongjuUI {
        constructor(xx, yy, vv) {
            super();
            this.hbox = new GameHitBox(35, 70);
            this.cd = 0;
            this.status = 0;
            this.ww = vv;
            this.ww -= GameBG.ww;
            this.pos(xx + GameBG.ww2, yy + GameBG.ww2);
            this.startY = this.y;
            this.on(Laya.Event.UNDISPLAY, this, this.onUnDis);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onUnDis() {
            this.clearTimer(this, this.onLoop);
            this.shudianju.stop();
            this.shuhuoxing.stop();
        }
        onDis() {
            this.shudianju.play();
            this.shuhuoxing.play();
            this.frameLoop(1, this, this.onLoop);
        }
        onLoop() {
            if (this.status == 0) {
                this.y += 4;
            }
            else {
                this.y -= 4;
            }
            if (this.y >= this.startY + this.ww) {
                this.status = 1;
                this.scaleY = -1;
            }
            else if (this.y <= this.startY) {
                this.status = 0;
                this.scaleY = 1;
            }
            this.hbox.setXY(this.x, this.y);
            this.checkHero();
        }
        checkHero() {
            if (Game.executor.getWorldNow() >= this.cd) {
                if (GameHitBox.faceToLenth(this.hbox, Game.hero.hbox) < GameBG.ww2) {
                    if (Game.hero.hbox.linkPro_) {
                        Game.hero.hbox.linkPro_.event(Game.Event_Hit, Game.bg.saw.pro);
                        this.cd = Game.executor.getWorldNow() + 1000;
                    }
                }
            }
        }
    }

    class Saw extends Laya.Sprite {
        constructor() {
            super();
            this.hengAry = [];
            this.zongAry = [];
            this.hengJuAry = [];
            this.zongJuAry = [];
            this.pro = new GamePro(0);
            this.pro.hurtValue = 150;
        }
        addBg(xx, yy, vv, type) {
            if (type == 1) {
                let heng = new SawHeng(xx, yy, vv);
                this.addChild(heng);
                this.hengAry.push(heng);
                let hengju = new HengJu(xx, yy, vv);
                this.hengJuAry.push(hengju);
            }
            else if (type == 2) {
                let zong = new SawZong(xx, yy, vv);
                this.addChild(zong);
                this.zongAry.push(zong);
                let zongju = new ZongJu(xx, yy, vv);
                this.zongJuAry.push(zongju);
            }
        }
        updateSaw() {
            for (var i = 0; i < this.hengAry.length; i++) {
                for (var j = 0; j < this.zongAry.length; j++) {
                    if (this.zongAry[j].line.startX > this.hengAry[i].line.startX && this.zongAry[j].line.startX < this.hengAry[i].line.endX && this.zongAry[j].line.startY < this.hengAry[i].line.startY && this.zongAry[j].line.endY > this.hengAry[i].line.startY) {
                        let xx = this.zongAry[j].line.startX;
                        let yy = this.hengAry[i].line.startY;
                        let img = new Laya.Image();
                        img.skin = 'bg/503.png';
                        this.addChild(img);
                        img.pos(xx, yy + 1);
                    }
                }
            }
            for (var i = 0; i < this.hengJuAry.length; i++) {
                this.addChild(this.hengJuAry[i]);
            }
            for (var i = 0; i < this.zongJuAry.length; i++) {
                this.addChild(this.zongJuAry[i]);
            }
        }
        clear() {
            this.removeChildren();
            this.hengAry.length = this.zongAry.length = this.hengJuAry.length = this.zongJuAry.length = 0;
        }
    }
    Saw.TAG = "SAW";
    class LineData {
    }

    var Image = Laya.Image;
    var Sprite$1 = Laya.Sprite;
    class GameBG extends Laya.Sprite {
        constructor() {
            super();
            this.maskImg = new Laya.Image();
            this.bottomImg = new Laya.Image();
            this.bgh = 0;
            this._box = new Sprite$1();
            this._top = new Image();
            this._bossImg = new Image();
            this._bottom = new Image();
            this._topShadow = new Image();
            this._leftShadow = new Image();
            this._door = new Image();
            this.saw = new Saw();
            this._sawInfo = {};
            this._sawInfoZong = {};
            this.npcId = 0;
            this.npcP = new Laya.Point();
            this.npcDic = {};
            GameBG.gameBG = this;
            this.mySp = new Sprite$1();
            this.mySp.graphics.drawRect(0, 0, GameBG.mw, GameBG.mw, 0x00ff00);
            this.doorNumber = BitmapNumber.getFontClip(0.3);
        }
        static get3D(xx, yy) {
            if (!GameBG.v3d) {
                GameBG.v3d = new Laya.Vector3(0, 0, 0);
            }
            GameBG.v3d.x = (xx - 6);
            let rowNum = GameBG.bgHH / GameBG.ww / 2;
            GameBG.v3d.z = (yy - rowNum + 0.5) / Game.cameraCN.cos0;
            return GameBG.v3d;
        }
        getBgh() {
            return this.bgh;
        }
        isHit(dx, dy) {
            var dx0 = dx - GameBG.mw2;
            var dy0 = dy - GameBG.mw2;
            var b = false;
            for (let i = 0; i < GameBG.arrsp.length; i++) {
                var element = GameBG.arrsp[i];
                if (this.isHit_(dx0, dy0, element)) {
                    b = true;
                }
            }
            return b;
        }
        isHit_(dx, dy, d2) {
            return dx < d2.x + GameBG.ww &&
                dx + GameBG.mw > d2.x &&
                dy < d2.y + GameBG.ww &&
                GameBG.mw + dy > d2.y;
        }
        setZhuan(box) {
        }
        updata(x, y) {
            this.mySp.x = x - GameBG.mw2;
            this.mySp.y = y - GameBG.mw2;
        }
        clear() {
            this._box.removeChildren();
            this.saw.clear();
            this._sawInfo = {};
            this._sawInfoZong = {};
            this.npcId = 0;
            this._npcAni && this._npcAni.removeSelf();
            this._npcAni = null;
        }
        drawR(hasBoss = false) {
            this.npcId = 0;
            var ww = GameBG.ww;
            var k = 0;
            let gType = 0;
            this.addChild(this._box);
            this.addChild(this.saw);
            this._box.cacheAs = "bitmap";
            let index3 = 0;
            this._box.graphics.clear();
            for (let j = 0; j < GameBG.MAP_ROW; j++) {
                if (GameBG.MAP_COL % 2 == 0) {
                    index3++;
                }
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    let gSkin = (index3 % 2 == 0) ? GameBG.BG_TYPE + "/10.png" : GameBG.BG_TYPE + "/11.png";
                    this._box.graphics.drawImage(Laya.loader.getRes(gSkin), i * ww, j * ww, 64, 64);
                    index3++;
                }
            }
            var k = 0;
            for (let j = 0; j < GameBG.MAP_ROW; j++) {
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    gType = GameBG.arr0[k];
                    if ((GridType.isWall(gType) || (gType >= 1 && gType <= 10))) {
                        let shadow = BgGrid.getOne(GameBG.BG_TYPE + '/y' + GameCube.getType(gType) + '.png');
                        shadow.x = i * ww;
                        shadow.y = j * ww;
                        this._box.addChild(shadow);
                    }
                    else if (GridType.isFence(gType)) {
                        let shadow = BgGrid.getOne("bg/lanying.png");
                        shadow.width = 200;
                        shadow.x = i * ww - 64;
                        shadow.y = j * ww + 50;
                        this._box.addChild(shadow);
                    }
                    k++;
                }
            }
            k = 0;
            for (let j = 0; j < GameBG.MAP_ROW; j++) {
                this.bgh += GameBG.ww;
                for (let i = 0; i < GameBG.MAP_COL; i++) {
                    if (k > GameBG.arr0.length) {
                        break;
                    }
                    gType = GameBG.arr0[k];
                    let xx = i * GameBG.ww;
                    let yy = j * GameBG.ww;
                    var thorn;
                    var grid;
                    if (GridType.isRiverPoint(gType)) {
                        grid = BgGrid.getOne(GameBG.BG_TYPE + '/100.png');
                        grid.pos(xx, yy);
                        this._box.addChild(grid);
                    }
                    else if (GridType.isThorn(gType)) {
                        thorn = GameThorn.getOne();
                        thorn.hbox.setXY(xx, yy);
                        thorn.pos(xx, yy);
                        this._box.addChild(thorn);
                    }
                    else if (GridType.isRiverScale9Grid(gType) || GridType.isRiverScale9Grid2(gType) || GridType.isRiverRow(gType) || GridType.isRiverCol(gType)) {
                        grid = BgGrid.getOne(GameBG.BG_TYPE + '/' + gType + '.png');
                        grid.pos(xx, yy);
                        this._box.addChild(grid);
                    }
                    else if (GridType.isFlower(gType)) {
                        grid = BgGrid.getOne(GameBG.BG_TYPE + '/' + gType + '.png');
                        grid.pos(xx, yy);
                        this._box.addChild(grid);
                    }
                    else if (GridType.isSawHeng(gType)) {
                        if (this._sawInfo[gType] == null) {
                            let hengAry = [];
                            this._sawInfo[gType] = hengAry;
                        }
                        let p = new Laya.Point(xx, yy);
                        this._sawInfo[gType].push(p);
                    }
                    else if (GridType.isSawZong(gType)) {
                        if (this._sawInfoZong[gType] == null) {
                            let hengAry = [];
                            this._sawInfoZong[gType] = hengAry;
                        }
                        let p = new Laya.Point(xx, yy);
                        this._sawInfoZong[gType].push(p);
                    }
                    else if (GridType.isNpc(gType)) {
                        this.npcId = gType;
                        this.npcP.x = xx + GameBG.ww2;
                        this.npcP.y = yy;
                        if (this.npcId == BattleFlagID.ANGLE) {
                            this.npcId = 1001;
                            if (this.npcDic[this.npcId] == null) {
                                let NPC = Laya.ClassUtils.getClass("NPC" + this.npcId);
                                this._npcAni = new NPC();
                                this.npcDic[this.npcId] = this._npcAni;
                            }
                            else {
                                this._npcAni = this.npcDic[this.npcId];
                            }
                            this.showNpc();
                        }
                    }
                    if (gType == BattleFlagID.DOOR) {
                        this._door.pos(xx - GameBG.ww2, yy - GameBG.ww2);
                        this._door.skin = 'bg/door.png';
                    }
                    else if (gType == BattleFlagID.HERO) {
                        Hero.bornX = xx;
                        Hero.bornY = yy;
                    }
                    k++;
                }
            }
            this.saw.clear();
            for (let key in this._sawInfo) {
                let hengAry = this._sawInfo[key];
                let pos = hengAry[0];
                let ww = hengAry[1].x - hengAry[0].x + GameBG.ww;
                this.saw.addBg(pos.x, pos.y, ww, 1);
            }
            for (let key in this._sawInfoZong) {
                let zongAry = this._sawInfoZong[key];
                let pos = zongAry[0];
                let hh = zongAry[1].y - zongAry[0].y + GameBG.ww;
                this.saw.addBg(pos.x, pos.y, hh, 2);
            }
            this._box.addChild(this._door);
            this.saw.updateSaw();
            this.startX = GameBG.ww2;
            this.x = -this.startX;
            this.y = (Laya.stage.height - GameBG.bgHH) * 0.5;
            GameBG.cx = this.x;
            GameBG.cy = this.y;
            this.addChild(this.maskImg);
            this.addChild(this.bottomImg);
            this.maskImg.skin = "battleBg/" + GameBG.BG_TYPE_NUM + ".png";
            this.maskImg.sizeGrid = "506,421,801,321";
            this.maskImg.width = GameBG.bgWW;
            this.maskImg.height = GameBG.bgHHReal;
            this.bottomImg.width = GameBG.bgWW;
            this.bottomImg.height = 500;
            this.bottomImg.y = this.maskImg.y + this.maskImg.height;
            this.bottomImg.skin = "battleBg/bottom_" + GameBG.BG_TYPE_NUM + ".jpg";
        }
        showGuidePointer() {
        }
        hideGuidePointer() {
        }
        showNpc() {
            if (this._npcAni) {
                this._npcAni.scale(1, 1);
                Game.topLayer.addChild(this._npcAni);
                this._npcAni.pos(this.npcP.x, this.npcP.y - 800);
                Laya.Tween.to(this._npcAni, { y: this.npcP.y }, 300, Laya.Ease.circIn);
            }
        }
        checkNpc() {
            if (this.npcId <= 0) {
                return;
            }
            if (!Game.map0.checkNpc()) {
                return;
            }
            Game.scenneM.battle.up(null);
            if (this.npcId == BattleFlagID.OTHER_NPC) {
                this.npcId = 0;
                let lossRate = Game.hero.lossBlood();
                if (lossRate <= 0) {
                    this.npcId = 1002;
                }
                else if (lossRate <= 0.1) {
                    this.npcId = 1002;
                }
                else {
                    this.npcId = 1001;
                }
            }
            else if (this.npcId == BattleFlagID.ANGLE) {
                this.npcId = 1001;
            }
            if (this.npcId > 0) ;
        }
        clearNpc() {
            if (this._npcAni) {
                Laya.Tween.to(this._npcAni, { scaleX: 0.3 }, 200, null, null, 100);
                Laya.Tween.to(this._npcAni, { y: -300 }, 300, Laya.Ease.circIn, new Laya.Handler(this, this.clearNpcCom), 300);
            }
        }
        clearNpcCom() {
            this._npcAni && this._npcAni.removeSelf();
            Game.map0.clearNpc();
            this.npcId = 0;
            this._npcAni = null;
            if (Game.map0.Eharr.length == 0) {
                CoinEffect.fly();
            }
        }
        setDoor(state) {
            this._door.visible = state == 1;
        }
        updateY() {
            var bgy = GameBG.cy - Game.hero.pos2.z;
            if (bgy <= 0 && bgy >= Laya.stage.height - GameBG.bgHH) {
                Game.bg.y = bgy;
                Game.camera.transform.localPositionZ = Game.cameraCN.z + Game.hero.z;
            }
            else if (bgy < Laya.stage.height - GameBG.bgHH) {
                Game.bg.y = Laya.stage.height - GameBG.bgHH;
                Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Game.bg.y) / GameBG.ww / Game.cameraCN.cos0;
            }
            else {
                Game.bg.y = 0;
                Game.camera.transform.localPositionZ = Game.cameraCN.z + (GameBG.cy - Game.bg.y) / GameBG.ww / Game.cameraCN.cos0;
            }
            let ww2 = this.startX;
            var bgx = GameBG.cx - Game.hero.pos2.x;
            if (bgx <= -ww2 && bgx >= (Laya.stage.width - GameBG.bgWW) + ww2) {
                Game.camera.transform.localPositionX = Game.hero.x;
                Game.bg.x = bgx;
            }
            else if (bgx > -ww2) {
                Game.bg.x = -ww2;
                Game.camera.transform.localPositionX = (GameBG.cx - Game.bg.x) / GameBG.ww;
            }
            else {
                Game.bg.x = (Laya.stage.width - GameBG.bgWW) + ww2;
                Game.camera.transform.localPositionX = (GameBG.cx - Game.bg.x) / GameBG.ww;
            }
            Game.updateMap();
        }
    }
    GameBG.wnum = 12;
    GameBG.hnum = 49;
    GameBG.width = 750;
    GameBG.height = 1334;
    GameBG.ww = GameBG.width / GameBG.wnum;
    GameBG.ww2 = GameBG.ww / 2;
    GameBG.fw = GameBG.ww * 0.4;
    GameBG.mw = GameBG.ww - GameBG.fw;
    GameBG.mw2 = GameBG.mw / 2;
    GameBG.mw4 = GameBG.mw / 4;
    GameBG.orthographicVerticalSize = GameBG.wnum * GameBG.height / GameBG.width;
    GameBG.arrsp = [];
    GameBG.arr0 = [];
    class BgGrid extends Laya.Image {
        constructor() {
            super();
            this.on(Laya.Event.UNDISPLAY, this, this.onUndis);
        }
        onInit(imgUrl) {
            if (this.imgUrl) {
                return;
            }
            this.skin = imgUrl;
            this.imgUrl = imgUrl;
        }
        onUndis() {
            Laya.Pool.recover(BgGrid.TAG + this.imgUrl, this);
        }
        static getOne(imgUrl) {
            let grid = new BgGrid();
            grid.onInit(imgUrl);
            grid.imgUrl = imgUrl;
            return grid;
        }
    }
    BgGrid.TAG = "BgGrid_";

    class PlatformID {
    }
    PlatformID.TEST = 0;
    PlatformID.H5 = 10;
    PlatformID.WX = 31;

    class HitType {
    }
    HitType.hit1 = 1;
    HitType.hit2 = 2;
    HitType.hit3 = 3;
    HitType.hit4 = 4;

    class GameScaleAnimator {
        constructor() {
            this.starttime = 0;
            this.playtime = 0;
            this.movelen = 0;
            this.ms = null;
            this.rad = 0;
            this.now = 0;
            this.cd = 1300;
        }
        ai(ms) { }
        ;
        isOk() {
            return Game.executor.getWorldNow() >= this.now + this.cd;
        }
    }

    class GameScaleAnimator1 extends GameScaleAnimator {
        constructor() {
            super();
        }
        zoom(nt, zoom, ms) {
            if (nt > 1)
                nt = 1;
            nt = Math.sin(Math.PI * (nt) * 4);
            let st = 0;
            st = zoom * 0.2 * nt;
            st = zoom * 0.8 + st;
            ms.sp3d.transform.localScaleX = st;
            ms.sp3d.transform.localScaleZ = st;
            st = zoom * 0.1 * nt;
            st = zoom * 1.1 - st;
            ms.sp3d.transform.localScaleY = st;
        }
        ai(ms) {
            if (this.starttime != 0) {
                var now = Game.executor.getWorldNow();
                var zoom = ms.tScale;
                if (now >= this.starttime + this.playtime) {
                    ms.sp3d.transform.localScaleZ = zoom;
                    ms.sp3d.transform.localScaleX = zoom;
                    ms.sp3d.transform.localScaleY = zoom;
                    this.starttime = 0;
                }
                else {
                    let nt = now - this.starttime;
                    nt = nt / this.playtime;
                    this.zoom(nt, zoom, ms);
                }
            }
        }
    }

    class GameScaleAnimator2 extends GameScaleAnimator {
        constructor() {
            super();
            this.movelen = GameBG.ww * 2.5;
            this.futureBox = new GameHitBox(1, 1);
            this.sp = new Laya.Point(0, 0);
        }
        move(nt) {
            var ww = this.movelen * nt;
            let ww2 = 0;
            let i = 0;
            while (i < 10) {
                ww2 += ww / 10;
                var vx = ww2 * Math.cos(this.rad);
                var vy = ww2 * Math.sin(this.rad);
                let nextX = this.sp.x + vx;
                let nextY = this.sp.y + vy;
                if (nextX >= (GameBG.bgWW - GameBG.ww) || nextX <= GameBG.ww || nextY >= (Game.map0.endRowNum * GameBG.ww) || nextY <= 3 * GameBG.ww) {
                    return;
                }
                this.futureBox.setXY(nextX, nextY);
                var hits = Game.map0.Wharr;
                if (!Game.map0.chechHit_arr(this.futureBox, hits)) {
                    this.ms.setXY2DBox(this.futureBox.x, this.futureBox.y);
                }
                else {
                    return;
                }
                i++;
            }
        }
        zoom(nt, zoom, ms) {
            if (nt > 1)
                nt = 1;
            if (nt < 0.5)
                nt = 0.5;
            nt = nt * 1;
            nt = Math.sin(Math.PI * (nt));
            if (nt < 0)
                nt *= -1;
            let st = 0;
            st = zoom * 0.8 * (1 - nt);
            st = zoom * 0.2 + st;
            ms.sp3d.transform.localScaleZ = st;
            st = zoom * 0.2 * (1 - nt);
            st = zoom * 1 + st;
            ms.sp3d.transform.localScaleX = st;
        }
        ai(ms) {
            if (this.starttime != 0) {
                var now = Game.executor.getWorldNow();
                var zoom = ms.tScale;
                if (now >= this.starttime + this.playtime) {
                    ms.sp3d.transform.localScaleZ = zoom;
                    ms.sp3d.transform.localScaleX = zoom;
                    ms.sp3d.transform.localScaleY = zoom;
                    this.starttime = 0;
                    this.ms = null;
                }
                else {
                    if (!this.ms) {
                        this.ms = ms;
                        this.rad = ms.face2d + Math.PI;
                        this.sp.x = ms.hbox.x;
                        this.sp.y = ms.hbox.y;
                        this.futureBox.setRq(this.sp.x, this.sp.y, ms.hbox.ww, ms.hbox.hh);
                    }
                    let nt = now - this.starttime;
                    nt = nt / this.playtime;
                    this.move(nt);
                    this.zoom(nt, zoom, ms);
                }
            }
        }
    }

    class GameScaleAnimator3 extends GameScaleAnimator {
        constructor() {
            super();
            this.movelen = GameBG.ww;
            this.futureBox = new GameHitBox(1, 1);
            this.sp = new Laya.Point(0, 0);
        }
        move(nt) {
            var ww = this.movelen * nt;
            var vx = ww * Math.cos(this.rad);
            var vy = ww * Math.sin(this.rad);
            this.futureBox.setXY(this.sp.x + vx, this.sp.y + vy);
            var hits = Game.map0.Wharr;
            if (!Game.map0.chechHit_arr(this.futureBox, hits)) {
                this.ms.setXY2DBox(this.futureBox.x, this.futureBox.y);
            }
        }
        zoom(nt, zoom, ms) {
            if (nt > 1)
                nt = 1;
            if (nt < 0.5)
                nt = 0.5;
            nt = nt * 1;
            nt = Math.sin(Math.PI * (nt));
            if (nt < 0)
                nt *= -1;
            let st = 0;
            st = zoom * 0.8 * (1 - nt);
            st = zoom * 0.2 + st;
            ms.sp3d.transform.localScaleZ = st;
            st = zoom * 0.2 * (1 - nt);
            st = zoom * 1 + st;
            ms.sp3d.transform.localScaleX = st;
        }
        ai(ms) {
            if (this.starttime != 0) {
                var now = Game.executor.getWorldNow();
                var zoom = ms.tScale;
                if (now >= this.starttime + this.playtime) {
                    ms.sp3d.transform.localScaleZ = zoom;
                    ms.sp3d.transform.localScaleX = zoom;
                    ms.sp3d.transform.localScaleY = zoom;
                    this.starttime = 0;
                    this.ms = null;
                }
                else {
                    if (!this.ms) {
                        this.ms = ms;
                        this.rad = ms.face2d + Math.PI;
                        this.sp.x = ms.hbox.x;
                        this.sp.y = ms.hbox.y;
                        this.futureBox.setRq(this.sp.x, this.sp.y, ms.hbox.ww, ms.hbox.hh);
                    }
                    let nt = now - this.starttime;
                    nt = nt / this.playtime;
                    this.zoom(nt, zoom, ms);
                }
            }
        }
    }

    class GameScaleAnimator4 extends GameScaleAnimator {
        constructor() {
            super();
            this.flag = false;
        }
        move(nt, ms) {
            this.flag = !this.flag;
            ms.sp3d.transform.localPositionX = ms.sp3d.transform.localPositionX + (this.flag ? 0.1 : -0.1);
        }
        ai(ms) {
            if (this.starttime != 0) {
                var now = Game.executor.getWorldNow();
                if (now >= this.starttime + this.playtime) {
                    this.starttime = 0;
                }
                else {
                    let nt = now - this.starttime;
                    nt = nt / this.playtime;
                    this.move(nt, ms);
                }
            }
        }
    }

    class NPC_1001 extends ui.test.xiongmao1UI {
        constructor() { super(); }
    }

    class NPC_1002 extends ui.test.moguiUI {
        constructor() { super(); }
    }

    class NPC_1003 extends ui.test.huziUI {
        constructor() { super(); }
    }

    class AIType {
    }
    AIType.NOTHAS = 0;
    AIType.FLYHIT = 1;
    AIType.BULLET = 2;
    AIType.STONE = 3;
    AIType.SHITOUREN = 4;
    AIType.TREE = 5;
    AIType.RANDOM_MOVE = 6;
    AIType.MOVEHIT = 8;
    AIType.REBOUND = 9;
    AIType.JUMP_FOLLOW = 10;
    AIType.RED_LINE = 11;

    class FlyAndHitAi extends BaseAI {
        constructor(pro) {
            super(pro);
            this.status = 0;
            this.cd = 0;
            pro.sp3d.transform.localPositionY = 1;
            if (FlyAndHitAi.timdex >= 4) {
                FlyAndHitAi.timdex = 0;
            }
            this.cd = Game.executor.getWorldNow() + FlyAndHitAi.timdex * 2000;
            FlyAndHitAi.timdex++;
            pro.setSpeed(1);
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            var sys = this.pro.sysEnemy;
            if (this.pro.isIce) {
                return;
            }
            if (this.status == 0 && this.now >= this.cd) {
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.cd = this.now + 1000;
                this.status = 1;
                if (this.pro.acstr != GameAI.NormalAttack) {
                    this.pro.play(GameAI.NormalAttack);
                    this.pro.unBlocking = true;
                }
            }
            else if (this.status == 1 && this.now >= this.cd) {
                this.pro.setSpeed(sys.moveSpeed);
                this.cd = this.now + sys.enemySpeed;
                this.status = 0;
                this.pro.unBlocking = false;
                this.pro.play(GameAI.Run);
            }
            if (this.status == 1) {
                if (this.pro.normalizedTime > 0.4) {
                    this.pro.setSpeed(10);
                    this.pro.move2D(this.pro.face2d);
                }
                else {
                    this.pro.setSpeed(1);
                    this.pro.move2D(this.pro.face2d + Math.PI);
                }
            }
            else if (this.status == 0) {
                this.traceHero();
            }
        }
        traceHero() {
            if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) > GameBG.ww2) {
                let a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.pro.move2D(this.pro.face2d);
            }
        }
        hit(pro) {
            super.hit(pro);
        }
    }
    FlyAndHitAi.timdex = 0;

    class MonsterBulletAI extends GameAI {
        constructor(pro) {
            super();
            this.i = 0;
            this.pro = pro;
        }
        hit(pro) {
        }
        exeAI(pro) {
            if (!pro.move2D(pro.face2d)) {
                pro.die();
                return false;
            }
        }
        starAi() {
            this.i = 0;
        }
        stopAi() {
            this.i = 0;
        }
    }

    class BoomCircle extends ui.game.boomRectUI {
        constructor() {
            super();
        }
    }

    class BoomEffect {
        constructor() {
            this.effectId = 0;
        }
        static getEffect(pro, sys) {
            if (!sys) {
                return null;
            }
            let tag = BoomEffect.TAG + sys.boomEffect;
            Game.poolTagArr[tag] = tag;
            let effect = Laya.Pool.getItemByClass(tag, BoomEffect);
            if (sys.attackAngle > 0) {
                if (!effect.boomCircle) {
                    effect.boomCircle = new BoomCircle();
                }
                Game.bg._box.addChild(effect.boomCircle);
                effect.boomCircle.img.scale(sys.attackAngle / 64, sys.attackAngle / 64);
                effect.boomCircle.pos(pro.hbox.cx, pro.hbox.cy);
                Laya.timer.once(500, this, () => {
                    effect.recover();
                });
                if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) <= sys.attackAngle) {
                    if (pro instanceof Monster) {
                        pro.hurtValue = pro.sysEnemy.enemyAttack;
                    }
                    else if (pro instanceof MonsterBullet) {
                        pro.hurtValue = pro.enemy.sysEnemy.enemyAttack;
                    }
                    Game.hero.hbox.linkPro_.event(Game.Event_Hit, pro);
                }
            }
            if (sys.boomEffect <= 0) {
                return null;
            }
            if (!effect.pro) {
                effect.pro = pro;
                effect.effectId = sys.boomEffect;
                effect.sp3d = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bulletsEffect/" + sys.boomEffect + "/monster.lh"));
            }
            effect.sp3d.transform.localPositionX = pro.sp3d.transform.localPositionX;
            effect.sp3d.transform.localPositionZ = pro.sp3d.transform.localPositionZ;
            Game.layer3d.addChild(effect.sp3d);
            Laya.timer.once(500, this, () => {
                effect.recover();
            });
        }
        recover() {
            this.pro = null;
            this.boomCircle && this.boomCircle.removeSelf();
            this.sp3d && this.sp3d.removeSelf();
            Laya.Pool.recover(BoomEffect.TAG + this.effectId, this);
        }
    }
    BoomEffect.TAG = "BoomEffect";

    class MonsterBulletMove extends GameMove {
        constructor() {
            super(...arguments);
            this.future = new GameHitBox(2, 2);
        }
        move2d(n, pro, speed) {
            pro.setSpeed(speed);
            if (pro.speed <= 0)
                return;
            if (pro.sysBullet.bulletBlock == 1) {
                var vx = pro.speed * Math.cos(n);
                var vz = pro.speed * Math.sin(n);
                var x0 = pro.hbox.cx;
                var y0 = pro.hbox.cy;
                this.future.setVV(x0, y0, vx, vz);
                var ebh;
                if (pro.sysBullet.bulletEjection == 1) {
                    ebh = Game.map0.chechHit_arr(this.future, Game.map0.Hharr);
                    if (ebh) {
                        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                        pro.setSpeed(0);
                        if (ebh.linkPro_) {
                            pro.hurtValue = 150;
                            ebh.linkPro_.event(Game.Event_Hit, pro);
                            pro.event(Game.Event_Hit, ebh.linkPro_);
                        }
                        this.hitEffect(pro);
                        return false;
                    }
                    var hits = Game.map0.Aharr;
                    ebh = Game.map0.chechHit_arr(this.future, hits);
                    if (ebh) {
                        if (pro.gamedata.bounce <= 0) {
                            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                            pro.setSpeed(0);
                            this.hitEffect(pro);
                            return false;
                        }
                        pro.gamedata.bounce--;
                        if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, -1 * vx, vz), hits)) {
                            vx = -1 * vx;
                        }
                        else if (!Game.map0.chechHit_arr(this.future.setVV(x0, y0, vx, -1 * vz), hits)) {
                            vz = -1 * vz;
                        }
                        else {
                            this.hitEffect(pro);
                            return false;
                        }
                        n = 2 * Math.PI - Math.atan2(vz, vx);
                        pro.rotation(n);
                    }
                    pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                    return true;
                }
                else {
                    ebh = Game.map0.chechHit_arr(this.future, Game.map0.Hharr);
                    if (ebh) {
                        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                        pro.setSpeed(0);
                        if (ebh.linkPro_) {
                            pro.hurtValue = 150;
                            ebh.linkPro_.event(Game.Event_Hit, pro);
                            pro.event(Game.Event_Hit, ebh.linkPro_);
                        }
                        this.hitEffect(pro);
                        return false;
                    }
                    ebh = Game.map0.chechHit_arr(this.future, Game.map0.Aharr);
                    if (ebh) {
                        pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                        pro.setSpeed(0);
                        if (ebh.linkPro_) {
                            pro.hurtValue = 150;
                            ebh.linkPro_.event(Game.Event_Hit, pro);
                            pro.event(Game.Event_Hit, ebh.linkPro_);
                        }
                        this.hitEffect(pro);
                        return false;
                    }
                    pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                    return true;
                }
            }
            else {
                var heroBox = Game.hero.hbox;
                pro.curLen += speed;
                if (pro.curLen >= pro.moveLen) {
                    pro.curLen = pro.moveLen;
                }
                var nn = pro.curLen / pro.moveLen;
                var vx = speed * Math.cos(n);
                var vz = speed * Math.sin(n);
                var dy = Math.sin((Math.PI * nn)) * 2;
                pro.sp3d.transform.localPositionY = 0.1 + dy;
                pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
                if (heroBox.hit(heroBox, pro.hbox)) {
                    if (Game.hero) {
                        pro.hurtValue = 150;
                        Game.hero.event(Game.Event_Hit, pro);
                        pro.event(Game.Event_Hit, Game.hero.hbox.linkPro_);
                        pro.setSpeed(0);
                    }
                    return false;
                }
                if (pro.curLen == pro.moveLen) {
                    this.hitEffect(pro);
                    return false;
                }
                return true;
            }
        }
        hitEffect(pro) {
            pro.setSpeed(0);
            BoomEffect.getEffect(pro, pro.sysBullet);
        }
    }

    class BulletRotateScript extends Laya.Script3D {
        constructor() {
            super();
        }
        onAwake() {
            let box = this.owner;
            this.qiu = box.getChildAt(0);
            this.qiu.transform.localRotationEulerX = 45;
            this.ball = this.qiu.getChildAt(0);
        }
        onStart() {
        }
        onUpdate() {
            if (!Game.executor.isRun) {
                return;
            }
            this.ball.transform.localRotationEulerY += 8;
        }
        onDisable() {
        }
    }

    class MonsterBullet extends GamePro {
        constructor() {
            super(GameProType.MonstorArrow);
            this.setGameMove(new MonsterBulletMove());
            this.setGameAi(new MonsterBulletAI(this));
            this._bulletShadow = new ui.test.BulletShadowUI();
            Game.footLayer.addChild(this._bulletShadow);
            this.setShadowSize(19);
        }
        setBubble(sb) {
            if (sb == null) {
                console.error('这个子弹有问题');
                return;
            }
            if (sb.bulletMode == 10004 || sb.bulletMode == 10005) {
                this._bulletShadow && this._bulletShadow.removeSelf();
            }
            else {
                Game.footLayer.addChild(this._bulletShadow);
            }
            this.sysBullet = sb;
            if (!this.sp3d) {
                var bullet;
                bullet = (Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/bullets/" + sb.bulletMode + "/monster.lh")));
                console.log("子弹id", this.sysBullet.id, this.sysBullet.bulletMode);
                if (this.sysBullet.id != 10 && this.sysBullet.id != 11 && this.sysBullet.id != 20) {
                    bullet.getChildAt(0).transform.localRotationEulerY = -bullet.transform.localRotationEulerY;
                    bullet.addComponent(BulletRotateScript);
                }
                this.setSp3d(bullet);
            }
            this.gamedata.bounce = sb.ejectionNum;
        }
        static getBullet(sb) {
            let tag = MonsterBullet.TAG + sb.bulletMode;
            Game.poolTagArr[tag] = tag;
            let bullet = Laya.Pool.getItemByClass(tag, MonsterBullet);
            bullet.isDie = false;
            bullet.setBubble(sb);
            return bullet;
        }
        die() {
            if (this.isDie) {
                return;
            }
            this.isDie = true;
            this.curLen = null;
            this.moveLen = null;
            this.stopAi();
            this._bulletShadow && this._bulletShadow.removeSelf();
            this.sp3d.transform.localPositionY = -500;
            this.sp3d.transform.localPositionZ = -500;
            Laya.Pool.recover(MonsterBullet.TAG + this.sysBullet.bulletMode, this);
            MemoryManager.ins.app(this.sp3d.url);
        }
    }
    MonsterBullet.TAG = "MonsterBullet_";
    MonsterBullet.count = 0;

    class MonsterShooting {
        constructor() {
            this.scd = 0;
            this.shootCd = 1200;
            this.st = 0;
            this.now = 0;
            this.at = 0;
            this.future = new GameHitBox(2, 2);
        }
        short_arrow(r_, pro, proType_, range = 0) {
            var bo = MonsterBullet.getBullet(this._sysBullet);
            bo.curLen = null;
            bo.moveLen = null;
            bo.enemy = pro;
            bo.sp3d.transform.localPositionY = 0.1;
            bo.setXY2D(pro.pos2.x, pro.pos2.z);
            Game.layer3d.addChild(bo.sp3d);
            bo.setSpeed(this._sysBullet.bulletSpeed);
            Game.bloodLayer.graphics.clear();
            bo.rotation(r_);
            bo.curLen = 0;
            bo.hurtValue = pro.hurtValue;
            bo.moveLen = range + Math.sqrt((bo.hbox.cy - Game.hero.hbox.cy) * (bo.hbox.cy - Game.hero.hbox.cy) + (bo.hbox.cx - Game.hero.hbox.cx) * (bo.hbox.cx - Game.hero.hbox.cx));
            bo.startAi();
        }
        get attackOk() {
            this.now = Game.executor.getWorldNow();
            return this.now >= this.st;
        }
        starAttack(pro, acstr) {
            this.pro = pro;
            if (this.attackOk) {
                this.scd = 0;
                pro.play(acstr);
                if (this.at > 0) {
                    Laya.stage.timer.frameLoop(this.at, this, this.ac0);
                }
                else {
                    this.ac0();
                }
                return true;
            }
            return false;
        }
        cancelAttack() {
            Laya.stage.timer.clear(this, this.ac0);
            this.scd = 0;
        }
        ac0() {
            if (this.pro.gamedata.hp <= 0) {
                return;
            }
            if (this.pro.normalizedTime >= this.at) {
                if (this.pro.normalizedTime >= 1) {
                    Laya.stage.timer.clear(this, this.ac0);
                    this.pro.play(GameAI.Idle);
                }
                if (this.scd == 0) {
                    this.scd = 1;
                    this.pro.event(Game.Event_Short, null);
                    this.st = Game.executor.getWorldNow() + this.shootCd;
                }
            }
        }
        checkBallistic(n, pro, ero) {
            var vx = GameBG.mw2 * Math.cos(n);
            var vz = GameBG.mw2 * Math.sin(n);
            var x0 = pro.hbox.cx;
            var y0 = pro.hbox.cy;
            var ebh;
            for (let i = 0; i < 6000; i++) {
                ebh = null;
                this.future.setVV(x0, y0, vx, vz);
                if (ero.hbox.hit(ero.hbox, this.future)) {
                    return ero;
                }
                var hits = Game.map0.Aharr;
                ebh = Game.map0.chechHit_arr(this.future, hits);
                if (ebh) {
                    return null;
                }
                x0 += vx;
                y0 += vz;
            }
            return null;
        }
    }

    class FlowerAI extends BaseAI {
        constructor(pro) {
            super(pro);
            this.shooting = new MonsterShooting();
            this.nextTime = 0;
            this.status = 0;
            this.shooting.at = 0.4;
            this.pro.setSpeed(this.sysEnemy.moveSpeed);
            this.pro.on(Game.Event_Short, this, this.shootAc);
            this.nextTime = Game.executor.getWorldNow() + Math.floor(Math.random() * 2000);
        }
        shootAc() {
            let curBullet = this.shooting._sysBullet;
            if (!curBullet) {
                return;
            }
            let minNum = curBullet.mixNum;
            let maxNum = curBullet.maxNum;
            let bulletAngle = curBullet.bulletAngle;
            this.shooting.shootCd = this.sysEnemy.enemySpeed;
            if (curBullet.bulletType == 1) {
                if (bulletAngle != 360) {
                    if (minNum % 2 == 0) {
                        let angle = curBullet.bulletAngle;
                        angle = angle / (minNum - 1);
                        let hudu = angle / 180 * Math.PI * 0.5;
                        let count = Math.floor(minNum / 2);
                        for (let k = 0; k < curBullet.bulletNum; k++) {
                            setTimeout(() => {
                                for (var i = 1; i <= count; i++) {
                                    this.shooting.short_arrow(this.pro.face3d + hudu * (2 * i - 1), this.pro, GameProType.MonstorArrow);
                                    this.shooting.short_arrow(this.pro.face3d - hudu * (2 * i - 1), this.pro, GameProType.MonstorArrow);
                                }
                            }, k * 500);
                        }
                    }
                    else {
                        let angle = curBullet.bulletAngle;
                        angle = angle / minNum;
                        let hudu = angle / 180 * Math.PI;
                        let count = Math.floor(minNum / 2);
                        for (let k = 0; k < curBullet.bulletNum; k++) {
                            setTimeout(() => {
                                this.shooting.short_arrow(this.pro.face3d, this.pro, GameProType.MonstorArrow);
                                for (var i = 1; i <= count; i++) {
                                    this.shooting.short_arrow(this.pro.face3d + hudu * i, this.pro, GameProType.MonstorArrow);
                                    this.shooting.short_arrow(this.pro.face3d - hudu * i, this.pro, GameProType.MonstorArrow);
                                }
                            }, k * 500);
                        }
                    }
                }
                else if (bulletAngle == 360) {
                    for (let k = 0; k < curBullet.bulletNum; k++) {
                        setTimeout(() => {
                            for (var i = 1; i <= minNum; i++) {
                                this.shooting.short_arrow(2 * Math.PI / minNum * i, this.pro, GameProType.MonstorArrow);
                            }
                        }, k * 500);
                    }
                }
            }
            else if (curBullet.bulletType == 2) {
                this.shooting.shootCd = this.sysEnemy.enemySpeed;
                let angle = curBullet.bulletAngle;
                angle = angle / 2;
                let bulletNum = minNum + Math.ceil(Math.random() * (maxNum - minNum));
                for (let i = 0; i < bulletNum; i++) {
                    setTimeout(() => {
                        let flag = i % 2 == 0 ? 1 : -1;
                        let tmp = (angle * Math.random()) / 180 * Math.PI * flag;
                        this.shooting.short_arrow(this.pro.face3d + tmp, this.pro, GameProType.MonstorArrow, (Math.random() > 0.5 ? 1 : -1) * 200 * Math.random());
                    }, Math.random() * 1000 + 200);
                }
            }
        }
        startAttack() {
            if (this.pro.gamedata.hp <= 0) {
                return;
            }
            this.shooting._sysBullet = null;
            if (this.normalSb) {
                if (this.normalSb.bulletType == AttackType.NORMAL_BULLET || this.normalSb.bulletType == AttackType.RANDOM_BULLET) {
                    this.shooting._sysBullet = this.normalSb;
                }
            }
            if (!this.shooting._sysBullet) {
                if (this.skillISbs.length > 0) {
                    let rand = Math.floor(this.skillISbs.length * Math.random());
                    let skillBullet = this.skillISbs[rand];
                    if (skillBullet.bulletType == AttackType.NORMAL_BULLET || skillBullet.bulletType == AttackType.RANDOM_BULLET) {
                        this.shooting._sysBullet = skillBullet;
                    }
                }
            }
            if (this.shooting._sysBullet) {
                if (this.now >= this.nextTime) {
                    this.faceToHero();
                    this.shooting.starAttack(this.pro, GameAI.NormalAttack);
                }
            }
            if (this.now >= this.nextTime) {
                this.faceToHero();
                this.nextTime = this.now + this.sysEnemy.enemySpeed;
            }
        }
        faceToHero() {
            var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.onExe();
            return false;
        }
        onExe() {
            this.checkHeroCollision();
            if (this.pro.isIce) {
                return;
            }
            if (this.status == 0 && this.now >= this.nextTime) {
                this.pro.play(GameAI.Idle);
                this.nextTime = this.now + this.sysEnemy.enemySpeed;
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.status = 1;
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.startAttack();
                this.status = 0;
                this.nextTime = this.now + this.shooting.shootCd;
            }
            if (this.status == 1) {
                if (this.sysEnemy.moveType == MoveType.FIXED) {
                    return;
                }
                this.pro.move2D(this.pro.face2d);
                this.pro.play(GameAI.Run);
            }
        }
        hit(pro) {
            super.hit(pro);
        }
        die() {
            super.die();
            this.shooting && this.shooting.cancelAttack();
        }
    }

    class CallSkill extends BaseSkill {
        constructor(sys) {
            super(sys);
            this.callId = 0;
            this.callCd = 0;
            let arr = this.sysBullet.callInfo.split(',');
            this.callId = Number(arr[0]);
            this.callCd = Number(arr[2]);
            this.cd = Game.executor.getWorldNow() + this.callCd;
        }
        exeSkill(now, pro) {
            if (now >= this.cd) {
                pro.play(GameAI.NormalAttack);
                let monster = Monster.getMonster(this.callId, pro.hbox.x + GameBG.ww, pro.hbox.y - GameBG.ww);
                let zhaohuan = new ui.test.zhaohuanUI();
                Game.bloodLayer.addChild(zhaohuan);
                zhaohuan.pos(pro.hbox.cx, pro.hbox.cy);
                setTimeout(() => {
                    zhaohuan.removeSelf();
                }, 1500);
                this.cd = now + this.callCd;
                return true;
            }
            return false;
        }
    }

    class WindSkill extends BaseSkill {
        constructor(sys) {
            super(sys);
            if (sys) {
                this.sysBullet.bulletCd = 4000;
            }
        }
        exeSkill(now, pro) {
            if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) > GameBG.ww * 6) {
                if (now >= this.cd) {
                    let a = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
                    pro.rotation(a);
                    pro.play(GameAI.SkillStart);
                    pro.curLen = 0;
                    pro.moveLen = GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox);
                    this.cd = now + this.sysBullet.bulletCd;
                    return true;
                }
            }
            return false;
        }
    }

    class StoneAI extends FlowerAI {
        constructor(pro) {
            super(pro);
            this.cd = 0;
            this.skillcd = 0;
            this.windCd = 0;
            this.callSkill = new CallSkill(this.skillISbs[0]);
            if (this.skillISbs.length > 1) {
                this.windSkill = new WindSkill(this.skillISbs[1]);
            }
            this.cd = this.sysEnemy.enemySpeed;
            this.nextTime = Game.executor.getWorldNow() + this.cd;
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            if (pro.isDie) {
                return;
            }
            this.setShader();
            if (this.pro.isIce) {
                return;
            }
            this.now = Game.executor.getWorldNow();
            if (this.now >= this.nextTime) {
                this.onExe2(this.now);
                this.nextTime = this.now + this.cd;
            }
            if (this.pro.moveLen > 0) {
                this.pro.setSpeed(8);
                if (this.pro.move2D(this.pro.face2d)) {
                    this.pro.curLen = this.pro.moveLen = 0;
                    this.pro.setSpeed(this.sysEnemy.moveSpeed);
                    this.pro.play(GameAI.SkillEnd);
                }
            }
            return false;
        }
        onExe2(now) {
            if (this.callSkill) {
                let isCall = this.callSkill.exeSkill(now, this.pro);
                if (!isCall) {
                    if (this.windSkill) {
                        let isWind = this.windSkill.exeSkill(now, this.pro);
                        if (!isWind) {
                            this.normalAttack();
                        }
                    }
                    else {
                        this.normalAttack();
                    }
                }
            }
        }
        normalAttack() {
            if (this.pro.isDie) {
                return;
            }
            if (this.status == 0 && this.now >= this.nextTime) {
                this.pro.play(GameAI.Idle);
                this.nextTime = this.now + this.sysEnemy.enemySpeed;
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.status = 1;
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.startAttack();
                this.status = 0;
                this.nextTime = this.now + this.shooting.shootCd;
            }
        }
    }

    class TreeAI extends FlowerAI {
        constructor(pro) {
            super(pro);
            this.pro.rotation(Math.PI * 0.5);
            if (TreeAI.mindex > 4) {
                TreeAI.mindex = 0;
            }
            TreeAI.mindex++;
            this.nextTime = Game.executor.getWorldNow() + this.sysEnemy.enemySpeed * TreeAI.mindex;
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            return false;
        }
        onExe() {
            if (this.pro.isDie) {
                return;
            }
            this.checkHeroCollision();
            this.jump();
        }
        jump() {
            if (this.status == 0 && this.now >= this.nextTime) {
                this.onJump();
                this.status = 1;
            }
            if (this.status == 1) {
                let isTo = this.pro.move2D(this.pro.face2d);
                if (isTo) {
                    if (this.status == 1) {
                        if (this.skillISbs.length > 0) {
                            let sys = this.skillISbs[Math.floor(this.skillISbs.length * Math.random())];
                            if (sys && sys.bulletType == AttackType.AOE) {
                                if (this.now >= this.nextTime) {
                                    this.onAoe(sys);
                                    this.nextTime = this.now + this.sysEnemy.enemySpeed * 2;
                                    this.status = 0;
                                }
                            }
                            else {
                                if (this.now >= this.nextTime) {
                                    this.startAttack();
                                    this.shootAc();
                                    this.pro.play(GameAI.NormalAttack);
                                    this.nextTime = this.now + this.shooting.shootCd * 2;
                                    this.status = 0;
                                }
                            }
                        }
                        else {
                            if (this.now >= this.nextTime) {
                                this.startAttack();
                                this.shootAc();
                                this.pro.play(GameAI.NormalAttack);
                                this.nextTime = this.now + this.shooting.shootCd * 2;
                                this.status = 0;
                            }
                        }
                    }
                    this.status = 0;
                }
            }
        }
        startAttack() {
            if (this.pro.isDie) {
                return;
            }
            this.shooting._sysBullet = null;
            if (this.normalSb) {
                if (this.normalSb.bulletType == AttackType.NORMAL_BULLET || this.normalSb.bulletType == AttackType.RANDOM_BULLET) {
                    this.shooting._sysBullet = this.normalSb;
                }
            }
            if (!this.shooting._sysBullet) {
                if (this.skillISbs.length > 0) {
                    let rand = Math.floor(this.skillISbs.length * Math.random());
                    let skillBullet = this.skillISbs[rand];
                    if (skillBullet.bulletType == AttackType.NORMAL_BULLET || skillBullet.bulletType == AttackType.RANDOM_BULLET) {
                        this.shooting._sysBullet = skillBullet;
                    }
                }
            }
        }
        onAoe(bullet) {
            BoomEffect.getEffect(this.pro, bullet);
        }
        onJump() {
            this.pro.sp3d.transform.localPositionY = 0;
            let toArr = Game.getRandPos(this.pro);
            if (toArr.length == 2) {
                let toX = toArr[0] * GameBG.ww;
                let toY = toArr[1] * GameBG.ww;
                if (toX && toY) {
                    this.pro.curLen = 0;
                    this.pro.moveLen = Math.sqrt((this.pro.hbox.y - toY) * (this.pro.hbox.y - toY) + (this.pro.hbox.x - toX) * (this.pro.hbox.x - toX));
                    this.pro.setSpeed(Math.ceil(this.pro.moveLen / GameBG.ww));
                    var xx = toX - this.pro.hbox.x;
                    var yy = this.pro.hbox.y - toY;
                    this.pro.rotation(Math.atan2(yy, xx));
                }
            }
        }
    }
    TreeAI.mindex = 0;

    class MoveAndHitAi extends BaseAI {
        constructor(pro) {
            super(pro);
            this.status = 0;
            this.cd = 0;
            if (MoveAndHitAi.timdex >= 4) {
                MoveAndHitAi.timdex = 0;
            }
            this.cd = Game.executor.getWorldNow() + MoveAndHitAi.timdex * pro.sysEnemy.enemySpeed;
            MoveAndHitAi.timdex++;
            var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
            this.pro.rotation(a);
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            if (this.pro.isIce) {
                return;
            }
            var sys = this.pro.sysEnemy;
            if (this.status == 0 && this.now >= this.cd) {
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.pro.setSpeed(sys.moveSpeed);
                this.cd = this.now + sys.enemySpeed;
                this.status = 1;
                this.pro.play(GameAI.Run);
            }
            else if (this.status == 1 && this.now >= this.cd) {
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.cd = this.now + sys.enemySpeed;
                this.status = 0;
                if (this.pro.acstr != GameAI.NormalAttack) {
                    this.pro.play(GameAI.NormalAttack);
                }
            }
            if (this.status == 0) {
                if (this.pro.acstr == GameAI.NormalAttack) {
                    if (this.pro.normalizedTime > 0.4 && this.pro.normalizedTime < 1) {
                        this.pro.setSpeed(8);
                        this.pro.move2D(this.pro.face2d);
                    }
                    else if (this.pro.normalizedTime <= 0.4) {
                        this.pro.setSpeed(sys.moveSpeed);
                        this.pro.move2D(this.pro.face2d + Math.PI);
                    }
                }
                else {
                    this.pro.play(GameAI.Run);
                    this.pro.setSpeed(sys.moveSpeed);
                    this.pro.move2D(this.pro.face2d);
                }
            }
            else {
                this.pro.play(GameAI.Run);
                if (GameHitBox.faceToLenth(this.pro.hbox, Game.hero.hbox) > GameBG.ww2) {
                    let a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                    this.pro.rotation(a);
                    this.pro.move2D(this.pro.face2d);
                }
            }
        }
        hit(pro) {
            super.hit(pro);
        }
    }
    MoveAndHitAi.timdex = 0;

    class ReboundAI extends BaseAI {
        constructor(pro) {
            super(pro);
            this.cd = 0;
            this.status = 0;
            this.f = [];
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            super.exeAI(pro);
            this.checkHeroCollision();
            if (this.pro.isIce) {
                return;
            }
            if (this.status == 0) {
                this.status = 1;
                this.pro.rotation(Math.PI / 180 * 360 * Math.random());
            }
            var bm = this.pro.getGameMove();
            this.pro.move2D(this.pro.face2d);
            if (bm && bm.rotation != this.pro.face2d) {
                this.pro.rotation(2 * Math.PI - bm.rotation);
            }
            if (this.pro.acstr != GameAI.Run) {
                this.pro.play(GameAI.Run);
            }
            return false;
        }
    }

    class AOESkill extends BaseSkill {
        constructor(sys) {
            super(sys);
            this.sysBullet.bulletCd = 3000;
        }
        exeSkill(now, pro) {
            if (GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox) > GameBG.ww * 6) {
                if (now >= this.cd) {
                    pro.sp3d.transform.localPositionY = 0;
                    pro.curLen = 0;
                    pro.moveLen = GameHitBox.faceToLenth(pro.hbox, Game.hero.hbox);
                    pro.setSpeed(Math.ceil(pro.moveLen / GameBG.ww));
                    let a = GameHitBox.faceTo3D(pro.hbox, Game.hero.hbox);
                    pro.rotation(a);
                    this.cd = now + this.sysBullet.bulletCd;
                    return true;
                }
            }
            return false;
        }
        showEff(pro) {
            pro.curLen = pro.moveLen = 0;
            BoomEffect.getEffect(pro, this.sysBullet);
        }
    }

    class JumpFollowAI extends FlowerAI {
        constructor(pro) {
            super(pro);
            this.cd = 0;
            this.skillcd = 0;
            this.windCd = 0;
            this.callSkill = new CallSkill(this.skillISbs[0]);
            this.aoeSkill = new AOESkill(this.skillISbs[1]);
            this.cd = this.sysEnemy.enemySpeed;
            this.nextTime = Game.executor.getWorldNow() + this.cd;
        }
        exeAI(pro) {
            if (!this.run_)
                return;
            if (this.pro.isIce) {
                return;
            }
            this.setShader();
            this.now = Game.executor.getWorldNow();
            if (this.now >= this.nextTime) {
                this.onExe2(this.now);
                this.nextTime = this.now + this.cd;
            }
            if (this.pro.moveLen > 0) {
                if (this.pro.move2D(this.pro.face2d)) {
                    this.aoeSkill.showEff(this.pro);
                }
            }
            return false;
        }
        onExe2(now) {
            let isCall = this.callSkill.exeSkill(now, this.pro);
            if (!isCall) {
                let isWind = this.aoeSkill.exeSkill(now, this.pro);
                if (!isWind) {
                    this.normalAttack();
                }
            }
        }
        normalAttack() {
            if (this.status == 0 && this.now >= this.nextTime) {
                this.pro.play(GameAI.Idle);
                this.nextTime = this.now + this.sysEnemy.enemySpeed;
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.status = 1;
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.startAttack();
                this.status = 0;
                this.nextTime = this.now + this.shooting.shootCd;
            }
        }
        onJump() {
        }
    }

    class GameInfrared {
        constructor(pro_, nn_ = 1) {
            this.vv = new MaoLineData(0, 0, 0, 1);
            this.future = new GameHitBox(2, 2);
            this.redLines = [];
            this.nn = 1;
            this.show_ = false;
            this.nn = nn_;
            this.pro = pro_;
            for (let i = 0; i < this.nn; i++) {
                let redLine = new Laya.Image();
                redLine.skin = "bg/hongtiao.png";
                redLine.anchorX = 0.5;
                redLine.anchorY = 0.5;
                redLine.alpha = 0.8;
                this.redLines.push(redLine);
            }
        }
        get show() {
            return this.show_;
        }
        set show(b) {
            this.show_ = b;
            this.show_ = false;
            if (this.show_) {
                for (let i = 0; i < this.redLines.length; i++) {
                    var e = this.redLines[i];
                    Game.frontLayer.addChild(e);
                }
            }
            else {
                for (let i = 0; i < this.redLines.length; i++) {
                    var e = this.redLines[i];
                    e.removeSelf();
                }
            }
        }
        moveline(n, x0, y0, clearg) {
            var vv = this.vv;
            var hits = Game.map0.Aharr;
            var vx = GameBG.ww * 20 * Math.cos(n);
            var vz = GameBG.ww * 20 * Math.sin(n);
            this.future.setVV(x0, y0, vx, vz);
            var all = Game.map0.chechHit_arr_all(this.future, hits);
            if (all) {
                vv.reset(x0, y0, x0 + vx, y0 + vz);
                var rs = Game.map0.getPointAndLine(vv, all);
                if (rs) {
                    var p = rs[0];
                    let l = rs[1];
                    vv.reset(vv.x0, vv.y0, p.x, p.y);
                    var l1 = new MaoLineData(vv.x0, vv.y0, p.x, p.y);
                    l = vv.rebound(l);
                    if (l) {
                        return [l1, l];
                    }
                    return [l1, null];
                }
            }
            return null;
        }
        drawMoveline() {
            if (!this.show_) {
                return;
            }
            var hero = this.pro;
            let larr = this.moveline(hero.face2d, hero.hbox.cx, hero.hbox.cy, true);
            for (let i = 0; i < this.nn; i++) {
                if (!larr)
                    break;
                let l0 = larr[0];
                let l1 = larr[1];
                var cp = l0.getCenter();
                var redLine = this.redLines[i];
                Game.frontLayer.addChild(redLine);
                redLine.x = cp.x;
                redLine.y = cp.y;
                redLine.height = l0.getlen();
                redLine.rotation = l0.atan2() / Math.PI * 180 + 270;
                if (l1) {
                    larr = this.moveline(l1.atan2(), l1.x0, l1.y0, false);
                }
            }
        }
    }

    class ArcherAI extends FlowerAI {
        constructor(pro) {
            super(pro);
            if (!this.gi) {
                var i = this.normalSb.ejectionNum + 1;
                if (i < 1)
                    i = 1;
                this.gi = new GameInfrared(pro, i);
                this.gi.show = false;
            }
        }
        faceToHero() {
            return;
        }
        onExe() {
            if (this.pro.gamedata.hp <= 0) {
                return;
            }
            this.checkHeroCollision();
            if (this.status == 0 && this.now >= this.nextTime) {
                this.pro.rotation((Math.PI / 4) * Math.ceil(Math.random() * 8));
                this.nextTime = this.now + 1500;
                this.status = 1;
                this.pro.play(GameAI.Run);
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.nextTime = this.now + 1500;
                this.status = 2;
                this.pro.play(GameAI.Idle);
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.gi.show = true;
                this.gi.drawMoveline();
            }
            else if (this.status == 2 && this.now >= this.nextTime) {
                this.gi.show = false;
                this.nextTime = this.now + 500;
                this.status = 3;
            }
            else if (this.status == 3 && this.now >= this.nextTime) {
                this.startAttack();
                this.nextTime = this.now + 1000;
                this.status = 0;
            }
            if (this.status == 1) {
                this.pro.move2D(this.pro.face2d);
            }
            else if (this.status == 2) {
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.gi.show = true;
                this.gi.drawMoveline();
            }
        }
        hit(pro) {
            super.hit(pro);
            if (this.pro.gamedata.hp <= 0) {
                this.gi.show = false;
            }
        }
    }

    class FlyGameMove extends GameMove {
        move2d(n, pro, speed) {
            if (pro.gamedata.hp <= 0) {
                return;
            }
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            var hits = Game.map0.Flyharr;
            if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                if (vz != 0 && Game.map0.chechHitArrs(pro, vx, 0, hits)) {
                    vx = 0;
                }
                if (vx != 0 && Game.map0.chechHitArrs(pro, 0, vz, hits)) {
                    vz = 0;
                }
                if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                    return false;
                }
            }
            if (!this.Blocking(pro, vx, vz)) {
                return false;
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    class FixedGameMove extends GameMove {
        move2d(n, pro, speed) {
            pro.setSpeed(0);
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    class JumpMove extends GameMove {
        constructor() { super(); }
        move2d(n, monster, speed) {
            this.pro = monster;
            monster.curLen += speed;
            if (monster.curLen >= monster.moveLen) {
                monster.curLen = monster.moveLen;
                return true;
            }
            var nn = monster.curLen / monster.moveLen;
            var vx = speed * Math.cos(n);
            var vz = speed * Math.sin(n);
            var dy = Math.sin((Math.PI * nn)) * 2;
            monster.sp3d.transform.localPositionY = 0.1 + dy * 2;
            monster.setXY2D(monster.pos2.x + vx, monster.pos2.z + vz);
            if (monster.hbox.x == null || monster.hbox.y == null) {
                console.log("跳出问题了");
            }
            return false;
        }
    }

    class BackMove extends GameMove {
        constructor() {
            super(...arguments);
            this.future = new GameHitBox(1, 1);
            this.rotation = Math.PI * -1;
        }
        move2d(n, pro, speed) {
            if (pro.gamedata.hp <= 0) {
                return;
            }
            this.rotation = n;
            var vx = Math.cos(n) * speed;
            var vz = Math.sin(n) * speed;
            var hits = Game.map0.Wharr;
            this.future.setXY(pro.hbox.x + vx, pro.hbox.y + vz);
            if (Game.map0.chechHit_arr(this.future, hits)) {
                this.future.setXY(pro.hbox.x + vx, pro.hbox.y);
                var ex = Game.map0.chechHit_arr(this.future, hits);
                this.future.setXY(pro.hbox.x, pro.hbox.y + vz);
                var ez = Game.map0.chechHit_arr(this.future, hits);
                if (ex != null) {
                    vx = vx * -1;
                }
                else if (ez != null) {
                    vz = vz * -1;
                }
                this.future.setXY(pro.hbox.x + vx, pro.hbox.y + vz);
                if (Game.map0.chechHit_arr(this.future, hits)) {
                    vx = vx * -1;
                    vz = vz * -1;
                }
                this.rotation = Math.atan2(vz, vx);
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    class BasePlatform {
    }

    class LoginHttp extends BaseHttp {
        constructor(hand) {
            super(hand);
        }
        static create(hand) {
            return new LoginHttp(hand);
        }
        send() {
            let str = "gamex3/login";
            if (App.platformId == PlatformID.H5) {
                str = "gamex2/login";
            }
            super.send(App.serverIP + str, "scode=" + App.platformId + "&jscode=" + LoginHttp.FRONT + this.jsCode, "post", "text");
        }
        onSuccess(data) {
            Session.SKEY = data;
            super.onSuccess(data);
            console.log("login success", data);
        }
        checkLogin() {
            let BP = Laya.ClassUtils.getRegClass("p" + App.platformId);
            new BP().login((code) => {
                this.jsCode = code;
                this.send();
            });
        }
    }
    LoginHttp.FRONT = "";

    class ReceiverHttp extends BaseHttp {
        constructor(hand) {
            super(hand);
        }
        static create(hand) {
            return new ReceiverHttp(hand);
        }
        send() {
            super.send(App.serverIP + "gamex3/gamedata", "skey=" + Session.SKEY, "post", "text");
        }
        onSuccess(data) {
            Session.parseData(data);
            super.onSuccess(data);
            console.log("receive data", data);
        }
    }

    class HomeLoading extends ui.game.homePageUI {
        constructor() {
            super();
            this.isInit = false;
            this.name = "HomeLoading";
            this.mouseEnabled = true;
            this.rect = new Laya.Rectangle(0, 0, 1, this.barImg.height);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            this.loadingBox.visible = false;
            this.startBtn.visible = true;
            this.idTxt.visible = (App.platformId == PlatformID.TEST || App.platformId == PlatformID.H5);
            Game.cookie.getCookie(CookieKey.USER_ID, (res) => {
                if (res == null) ;
                else {
                    App.soundManager.setMusicVolume(res.state);
                    this.idTxt.text = res.userId;
                }
            });
        }
        load() {
            this.loadingBox.visible = true;
            this.startBtn.visible = false;
            this.barImg.scrollRect = this.rect;
            this.sliderImg.x = this.rect.width;
            this.txt.text = "0%";
            Laya.loader.load([
                { url: "res/atlas/main.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/zhaohuan.atlas", type: Laya.Loader.ATLAS },
                { url: "res/atlas/guide.atlas", type: Laya.Loader.ATLAS }
            ], new Laya.Handler(this, this.onHandler), new Laya.Handler(this, this.onProgress));
        }
        onHandler() {
            console.log("加载完成");
            new LoginHttp(new Laya.Handler(this, this.onSuccess)).checkLogin();
        }
        onSuccess(data) {
            console.log("登录成功");
            ReceiverHttp.create(new Laya.Handler(this, this.onReceive)).send();
        }
        onReceive(data) {
            if (this.isInit) {
                return;
            }
            console.log("获取玩家数据成功" + data);
            this.isInit = true;
            new GameMain();
            setTimeout(() => {
                this.removeSelf();
            }, 300);
        }
        onProgress(value) {
            this.rect.width = this.barImg.width * value;
            this.barImg.scrollRect = this.rect;
            this.sliderImg.x = this.rect.width;
            value = value * 100;
            this.txt.text = "" + value.toFixed(0) + "%";
        }
    }

    class TestPlatform extends BasePlatform {
        checkUpdate() {
        }
        login(callback) {
            callback && callback("shfdsaomghjgai123fdafda456");
        }
        getUserInfo(callback) {
            this.cb = callback;
            let uu = Laya.stage.getChildByName("HomeLoading");
            uu.on(Laya.Event.CLICK, this, this.clickFun);
        }
        clickFun(e) {
            if (e.target instanceof HomeLoading) {
                let uu = Laya.stage.getChildByName("HomeLoading");
                LoginHttp.FRONT = "test" + uu.idTxt.text;
                Game.cookie.setCookie(CookieKey.USER_ID, { "userId": uu.idTxt.text });
                this.cb && this.cb();
            }
        }
        onShare(callback) {
            callback && callback();
            Game.hero.reborn();
        }
    }

    class WXPlatform extends BasePlatform {
        constructor() {
            super();
            this.tag = 0;
        }
        checkUpdate() {
            Laya.Browser.window.wx.setKeepScreenOn({
                keepScreenOn: true
            });
            if (Laya.Browser.window.wx.getUpdateManager) {
                console.log("基础库 1.9.90 开始支持，低版本需做兼容处理");
                const updateManager = Laya.Browser.window.wx.getUpdateManager();
                updateManager.onCheckForUpdate(function (result) {
                    if (result.hasUpdate) {
                        console.log("有新版本");
                        updateManager.onUpdateReady(function () {
                            console.log("新的版本已经下载好");
                            Laya.Browser.window.wx.showModal({
                                title: '更新提示',
                                content: '新版本已经下载，是否重启？',
                                success: function (result) {
                                    if (result.confirm) {
                                        updateManager.applyUpdate();
                                    }
                                }
                            });
                        });
                        updateManager.onUpdateFailed(function () {
                            console.log("新的版本下载失败");
                            Laya.Browser.window.wx.showModal({
                                title: '已经有新版本了',
                                content: '新版本已经上线啦，请您删除当前小游戏，重新搜索打开'
                            });
                        });
                    }
                    else {
                        console.log("没有新版本");
                    }
                });
            }
            else {
                console.log("有更新肯定要用户使用新版本，对不支持的低版本客户端提示");
                Laya.Browser.window.wx.showModal({
                    title: '温馨提示',
                    content: '当前微信版本过低，无法使用该应用，请升级到最新微信版本后重试。'
                });
            }
            Laya.Browser.window.wx.onMemoryWarning((res) => {
                console.error("内存不足了", res);
                Laya.stage.event(GameEvent.MEMORY_WARNING);
            });
        }
        login(callback) {
            Laya.Browser.window.wx.login({
                success: (res) => {
                    if (res.code) {
                        callback && callback(res.code);
                    }
                }
            });
        }
        getUserInfo(callback) {
            if (this.userBtn) {
                return;
            }
            this.userBtn = Laya.Browser.window.wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    width: Laya.Browser.window.wx.getSystemInfoSync().windowWidth,
                    height: Laya.Browser.window.wx.getSystemInfoSync().windowHeight
                }
            });
            this.userBtn.onTap((resButton) => {
                if (resButton.errMsg == "getUserInfo:ok") {
                    Game.userHeadUrl = resButton.userInfo.avatarUrl;
                    Game.userName = resButton.userInfo.nickName;
                    this.filterEmoji();
                    this.userBtn.destroy();
                    callback && callback();
                }
                else {
                    console.log("授权失败");
                }
            });
        }
        wxAuthSetting() {
            console.log("wx.getSetting");
            Laya.Browser.window.wx.getSetting({
                success: (res) => {
                    console.log(res.authSetting);
                    var authSetting = res.authSetting;
                    if (authSetting["scope.userInfo"]) {
                        console.log("已经授权");
                    }
                    else {
                        console.log("未授权");
                    }
                }
            });
        }
        filterEmoji() {
            var strArr = Game.userName.split(""), result = "", totalLen = 0;
            for (var idx = 0; idx < strArr.length; idx++) {
                if (totalLen >= 16)
                    break;
                var val = strArr[idx];
                if (/[a-zA-Z]/.test(val)) {
                    totalLen = 1 + (+totalLen);
                    result += val;
                }
                else if (/[\u4e00-\u9fa5]/.test(val)) {
                    totalLen = 2 + (+totalLen);
                    result += val;
                }
                else if (/[\ud800-\udfff]/.test(val)) {
                    if (/[\ud800-\udfff]/.test(strArr[idx + 1])) {
                        idx++;
                    }
                    result += "?";
                }
            }
            Game.userName = result;
            console.log("过滤之后", Game.userName);
        }
        onShare(callback) {
            Laya.Browser.window.wx.shareAppMessage({
                title: "来吧，pk一下吧！",
                imageUrl: "https://img.kuwan511.com/arrowLegend/share.jpg",
                destWidth: 500,
                destHeight: 400
            });
            Laya.Browser.window.wx.onShow(res => {
                console.log("onShow", this.tag);
                if (this.tag == 1000) {
                    Game.hero.reborn();
                    Laya.Browser.window.wx.offShow();
                    Laya.Browser.window.wx.offHide();
                    this.tag = -1;
                }
            });
            Laya.Browser.window.wx.onHide(res => {
                this.tag = 1000;
                console.log("onHide");
            });
        }
    }

    class PlayerBuff {
        constructor() {
            this.skillCD = 0;
            this.chixuCD = 0;
            this.hurtValue = 0;
            this.nextTime = 0;
            this.startTime = 0;
            this.curTimes = 0;
        }
        exe(now) {
        }
    }

    class FireBuff extends PlayerBuff {
        constructor(id) {
            super();
            this.skill = App.tableManager.getDataByNameAndId(SysSkill.NAME, id);
            this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
        }
        exe(now) {
            if (this.buff.times > 0 && this.curTimes > this.buff.times) {
                console.log("移除火焰buff");
                Game.buffM.removeBuff(this);
                return;
            }
            if (now > this.nextTime) {
                this.curTimes++;
                this.nextTime = this.startTime + this.buff.buffCD * this.curTimes;
                this.bullet.hurtValue = Math.floor(this.hurtValue * this.buff.damagePercent / 100);
                if (this.skill.skilltarget == 2) {
                    this.to.hit(this.bullet, true);
                }
            }
        }
    }

    class IceBuff extends PlayerBuff {
        constructor(id) {
            super();
            this.isExe = false;
            this.skill = App.tableManager.getDataByNameAndId(SysSkill.NAME, id);
            this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
        }
        exe(now) {
            let nt = now - this.startTime;
            nt = nt / this.buff.buffCD;
            if (nt >= 1) {
                console.log("移除冰冻buff");
                Game.buffM.removeBuff(this);
                return;
            }
            let nt2 = now - this.startTime;
            nt2 = nt2 / this.buff.buffDot;
            if (nt2 >= 1) {
                this.to.offCie();
            }
            this.onCie();
        }
        onCie() {
            if (this.isExe) {
                return;
            }
            this.isExe = true;
            this.to.onCie();
            if (this.buff.damagePercent > 0) {
                if (this.skill.skilltarget == 2) {
                    this.bullet.hurtValue = Math.floor(this.hurtValue * this.buff.damagePercent / 100);
                    this.to.hit(this.bullet, true);
                }
            }
        }
    }

    class WudiBuff extends PlayerBuff {
        constructor(id) {
            super();
            this.skill = App.tableManager.getDataByNameAndId(SysSkill.NAME, id);
            this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
        }
        exe(now) {
            this.buff = App.tableManager.getDataByNameAndId(SysBuff.NAME, this.skill.skillEffect1);
            if (now > this.skillCD) {
                this.skillCD = now + this.buff.buffCD;
                this.chixuCD = now + this.buff.buffDot;
                Game.hero.setWudi(true);
            }
            else if (now > this.chixuCD) {
                Game.hero.setWudi(false);
            }
        }
    }

    class ShitouAI extends FlowerAI {
        constructor(pro) {
            super(pro);
        }
        onExe() {
            this.checkHeroCollision();
            if (this.status == 0 && this.now >= this.nextTime) {
                var a = GameHitBox.faceTo3D(this.pro.hbox, Game.hero.hbox);
                this.pro.rotation(a);
                this.startAttack();
                this.nextTime = this.now + this.shooting.shootCd;
                if (Math.random() > 0.7) {
                    this.status = 1;
                }
            }
            else if (this.status == 1 && this.now >= this.nextTime) {
                this.nextTime = this.now + 1000;
                this.status = 2;
                this.pro.rotation(Math.floor(Math.random() * 8) * (Math.PI / 4));
            }
            else if (this.status == 2 && this.now >= this.nextTime) {
                this.pro.play(GameAI.Idle);
                this.nextTime = this.now + 500;
                this.status = 0;
            }
            if (this.status == 2) {
                this.pro.move2D(this.pro.face2d);
                this.pro.play(GameAI.Run);
            }
        }
    }

    class FlyGameMove2 extends GameMove {
        move2d(n, pro, speed) {
            if (pro.gamedata.hp <= 0) {
                return;
            }
            var vx = pro.speed * Math.cos(n);
            var vz = pro.speed * Math.sin(n);
            var hits = Game.map0.Flyharr;
            if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                if (vz != 0 && Game.map0.chechHitArrs(pro, vx, 0, hits)) {
                    vx = 0;
                }
                if (vx != 0 && Game.map0.chechHitArrs(pro, 0, vz, hits)) {
                    vz = 0;
                }
                if (Game.map0.chechHitArrs(pro, vx, vz, hits)) {
                    return false;
                }
            }
            if (!this.Blocking(pro, vx, vz)) {
                return false;
            }
            pro.setXY2D(pro.pos2.x + vx, pro.pos2.z + vz);
            return true;
        }
    }

    var Handler = Laya.Handler;
    var Loader = Laya.Loader;
    class ZipLoader {
        constructor() {
            this.handler = null;
            this.fileNameArr = [];
            this.resultArr = [];
        }
        static load(fileName, handler) {
            this.instance.loadFile(fileName, handler);
        }
        loadFile(fileName, handler) {
            this.handler = handler;
            Laya.loader.load(fileName, new Handler(this, this.zipFun), null, Loader.BUFFER);
        }
        zipFun(ab, handler) {
            this.handler = handler;
            Laya.Browser.window.JSZip.loadAsync(ab).then((jszip) => {
                this.analysisFun(jszip);
            });
        }
        analysisFun(jszip) {
            this.currentJSZip = jszip;
            for (var fileName in jszip.files) {
                this.fileNameArr.push(fileName + "");
            }
            this.exeOne();
        }
        exeOne() {
            this.currentJSZip.file(this.fileNameArr[0]).async('text').then((content) => {
                this.over(content);
            });
        }
        over(content) {
            var fileName = this.fileNameArr.shift();
            this.resultArr.push(fileName);
            this.resultArr.push(content);
            if (this.fileNameArr.length != 0) {
                this.exeOne();
            }
            else {
                this.handler.runWith([this.resultArr]);
            }
        }
    }
    ZipLoader.instance = new ZipLoader();

    class NPC_1001_view extends ui.test.tianshi_1UI {
        constructor() {
            super();
            this.grid1 = new SkillGrid(new Laya.Handler(this, this.onClick));
            this.grid2 = new SkillGrid(new Laya.Handler(this, this.onClick));
            this.queding.visible = false;
            this.box1.addChild(this.grid1);
            this.box2.addChild(this.grid2);
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onClick(sys) {
            console.log(sys.skillName);
            if (!Game.hero.changeBlood(sys)) {
                Game.skillManager.addSkill(sys);
            }
            Game.bg.clearNpc();
            this.removeSelf();
        }
        onDis() {
            Game.executor.stop_();
            let id = Game.battleLoader.chapterId == 1 ? 1006 : 1001;
            let sys = App.tableManager.getDataByNameAndId(SysNpc.NAME, id);
            this.box1.scaleX = 1;
            this.box2.scaleX = 1;
            this.grid1.update(Game.skillManager.getRandomSkillByNpcId(id));
            this.grid2.update(sys.skillId);
        }
        removeSelf() {
            Game.executor.start();
            Game.state = 0;
            return super.removeSelf();
        }
    }

    class BaseCookie {
    }

    class TestCookie extends BaseCookie {
        constructor() {
            super();
        }
        setCookie(code, data) {
            Laya.LocalStorage.setJSON(code, data);
        }
        getCookie(code, callback) {
            let data = Laya.LocalStorage.getJSON(code);
            callback && callback(data);
        }
        removeCookie(code) {
            Laya.LocalStorage.removeItem(code);
        }
        clearAll() {
            Laya.LocalStorage.clear();
        }
    }

    class WXCookie extends BaseCookie {
        constructor() {
            super();
            this.wx = Laya.Browser.window.wx;
        }
        setCookie(code, data1) {
            this.wx.setStorage({
                key: code,
                data: data1,
                success(res) {
                }
            });
        }
        getCookie(code, callback) {
            this.wx.getStorage({
                key: code,
                success(res) {
                    callback && callback(res.data);
                },
                fail(res) {
                    callback && callback(null);
                },
                complete(res) {
                }
            });
        }
        removeCookie(code) {
            this.wx.removeStorage({
                key: code,
                success(res) {
                }
            });
        }
        clearAll() {
            this.wx.clearStorage();
        }
    }

    class InitView extends ui.test.initViewUI {
        constructor() {
            super();
            this.on(Laya.Event.DISPLAY, this, this.onDis);
        }
        onDis() {
            this.initTxt.text = "0%";
            Laya.loader.load("h5/config.json", new Laya.Handler(this, this.configFun));
        }
        configFun() {
            let config = Laya.loader.getRes("h5/config.json");
            App.platformId = config.platformId;
            App.serverIP = config.platforms[App.platformId];
            let bc;
            if (App.platformId != PlatformID.WX) {
                bc = new TestCookie();
            }
            else if (App.platformId == PlatformID.WX) {
                bc = new WXCookie();
            }
            Game.cookie = bc;
            Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
                if (res == null) {
                    Game.cookie.setCookie(CookieKey.MUSIC_SWITCH, { "state": 1 });
                    App.soundManager.setMusicVolume(1);
                }
                else {
                    App.soundManager.setMusicVolume(res.state);
                }
            });
            Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
                if (res == null) {
                    Game.cookie.setCookie(CookieKey.SOUND_SWITCH, { "state": 1 });
                    App.soundManager.setSoundVolume(1);
                }
                else {
                    App.soundManager.setSoundVolume(res.state);
                }
            });
            Game.playBgMusic();
            let arr = [{ url: "h5/tables.zip", type: Laya.Loader.BUFFER }];
            for (let i = 0; i < Game.nativefiles.length; i++) {
                arr.push({ url: Game.nativefiles[i], type: Laya.Loader.IMAGE });
            }
            Laya.loader.load(arr, new Laya.Handler(this, this.onInitCom), new Laya.Handler(this, this.onInitProgress));
        }
        onInitCom() {
            Laya.stage.event(GameEvent.INIT_COM);
        }
        onInitProgress(value) {
            value = value * 100;
            this.initTxt.text = "" + value.toFixed(0) + "%";
        }
    }

    class Main {
        constructor() {
            this.isSuccess = false;
            UIConfig.popupBgAlpha = 0.8;
            if (window["Laya3D"])
                Laya3D.init(GameBG.width, GameBG.height);
            else
                Laya.init(GameBG.width, GameBG.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.bgColor = "#000000";
            Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
            Laya.stage.screenMode = Laya.Stage.SCREEN_VERTICAL;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            console.log("代码版本", Game.codeVer);
            console.log("代码版本", Game.resVer);
            if (Laya.Browser.window.wx) {
                Laya.URL.basePath = "https://img.kuwan511.com/arrowLegend/" + Game.resVer + "/";
                Laya.MiniAdpter.nativefiles = Game.nativefiles;
                Laya.Browser.window.wx.getSystemInfo({
                    success(res) {
                        let model = res.model;
                        GameBG.height = GameBG.width / res.windowWidth * res.windowHeight;
                    }
                });
            }
            App.init();
            App.soundManager.pre = "h5/sounds/";
            this._initView = new InitView();
            Laya.stage.once(GameEvent.INIT_COM, this, this.onInitCom);
            Laya.stage.addChild(this._initView);
            MyEffect.initBtnEffect();
            let bg = new ui.test.StageBgUI();
            Laya.stage.addChild(bg);
            bg.centerY = 0;
            bg.zOrder = -10;
            bg.mouseEnabled = false;
        }
        zipFun(arr) {
            GameMain.initDialog();
            GameMain.initTable(arr);
            Session.init();
            this.authSetting();
            Laya.stage.event(GameEvent.CONFIG_OVER);
        }
        onInitCom() {
            Laya.stage.addChild(App.layerManager);
            ZipLoader.instance.zipFun(Laya.loader.getRes("h5/tables.zip"), new Laya.Handler(this, this.zipFun));
            this.regClass();
            App.gameSoundManager.reg(GameSoundManager.BTN, App.soundManager.pre + "fx_button.wav");
        }
        authSetting() {
            if (!this.homePage) {
                this.homePage = new HomeLoading();
            }
            Laya.stage.addChild(this.homePage);
            App.sdkManager.log(LogType.SHOW_LOGIN_BTN, "显示登陆按钮");
            let BP = Laya.ClassUtils.getRegClass("p" + App.platformId);
            if (!this.curBP) {
                this.curBP = new BP();
            }
            this.curBP.checkUpdate();
            this.curBP.getUserInfo(this.getUserInfoSuccess.bind(this));
            this._initView && this._initView.removeSelf();
        }
        getUserInfoSuccess() {
            if (this.isSuccess) {
                return;
            }
            this.isSuccess = true;
            App.sdkManager.log(LogType.START_LOADING, "开始加载资源");
            this.homePage.load();
            console.log("授权成功，开始加载");
        }
        regClass() {
            var REG = Laya.ClassUtils.regClass;
            REG("HIT_" + HitType.hit1, GameScaleAnimator1);
            REG("HIT_" + HitType.hit2, GameScaleAnimator2);
            REG("HIT_" + HitType.hit3, GameScaleAnimator4);
            REG("HIT_" + HitType.hit4, GameScaleAnimator3);
            REG("NPC1001", NPC_1001);
            REG("NPC1002", NPC_1002);
            REG("NPC1003", NPC_1003);
            REG("NPCVIEW1001", NPC_1001_view);
            REG(AttackType.TAG + AIType.NOTHAS, BaseAI);
            REG(AttackType.TAG + AIType.FLYHIT, FlyAndHitAi);
            REG(AttackType.TAG + AIType.BULLET, FlowerAI);
            REG(AttackType.TAG + AIType.STONE, StoneAI);
            REG(AttackType.TAG + AIType.SHITOUREN, ShitouAI);
            REG(AttackType.TAG + AIType.TREE, TreeAI);
            REG(AttackType.TAG + AIType.RANDOM_MOVE, RandMoveAI);
            REG(AttackType.TAG + AIType.MOVEHIT, MoveAndHitAi);
            REG(AttackType.TAG + AIType.REBOUND, ReboundAI);
            REG(AttackType.TAG + AIType.JUMP_FOLLOW, JumpFollowAI);
            REG(AttackType.TAG + AIType.RED_LINE, ArcherAI);
            REG(MoveType.TAG + MoveType.FLY, FlyGameMove);
            REG(MoveType.TAG + MoveType.MOVE, PlaneGameMove);
            REG(MoveType.TAG + MoveType.FIXED, FixedGameMove);
            REG(MoveType.TAG + MoveType.JUMP, JumpMove);
            REG(MoveType.TAG + MoveType.BACK, BackMove);
            REG(MoveType.TAG + MoveType.BOOM, FlyGameMove2);
            REG("p" + PlatformID.TEST, TestPlatform);
            REG("p" + PlatformID.H5, TestPlatform);
            REG("p" + PlatformID.WX, WXPlatform);
            REG("BUFF" + BuffID.WUDI_5009, WudiBuff);
            REG("BUFF" + BuffID.FIRE_2001, FireBuff);
            REG("BUFF" + BuffID.FIRE_5001, FireBuff);
            REG("BUFF" + BuffID.DU_2002, FireBuff);
            REG("BUFF" + BuffID.DU_5002, FireBuff);
            REG("BUFF" + BuffID.ICE_2003, IceBuff);
            REG("BUFF" + BuffID.ICE_5003, IceBuff);
        }
    }
    new Main();

}());
