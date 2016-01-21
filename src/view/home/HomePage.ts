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


class HomePage extends AbstractPage{
    constructor(){
        super();
    }

    public onResize():void{
        if(this.bunny){
            this.bunny.position.x = Config.stageWidth * 0.5;
            this.bunny.position.y = Config.stageHeight * 0.5;
        }

        if(this.monster){
            this.monster.position.x = Config.stageWidth * 0.5;
            this.monster.position.y = Config.stageHeight * 0.5 + 100;
        }


        if(this.bgSP){
            Config.toSetSpriteSize(this.bgSP, ResizeEvent.RESIZE_COVER);
        }
    }

    public onRemove():void{
        this.removeChild(this.bunny);
        this.removeChild(this.monster);
        this.bunny.destroy();
        this.monster.destroy();
        this.filters = null;
    }

    public onRender():void{
        super.onRender();
        if(this.displacementSP){
            //this.displacementSP.y +=2;
        }
    }

    public toLoadElement():void{
        super.toLoadElement();
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

    }


    private bgSP:PIXI.Sprite;
    private displacementSP:PIXI.Sprite;
    private displacementFilter:PIXI.filters.DisplacementFilter;
    private bunny:PIXI.Sprite;
    private monster:PIXI.Sprite;

    public toSettingElement(loader, resources):void{
        super.toSettingElement(loader, resources);
        

        this.bgSP = new PIXI.Sprite(resources.dbg.texture)
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

    }

    public onTransitionInComplete():void{
        super.onTransitionInComplete();
        console.log("onTransitionInComplete Home");
        Config.toWebSocketInit();
        this.toSetButton(this.bunny);
        this.toSetButton(this.monster);


    }


    public onClick(eventData):void{
        if(eventData.target.name == "bunny"){
            //this.toTransitionOut(1);
            //window.location.assign(window.location.href);
            window.open(Config.MobileLink,'_blank');

        }else if(eventData.target.name == "monster"){
            //Config.toWebSocketSend("enter", {
            //    device:"1,0,0,0"
            //})

            //get img photo to pixi
            this.toShowImgTexture();
        }
    }

    private toShowImgTexture():void{
        var img = document.getElementById("qrcode").getElementsByTagName("img")[0];
        var tmpSP:PIXI.Sprite = new PIXI.Sprite(Config.toGetImgTagToTexture(img));
        tmpSP.anchor.x = 0.5;
        tmpSP.anchor.y = 0.5;
        tmpSP.position.x = Config.stageWidth * 0.5;
        tmpSP.position.y = Config.stageHeight * 0.5;
        this.addChild(tmpSP);

    }


}


