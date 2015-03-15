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
    }

    /**
     * 放在 Object 层上的图形砖块，对应 MapObject 实例中 isTileObject 为 true 的对象图块
     */
    export class ObjectTile extends Tile {
        public type:string;

        public properties:any;
    }
}