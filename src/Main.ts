declare var Stats;
class Main {
    public static canvas;
    public static canvasScale:number = 1;
    public static renderer;
    private stage:PIXI.Container;
    private stats;
    private container;

    constructor(){
        this.toSetStats();
        this.toInit();
        $(window).on('resize', this.onWindowResize.bind(this));
    }

    private onWindowResize():void {
        console.log("onWindowResize");
        Main.renderer.resize(window.innerWidth, window.innerHeight);

        Config.stageWidth = Main.canvas.width * Main.canvasScale;
        Config.stageHeight = Main.canvas.height * Main.canvasScale;
    }

    private toSetStats():void{
        this.container = document.createElement("div");
        document.body.appendChild(this.container);

        this.stats = new Stats();
        this.container.appendChild(this.stats.domElement);
        this.stats.domElement.style.position = "absolute";
        this.stats.domElement.style.top = "0px";
        this.stats.domElement.style.right = "0px";
    }

    private toInitPixi():void{
        //var renderer = new PIXI.WebGLRenderer(800, 600);
        //document.body.appendChild(renderer.view);
        Main.canvas = document.createElement('canvas');
        $('#canvas-container').append(Main.canvas);

        Main.renderer = PIXI.autoDetectRenderer(window.innerWidth,window.innerHeight,{
            view:Main.canvas,
            //resolution:window.devicePixelRatio,
            resolution:1,
            backgroundColor:0x263332,
            transparent:true
        });



        this.onWindowResize();

        this.stage = new PIXI.Container();
        this.onRender();
    }

    private onRender() {
        // start the timer for the next animation loop
        requestAnimationFrame(this.onRender.bind(this));
        Main.renderer.render(this.stage);
        window.scrollTo(0,0);

        if(this.stats){
            this.stats.update();
        }
    }

    //==========================================================================
    private toInit():void{
        this.toInitPixi();
        this.toCreatePage(0);
    }

    private pId:number = 0;
    private pageA:Array<any> = [ HomePage, VideoPage, MovieClipPage, physicalPage ];
    private nowPage:AbstractPage;

    private toCreatePage(id:number = -1):void{
        if(this.nowPage){
            this.nowPage.toTransitionOut(id);
            return;
        }

        this.pId = id;
        var tmpClass:any = this.pageA[id];
        this.nowPage = new tmpClass();
        this.stage.addChild(this.nowPage);
        this.nowPage.on(PageEvent.PAGE_OUT_COMPLETE, this.onPageStatus.bind(this));

    }

    private onPageStatus(eventData):void{
        this.stage.removeChild(this.nowPage);
        this.nowPage = null;

        if(eventData.id != -1){
            this.toCreatePage(eventData.id);
        }

    }

}