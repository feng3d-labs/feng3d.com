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
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddedToStage, _this);
        return _this;
    }
    Main.prototype.onAddedToStage = function () {
        var stageWidth = this.stage.stageWidth;
        var stageHeight = this.stage.stageHeight;
        var txt = new egret.TextField();
        txt.text = "这是feng3d与egret配合使用的示例";
        this.addChild(txt);
        // var w = 40, h = 20;
        var leftBtn = this.leftBtn = new Button();
        leftBtn.x = 20;
        leftBtn.y = (stageHeight - leftBtn.height) / 2;
        var rightBtn = this.rightBtn = new Button();
        rightBtn.x = stageWidth - rightBtn.width - 20;
        rightBtn.y = (stageHeight - rightBtn.height) / 2;
        var topBtn = this.topBtn = new Button();
        topBtn.x = (stageWidth - topBtn.width) / 2;
        topBtn.y = 50;
        var bottomBtn = this.bottomBtn = new Button();
        bottomBtn.x = (stageWidth - bottomBtn.width) / 2;
        bottomBtn.y = stageHeight - bottomBtn.height - 20;
        leftBtn.touchEnabled = true;
        rightBtn.touchEnabled = true;
        topBtn.touchEnabled = true;
        bottomBtn.touchEnabled = true;
        this.addChild(leftBtn);
        this.addChild(rightBtn);
        this.addChild(topBtn);
        this.addChild(bottomBtn);
        leftBtn.addEventListener("touchTap", this.onTouchTap, this);
        rightBtn.addEventListener("touchTap", this.onTouchTap, this);
        topBtn.addEventListener("touchTap", this.onTouchTap, this);
        bottomBtn.addEventListener("touchTap", this.onTouchTap, this);
    };
    Main.prototype.onTouchTap = function (e) {
        switch (e.currentTarget) {
            case this.leftBtn:
                cube.transform.x--;
                break;
            case this.rightBtn:
                cube.transform.x++;
                break;
            case this.topBtn:
                cube.transform.y++;
                break;
            case this.bottomBtn:
                cube.transform.y--;
                break;
        }
    };
    return Main;
}(egret.Sprite));
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(w, h) {
        if (w === void 0) { w = 100; }
        if (h === void 0) { h = 40; }
        var _this = _super.call(this) || this;
        _this.graphics.beginFill(0xff0000);
        _this.graphics.drawRect(0, 0, w, h);
        _this.graphics.endFill();
        return _this;
    }
    return Button;
}(egret.Sprite));
window.onload = function () {
    //启动 egret
    egret.runEgret({ renderMode: "webgl", audioType: 0 });
    //
    initFeng3d();
};
var feng3dCanvas;
var cube;
function initFeng3d() {
    feng3dCanvas = document.getElementById("feng3d");
    var engine = new feng3d.Engine(feng3dCanvas);
    engine.scene.background = new feng3d.Color4(0, 0, 0, 0.5);
    cube = feng3d.gameObjectFactory.createCube();
    cube.getComponent(feng3d.Model).material.uniforms.u_diffuse = new feng3d.Color4(1, 0, 1, 1);
    cube.transform.z = 4;
    cube.transform.y = -1;
    engine.scene.gameObject.addChild(cube);
    feng3d.ticker.onframe(function () {
        cube.transform.ry++;
    });
}
//# sourceMappingURL=main.js.map