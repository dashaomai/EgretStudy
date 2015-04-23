/**
 * Created by Bob Jiang on 2015/4/23.
 */

declare module pomelo {
    export class Pomelo {
        init(params:any, cb:()=>void):void;

        request(route:string, msg:any, cb: (response:any)=>void):void;
        notify(route:string, msg:any):void;

        on(route:string, cb: (response:any)=>void):void;

        disconnect();
    }
}