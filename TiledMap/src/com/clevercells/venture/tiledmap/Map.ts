/**
 * Created by Bob Jiang on 2015/3/9.
 */
module tiledmap {
    export class Map {

        // 四个方向的二进制定义
        public static RIGHT:number = 1;     // 0001
        public static UP:number = 2;        // 0010
        public static LEFT:number = 4;      // 0100
        public static DOWN:number = 8;      // 1000

        public version:number;

        public orientation:string;
        public renderOrder:string;

        public width:number;
        public height:number;

        public tileWidth:number;
        public tileHeight:number;

        public nextObjectId:number;

        public tileSets:TileSet[];
        public layers:Layer[];
        public objectGroups:ObjectGroup[];

        // 可行走数据的数组，这是一维数组，存放所有的路径结点
        public tileData:Tile[];
        public walkingData:number[];

        public constructor(param:any) {
            if (!hasProperties(
                    param,
                    'version',
                    'orientation',
                    'renderorder',
                    'width',
                    'height',
                    'tilewidth',
                    'tileheight',
                    'nextobjectid',
                    'tilesets',
                    'layers'

            ))
                return;

            copyProperties(
                this, param,
                ['version', 'orientation', 'renderOrder',
                    'width', 'height', 'tileWidth', 'tileHeight',
                    'nextObjectId'],
                ['version', 'orientation', 'renderorder',
                    'width', 'height', 'tilewidth', 'tileheight',
                    'nextobjectid']
            );


            //this.version = parseInt(param['version']);
            //
            //this.orientation = param['orientation'];
            //this.renderOrder = param['renderorder'];
            //
            //this.width = parseInt(param['width']);
            //this.height = parseInt(param['height']);
            //
            //this.tileWidth = parseInt(param['tilewidth']);
            //this.tileHeight = parseInt(param['tileheight']);
            //
            //this.nextObjectId = parseInt(param['nextobjectid']);

            this.tileSets = [];
            this.layers = [];
            this.objectGroups = [];

            var i:number, m:number;
            var obj:any;
            var array:any[];

            array = param['tilesets'];

            for (i=0, m=array.length; i<m; i++) {
                this.tileSets.push(new TileSet(array[i]));
            }

            array = param['layers'];

            for (i=0, m=array.length; i<m; i++) {
                obj = array[i];

                switch (obj['type']) {
                    case 'tilelayer':
                        this.layers.push(new Layer(obj));
                        break;

                    case 'objectgroup':
                        this.objectGroups.push(new ObjectGroup(obj));
                        break;
                }
            }

            this.calculateTileData();
        }

