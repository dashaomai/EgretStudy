/**
 * Created by bob on 16/2/21.
 */
module views {
    export class TileImage extends eui.Image {

        public index: number;

        public constructor(idx: number) {
            super();

            this.index = idx;

            this.getTexture();
        }

        private getTexture():void {
            var k: string = 'p' + (this.index < 10 ? '0' + this.index : this.index);
            this.texture = RES.getRes(k);
        }
    }
}