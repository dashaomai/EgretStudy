/**
 * Created by Bob Jiang on 2015/3/9.
 */
module tiledmap {
    export class ObjectGroup {
        public name:string;

        public x:number;
        public y:number;

        public width:number;
        public height:number;

        public opacity:number;
        public visible:boolean;

        public drawOrder:string;

        public objects:MapObject[];

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
                    'draworder',
                    'objects'
            ))
                return;

            copyProperties(this, param,
                ['name', 'x', 'y', 'width', 'height', 'opacity', 'visible', 'drawOrder'],
                ['name', 'x', 'y', 'width', 'height', 'opacity', 'visible', 'draworder']
            );

            this.objects = [];
            var array:any[] = param['objects'];

            for (var i:number=0, m:number = array.length; i<m; i++) {
                this.objects.push(new MapObject(array[i]));
            }
        }
    }
}