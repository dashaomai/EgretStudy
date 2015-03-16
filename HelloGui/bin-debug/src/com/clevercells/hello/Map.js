var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by Bob Jiang on 2015/3/5.
 */
var com;
(function (com) {
    var clevercells;
    (function (clevercells) {
        var hello;
        (function (hello) {
            var Map = (function (_super) {
                __extends(Map, _super);
                function Map() {
                    _super.call(this);
                    this.skinName = 'com.clevercells.hello.MapSkin';
                }
                Map.prototype.partAdded = function (partName, instance) {
                    _super.prototype.partAdded.call(this, partName, instance);
                    switch (instance) {
                        case this.nodeA:
                        case this.nodeB:
                        case this.nodeC:
                            instance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
                            break;
                        default:
                            console.log('What\'s this?', instance);
                            break;
                    }
                };
                Map.prototype.onTapHandler = function (e) {
                    console.log('Taped ', e.target);
                };
                return Map;
            })(egret.gui.SkinnableComponent);
            hello.Map = Map;
            Map.prototype.__class__ = "com.clevercells.hello.Map";
        })(hello = clevercells.hello || (clevercells.hello = {}));
    })(clevercells = com.clevercells || (com.clevercells = {}));
})(com || (com = {}));
