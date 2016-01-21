class Config{
    private static _config: Config;
    //==================
    public static UserName:string = "";
    public static stageWidth:number = 0;
    public static stageHeight:number = 0;

    public static SocketURL:string = "ws://gentle-fjord-6793.herokuapp.com";
    public static WS:WebSocket;
    public static NowKey;
    public static MobileLink:string;
    public static NowQrcode;
    public static DomainUrl:string = "";//需要斜線結尾

    public static ChannelId:number = 0;

    constructor(){
        Config.toGetInstance();
    }

    public static toGetInstance(): Config {
        if (this._config == null) {
            this._config = new Config();
        }
        return this._config;
    }

    public static toSetSpriteSize(sp:PIXI.Sprite, type:string = ResizeEvent.RESIZE_COVER):void{
        //console.log(type)
        var spRate:number
        var stageRate:number
        if(type == ResizeEvent.RESIZE_WIDTH){
            spRate = sp.height / sp.width;
            sp.width = Config.stageWidth;
            sp.height = sp.width * spRate;

        }else if(type == ResizeEvent.RESIZE_HEIGHT){
            spRate = sp.width / sp.height;
            sp.height = Config.stageHeight;
            sp.width = sp.height * spRate;

        }else if(type == ResizeEvent.RESIZE_COVER){
            //以寬為主 以寬當分母的比例
            spRate = sp.height / sp.width;
            stageRate = Config.stageHeight / Config.stageWidth;
            if(spRate >= stageRate){
                sp.width = Config.stageWidth;
                sp.height = sp.width * spRate;
            }else{
                spRate = sp.width / sp.height;
                sp.height = Config.stageHeight;
                sp.width = sp.height * spRate;

            }
        }

        sp.anchor.x = 0.5;
        sp.anchor.y = 0.5;
        sp.position.x = Config.stageWidth * 0.5;
        sp.position.y = Config.stageHeight * 0.5;
    }

    public static toNumberStringSwap(value: any, radix: number = 10): any {
        if (typeof value === 'string') {
            return parseInt(value, radix);
        }

        else if (typeof value === 'number') {
            return String(value);
        }
    }


    public static toDetectAppleDevice() {
        var isiPhone = navigator.userAgent.toLowerCase().indexOf("iphone");
        var isiPad = navigator.userAgent.toLowerCase().indexOf("ipad");
        var isiPod = navigator.userAgent.toLowerCase().indexOf("ipod");

        if (isiPhone > -1) {/*Redirect to iPhone Version of the website.*/}
        if (isiPad > -1) {/*Redirect to iPad Version of the website.*/}
        if (isiPod > -1) {/*Redirect to iPod Version of the website.*/}
    }

    public static toDetectBrowser(): string {
        var Sys: any = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        var browserName: string = "";
        if (Sys.ie) {
            browserName = "IE:" + Sys.ie;
        } else if (Sys.firefox) {
            browserName = "Firefox:" + Sys.firefox;
        } else if (Sys.chrome) {
            browserName = "Chrome:" + Sys.chrome;
        } else if (Sys.opera) {
            browserName = "Opera:" + Sys.opera;
        } else if (Sys.safari) {
            browserName = "Safari:" + Sys.safari;
        }


        return browserName;
    }

    public static toRequest(m) {
        var sValue: any = location.search.match(new RegExp("[\?\&]" + m + "=([^\&]*)(\&?)", "i"));
        if (sValue) {
            return sValue[1];
        } else {
            return sValue;
        }
    }

    public static UrlUpdateParams(url, name, value) {
        var r = url;
        if (r != null && r != "") {
            value = encodeURIComponent(value);
            var reg: any = new RegExp("(^|)" + name + "=([^&]*)(|$)");
            var tmp = name + "=" + value;
            if (url.match(reg) != null) {
                r = url.replace(eval(reg), tmp);
            }
            else {
                if (url.match("[\?]")) {
                    r = url + "&" + tmp;
                } else {
                    r = url + "?" + tmp;
                }
            }
        }
        return r;
    }

    public static toCreateSP(texture, snum:number = 1):PIXI.Sprite{
        var tmpSP:PIXI.Sprite = new PIXI.Sprite(texture);
        tmpSP.anchor.x = 0.5;
        tmpSP.anchor.y = 0.5;
        tmpSP.scale.x = snum;
        tmpSP.scale.y = snum;
        tmpSP.position.x = Config.stageWidth * 0.5;
        tmpSP.position.y = Config.stageHeight * 0.5;
        return tmpSP;

    }

    public static toGetImgTagToTexture(imgTag):PIXI.Texture{
        //var img = document.getElementById("qrcode").getElementsByTagName("img")[0];
        var imgBaseTexture = new PIXI.BaseTexture(imgTag);
        var imgTexture = new PIXI.Texture(imgBaseTexture);
        return imgTexture;
    }

    //=================================
    //=================================
    //=================================
    public static toWebSocketInit(tmpKey?):void{
        var key;
        if(tmpKey){
            key = tmpKey
        }else{
            //產生link + key
            key = Config.NewGuid();
            Config.NowKey = key;
            Config.NowQrcode = new QRCode(document.getElementById("qrcode"), Config.DomainUrl + "mob.html?key=" + Config.NowKey);
            Config.MobileLink = Config.DomainUrl + "mob.html?key=" + Config.NowKey;
        }

        Config.WS = new WebSocket(Config.SocketURL);

        Config.WS.onmessage = function(result){
            Config.onWebSocketReceive(result);
        }

        Config.WS.onopen = function(){
            Config.onWebSocketOpen();
        };

        Config.WS.onclose = function(){
            Config.onWebSocketClosed();
        }

        Config.WS.onerror = function(){
            Config.onWebSocketError();
        }


        console.log(Config.NowKey);
    }


    public static onWebSocketOpen():void{
        Config.toWebSocketGetChannelId();
    }

    public static toWebSocketGetChannelId():void{
        Config.WS.send(JSON.stringify({
            key: Config.NowKey,
            act: "channel",
            id: Config.ChannelId
        }));
    }


    public static toWebSocketSend(event, obj?):void{
        Config.WS.send(JSON.stringify({
            key: Config.NowKey,
            act: event,
            id: Config.ChannelId,
            value: obj
        }));

    }

    public static onWebSocketReceive(result):void{
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
            //end case
        }
    }

    public static onWebSocketClosed() {
        console.log("Closed");

    }

    public static onWebSocketError() {
        console.log("Error");
    }

    //斷開WS
    public static toWebSocketDisconnect() {
        Config.WS.close();
    }


    //=======================
    //生成亂數種子
    public static S4() {
        return (((1 + Math.random())*0x10000)|0).toString(16).substring(1);
    }

    public static  NewGuid() {
        return (Config.S4() + Config.S4());
    }

}