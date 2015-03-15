/**
 * Created by Bob Jiang on 2015/3/9.
 */
module tiledmap {
    export class TileSet {
        public firstGlobalId:number;
        public name:string;

        public tileWidth:number;
        public tileHeight:number;

        public spacing:number;
        public margin:number;

        public image:string;
        public imageWidth:number;
        public imageHeight:number;

        public constructor(param:any) {
            if (!hasProperties(
                    param,
                    'firstgid',
                    'name',
                    'image',
                    'imageheight',
                    'imagewidth',
                    'margin',
                    'spacing',
                    'tilewidth',
                    'tileheight'
            ))
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

        /**
         * 水平方向上的砖块数量
         * @returns {number}
         */
        public get hTileCount():number {
            return this.imageWidth / this.tileWidth;
        }

        /**
         * 垂直方向上的砖块数量
         * @returns {number}
         */
        public get vTileCount():number {
            return this.imageHeight / this.tileHeight;
        }

        public get lastGlobalId():number {
            return this.firstGlobalId + this.hTileCount * this.vTileCount;
        }

        /**
         * 指定一个砖块 id，判断它是否落在本 TileSet 之内
         * @param id
         */
        public containId(id:number):boolean {
            return id >= this.firstGlobalId && id < this.lastGlobalId;
        }

        /**
         * 指定一个砖块 id，取出它在当前纹理集当中的纹理坐标
         * @param id
         * @returns {*}
         */
        public getRectangleByTileId(id:number):egret.Rectangle {
            if (this.containId(id)) {
                var offset:number = id - this.firstGlobalId;
                var rows:number = Math.floor(offset / this.hTileCount);
                var cols:number = offset - this.hTileCount * rows;

                return new egret.Rectangle(cols * this.tileWidth, rows * this.tileHeight, this.tileWidth, this.tileHeight);
            } else {
                return null;
            }
        }
    }
}