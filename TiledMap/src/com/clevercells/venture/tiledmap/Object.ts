/**
 * Created by Bob Jiang on 2015/3/10.
 */
module tiledmap {
    export class MapObject {
        // 地图特殊对象的类型定义
        public static NORMAL:number = 0;            // 普通可行走地块
        public static DOOR:number = 1;              // 入口门
        public static COLLECTION:number = 2;        // 采集点
        public static TRAP:number = 3;              // 陷阱
        public static BOSS:number = 4;              // Boss
        public static TREASURE:number = 5;          // 宝箱候选点

        public id:number;
        public globalId:number;

        /**
         * 根据是否存在 gid 来判断当前对象是图块对象还是普通矢量对象
         * @returns {boolean}
         */
        public get isTileObject():boolean {
            return !!this.globalId;
        }

        public x:number;
        public y:number;
        public width:number;
        public height:number;
        public rotation:number;

        public visible:boolean;

        public name:string;
        public type:string;

        // 来自地图编辑器的额外属性
        public properties:any;

        public constructor(param:any) {
            if (!hasProperties(
                    param,
                    'name',
                    'type',
                    'id',
                    'x',
                    'y',
                    'width',
                    'height',
                    'rotation',
                    'visible',
                    'properties'
                ))
                return;

            copyProperties(this, param,
                ['name', 'type', 'id', 'globalId', 'x', 'y', 'width', 'height', 'rotation', 'visible', 'properties'],
                ['name', 'type', 'id', 'gid', 'x', 'y', 'width', 'height', 'rotation', 'visible', 'properties']
            );
        }
    }

    /**
     * 获取来自地图编辑器指定的对象类型文字描述，转换为内置的数字类型编号
     * @param strType
     * @returns {number}
     */
    export function getTypeByString(strType:string):number {
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
}