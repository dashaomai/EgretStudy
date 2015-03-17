/**
 * Created by Bob Jiang on 2015/3/12.
 */
module tiledmap {
    /**
     * 迷宫内每个地块的数据值对象
     */
    export class Tile {
        // 按规定不超过 256 的 tiledId
        public tid:number;

        // 基于砖块的坐标（不是基于像素）
        public x:number;
        public y:number;

        // 用于 A* 算法的 parent tid，父砖块 tiledId
        public parentIndex:number;

        // 用于 A* 算法的几个重要变量
        public get F():number { return this.G + this.H; }          // = G + H
        public G:number;                // 路径从起点到该结点时的累计移动消耗
        public H:number;                // 该结点到终点的预测距离

        // 可行走方向
        public right:boolean;
        public up:boolean;
        public left:boolean;
        public down:boolean;

        // 在地图里的 index 索引
        public index:number;

        /**
         * 为当前砖块结点指定一个路径上的父结点
         * @param parent
         */
        public setParent(parent:Tile):void {
            this.parentIndex = parent.index;
            this.G = parent.G + 1;
        }

        /**
         * 猜测当前砖块点到目标结点的距离
         * @param target
         */
        public guessDistance(target:Tile):void {
            this.H = Math.abs(target.x - this.x) + Math.abs(target.y - this.y);
        }
    }

    /**
     * 放在 Object 层上的图形砖块，对应 MapObject 实例中 isTileObject 为 true 的对象图块
     */
    export class ObjectTile extends Tile {
        public type:number;

        public properties:any;
    }
}