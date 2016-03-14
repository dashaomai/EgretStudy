/**
 * Created by bob on 16/1/10.
 */
module views {
    export class PuzzleView extends eui.Component {
        private static PUZZLE_CHOOSE: number = 1;
        private static PUZZLE_GAME: number = 2;

        public change_button: eui.Button;
        public reward_label: eui.Label;
        public time_label: eui.Label;
        public decount_label: eui.BitmapLabel;
        public puzzle_group: eui.Group;

        private loading: boolean;

        private status: number;

        private secondsTimer: egret.Timer;

        private static PADDING: number = 192;
        private static WIDTH: number = 3;
        private static HEIGHT: number = 4;

        private grids: number[];
        private puzzles: views.TileImage[];

        public constructor() {
            super();

            this.addEventListener(eui.UIEvent.COMPLETE, this.onCompleteHandler, this);
            this.skinName = 'resource/ui/PuzzleSkin.exml';
        }

        private setStatus(st: number):void {
            this.status = st;
        }

        private setupTimer():void {
            var second: number = 1000;
            var discount: number;

            switch (this.status) {
                case PuzzleView.PUZZLE_CHOOSE:
                    discount = 5;
                    this.decount_label.text = discount.toString();
                    break;

                case PuzzleView.PUZZLE_GAME:
                    discount = 120;
                    break;
            }

            if (!!this.secondsTimer) {
                this.secondsTimer.stop();
                this.secondsTimer.removeEventListener(egret.TimerEvent.TIMER, this.onSecondHandler, this);
                this.secondsTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onSecondsCompleteHandler, this);
            }

