/**
 * Created by Bob Jiang on 2015/3/5.
 */
module com.clevercells.hello {
    export class Map extends egret.gui.SkinnableComponent {

        public constructor() {
            super();
            this.skinName = 'com.clevercells.hello.MapSkin';
        }

        public nodeA:egret.gui.Button;
        public nodeB:egret.gui.Button;
        public nodeC:egret.gui.Button;

        public partAdded(partName:string, instance:any):void {
            super.partAdded(partName, instance);

            switch (instance) {
                case this.nodeA:
                case this.nodeB:
                case this.nodeC:

                    instance.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
                    break;

                default:
                    console.log('What\'s this?', instance);
                    break;
            }
        }

        private onTapHandler(e:egret.TouchEvent):void {
            console.log('Taped ', e.target);
        }
    }
}
