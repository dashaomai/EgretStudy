/**
 * Created by bob on 15/1/27.
 */
class MainSkinPanel extends egret.gui.Panel {
    public constructor() {
        super();
        this.skinName = 'MainSkin';
    }

    public confirm:egret.gui.Button;

    public partAdded(partName:string, instance:any):void {
        super.partAdded(partName, instance);

        switch (instance) {
            case this.confirm:
                this.confirm.label = '注入成功';
                this.confirm.addEventListener(egret.TouchEvent.TOUCH_END, this.onConfirmClickedHandler, this);
                break;
        }
    }

    private onConfirmClickedHandler(e:egret.TouchEvent):void {
        alert('clicked!');
    }
}