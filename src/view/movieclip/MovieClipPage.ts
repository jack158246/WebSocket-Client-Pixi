class MovieClipPage extends AbstractPage{

    constructor(){
        super();
    }

    public onResize():void{
        if(this.explosionMC){
            this.explosionMC.position.x = Config.stageWidth * 0.5;
            this.explosionMC.position.y = Config.stageHeight * 0.5;
        }
    }

    public onRemove():void{
        this.removeChild(this.explosionMC);
        this.explosionMC.destroy();
    }


    public toLoadElement():void{
        super.toLoadElement();

        this.loader.add('explosionTexture', './resource/assets/explosion/explosion.png');
        this.loader.add('explosion', './resource/assets/explosion/explosion.json');
        this.loader.load();
    }

    private explosionTextures:Array<PIXI.Texture> = [];
    private explosionMC:PIXI.extras.MovieClip;

    public toSettingElement(loader, resources):void{
        super.toSettingElement(loader, resources);
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
            var texture:PIXI.Texture = PIXI.Texture.fromFrame('Explosion_Sequence_A ' + (i+1) + '.png');
            this.explosionTextures.push(texture);
        }

        this.explosionMC = new PIXI.extras.MovieClip(this.explosionTextures);
        this.explosionMC.anchor.x = 0.5;
        this.explosionMC.anchor.y = 0.5;

        this.explosionMC.x = Config.stageWidth * 0.5;
        this.explosionMC.y = Config.stageHeight * 0.5;

        this.explosionMC.gotoAndPlay(Math.random() * 27);
        this.addChild(this.explosionMC);
    }

    public onTransitionInComplete():void{
        super.onTransitionInComplete();
        console.log("onTransitionInComplete MovieClip");
        this.toSetButton(this.explosionMC);
    }

    public onClick(eventData):void{
        this.toTransitionOut(0);
    }






}