            this.secondsTimer = new egret.Timer(second, discount);
            this.secondsTimer.addEventListener(egret.TimerEvent.TIMER, this.onSecondHandler, this);
            this.secondsTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onSecondsCompleteHandler, this);
            this.secondsTimer.start();
        }

        private onCompleteHandler():void {

            this.grids = [];
            this.puzzles = [];

            //this.loadPuzzleGroup(1);
            this.onGroupCompleteHandler();
        }

        private loadPuzzleGroup(index: number):void {
            this.loading = true;
            this.status = PuzzleView.PUZZLE_CHOOSE;

            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onGroupCompleteHandler, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadErrorHandler, this);
            RES.loadGroup('puzzle_' + (index < 10 ? '0' + index : String(index)));
        }

        private onGroupCompleteHandler():void {
            this.loading = false;

            this.change_button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onChangeHandler, this);

            this.setStatus(PuzzleView.PUZZLE_CHOOSE);

            this.orderedBoard();
        }

        private onChangeHandler():void {
            this.setupTimer();
        }

        private orderedBoard():void {
            var p: eui.Group = this.puzzle_group;
            var index = 0;

            for (var i:number = 0, m:number = PuzzleView.HEIGHT; i<m; i++) {
                var yOff: number = i * PuzzleView.PADDING;
                for (var j:number = 0, n:number = PuzzleView.WIDTH; j<n; j++) {
                    var xOff: number = j * PuzzleView.PADDING;
                    index++;

                    var pz: views.TileImage = new views.TileImage(index);
                    pz.x = xOff;
                    pz.y = yOff;

                    p.addChild(pz);

                    this.puzzles[index - 1] = pz;
                }
            }

            this.setupTimer();
        }

        private onGroupLoadErrorHandler(e):void {
            egret.log(JSON.stringify(e));
        }

        private onSecondHandler():void {
            switch (this.status) {
                case PuzzleView.PUZZLE_CHOOSE:
                    var second: number = parseInt(this.decount_label.text);
                    this.decount_label.text = (second-1).toString();

                    break;

                case PuzzleView.PUZZLE_GAME:
                    var timeArr: string[] = this.time_label.text.split(':');
                    var minutes: number = parseInt(timeArr[0]);
                    var seconds: number = parseInt(timeArr[1]);

                    if (seconds >= 1) {
                        seconds -= 1;
                    } else {
                        if (minutes > 0)
                            minutes -= 1;
                        seconds = 59;
                    }

                    this.time_label.text = (minutes > 9 ? minutes.toString() : '0' + minutes) + ':'
                        + (seconds > 9 ? seconds.toString() : '0' + seconds);

                    break;
            }
        }

        private onSecondsCompleteHandler():void {
            egret.log('计时结束一次');

            this.secondsTimer.stop();
            this.secondsTimer.removeEventListener(egret.TimerEvent.TIMER, this.onSecondHandler, this);
            this.secondsTimer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onSecondsCompleteHandler, this);

            this.secondsTimer = null;

            // 绘制门的遮罩
            var mask1: egret.Shape = new egret.Shape();
            var g: egret.Graphics = mask1.graphics;
            g.beginFill(0xFF00FF);
            g.drawRect(0, 0, this.puzzle_group.width, this.puzzle_group.height);
            g.endFill();

            this.puzzle_group.addChild(mask1);
            
            var mask2: egret.Shape = new egret.Shape();
            var g: egret.Graphics = mask2.graphics;
            g.beginFill(0xFF00FF);
            g.drawRect(0, 0, this.puzzle_group.width, this.puzzle_group.height);
            g.endFill();

            this.puzzle_group.addChild(mask2);

            // 加入门
            var door_up: eui.Image = new eui.Image();
            door_up.texture = RES.getRes('bg-up');

            var up_y0:number = -door_up.height;
            var up_y1:number = 0;

            door_up.y = up_y0;
            door_up.mask = mask1;

            this.puzzle_group.addChild(door_up);

            var door_down: eui.Image = new eui.Image();
            door_down.texture = RES.getRes('bg-down');

            var down_y0:number = door_up.height + door_down.height;
            var down_y1:number = door_up.height;

            door_down.y = down_y0;
            door_down.mask = mask2;

            this.puzzle_group.addChild(door_down);

            // Tween
            egret.Tween.get(door_up).to({y: up_y1}, 500).wait(900).call(this.onDoorHalfCb, this, [door_up, up_y0, 500]);
            egret.Tween.get(door_down).to({y: down_y1}, 500).wait(900).call(this.onDoorHalfCb, this, [door_down, down_y0, 500, true]);

            // 恢复游戏计时
            this.time_label.text = '02:00';
        }

        private onDoorHalfCb(target: egret.DisplayObject, yPos: number, duration: number, initialGame: boolean):void {
            if (initialGame) {
                this.randomThePuzzles();
                egret.Tween.get(target).to({y: yPos}, duration).call(this.onDoorOpenCb, this);
            } else {
                egret.Tween.get(target).to({y: yPos}, duration);
            }
        }

        private onDoorOpenCb() {
            this.setStatus(PuzzleView.PUZZLE_GAME);
            this.setupTimer();
        }

        private randomThePuzzles():void {
            var pz: eui.Image;
            var pool: number[] = [];

            for (var i: number = 0, m: number = PuzzleView.WIDTH * PuzzleView.HEIGHT; i<m; i++) {
                pool.push(i);

                pz = this.puzzles[i];
                pz.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPuzzleTapedHandler, this);
            }

            if (!this.grids)
                this.grids = [];
            else
                this.grids.length = 0;

            for (i = 0; i<m; i++) {
                var pos = Math.floor(Math.random() * pool.length);
                var index = pool[pos];

                this.grids.push(index);
                pool.splice(pos, 1);

                var xPos: number = i % PuzzleView.WIDTH * PuzzleView.PADDING;
                var yPos: number = Math.floor(i / PuzzleView.WIDTH) * PuzzleView.PADDING;

                egret.log('xPos: %d, yPos: %d', xPos, yPos);

                pz = this.puzzles[index];
                pz.x = xPos;
                pz.y = yPos;

                this.grids[i] = pos;
            }
        }

        private onPuzzleTapedHandler(e: egret.TouchEvent):void {
            var target: views.TileImage = <views.TileImage>e.currentTarget;

            egret.log('Taped the tile #%d', target.index);
        }
    }
}