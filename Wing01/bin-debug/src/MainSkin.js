var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MainSkin = (function (_super) {
    __extends(MainSkin, _super);
    function MainSkin() {
        _super.call(this);
        this.__s = egret.gui.setProperties;
        this.__s(this, ["height", "width"], [300, 400]);
        this.elementsContent = [this.__3_i()];
        this.states = [
            new egret.gui.State("normal", [
            ]),
            new egret.gui.State("disabled", [
            ])
        ];
    }
    Object.defineProperty(MainSkin.prototype, "skinParts", {
        get: function () {
            return MainSkin._skinParts;
        },
        enumerable: true,
        configurable: true
    });
    MainSkin.prototype.confirm_i = function () {
        var t = new egret.gui.Button();
        this.confirm = t;
        this.__s(t, ["label", "left", "skinName", "top"], ["按钮", 0, skins.simple.ButtonSkin, 0]);
        return t;
    };
    MainSkin.prototype.__3_i = function () {
        var t = new egret.gui.Group();
        this.__s(t, ["bottom", "left", "right", "top"], [10, 10, 10, 10]);
        t.elementsContent = [this.confirm_i()];
        return t;
    };
    MainSkin._skinParts = ["confirm"];
    return MainSkin;
})(egret.gui.Skin);
MainSkin.prototype.__class__ = "MainSkin";
