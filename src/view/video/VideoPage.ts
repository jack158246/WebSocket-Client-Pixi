class VideoPage extends AbstractPage{
    private videoTexture:PIXI.Texture;
    private videoSP:PIXI.Sprite;
    private controlVideo:any;
    private videoRate:number = 1;

    constructor(){
        super();
    }

    public onResize():void{
        this.toSetVideoSize();
        if(this.bunny){
            this.bunny.position.x = Config.stageWidth * 0.5;
            this.bunny.position.y = Config.stageHeight * 0.5;
        }
    }

    public onRemove():void{
        this.removeChild(this.videoSP);

    }

    public toLoadElement():void{
        super.toLoadElement();

        this.loader.add('bunny', './resource/assets/bunny.png');
        this.loader.add('video', './resource/video/sintel.mp4');
        this.loader.load();
        console.log("toLoadElement");
    }

    public onLoadProgress(loader?, loadedResource?):void{
        super.onLoadProgress(loader, loadedResource);

    }


    private bunny:PIXI.Sprite;
    public toSettingElement(loader?, resources?):void{
        super.toSettingElement(loader, resources);
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
    }

    private toSetVideoSize():void{
        //console.log(this.videoTexture.width);
        if(!this.videoTexture){
            return;
        }
        if(this.videoTexture.width == 0 || this.videoTexture.height == 0){
            this.videoSP.visible = false;
            return
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
    }


    public onTransitionInComplete():void{
        super.onTransitionInComplete();
        console.log("onTransitionInComplete Video");
        this.toSetButton(this.bunny);
        this.toSetButton(this.videoSP);

        //PIXI.filters.GrayFilter
    }

    private clickNum:number = 1;
    public onClick(eventData):void{
        if(eventData.target.name == "bunny") {
            if(this.clickNum % 2 == 0) {
                this.controlVideo.pause();
            }else{
                this.controlVideo.play();
            }
            this.clickNum +=1;
        }else{
            this.toTransitionOut(2);
        }

    }


    private pauseId:any;
    private toPauseVideo(el) {
        console.log(el);
        this.pauseId = window.setInterval(function(){
            if (!el.paused) {
                this.toSetVideoSize();
                //console.log("videoSP : " + this.videoTexture.width, this.videoTexture.height);
                clearInterval(this.pauseId);
            }
            el.pause();
        }.bind(this), 1000);//10
    }


}