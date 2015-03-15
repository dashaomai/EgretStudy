/**
 * Created by Bob Jiang on 2015/3/9.
 */
var tiledmap;
(function (tiledmap) {
    var TiledMapParser = (function () {
        function TiledMapParser() {
        }
        /**
         * 提供一个 json 地图文件的 id，读取并解析它
         * @param resId
         * @returns {*}
         */
        TiledMapParser.parse = function (resId) {
            var mapJson = RES.getRes(resId);
            if (!mapJson)
                return null;
            return new tiledmap.Map(mapJson);
        };
        return TiledMapParser;
    })();
    tiledmap.TiledMapParser = TiledMapParser;
    TiledMapParser.prototype.__class__ = "tiledmap.TiledMapParser";
})(tiledmap || (tiledmap = {}));
