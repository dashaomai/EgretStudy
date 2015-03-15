var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by bob on 15/1/27.
 */
var MainSkinPanel = (function (_super) {
    __extends(MainSkinPanel, _super);
    function MainSkinPanel() {
        _super.call(this);
        this.skinName = 'MainSkin';
    }
    MainSkinPanel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
        switch (instance) {
            case this.confirm:
                this.confirm.label = '注入成功';
                this.confirm.addEventListener(egret.TouchEvent.TOUCH_END, this.onConfirmClickedHandler, this);
                break;
        }
    };
    MainSkinPanel.prototype.onConfirmClickedHandler = function (e) {
        alert('clicked!');
    };
    return MainSkinPanel;
})(egret.gui.Panel);
MainSkinPanel.prototype.__class__ = "MainSkinPanel";
