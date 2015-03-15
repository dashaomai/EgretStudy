/**
 * Created by Bob Jiang on 2015/3/9.
 */
module tiledmap {
    export class Layer {
        public name:string;

        public x:number;
        public y:number;

        public width:number;
        public height:number;

        public opacity:number;
        public visible:boolean;

        /**
         * 对应 layer 结点下的 data 内容
         */
        public tileIds:number[];

        public constructor(param:any) {
            if (!hasProperties(
                    param,
                    'name',
                    'x',
                    'y',
                    'width',
                    'height',
                    'opacity',
                    'visible',
                    'data'
            ))
                return;

            this.name = param['name'];
            this.x = param['x'];
            this.y = param['y'];
            this.width = param['width'];
            this.height = param['height'];

            this.opacity = param['opacity'];
            this.visible = param['visible'];

            this.tileIds = param['data'];
        }
    }
}