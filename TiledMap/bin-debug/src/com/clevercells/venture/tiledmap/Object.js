/**
 * Created by Bob Jiang on 2015/3/10.
 */
var tiledmap;
(function (tiledmap) {
    var MapObject = (function () {
        function MapObject(param) {
            if (!tiledmap.hasProperties(param, 'name', 'type', 'id', 'x', 'y', 'width', 'height', 'rotation', 'visible', 'properties'))
                return;
            tiledmap.copyProperties(this, param, ['name', 'type', 'id', 'globalId', 'x', 'y', 'width', 'height', 'rotation', 'visible', 'properties'], ['name', 'type', 'id', 'gid', 'x', 'y', 'width', 'height', 'rotation', 'visible', 'properties']);
        }
        Object.defineProperty(MapObject.prototype, "isTileObject", {
            /**
             * 根据是否存在 gid 来判断当前对象是图块对象还是普通矢量对象
             * @returns {boolean}
             */
            get: function () {
                return !!this.globalId;
            },
            enumerable: true,
            configurable: true
        });
        // 地图特殊对象的类型定义
        MapObject.NORMAL = 0; // 普通可行走地块
        MapObject.DOOR = 1; // 入口门
        MapObject.COLLECTION = 2; // 采集点
        MapObject.TRAP = 3; // 陷阱
        MapObject.BOSS = 4; // Boss
        MapObject.TREASURE = 5; // 宝箱候选点
        return MapObject;
    })();
    tiledmap.MapObject = MapObject;
    MapObject.prototype.__class__ = "tiledmap.MapObject";
    /**
     * 获取来自地图编辑器指定的对象类型文字描述，转换为内置的数字类型编号
     * @param strType
     * @returns {number}
     */
    function getTypeByString(strType) {
        switch (strType) {
            case 'door':
                return MapObject.DOOR;
            case 'collection':
                return MapObject.COLLECTION;
            case 'trap':
                return MapObject.TRAP;
            case 'boss':
                return MapObject.BOSS;
            case 'treasure':
                return MapObject.TREASURE;
            default:
                return MapObject.NORMAL;
        }
    }
    tiledmap.getTypeByString = getTypeByString;
})(tiledmap || (tiledmap = {}));
