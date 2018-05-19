var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Label = Laya.Label;
var Handler = Laya.Handler;
var Loader = Laya.Loader;
var WebGL = Laya.WebGL;
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.upBtn.on(laya.events.Event.CLICK, _this, _this.onClick);
        _this.downBtn.on(laya.events.Event.CLICK, _this, _this.onClick);
        _this.leftBtn.on(laya.events.Event.CLICK, _this, _this.onClick);
        _this.rightBtn.on(laya.events.Event.CLICK, _this, _this.onClick);
        return _this;
    }
    Main.prototype.onClick = function (e) {
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
    };
    return Main;
}(ui.MainUIUI));
Config.isAlpha = true;
//程序入口
Laya.init(600, 400, WebGL);
//激活资源版本控制
Laya.ResourceVersion.enable("version.json", Handler.create(null, beginLoad), Laya.ResourceVersion.FILENAME_VERSION);
function beginLoad() {
    Laya.loader.load("res/atlas/comp.atlas", Handler.create(null, onLoaded));
}
function onLoaded() {
    //实例UI界面
    var testUI = new Main();
    Laya.stage.addChild(testUI);
    Laya.stage.bgColor = null;
}
// 初始化feng3d
var engine = new feng3d.Engine(document.getElementById("feng3d"));
var cube = feng3d.gameObjectFactory.createCube();
cube.transform.z = 4;
cube.transform.y = -1;
engine.scene.gameObject.addChild(cube);
engine.canvas.style.left = 0 + "px";
engine.canvas.style.top = 0 + "px";
engine.canvas.style.width = Laya.stage.width + "px";
engine.canvas.style.height = Laya.stage.height + "px";
feng3d.ticker.onframe(function () {
    cube.transform.ry++;
});
//# sourceMappingURL=Main.js.map