class AbstractPage extends PIXI.Container{
    public loader:PIXI.loaders.Loader = new PIXI.loaders.Loader;
    public dataObj:any = {};

    constructor(){
        super();
        this.onInit();
    }

    public onResize():void{

    }


    public onRemove():void{

    }

    public onRender():void{
        requestAnimationFrame(this.onRender.bind(this));
    }

    private onInit():void{
        $(window).resize(this.onResize.bind(this));
        //this.on("LOAD_COMPLETE", this.onLoadComplete.bind(this));
        this.toLoadElement();
    }

    public toLoadElement():void{
        this.loader.reset()
        this.loader.on('progress', this.onLoadProgress.bind(this));
        this.loader.once('complete',this.onLoadComplete.bind(this));


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
    }

    public toSettingElement(loader?, resources?):void{
        this.onRender();

    }

    public onLoadProgress(loader?, loadedResource?):void{
        //console.dir(loadedResource);
        console.log('Progress:', loader.progress + '%');
    }

    public onLoadComplete(loader?, resources?):void{
        this.toSettingElement(loader, resources);
        this.onResize();
        this.alpha = 0;
        this.toTransitionIn();

    }

    public toTransitionIn():void{
        TweenMax.to(this, 0.6, {
            alpha: 1, ease: Quart.easeOut,
            onComplete: this.onTransitionInComplete.bind(this), onCompleteParams: ["TRANSITION_IN_COMPLETE"]
        });

    }

    public onTransitionInComplete():void{
        TweenMax.killTweensOf(this);

    }

    public toTransitionOut(id: number = -1):void{
        TweenMax.to(this, 0.6, {
            alpha: 0, ease: Quart.easeOut,
            onComplete: this.onTransitionOutComplete.bind(this), onCompleteParams: ["TRANSITION_OUT_COMPLETE", id]
        });


    }

    private onTransitionOutComplete(way: string, id: number = -1):void{
        TweenMax.killTweensOf(this);
        this.emit(PageEvent.PAGE_OUT_COMPLETE, {id:id});
    }

    public toSetButton(target):void{
        //pc 與 mobile 的事件狀態不同 無法共用;
        target.interactive = true;
        target.buttonMode = true;
        target.on("tap", this.onClick.bind(this)).on("click", this.onClick.bind(this));
    }

    public onClick(eventData):void{

    }
}