


declare class pomelo {

    static init(params:any, cb:()=>void):void;

    static request(route:string, msg:any, cb: (response:any)=>void):void;
    static notify(route:string, msg:any):void;

    static on(route:string, cb: (response:any)=>void):void;

    static disconnect();
}