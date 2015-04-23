var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by Bob Jiang on 2015/3/12.
 */
var tiledmap;
(function (tiledmap) {
    /**
     * 迷宫内每个地块的数据值对象
     */
    var Tile = (function () {
        function Tile() {
        }
        Object.defineProperty(Tile.prototype, "F", {
            // 用于 A* 算法的几个重要变量
            get: function () {
                return this.G + this.H;
            } // = G + H
            ,
            enumerable: true,
            configurable: true
        });
        /**
         * 为当前砖块结点指定一个路径上的父结点
         * @param parent
         */
        Tile.prototype.setParent = function (parent) {
            this.parentIndex = parent.index;
            this.G = parent.G + 1;
        };
        /**
         * 猜测当前砖块点到目标结点的距离
         * @param target
         */
        Tile.prototype.guessDistance = function (target) {
            this.H = Math.abs(target.x - this.x) + Math.abs(target.y - this.y);
        };
        return Tile;
    })();
    tiledmap.Tile = Tile;
    Tile.prototype.__class__ = "tiledmap.Tile";
    /**
     * 放在 Object 层上的图形砖块，对应 MapObject 实例中 isTileObject 为 true 的对象图块
     */
    var ObjectTile = (function (_super) {
        __extends(ObjectTile, _super);
        function ObjectTile() {
            _super.apply(this, arguments);
        }
        return ObjectTile;
    })(Tile);
    tiledmap.ObjectTile = ObjectTile;
    ObjectTile.prototype.__class__ = "tiledmap.ObjectTile";
})(tiledmap || (tiledmap = {}));
