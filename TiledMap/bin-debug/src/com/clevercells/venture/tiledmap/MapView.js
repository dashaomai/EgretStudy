var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * Created by Bob Jiang on 2015/3/11.
 */
var tiledmap;
(function (tiledmap) {
    /**
     * 将一个地图对象 Map 展现出来的显示容器
     */
    var MapView = (function (_super) {
        __extends(MapView, _super);
        function MapView(map) {
            _super.call(this);
            this.map = map;
            this.drawMap();
        }
        /**
         * 绘制地图
         */
        MapView.prototype.drawMap = function () {
            // 将各 id 对应的纹理全部放入统一的 tileSetTextures 数组内
            this.tileSetTextures = [];
            var i, m;
            var j, n;
            var k, l;
            var id;
            var textureName;
            var texture, bitmap;
            var rect, subTexture;
            var ts;
            for (i = 0, m = this.map.tileSets.length; i < m; i++) {
                ts = this.map.tileSets[i];
                id = ts.firstGlobalId;
                textureName = tiledmap.convertResPathToId(ts.image);
                texture = RES.getRes(textureName);
                bitmap = new egret.Bitmap(texture);
                for (j = 0, n = ts.vTileCount; j < n; j++) {
                    for (k = 0, l = ts.hTileCount; k < l; k++) {
                        id++;
                        if (!this.map.usedTileSetIds[id])
                            continue;
                        rect = ts.getRectangleByTileId(id);
                        if (!rect) {
                            egret.Logger.info('x = ' + k + ', y = ' + j + ', rect = ' + rect);
                            continue;
                        }
                        subTexture = new egret.RenderTexture();
                        subTexture.drawToTexture(bitmap, rect);
                        // 很重要，必须重设这几项为 0，否则默认会是 rect.x 和 rect.y
                        subTexture._offsetX = subTexture._offsetY = 0;
                        this.tileSetTextures[id] = subTexture;
                    }
                }
            }
            RES.destroyRes(textureName);
            texture = null;
            // 循环各 TileLayer，将地图绘制出来
            var layer;
            var tileX, tileY;
            var bitmap;
            for (i = 0, m = this.map.layers.length; i < m; i++) {
                layer = this.map.layers[i];
                if (!layer.visible)
                    continue;
                for (j = 0, n = layer.tileIds.length; j < n; j++) {
                    tileY = Math.floor(j / layer.width);
                    tileX = j - tileY * layer.width;
                    id = layer.tileIds[j];
                    if (id === 0)
                        continue;
                    //egret.Logger.info('index = ' + j + ', id = ' + id + ', tileX = ' + tileX + ', tileY = ' + tileY + ', x = ' + (layer.x + tileX * map.tileWidth) + ', y = ' + (layer.y + tileY * map.tileHeight));
                    bitmap = new egret.Bitmap(this.tileSetTextures[id]);
                    bitmap.x = layer.x + tileX * this.map.tileWidth;
                    bitmap.y = layer.y + tileY * this.map.tileHeight;
                    this.addChild(bitmap);
                }
            }
            // 循环各 ObjectGroup，将对象绘制出来
            var group;
            var obj;
            for (i = 0, m = this.map.objectGroups.length; i < m; i++) {
                group = this.map.objectGroups[i];
                if (!group.visible)
                    continue;
                for (j = 0, n = group.objects.length; j < n; j++) {
                    obj = group.objects[j];
                    if (!obj.isTileObject) {
                        continue;
                    }
                    else {
                        // 图块对象
                        bitmap = new egret.Bitmap(this.tileSetTextures[obj.globalId]);
                        bitmap.x = layer.x + obj.x;
                        bitmap.y = layer.y + obj.y - this.map.tileHeight; // 可能是 Tiled 软件的坐标系有变化？ 需要 y 减自己，或 y 向脚点为 1
                        this.addChild(bitmap);
                    }
                }
            }
            // 根据 walkingData 内的可行走方向，把墙画出来
            var walkingData = this.map.walkingData;
            var walkByte;
            var wall = new egret.Shape();
            var g = wall.graphics;
            var tileWidth, tileHeight;
            tileWidth = this.map.tileWidth;
            tileHeight = this.map.tileHeight;
            var hPos, vPos;
            var tileX, tileY;
            var wallWidth = 2;
            var halfOfWallWidth = wallWidth / 2;
            var wallColor = 0xFFFF00;
            g.lineStyle(wallWidth, wallColor);
            for (i = 0, m = walkingData.length; i < m; i++) {
                walkByte = walkingData[i];
                if (walkByte === 0)
                    continue;
                vPos = Math.floor(i / this.map.width);
                hPos = i - vPos * this.map.width;
                tileX = hPos * tileWidth;
                tileY = vPos * tileHeight;
                // 绘制砖块的右墙
                if ((walkByte & tiledmap.Map.RIGHT) === 0) {
                    g.moveTo(tileX + tileWidth - wallWidth, tileY);
                    g.lineTo(tileX + tileWidth - wallWidth, tileY + tileHeight - wallWidth);
                }
                // 上墙
                if ((walkByte & tiledmap.Map.UP) === 0) {
                    g.moveTo(tileX, tileY + halfOfWallWidth);
                    g.lineTo(tileX + tileWidth - wallWidth, tileY + halfOfWallWidth);
                }
                // 左墙
                if ((walkByte & tiledmap.Map.LEFT) === 0) {
                    g.moveTo(tileX + halfOfWallWidth, tileY);
                    g.lineTo(tileX + halfOfWallWidth, tileY + tileHeight - wallWidth);
                }
                // 下墙
                if ((walkByte & tiledmap.Map.DOWN) === 0) {
                    g.moveTo(tileX, tileY + tileHeight - wallWidth);
                    g.lineTo(tileX + tileWidth - wallWidth, tileY + tileHeight - wallWidth);
                }
            }
            g.endFill();
            wall.cacheAsBitmap = true;
            this.addChild(wall);
        };
        MapView.prototype.addTeam = function (team) {
            if (this.team)
                return;
            this.team = team;
            // TODO: 先使用默认的英雄形象
            var texture = RES.getRes('hero_png');
            this.teamAvatar = new egret.Bitmap(texture);
            this.addChild(this.teamAvatar);
            var doorIndex = this.map.getIndexOfType(tiledmap.MapObject.DOOR);
            if (doorIndex === -1)
                throw new Error('找不到迷宫内门的所在位置');
            this.moveTeamToIndex(doorIndex);
        };
        MapView.prototype.moveTeamToIndex = function (index) {
            if (index === -1)
                throw new Error('找不到对应的砖块索引');
            var doorX, doorY;
            doorY = Math.floor(index / this.map.width);
            doorX = index - doorY * this.map.width;
            this.teamAvatar.x = doorX * this.map.tileWidth;
            this.teamAvatar.y = doorY * this.map.tileHeight;
        };
        return MapView;
    })(egret.DisplayObjectContainer);
    tiledmap.MapView = MapView;
    MapView.prototype.__class__ = "tiledmap.MapView";
})(tiledmap || (tiledmap = {}));