        /**
         * 根据已经获得的 layers 数组，构造出 tileData 数据数组的内容
         */
        private calculateTileData():void {
            if (!this.tileData)
                this.tileData = [];
            else
                this.tileData.length = 0;

            if (!this.walkingData)
                this.walkingData = [];
            else
                this.walkingData.length = this.width * this.height;

            // 将 this.tileData 短路成本地变量
            var tileData:Tile[];
            tileData = this.tileData;

            // 将 this.walkingData 短路成本地变量
            var walkingData:number[];
            walkingData = this.walkingData;

            var i:number, m:number;
            var j:number, n:number;

            // 将 walkingData 数组内容以零初始化
            for (i=0, m=this.width * this.height; i<m; i++) {
                walkingData[i] = 0;
            }

            // 按现有图层转换为 tileData 及 walkingData
            var layer:Layer;

            var tile:Tile;

            var hPos:number, vPos:number;
            var hTileCount:number;

            hTileCount = this.width;

            var walkByte:number;

            for (i=0, m=this.layers.length; i<m; i++) {
                layer = this.layers[i];

                for (j=0, n=layer.tileIds.length; j<n; j++) {

                    vPos = Math.floor(j / hTileCount);
                    hPos = j - vPos * hTileCount;

                    if (layer.tileIds[j] !== 0) {
                        tile = new Tile();
                        //tile.tid = tileData[j] ? tileData[j].tid : tid++;
                        tile.x = hPos;
                        tile.y = vPos;

                        tileData[j] = tile;

                        // 判断 walkingData 内当前格四方向是否可走
                        walkByte = walkingData[j];

                        // 如果以前的图层没有让当下砖块可向右行走，则判断本层能否实现该目标
                        if ((walkByte & Map.RIGHT) === 0) {
                            // 如果砖块不在最右边，而且它右方有砖块，则可以向右行走
                            if (hPos < this.width - 1 && layer.tileIds[j+1] !== 0) {
                                walkByte |= Map.RIGHT;
                            }
                        }

                        // 上
                        if ((walkByte & Map.UP) === 0) {
                            // 如果砖块不在是上边，而且它上方有砖块，则可以向上行走
                            if (vPos > 0 && layer.tileIds[j-hTileCount] !== 0) {
                                walkByte |= Map.UP;
                            }
                        }

                        // 左
                        if ((walkByte & Map.LEFT) === 0) {
                            if (hPos > 0 && layer.tileIds[j-1] !== 0) {
                                walkByte |= Map.LEFT;
                            }
                        }

                        // 下
                        if ((walkByte & Map.DOWN) === 0) {
                            if (vPos < this.height - 1 && layer.tileIds[j+hTileCount] !== 0) {
                                walkByte |= Map.DOWN;
                            }
                        }

                        walkingData[j] = walkByte;
                    }
                }
            }

            // 按现有对象层更新 tileData 及 walkingData
            var group:ObjectGroup;
            var obj:MapObject;

            var objTile:ObjectTile;

            // 内墙数组
            var innerWalls:MapObject[];
            innerWalls = [];

            var tileWidth:number, tileHeight:number;
            var idx:number;

            tileWidth = this.tileWidth;
            tileHeight = this.tileHeight;

            for (i=0, m=this.objectGroups.length; i<m; i++) {
                group = this.objectGroups[i];

                for (j=0, n=group.objects.length; j<n; j++) {
                    obj = group.objects[j];

                    if (obj.isTileObject) {

                        objTile = new ObjectTile();
                        //objTile.tid = tileData[j] ? tileData[j].tid : tid++;
                        objTile.x = obj.x / tileWidth;
                        objTile.y = obj.y / tileHeight - 1;       // object 类型的 y 坐标是不对的，要上移一砖
                        objTile.type = obj.type;
                        objTile.properties = obj.properties;

                        idx = this.getIndexOfPosXY(objTile.x, objTile.y);

                        tileData[idx] = objTile;

                        // 对 walkingData 的砖块类型进行覆盖式更新
                        walkByte = walkingData[idx];

                        if (walkByte === 0)
                            throw new Error('居然把对象放在无砖块的格子里了！');

                        // TODO: type 要改为从数值表读取
                        walkByte |= getTypeByString(obj.type);

                        walkingData[idx] = walkByte;
                    } else if ((obj.width === 0 && obj.height > 0) || (obj.width > 0 && obj.height === 0)) {
                        // 内墙对象先添加到相关数组里，为之后 walkingData 数组 patch 而使用
                        innerWalls.push(obj);
                    }
                }
            }

            // 为所有 tile 计算 tid
            var tid:number;
            tid = 0;

            for (i=0, m=this.walkingData.length; i<m; i++) {
                if (walkingData[i]) {
                    tileData[i].tid = tid++;
                }
            }

            // 借内墙数组对 walkingData 进行可行走方向的 patch

            var cross:number;       // 某内墙跨越了多少砖块


            for (i=0, m=innerWalls.length; i<m; i++) {
                obj = innerWalls[i];
                hPos = obj.x / this.tileWidth;
                vPos = obj.y / this.tileHeight;             // 这里不需要减 1

                if (obj.width > 0) {
                    // 这是横向墙
                    cross = obj.width / this.tileWidth;

                    for (j=hPos, n=hPos + cross; j<n; j++) {
                        // 上一行不能往下走
                        if (vPos > 0)
                            walkingData[j + (vPos - 1) * hTileCount] &= ~Map.DOWN;
                        // 当前行不能往上走
                        walkingData[j + vPos * hTileCount] &= ~Map.UP;      // ~ 为按位取反操作
                    }
                } else {
                    // 这是纵向墙
                    cross = obj.height / this.tileHeight;

                    for (j=vPos, n=vPos + cross; j<n; j++) {
                        // 前一列不能往右走
                        if (hPos > 0)
                            walkingData[hPos + j * hTileCount - 1] &= ~Map.RIGHT;
                        // 当前列不能往左走
                        walkingData[hPos + j * hTileCount] &= ~Map.LEFT;
                    }
                }
            }

            egret.Logger.info('walkingData = ' + JSON.stringify(walkingData));
        }

        /**
         * 根据指定的砖块横纵值，返回它在一维数组内的索引位置
         * @param x
         * @param y
         * @returns {number}
         */
        private getIndexOfPosXY(x:number, y:number):number {
            return y * this.width + x;
        }
    }
}