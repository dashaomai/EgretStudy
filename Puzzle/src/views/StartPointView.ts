/**
 * Created by bob on 16/1/6.
 */
module views {
    export class StartPointView extends eui.Component {
        public go_button:eui.Button;
        public avatar_image:eui.Image;
        public coin_label:eui.Label;

        public constructor() {
            super();
            this.addEventListener(eui.UIEvent.COMPLETE, this.onCompleteHandler, this);
            this.skinName = 'resource/ui/StartPointSkin.exml';
        }

        private onCompleteHandler():void {
            this.go_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onGoHandler, this);
        }

        private onGoHandler(e:eui.UIEvent):void {
            console.log('跳转到游戏中');

            this.dispatchEvent(new egret.Event('puzzle'));
        }
    }
}