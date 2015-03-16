var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var com;
(function (com) {
    var clevercells;
    (function (clevercells) {
        var hello;
        (function (hello) {
            var MapSkin = (function (_super) {
                __extends(MapSkin, _super);
                function MapSkin() {
                    _super.call(this);
                    this.__s = egret.gui.setProperties;
                    this.__s(this, ["height", "width"], [640, 960]);
                    this.elementsContent = [this.__4_i()];
                    this.states = [
                        new egret.gui.State("normal", []),
                        new egret.gui.State("disabled", [])
                    ];
                }
                Object.defineProperty(MapSkin.prototype, "skinParts", {
                    get: function () {
                        return MapSkin._skinParts;
                    },
                    enumerable: true,
                    configurable: true
                });
                MapSkin.prototype.__4_i = function () {
                    var t = new egret.gui.Group();
                    this.__s(t, ["percentHeight", "left", "top", "percentWidth"], [100, 0, 0, 100]);
                    t.layout = this.__3_i();
                    t.elementsContent = [this.nodeA_i(), this.nodeB_i(), this.nodeC_i()];
                    return t;
                };
                MapSkin.prototype.nodeA_i = function () {
                    var t = new egret.gui.Button();
                    this.nodeA = t;
                    this.__s(t, ["label", "x", "y"], ["进入迷宫 A", 370, 63]);
                    return t;
                };
                MapSkin.prototype.nodeB_i = function () {
                    var t = new egret.gui.Button();
                    this.nodeB = t;
                    this.__s(t, ["label", "x", "y"], ["进入迷宫 B", 207, 25]);
                    return t;
                };
                MapSkin.prototype.nodeC_i = function () {
                    var t = new egret.gui.Button();
                    this.nodeC = t;
                    this.__s(t, ["label", "x", "y"], ["进入迷宫 C", 402, 26]);
                    return t;
                };
                MapSkin.prototype.__3_i = function () {
                    var t = new egret.gui.HorizontalLayout();
                    return t;
                };
                MapSkin._skinParts = ["nodeA", "nodeB", "nodeC"];
                return MapSkin;
            })(egret.gui.Skin);
            hello.MapSkin = MapSkin;
            MapSkin.prototype.__class__ = "com.clevercells.hello.MapSkin";
        })(hello = clevercells.hello || (clevercells.hello = {}));
    })(clevercells = com.clevercells || (com.clevercells = {}));
})(com || (com = {}));
