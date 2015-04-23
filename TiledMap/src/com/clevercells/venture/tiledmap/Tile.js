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
        return Tile;
    })();
    tiledmap.Tile = Tile;
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
})(tiledmap || (tiledmap = {}));
//# sourceMappingURL=Tile.js.map