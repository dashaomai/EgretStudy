/**
 * Created by Bob Jiang on 2015/3/9.
 */
var tiledmap;
(function (tiledmap) {
    var TileSet = (function () {
        function TileSet(param) {
            if (!tiledmap.hasProperties(param, 'firstgid', 'name', 'image', 'imageheight', 'imagewidth', 'margin', 'spacing', 'tilewidth', 'tileheight'))
                return;
            this.firstGlobalId = param['firstgid'];
            this.name = param['name'];
            this.tileWidth = param['tilewidth'];
            this.tileHeight = param['tileheight'];
            this.spacing = param['spacing'];
            this.margin = param['margin'];
            this.image = param['image'];
            this.imageWidth = param['imagewidth'];
            this.imageHeight = param['imageheight'];
        }
        Object.defineProperty(TileSet.prototype, "hTileCount", {
            /**
             * 水平方向上的砖块数量
             * @returns {number}
             */
            get: function () {
                return this.imageWidth / this.tileWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileSet.prototype, "vTileCount", {
            /**
             * 垂直方向上的砖块数量
             * @returns {number}
             */
            get: function () {
                return this.imageHeight / this.tileHeight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileSet.prototype, "lastGlobalId", {
            get: function () {
                return this.firstGlobalId + this.hTileCount * this.vTileCount;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * 指定一个砖块 id，判断它是否落在本 TileSet 之内
         * @param id
         */
        TileSet.prototype.containId = function (id) {
            return id >= this.firstGlobalId && id < this.lastGlobalId;
        };
        /**
         * 指定一个砖块 id，取出它在当前纹理集当中的纹理坐标
         * @param id
         * @returns {*}
         */
        TileSet.prototype.getRectangleByTileId = function (id) {
            if (this.containId(id)) {
                var offset = id - this.firstGlobalId;
                var rows = Math.floor(offset / this.hTileCount);
                var cols = offset - this.hTileCount * rows;
                return new egret.Rectangle(cols * this.tileWidth, rows * this.tileHeight, this.tileWidth, this.tileHeight);
            }
            else {
                return null;
            }
        };
        return TileSet;
    })();
    tiledmap.TileSet = TileSet;
    TileSet.prototype.__class__ = "tiledmap.TileSet";
})(tiledmap || (tiledmap = {}));
