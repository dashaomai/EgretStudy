/**
 * Created by Bob Jiang on 2015/3/9.
 */
var tiledmap;
(function (tiledmap) {
    var Map = (function () {
        function Map(param) {
            if (!tiledmap.hasProperties(param, 'version', 'orientation', 'renderorder', 'width', 'height', 'tilewidth', 'tileheight', 'nextobjectid', 'tilesets', 'layers'))
                return;
            tiledmap.copyProperties(this, param, ['version', 'orientation', 'renderOrder', 'width', 'height', 'tileWidth', 'tileHeight', 'nextObjectId'], ['version', 'orientation', 'renderorder', 'width', 'height', 'tilewidth', 'tileheight', 'nextobjectid']);
            this.tileSets = [];
            this.layers = [];
            this.objectGroups = [];
            var i, m;
            var obj;
            var array;
            array = param['tilesets'];
            for (i = 0, m = array.length; i < m; i++) {
                this.tileSets.push(new tiledmap.TileSet(array[i]));
            }
            array = param['layers'];
            for (i = 0, m = array.length; i < m; i++) {
                obj = array[i];
                switch (obj['type']) {
                    case 'tilelayer':
                        this.layers.push(new tiledmap.Layer(obj));
                        break;
                    case 'objectgroup':
                        this.objectGroups.push(new tiledmap.ObjectGroup(obj));
                        break;
                }
            }
            this.calculateTileData();
        }
        /**
         * 根据已经获得的 layers 数组，构造出 tileData 数据数组的内容
         */
        Map.prototype.calculateTileData = function () {
            if (!this.tileData)
                this.tileData = [];
            else
                this.tileData.length = 0;
            if (!this.objectData)
                this.objectData = [];
            else
                this.objectData.length = 0;
            if (!this.walkingData)
                this.walkingData = [];
            else
                this.walkingData.length = this.width * this.height;
            if (!this.usedTileSetIds)
                this.usedTileSetIds = [];
            else
                this.usedTileSetIds.length = 0;
            // 将 this.tileData 短路成本地变量
            var tileData;
            tileData = this.tileData;
            // 将 this.walkingData 短路成本地变量
            var walkingData;
            walkingData = this.walkingData;
            var i, m;
            var j, n;
            for (i = 0, m = this.width * this.height; i < m; i++) {
                walkingData[i] = 0;
            }
            // 按现有图层转换为 tileData 及 walkingData
            var layer;
            var tile;
            var hPos, vPos;
            var hTileCount;
            hTileCount = this.width;
            var walkByte;
            var tileSetId;
            for (i = 0, m = this.layers.length; i < m; i++) {
                layer = this.layers[i];
                for (j = 0, n = layer.tileIds.length; j < n; j++) {
                    vPos = Math.floor(j / hTileCount);
                    hPos = j - vPos * hTileCount;
                    tileSetId = layer.tileIds[j];
                    if (tileSetId !== 0) {
                        tile = new tiledmap.Tile();
                        //tile.tid = tileData[j] ? tileData[j].tid : tid++;
                        tile.x = hPos;
                        tile.y = vPos;
                        tileData[j] = tile;
                        // 判断 walkingData 内当前格四方向是否可走
                        walkByte = walkingData[j];
                        // 如果以前的图层没有让当下砖块可向右行走，则判断本层能否实现该目标
                        if ((walkByte & Map.RIGHT) === 0) {
                            // 如果砖块不在最右边，而且它右方有砖块，则可以向右行走
                            if (hPos < this.width - 1 && layer.tileIds[j + 1] !== 0) {
                                walkByte |= Map.RIGHT;
                            }
                        }
                        // 上
                        if ((walkByte & Map.UP) === 0) {
                            // 如果砖块不在是上边，而且它上方有砖块，则可以向上行走
                            if (vPos > 0 && layer.tileIds[j - hTileCount] !== 0) {
                                walkByte |= Map.UP;
                            }
                        }
                        // 左
                        if ((walkByte & Map.LEFT) === 0) {
                            if (hPos > 0 && layer.tileIds[j - 1] !== 0) {
                                walkByte |= Map.LEFT;
                            }
                        }
                        // 下
                        if ((walkByte & Map.DOWN) === 0) {
                            if (vPos < this.height - 1 && layer.tileIds[j + hTileCount] !== 0) {
                                walkByte |= Map.DOWN;
                            }
                        }
                        walkingData[j] = walkByte;
                        // 记录当前格所使用的 tileSet 纹理 id
                        this.usedTileSetIds[tileSetId] = true;
                    }
                    else {
                        this.usedTileSetIds[tileSetId] = false;
                    }
                }
            }
            // 按现有对象层更新 tileData 及 walkingData
            var group;
            var obj;
            var objTile;
            // 内墙数组
            var innerWalls;
            innerWalls = [];
            var tileWidth, tileHeight;
            var idx;
            tileWidth = this.tileWidth;
            tileHeight = this.tileHeight;
            for (i = 0, m = this.objectGroups.length; i < m; i++) {
                group = this.objectGroups[i];
                for (j = 0, n = group.objects.length; j < n; j++) {
                    obj = group.objects[j];
                    if (obj.isTileObject) {
                        objTile = new tiledmap.ObjectTile();
                        //objTile.tid = tileData[j] ? tileData[j].tid : tid++;
                        objTile.x = obj.x / tileWidth;
                        objTile.y = obj.y / tileHeight - 1; // object 类型的 y 坐标是不对的，要上移一砖
                        objTile.type = tiledmap.getTypeByString(obj.type);
                        objTile.properties = obj.properties;
                        idx = this.getIndexOfPosXY(objTile.x, objTile.y);
                        this.objectData.push(objTile);
                        // 对 walkingData 的砖块类型进行覆盖式更新
                        walkByte = walkingData[idx];
                        if (walkByte === 0)
                            throw new Error('居然把对象放在无砖块的格子里了！');
                        // TODO: type 要改为从数值表读取
                        walkByte |= (objTile.type << 4);
                        walkingData[idx] = walkByte;
                        this.usedTileSetIds[obj.globalId] = true;
                    }
                    else if ((obj.width === 0 && obj.height > 0) || (obj.width > 0 && obj.height === 0)) {
                        // 内墙对象先添加到相关数组里，为之后 walkingData 数组 patch 而使用
                        innerWalls.push(obj);
                    }
                }
            }
            // 借内墙数组对 walkingData 进行可行走方向的 patch
            var cross; // 某内墙跨越了多少砖块
            for (i = 0, m = innerWalls.length; i < m; i++) {
                obj = innerWalls[i];
                hPos = obj.x / this.tileWidth;
                vPos = obj.y / this.tileHeight; // 这里不需要减 1
                if (obj.width > 0) {
                    // 这是横向墙
                    cross = obj.width / this.tileWidth;
                    for (j = hPos, n = hPos + cross; j < n; j++) {
                        // 上一行不能往下走
                        if (vPos > 0)
                            walkingData[j + (vPos - 1) * hTileCount] &= ~Map.DOWN;
                        // 当前行不能往上走
                        walkingData[j + vPos * hTileCount] &= ~Map.UP; // ~ 为按位取反操作
                    }
                }
                else {
                    // 这是纵向墙
                    cross = obj.height / this.tileHeight;
                    for (j = vPos, n = vPos + cross; j < n; j++) {
                        // 前一列不能往右走
                        if (hPos > 0)
                            walkingData[hPos + j * hTileCount - 1] &= ~Map.RIGHT;
                        // 当前列不能往左走
                        walkingData[hPos + j * hTileCount] &= ~Map.LEFT;
                    }
                }
            }
            // 为所有 tile 计算 tid 并设置可行走方向信息
            var tid;
            tid = 0;
            for (i = 0, m = this.walkingData.length; i < m; i++) {
                walkByte = walkingData[i];
                if (walkByte) {
                    tile = tileData[i];
                    tile.tid = tid++;
                    tile.right = (walkByte & Map.RIGHT) > 0;
                    tile.up = (walkByte & Map.UP) > 0;
                    tile.left = (walkByte & Map.LEFT) > 0;
                    tile.down = (walkByte & Map.DOWN) > 0;
                    tile.index = i;
                }
            }
            //egret.Logger.info('walkingData = ' + JSON.stringify(walkingData));
        };
        /**
         * 指定对象砖块的类型（门、Boss 等），从当前地图找出它出现的第一个索引位置。
         * @param type
         * @returns {number}        该类型在地图上的第一个出现位置。如果为 -1，表示没找到
         */
        Map.prototype.getIndexOfType = function (type) {
            var ot;
            for (var i = 0, m = this.objectData.length; i < m; i++) {
                ot = this.objectData[i];
                if (ot.type == type)
                    return ot.x + ot.y * this.width;
            }
            return -1;
        };
        /**
         * 指定对象砖块的类型（采集点，宝箱候选点等），从当前地图找出它出现的所有索引位置
         * @param type
         * @returns {number[]}
         */
        Map.prototype.getIndexesOfType = function (type) {
            var ot;
            var result = [];
            for (var i = 0, m = this.objectData.length; i < m; i++) {
                ot = this.objectData[i];
                if (ot.type == type)
                    result.push(ot.x + ot.y * this.width);
            }
            return result;
        };
        /**
         * 根据指定的两个索引数，找出其间由索引组成的路径数组
         * @param index0        起点索引
         * @param index1        终点索引
         */
        Map.prototype.findPathWithIndexes = function (index0, index1) {
            var path = [];
            // TODO: 需要一个真正的 A* 级别算法
            var tileData = this.tileData;
            //var walkingData:number[] = this.walkingData;
            var hTileCount = this.width;
            var open = [];
            var close = [];
            var tile = tileData[index0];
            var nextTile, nearestInOpen;
            var target = tileData[index1];
            tile.G = 0;
            tile.guessDistance(target);
            tile.parentIndex = 0;
            open.push(tile);
            var pid;
            var i, m, f;
            for (; tile.H !== 0;) {
                // 如果某方向可走，则它对应该方向上下一格一定是索引存在的，不需要额外的检查
                if (tile.right) {
                    nextTile = tileData[tile.index + 1];
                    // TODO: 待续
                    if (close.indexOf(nextTile) === -1) {
                        if (open.indexOf(nextTile) === -1) {
                            nextTile.setParent(tile);
                            nextTile.guessDistance(target);
                            open.push(nextTile);
                        }
                    }
                }
                if (tile.up) {
                    nextTile = tileData[tile.index - hTileCount];
                    if (close.indexOf(nextTile) === -1) {
                        if (open.indexOf(nextTile) === -1) {
                            nextTile.setParent(tile);
                            nextTile.guessDistance(target);
                            open.push(nextTile);
                        }
                    }
                }
                if (tile.left) {
                    nextTile = tileData[tile.index - 1];
                    if (close.indexOf(nextTile) === -1) {
                        if (open.indexOf(nextTile) === -1) {
                            nextTile.setParent(tile);
                            nextTile.guessDistance(target);
                            open.push(nextTile);
                        }
                    }
                }
                if (tile.down) {
                    nextTile = tileData[tile.index + hTileCount];
                    if (close.indexOf(nextTile) === -1) {
                        if (open.indexOf(nextTile) === -1) {
                            nextTile.setParent(tile);
                            nextTile.guessDistance(target);
                            open.push(nextTile);
                        }
                    }
                }
                open.splice(open.indexOf(tile), 1);
                close.push(tile);
                pid = tile.index;
                // 找出 open 列表内现存 F 值最小的砖块，作为下一循环使用
                nearestInOpen = 0;
                f = 4096; // 先设置 f 参数为路径不可能达到的最大值
                for (i = 0, m = open.length; i < m; i++) {
                    tile = open[i];
                    if (tile.parentIndex === pid && tile.F < f) {
                        f = tile.F;
                        nearestInOpen = i;
                    }
                }
                tile = open[nearestInOpen];
            }
            for (i = 0, m = close.length; i < m; i++) {
                tile = close[i];
                path.push(tile.index);
            }
            path.push(index1);
            return path;
        };
        /**
         * 根据指定的砖块横纵值，返回它在一维数组内的索引位置
         * @param x
         * @param y
         * @returns {number}
         */
        Map.prototype.getIndexOfPosXY = function (x, y) {
            return y * this.width + x;
        };
        // 四个方向的二进制定义
        Map.RIGHT = 1; // 0001
        Map.UP = 2; // 0010
        Map.LEFT = 4; // 0100
        Map.DOWN = 8; // 1000
        return Map;
    })();
    tiledmap.Map = Map;
    Map.prototype.__class__ = "tiledmap.Map";
})(tiledmap || (tiledmap = {}));
