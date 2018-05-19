import Label = Laya.Label;
import Handler = Laya.Handler;
import Loader = Laya.Loader;
import WebGL = Laya.WebGL;

class Main extends ui.MainUIUI {

    constructor() {
        super();

        this.upBtn.on(laya.events.Event.CLICK, this, this.onClick);
        this.downBtn.on(laya.events.Event.CLICK, this, this.onClick);
        this.leftBtn.on(laya.events.Event.CLICK, this, this.onClick);
        this.rightBtn.on(laya.events.Event.CLICK, this, this.onClick);
    }

    private onClick(e: laya.events.Event) {

        switch (e.currentTarget) {
            case this.leftBtn:
                cube.transform.x--;
                break;
            case this.rightBtn:
                cube.transform.x++;
                break;
            case this.upBtn:
                cube.transform.y++;
                break;
            case this.downBtn:
                cube.transform.y--;
                break;
        }
    }
}

Config.isAlpha = true;

//程序入口
Laya.init(600, 400, WebGL);

//激活资源版本控制
Laya.ResourceVersion.enable("version.json", Handler.create(null, beginLoad), Laya.ResourceVersion.FILENAME_VERSION);

function beginLoad() {
	Laya.loader.load("res/atlas/comp.atlas", Handler.create(null, onLoaded));
}

function onLoaded(): void {

	//实例UI界面
	var testUI: Main = new Main();
	Laya.stage.addChild(testUI);

	Laya.stage.bgColor = null;
}

// 初始化feng3d
var engine = new feng3d.Engine(<any>document.getElementById("feng3d"));
var cube = feng3d.gameObjectFactory.createCube();
cube.transform.z = 4;
cube.transform.y = -1;
engine.scene.gameObject.addChild(cube);

engine.canvas.style.left = 0 + "px";
engine.canvas.style.top = 0 + "px";
engine.canvas.style.width = Laya.stage.width + "px";
engine.canvas.style.height = Laya.stage.height + "px";

feng3d.ticker.onframe(() => {
	cube.transform.ry++;
});