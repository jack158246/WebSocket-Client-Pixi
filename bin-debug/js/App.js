var Config = (function () {
    function Config() {
        Config.toGetInstance();
    }
    Config.toGetInstance = function () {
        if (this._config == null) {
            this._config = new Config();
        }
        return this._config;
    };
    Config.toSetSpriteSize = function (sp, type) {
        if (type === void 0) { type = ResizeEvent.RESIZE_COVER; }
        //console.log(type)
        var spRate;
        var stageRate;
        if (type == ResizeEvent.RESIZE_WIDTH) {
            spRate = sp.height / sp.width;
            sp.width = Config.stageWidth;
            sp.height = sp.width * spRate;
        }
        else if (type == ResizeEvent.RESIZE_HEIGHT) {
            spRate = sp.width / sp.height;
            sp.height = Config.stageHeight;
            sp.width = sp.height * spRate;
        }
        else if (type == ResizeEvent.RESIZE_COVER) {
            //以寬為主 以寬當分母的比例
            spRate = sp.height / sp.width;
            stageRate = Config.stageHeight / Config.stageWidth;
            if (spRate >= stageRate) {
                sp.width = Config.stageWidth;
                sp.height = sp.width * spRate;
            }
            else {
                spRate = sp.width / sp.height;
                sp.height = Config.stageHeight;
                sp.width = sp.height * spRate;
            }
        }
        sp.anchor.x = 0.5;
        sp.anchor.y = 0.5;
        sp.position.x = Config.stageWidth * 0.5;
        sp.position.y = Config.stageHeight * 0.5;
    };
    Config.toNumberStringSwap = function (value, radix) {
        if (radix === void 0) { radix = 10; }
        if (typeof value === 'string') {
            return parseInt(value, radix);
        }
        else if (typeof value === 'number') {
            return String(value);
        }
    };
    Config.toDetectAppleDevice = function () {
        var isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone");
        var isiPad = navigator.userAgent.toLowerCase().indexOf("ipad");
        var isiPod = navigator.userAgent.toLowerCase().indexOf("ipod");
        if (isiPhone > -1) { }
        if (isiPad > -1) { }
        if (isiPod > -1) { }
    };
    Config.toDetectBrowser = function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        var browserName = "";
        if (Sys.ie) {
            browserName = "IE:" + Sys.ie;
        }
        else if (Sys.firefox) {
            browserName = "Firefox:" + Sys.firefox;
        }
        else if (Sys.chrome) {
            browserName = "Chrome:" + Sys.chrome;
        }
        else if (Sys.opera) {
            browserName = "Opera:" + Sys.opera;
        }
        else if (Sys.safari) {
            browserName = "Safari:" + Sys.safari;
        }
        return browserName;
    };
    Config.toRequest = function (m) {
        var sValue = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
        if (sValue) {
            return sValue[1];
        }
        else {
            return sValue;
        }
    };
    Config.UrlUpdateParams = function (url, name, value) {
        var r = url;
        if (r != null && r != "") {
            value = encodeURIComponent(value);
            var reg = new RegExp("(^|)" + name + "=([^&]*)(|$)");
            var tmp = name + "=" + value;
            if (url.match(reg) != null) {
                r = url.replace(eval(reg), tmp);
            }
            else {
                if (url.match("[\?]")) {
                    r = url + "&" + tmp;
                }
                else {
                    r = url + "?" + tmp;
                }
            }
        }
        return r;
    };
    Config.toCreateSP = function (texture, snum) {
        if (snum === void 0) { snum = 1; }
        var tmpSP = new PIXI.Sprite(texture);
        tmpSP.anchor.x = 0.5;
        tmpSP.anchor.y = 0.5;
        tmpSP.scale.x = snum;
        tmpSP.scale.y = snum;
        tmpSP.position.x = Config.stageWidth * 0.5;
        tmpSP.position.y = Config.stageHeight * 0.5;
        return tmpSP;
    };
    Config.toGetImgTagToTexture = function (imgTag) {
        //var img = document.getElementById("qrcode").getElementsByTagName("img")[0];
        var imgBaseTexture = new PIXI.BaseTexture(imgTag);
        var imgTexture = new PIXI.Texture(imgBaseTexture);
        return imgTexture;
    };
    //=================================
    //=================================
    //=================================
    Config.toWebSocketInit = function (tmpKey) {
        var key;
        if (tmpKey) {
            key = tmpKey;
        }
        else {
            //產生link + key
            key = Config.NewGuid();
            Config.NowKey = key;
            Config.NowQrcode = new QRCode(document.getElementById("qrcode"), Config.DomainUrl + "mob.html?key=" + Config.NowKey);
            Config.MobileLink = Config.DomainUrl + "mob.html?key=" + Config.NowKey;
        }
        Config.WS = new WebSocket(Config.SocketURL);
        Config.WS.onmessage = function (result) {
            Config.onWebSocketReceive(result);
        };
        Config.WS.onopen = function () {
            Config.onWebSocketOpen();
        };
        Config.WS.onclose = function () {
            Config.onWebSocketClosed();
        };
        Config.WS.onerror = function () {
            Config.onWebSocketError();
        };
        console.log(Config.NowKey);
    };
    Config.onWebSocketOpen = function () {
        Config.toWebSocketGetChannelId();
    };
    Config.toWebSocketGetChannelId = function () {
        Config.WS.send(JSON.stringify({
            key: Config.NowKey,
            act: "channel",
            id: Config.ChannelId
        }));
    };
    Config.toWebSocketSend = function (event, obj) {
        Config.WS.send(JSON.stringify({
            key: Config.NowKey,
            act: event,
            id: Config.ChannelId,
            value: obj
        }));
    };
    Config.onWebSocketReceive = function (result) {
        //console.log(result);
        var resultObj = JSON.parse(result.data);
        var combine = resultObj.key + "_" + resultObj.act;
        switch (combine) {
            //1. 獲取我在此頻道中的 id 指的是人的ID
            case Config.NowKey + "_" + "myid":
                console.log("my id is: " + resultObj.id);
                Config.ChannelId = resultObj.id;
                break;
            //end case
            //2. 偵測頻道中的目前人數
            case Config.NowKey + "_" + "nowtotal":
                console.log("there are " + resultObj.tt + " people in this channel");
                break;
            //end case
            //3. 偵測頻道中其他人的動作
            case Config.NowKey + "_" + "enter":
                console.log(resultObj.id + " is enter");
                break;
            //end case
            //4. 偵測頻道中斷線的人的 id
            case Config.NowKey + "_" + "dead":
                console.log(resultObj.id + " is dead");
                break;
        }
    };
    Config.onWebSocketClosed = function () {
        console.log("Closed");
    };
    Config.onWebSocketError = function () {
        console.log("Error");
    };
    //斷開WS
    Config.toWebSocketDisconnect = function () {
        Config.WS.close();
    };
    //=======================
    //生成亂數種子
    Config.S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    Config.NewGuid = function () {
        return (Config.S4() + Config.S4());
    };
    //==================
    Config.UserName = "";
    Config.stageWidth = 0;
    Config.stageHeight = 0;
    Config.SocketURL = "ws://gentle-fjord-6793.herokuapp.com";
    Config.DomainUrl = ""; //需要斜線結尾
    Config.ChannelId = 0;
    return Config;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AbstractPage = (function (_super) {
    __extends(AbstractPage, _super);
    function AbstractPage() {
        _super.call(this);
        this.loader = new PIXI.loaders.Loader;
        this.dataObj = {};
        this.onInit();
    }
    AbstractPage.prototype.onResize = function () {
    };
    AbstractPage.prototype.onRemove = function () {
    };
    AbstractPage.prototype.onRender = function () {
        requestAnimationFrame(this.onRender.bind(this));
    };
    AbstractPage.prototype.onInit = function () {
        $(window).resize(this.onResize.bind(this));
        //this.on("LOAD_COMPLETE", this.onLoadComplete.bind(this));
        this.toLoadElement();
    };
    AbstractPage.prototype.toLoadElement = function () {
        this.loader.reset();
        this.loader.on('progress', this.onLoadProgress.bind(this));
        this.loader.once('complete', this.onLoadComplete.bind(this));
        //也可以適用下列的方式
        //var filesToLoad = [
        //    { name : "bunny", url : "bunny.png" },
        //    { name : "buttons_atlas", url : "buttons.json" },
        //];
        //
        //this._pixiAssetLoader = new PIXI.loaders.Loader();
        //this._pixiAssetLoader.add( filesToLoad  );
        //this._pixiAssetLoader.on( "progress", this._onProgress, this );
        //this._pixiAssetLoader.on( "complete", this._onComplete, this );
    };
    AbstractPage.prototype.toSettingElement = function (loader, resources) {
        this.onRender();
    };
    AbstractPage.prototype.onLoadProgress = function (loader, loadedResource) {
        //console.dir(loadedResource);
        console.log('Progress:', loader.progress + '%');
    };
    AbstractPage.prototype.onLoadComplete = function (loader, resources) {
        this.toSettingElement(loader, resources);
        this.onResize();
        this.alpha = 0;
        this.toTransitionIn();
    };
    AbstractPage.prototype.toTransitionIn = function () {
        TweenMax.to(this, 0.6, {
            alpha: 1, ease: Quart.easeOut,
            onComplete: this.onTransitionInComplete.bind(this), onCompleteParams: ["TRANSITION_IN_COMPLETE"]
        });
    };
    AbstractPage.prototype.onTransitionInComplete = function () {
        TweenMax.killTweensOf(this);
    };
    AbstractPage.prototype.toTransitionOut = function (id) {
        if (id === void 0) { id = -1; }
        TweenMax.to(this, 0.6, {
            alpha: 0, ease: Quart.easeOut,
            onComplete: this.onTransitionOutComplete.bind(this), onCompleteParams: ["TRANSITION_OUT_COMPLETE", id]
        });
    };
    AbstractPage.prototype.onTransitionOutComplete = function (way, id) {
        if (id === void 0) { id = -1; }
        TweenMax.killTweensOf(this);
        this.emit(PageEvent.PAGE_OUT_COMPLETE, { id: id });
    };
    AbstractPage.prototype.toSetButton = function (target) {
        //pc 與 mobile 的事件狀態不同 無法共用;
        target.interactive = true;
        target.buttonMode = true;
        target.on("tap", this.onClick.bind(this)).on("click", this.onClick.bind(this));
    };
    AbstractPage.prototype.onClick = function (eventData) {
    };
    return AbstractPage;
})(PIXI.Container);
//declare module PIXI {
//    module cocoontext {
//        export function CocoonText(str?:string, obj?:any):void;
//    }
//}
//declare module GOWN {
//    export function Application(obj1?:any, obj2?:any):void;
//}
//
//declare class LoginTheme {
//    constructor(obj?:any, callback?:any);
//}
//
//declare class LoginDialog {
//    constructor();
//}
var HomePage = (function (_super) {
    __extends(HomePage, _super);
    function HomePage() {
        _super.call(this);
    }
    HomePage.prototype.onResize = function () {
        if (this.bunny) {
            this.bunny.position.x = Config.stageWidth * 0.5;
            this.bunny.position.y = Config.stageHeight * 0.5;
        }
        if (this.monster) {
            this.monster.position.x = Config.stageWidth * 0.5;
            this.monster.position.y = Config.stageHeight * 0.5 + 100;
        }
        if (this.bgSP) {
            Config.toSetSpriteSize(this.bgSP, ResizeEvent.RESIZE_COVER);
        }
    };
    HomePage.prototype.onRemove = function () {
        this.removeChild(this.bunny);
        this.removeChild(this.monster);
        this.bunny.destroy();
        this.monster.destroy();
        this.filters = null;
    };
    HomePage.prototype.onRender = function () {
        _super.prototype.onRender.call(this);
        if (this.displacementSP) {
        }
    };
    HomePage.prototype.toLoadElement = function () {
        _super.prototype.toLoadElement.call(this);
        //重新 利用 PIXI.loaders 設計
        //PIXI.loader.add('bunny', '../resource/assets/bunny.png').load(function (loader, resources) {
        //    this.emit("LOAD_COMPLETE", loader, resources);
        //
        //}.bind(this));onLoadComplete
        //this.loader.add('bunny', '../resource/assets/bunny.png').load(this.onLoadComplete.bind(this));
        this.loader.add('bunny', './resource/assets/bunny.png');
        this.loader.add('monster', './resource/assets/bmonster5.png');
        this.loader.add('dbg', './resource/material/displacement_bg.jpg');
        this.loader.add('dmap', './resource/material/displacement_map.jpg');
        this.loader.load();
    };
    HomePage.prototype.toSettingElement = function (loader, resources) {
        _super.prototype.toSettingElement.call(this, loader, resources);
        this.bgSP = new PIXI.Sprite(resources.dbg.texture);
        this.bgSP.anchor.x = 0.5;
        this.bgSP.anchor.y = 0.5;
        this.bgSP.position.x = Config.stageWidth * 0.5;
        this.bgSP.position.y = Config.stageHeight * 0.5;
        this.addChild(this.bgSP);
        //this.displacementSP = new PIXI.Sprite(resources.dmap.texture);
        //this.addChild(this.displacementSP);
        //當一旦使用filter，效能跟記憶體控制得要處理
        //this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSP);
        //this.filters = [this.displacementFilter];
        //this.displacementFilter.scale.y = 50;
        //this.displacementFilter.scale.x = 50;
        this.bunny = Config.toCreateSP(resources.bunny.texture, 1);
        this.bunny.name = "bunny";
        this.addChild(this.bunny);
        this.monster = Config.toCreateSP(resources.monster.texture, 0.1);
        this.monster.name = "monster";
        this.addChild(this.monster);
        this.onResize();
    };
    HomePage.prototype.onTransitionInComplete = function () {
        _super.prototype.onTransitionInComplete.call(this);
        console.log("onTransitionInComplete Home");
        Config.toWebSocketInit();
        this.toSetButton(this.bunny);
        this.toSetButton(this.monster);
    };
    HomePage.prototype.onClick = function (eventData) {
        if (eventData.target.name == "bunny") {
            //this.toTransitionOut(1);
            //window.location.assign(window.location.href);
            window.open(Config.MobileLink, '_blank');
        }
        else if (eventData.target.name == "monster") {
            //Config.toWebSocketSend("enter", {
            //    device:"1,0,0,0"
            //})
            //get img photo to pixi
            this.toShowImgTexture();
        }
    };
    HomePage.prototype.toShowImgTexture = function () {
        var img = document.getElementById("qrcode").getElementsByTagName("img")[0];
        var tmpSP = new PIXI.Sprite(Config.toGetImgTagToTexture(img));
        tmpSP.anchor.x = 0.5;
        tmpSP.anchor.y = 0.5;
        tmpSP.position.x = Config.stageWidth * 0.5;
        tmpSP.position.y = Config.stageHeight * 0.5;
        this.addChild(tmpSP);
    };
    return HomePage;
})(AbstractPage);
var VideoPage = (function (_super) {
    __extends(VideoPage, _super);
    function VideoPage() {
        _super.call(this);
        this.videoRate = 1;
        this.clickNum = 1;
    }
    VideoPage.prototype.onResize = function () {
        this.toSetVideoSize();
        if (this.bunny) {
            this.bunny.position.x = Config.stageWidth * 0.5;
            this.bunny.position.y = Config.stageHeight * 0.5;
        }
    };
    VideoPage.prototype.onRemove = function () {
        this.removeChild(this.videoSP);
    };
    VideoPage.prototype.toLoadElement = function () {
        _super.prototype.toLoadElement.call(this);
        this.loader.add('bunny', './resource/assets/bunny.png');
        this.loader.add('video', './resource/video/sintel.mp4');
        this.loader.load();
        console.log("toLoadElement");
    };
    VideoPage.prototype.onLoadProgress = function (loader, loadedResource) {
        _super.prototype.onLoadProgress.call(this, loader, loadedResource);
    };
    VideoPage.prototype.toSettingElement = function (loader, resources) {
        _super.prototype.toSettingElement.call(this, loader, resources);
        //console.dir(resources.video.data);
        //如何使用
        //this.videoTexture = PIXI.VideoBaseTexture.fromUrl("../resource/video/sintel.mp4")
        //------------------------------------
        this.bunny = new PIXI.Sprite(resources.bunny.texture);
        this.bunny.name = "bunny";
        this.bunny.anchor.x = 0.5;
        this.bunny.anchor.y = 0.5;
        this.bunny.scale.x = 1;
        this.bunny.scale.y = 1;
        this.bunny.position.x = Config.stageWidth * 0.5;
        this.bunny.position.y = Config.stageHeight * 0.5;
        //------------------------------------
        this.videoTexture = PIXI.Texture.fromVideo("./resource/video/sintel.mp4");
        this.controlVideo = this.videoTexture.baseTexture.source;
        this.videoSP = new PIXI.Sprite(this.videoTexture);
        this.toSetVideoSize();
        this.addChild(this.videoSP);
        this.toPauseVideo(this.controlVideo);
        this.addChild(this.bunny);
    };
    VideoPage.prototype.toSetVideoSize = function () {
        //console.log(this.videoTexture.width);
        if (!this.videoTexture) {
            return;
        }
        if (this.videoTexture.width == 0 || this.videoTexture.height == 0) {
            this.videoSP.visible = false;
            return;
        }
        this.videoSP.visible = true;
        this.videoRate = this.videoTexture.height / this.videoTexture.width;
        this.videoSP.width = Config.stageWidth;
        this.videoSP.height = this.videoSP.width * this.videoRate;
        //this.videoSP.y = -(this.videoSP.height - Config.stageHeight) * 0.5;
        this.videoSP.anchor.x = 0.5;
        this.videoSP.anchor.y = 0.5;
        this.videoSP.position.x = Config.stageWidth * 0.5;
        this.videoSP.position.y = Config.stageHeight * 0.5;
    };
    VideoPage.prototype.onTransitionInComplete = function () {
        _super.prototype.onTransitionInComplete.call(this);
        console.log("onTransitionInComplete Video");
        this.toSetButton(this.bunny);
        this.toSetButton(this.videoSP);
        //PIXI.filters.GrayFilter
    };
    VideoPage.prototype.onClick = function (eventData) {
        if (eventData.target.name == "bunny") {
            if (this.clickNum % 2 == 0) {
                this.controlVideo.pause();
            }
            else {
                this.controlVideo.play();
            }
            this.clickNum += 1;
        }
        else {
            this.toTransitionOut(2);
        }
    };
    VideoPage.prototype.toPauseVideo = function (el) {
        console.log(el);
        this.pauseId = window.setInterval(function () {
            if (!el.paused) {
                this.toSetVideoSize();
                //console.log("videoSP : " + this.videoTexture.width, this.videoTexture.height);
                clearInterval(this.pauseId);
            }
            el.pause();
        }.bind(this), 1000); //10
    };
    return VideoPage;
})(AbstractPage);
var MovieClipPage = (function (_super) {
    __extends(MovieClipPage, _super);
    function MovieClipPage() {
        _super.call(this);
        this.explosionTextures = [];
    }
    MovieClipPage.prototype.onResize = function () {
        if (this.explosionMC) {
            this.explosionMC.position.x = Config.stageWidth * 0.5;
            this.explosionMC.position.y = Config.stageHeight * 0.5;
        }
    };
    MovieClipPage.prototype.onRemove = function () {
        this.removeChild(this.explosionMC);
        this.explosionMC.destroy();
    };
    MovieClipPage.prototype.toLoadElement = function () {
        _super.prototype.toLoadElement.call(this);
        this.loader.add('explosionTexture', './resource/assets/explosion/explosion.png');
        this.loader.add('explosion', './resource/assets/explosion/explosion.json');
        this.loader.load();
    };
    MovieClipPage.prototype.toSettingElement = function (loader, resources) {
        _super.prototype.toSettingElement.call(this, loader, resources);
        //var alienImages = ["image_sequence_01.png","image_sequence_02.png","image_sequence_03.png","image_sequence_04.png"];
        //var textureArray = [];
        //
        //for (var i=0; i < 4; i++)
        //{
        //    var texture = PIXI.Texture.fromImage(alienImages[i]);
        //    textureArray.push(texture);
        //};
        //
        //var mc = new PIXI.MovieClip(textureArray);
        for (var i = 0; i < 26; i++) {
            var texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i + 1) + '.png');
            this.explosionTextures.push(texture);
        }
        this.explosionMC = new PIXI.extras.MovieClip(this.explosionTextures);
        this.explosionMC.anchor.x = 0.5;
        this.explosionMC.anchor.y = 0.5;
        this.explosionMC.x = Config.stageWidth * 0.5;
        this.explosionMC.y = Config.stageHeight * 0.5;
        this.explosionMC.gotoAndPlay(Math.random() * 27);
        this.addChild(this.explosionMC);
    };
    MovieClipPage.prototype.onTransitionInComplete = function () {
        _super.prototype.onTransitionInComplete.call(this);
        console.log("onTransitionInComplete MovieClip");
        this.toSetButton(this.explosionMC);
    };
    MovieClipPage.prototype.onClick = function (eventData) {
        this.toTransitionOut(0);
    };
    return MovieClipPage;
})(AbstractPage);
var physicalPage = (function (_super) {
    __extends(physicalPage, _super);
    function physicalPage() {
        _super.call(this);
    }
    physicalPage.prototype.onResize = function () {
    };
    physicalPage.prototype.onRemove = function () {
    };
    physicalPage.prototype.onRender = function () {
        _super.prototype.onRender.call(this);
    };
    physicalPage.prototype.toLoadElement = function () {
        _super.prototype.toLoadElement.call(this);
    };
    physicalPage.prototype.toSettingElement = function (loader, resources) {
        _super.prototype.toSettingElement.call(this, loader, resources);
    };
    physicalPage.prototype.onTransitionInComplete = function () {
        _super.prototype.onTransitionInComplete.call(this);
        console.log("onTransitionInComplete Box2d");
    };
    physicalPage.prototype.onClick = function (eventData) {
    };
    return physicalPage;
})(AbstractPage);
var ResizeEvent = (function () {
    function ResizeEvent() {
    }
    ResizeEvent.RESIZE_COVER = "resize_cover";
    ResizeEvent.RESIZE_WIDTH = "resize_width";
    ResizeEvent.RESIZE_HEIGHT = "resize_height";
    return ResizeEvent;
})();
var PageEvent = (function () {
    function PageEvent() {
    }
    PageEvent.PAGE_IN_COMPLETE = "page_in_complete";
    PageEvent.PAGE_OUT_COMPLETE = "page_out_complete";
    return PageEvent;
})();
var Main = (function () {
    function Main() {
        this.pId = 0;
        this.pageA = [HomePage, VideoPage, MovieClipPage, physicalPage];
        this.toSetStats();
        this.toInit();
        $(window).on('resize', this.onWindowResize.bind(this));
    }
    Main.prototype.onWindowResize = function () {
        console.log("onWindowResize");
        Main.renderer.resize(window.innerWidth, window.innerHeight);
        Config.stageWidth = Main.canvas.width * Main.canvasScale;
        Config.stageHeight = Main.canvas.height * Main.canvasScale;
    };
    Main.prototype.toSetStats = function () {
        this.container = document.createElement("div");
        document.body.appendChild(this.container);
        this.stats = new Stats();
        this.container.appendChild(this.stats.domElement);
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.stats.domElement.style.right = "0px";
    };
    Main.prototype.toInitPixi = function () {
        //var renderer = new PIXI.WebGLRenderer(800, 600);
        //document.body.appendChild(renderer.view);
        Main.canvas = document.createElement('canvas');
        $('#canvas-container').append(Main.canvas);
        Main.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
            view: Main.canvas,
            //resolution:window.devicePixelRatio,
            resolution: 1,
            backgroundColor: 0x263332,
            transparent: true
        });
        this.onWindowResize();
        this.stage = new PIXI.Container();
        this.onRender();
    };
    Main.prototype.onRender = function () {
        // start the timer for the next animation loop
        requestAnimationFrame(this.onRender.bind(this));
        Main.renderer.render(this.stage);
        window.scrollTo(0, 0);
        if (this.stats) {
            this.stats.update();
        }
    };
    //==========================================================================
    Main.prototype.toInit = function () {
        this.toInitPixi();
        this.toCreatePage(0);
    };
    Main.prototype.toCreatePage = function (id) {
        if (id === void 0) { id = -1; }
        if (this.nowPage) {
            this.nowPage.toTransitionOut(id);
            return;
        }
        this.pId = id;
        var tmpClass = this.pageA[id];
        this.nowPage = new tmpClass();
        this.stage.addChild(this.nowPage);
        this.nowPage.on(PageEvent.PAGE_OUT_COMPLETE, this.onPageStatus.bind(this));
    };
    Main.prototype.onPageStatus = function (eventData) {
        this.stage.removeChild(this.nowPage);
        this.nowPage = null;
        if (eventData.id != -1) {
            this.toCreatePage(eventData.id);
        }
    };
    Main.canvasScale = 1;
    return Main;
})();
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/greensock/greensock.d.ts" />
/// <reference path="../typings/pixi/pixi.js.d.ts" />
/// <reference path="../typings/pixi/pixi-extra-filters.d.ts" />
/// <reference path="../typings/pixi/pixi-spine.d.ts" />
/// <reference path="config/Config.ts" />
/// <reference path="abstract/AbstractPage.ts" />
/// <reference path="view/home/HomePage.ts" />
/// <reference path="view/video/VideoPage.ts" />
/// <reference path="view/movieclip/MovieClipPage.ts" />
/// <reference path="view/physical/physicalPage.ts" />
/// <reference path="events/ResizeEvent.ts" />
/// <reference path="events/PageEvent.ts" />
/// <reference path="Main.ts" />
var App;
(function (App) {
    $(document).ready(function () {
        var pixiMain = new Main;
        console.log("=========");
        console.log("PIXI__JACK__Beta1.1");
        console.log("PIXI__JACK__Beta1.1");
        console.log("PIXI__JACK__Beta1.1");
        console.log("PIXI__JACK__Beta1.1");
        console.log("PIXI__JACK__Beta1.1");
        console.log("PIXI__JACK__Beta1.1");
        console.log("PIXI__JACK__Beta1.1");
        console.log("PIXI__JACK__Beta1.1");
        console.log("PIXI__JACK__Beta1.1");
        console.log("PIXI__JACK__Beta1.1");
        console.log("=========");
    });
})(App || (App = {}));
