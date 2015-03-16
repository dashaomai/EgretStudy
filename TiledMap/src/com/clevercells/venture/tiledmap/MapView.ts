/**
 * Created by Bob Jiang on 2015/3/11.
 */
module tiledmap {
    /**
     * 将一个地图对象 Map 展现出来的显示容器
     */
    export class MapView extends egret.DisplayObjectContainer {
        public map:Map;

        // tileSetTextures 内按各 TileSet 的 id 保存各自的 RenderTexture 实例
        private tileSetTextures:egret.Texture[];

        public constructor(map:Map) {
            super();

            this.map = map;

            // 将各 id 对应的纹理全部放入统一的 tileSetTextures 数组内
            this.tileSetTextures = [];

            var i:number, m:number;
            var j:number, n:number;
            var k:number, l:number;
            var id:number;
            var texture:egret.Texture, bitmap:egret.Bitmap;
            var rect:egret.Rectangle, subTexture:egret.RenderTexture;

            var ts:TileSet;
            for (i=0, m=map.tileSets.length; i<m; i++) {
                ts = map.tileSets[i];
                id = ts.firstGlobalId;
                texture = RES.getRes(convertResPathToId(ts.image));
                bitmap = new egret.Bitmap(texture);

                for (j=0, n=ts.vTileCount; j<n; j++) {

                    for (k=0, l=ts.hTileCount; k<l; k++) {
                        id ++;

                        if (!map.usedTileSetIds[id])
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

            // 循环各 TileLayer，将地图绘制出来
            var layer:Layer;
            var tileX:number, tileY:number;
            var bitmap:egret.Bitmap;

            for (i=0, m=map.layers.length; i<m; i++) {
                layer = map.layers[i];

                if (!layer.visible)
                    continue;

                //egret.Logger.info('process the layer: ' + JSON.stringify(layer));

                for (j=0, n=layer.tileIds.length; j<n; j++) {
                    tileY = Math.floor(j / layer.width);
                    tileX = j - tileY * layer.width;
                    id = layer.tileIds[j];

                    if (id === 0)
                        continue;

                    //egret.Logger.info('index = ' + j + ', id = ' + id + ', tileX = ' + tileX + ', tileY = ' + tileY + ', x = ' + (layer.x + tileX * map.tileWidth) + ', y = ' + (layer.y + tileY * map.tileHeight));

                    bitmap = new egret.Bitmap(this.tileSetTextures[id]);
                    bitmap.x = layer.x + tileX * map.tileWidth;
                    bitmap.y = layer.y + tileY * map.tileHeight;
                    this.addChild(bitmap);
                }
            }

            // 循环各 ObjectGroup，将对象绘制出来
            var group:ObjectGroup;
            var obj:MapObject;
            for (i=0, m=map.objectGroups.length; i<m; i++) {
                group = map.objectGroups[i];

                if (!group.visible)
                    continue;

                for (j=0, n=group.objects.length; j<n; j++) {
                    obj = group.objects[j];

                    if (!obj.isTileObject) {
                        // 非图块对象一律看作墙
                        continue;
                    } else {
                        // 图块对象
                        bitmap = new egret.Bitmap(this.tileSetTextures[obj.globalId]);
                        bitmap.x = layer.x + obj.x;
                        bitmap.y = layer.y + obj.y - map.tileHeight;        // 可能是 Tiled 软件的坐标系有变化？ 需要 y 减自己，或 y 向脚点为 1
                        this.addChild(bitmap);
                    }
                }
            }
        }
    }
}