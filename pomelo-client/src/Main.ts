/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }
    /**
    * 资源组加载出错
     *  The resource group loading failed
    */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textContainer: egret.Sprite;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {

        var sky: egret.Bitmap = this.createBitmapByName("bgImage");
        this.addChild(sky);
        var stageW: number = this.stage.stageWidth;
        var stageH: number = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

        var topMask: egret.Shape = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, stageH);
        topMask.graphics.endFill();
        topMask.width = stageW;
        topMask.height = stageH;
        this.addChild(topMask);

        var icon: egret.Bitmap = this.createBitmapByName("egretIcon");
        icon.anchorX = icon.anchorY = 0.5;
        this.addChild(icon);
        icon.x = stageW / 2;
        icon.y = stageH / 2 - 60;
        icon.scaleX = 0.55;
        icon.scaleY = 0.55;

        var colorLabel: egret.TextField = new egret.TextField();
        colorLabel.x = stageW / 2;
        colorLabel.y = stageH / 2 + 50;
        colorLabel.anchorX = colorLabel.anchorY = 0.5;
        colorLabel.textColor = 0xffffff;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 20;
        this.addChild(colorLabel);

        var textContainer: egret.Sprite = new egret.Sprite();
        textContainer.anchorX = textContainer.anchorY = 0.5;
        this.addChild(textContainer);
        textContainer.x = stageW / 2;
        textContainer.y = stageH / 2 + 100;
        textContainer.alpha = 0;

        this.textContainer = textContainer;

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description", this.startAnimation, this);

        // 访问 Pomelo API

        var host:string = "iojs.clevercells.com";
        //var host:string = "192.168.2.54";
        var port:string = "3010";

        var pomelo:Pomelo;
        pomelo = new Pomelo();

        pomelo.init(
            {
                host: host,
                port: port,
                log: true
            }, function (response:any):void {
                if (response.code !== 200)
                    return;

                egret.Logger.info('已经连接成功，即将发送消息！');

                pomelo.on('close', function(response:any):void {
                    egret.Logger.info('关闭了！');
                });

                pomelo.on('onHi', function(response:any):void {
                    egret.Logger.info('获得来自服务器的推送消息：' + response.msg);
                });

                pomelo.request(
                    'gate.queryHandler.queryConnector',
                    {username: 'Bob Jiang 2', password: '123456', token: 'aaaccc'},
                    function (response:any):void {
                        if (response.code !== 200)
                            return;

                        egret.Logger.info('请求已返回！');

                        var id = response.id;

                        pomelo.init({
                            host: response.host,
                            port: response.port,
                        }, function(response:any):void {
                            if (response.code !== 200)
                                return;

                            // 登入游戏
                            pomelo.request(
                                'connector.entryHandler.entry',
                                {id: id},
                                function(response:any):void {
                                    if (response.code !== 200)
                                        return;

                                    egret.Logger.info('到 connector 的请求已返回：' + JSON.stringify(response.player));

                                    // 请求更换队伍
                                    pomelo.request(
                                        'game.teamHandler.formation',
                                        {id: 2, team: [1001, 1003, 1005, 1007]},
                                        function(response:any):void {
                                            if (response.code !== 200) {
                                                egret.Logger.info(response.error);
                                            }

                                            egret.Logger.info('成功更换冒险者队伍');
                                        }
                                    );

                                    // 进行一次迷宫探险任务
                                    pomelo.request(
                                        'maze.taskHandler.begin',
                                        {teamId: 2, mazeId: 11, consumableAmount: 100, medicineAmount: 50, reviveAmount: 50, type: 1},
                                        function(response:any):void {
                                            if (response.code !== 200)
                                                egret.Logger.info(response.error);

                                            egret.Logger.info('成功进行了一次探险');

                                            pomelo.request(
                                                'maze.taskHandler.get',
                                                {taskId: response.taskId},
                                                function(response:any):void {
                                                    if (response.code !== 200)
                                                        egret.Logger.info(response.error);

                                                    egret.Logger.info('成功获得任务内容：' + response.isFinished + response.steps);
                                                }
                                            );
                                        }
                                    );

                                    // 列出当前所有的迷宫探险任务
                                    pomelo.request(
                                        'maze.taskHandler.list',
                                        {},
                                        function(response:any):void {
                                            if (response.code !== 200)
                                                egret.Logger.info(response.error);

                                            egret.Logger.info('成功获取任务列表：' + JSON.stringify(response));

                                            var tasks:any[] = response.tasks;
                                            var task:any;
                                            for (var i:number = 0, m:number = tasks.length; i<m; i++) {
                                                task = tasks[i];

                                                if (task.isFinished) {
                                                    pomelo.request(
                                                        'maze.taskHandler.finish',
                                                        {taskId: task.id},
                                                        function(response:any):void {
                                                            if (response.code !== 200)
                                                                egret.Logger.info(response.error);

                                                            egret.Logger.info('成功完成任务：' + JSON.stringify(response));
                                                        }
                                                    );

                                                    break;
                                                }
                                            }
                                        }
                                    );
                                }
                            );
                        });
                    }
                );
            }
        );
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        var textContainer: egret.Sprite = this.textContainer;
        var count: number = -1;
        var self: any = this;
        var change: Function = function () {
            count++;
            if (count >= result.length) {
                count = 0;
            }
            var lineArr = result[count];

            self.changeDescription(textContainer, lineArr);

            var tw = egret.Tween.get(textContainer);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        }

        change();
    }
    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textContainer: egret.Sprite, lineArr: Array<any>): void {
        textContainer.removeChildren();
        var w: number = 0;
        for (var i: number = 0; i < lineArr.length; i++) {
            var info: any = lineArr[i];
            var colorLabel: egret.TextField = new egret.TextField();
            colorLabel.x = w;
            colorLabel.anchorX = colorLabel.anchorY = 0;
            colorLabel.textColor = parseInt(info["textColor"]);
            colorLabel.text = info["text"];
            colorLabel.size = 30;
            textContainer.addChild(colorLabel);

            w += colorLabel.width;
        }
    }
}


