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
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var MainUIUI = /** @class */ (function (_super) {
        __extends(MainUIUI, _super);
        function MainUIUI() {
            return _super.call(this) || this;
        }
        MainUIUI.prototype.createChildren = function () {
            _super.prototype.createChildren.call(this);
            this.createView(ui.MainUIUI.uiView);
        };
        MainUIUI.uiView = { "type": "View", "props": { "width": 600, "height": 400 }, "child": [{ "type": "Button", "props": { "y": 186, "x": 28, "var": "leftBtn", "skin": "comp/button.png", "label": "左" } }, { "type": "Button", "props": { "y": 188, "x": 508, "var": "rightBtn", "skin": "comp/button.png", "label": "右" } }, { "type": "Button", "props": { "y": 49, "x": 253, "var": "upBtn", "skin": "comp/button.png", "label": "上" } }, { "type": "Button", "props": { "y": 290, "x": 269, "var": "downBtn", "skin": "comp/button.png", "label": "下" } }] };
        return MainUIUI;
    }(View));
    ui.MainUIUI = MainUIUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map