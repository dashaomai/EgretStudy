/**
 * Created by Bob Jiang on 2015/3/10.
 */
module tiledmap {
    /**
     * 检查一个参数对象内是否存在所有的属性
     * @param param
     * @param propName
     * @returns {boolean}
     */
    export function hasProperties(param:any, ...propName: string[]):boolean {
        var result:boolean = true;
        var name:string;

        for (var i:number = 0, m:number = propName.length; i<m; i++) {
            name = propName[i];

            if (param[name] === undefined) {
                result = false;
                break;
            }
        }

        return result;
    }

    /**
     * 将一个文件路径转换为 RES 类可识别的资源 Id。
     * 该工具认定对应的资源已经被配置到资源描述文件当中，并且已经被加载。
     *
     * @param path
     * @returns {string}
     */
    export function convertResPathToId(path:string):string {
        var result:string;

        var pos:number = path.lastIndexOf('/');
        if (pos !== -1)
            result = path.substring(pos + 1);
        else
            result = path;

        result = result.replace('.', '_');
        egret.Logger.info('convert path from: ' + path + ' to: ' + result);

        return result;
    }

    /**
     * 在两个对象之间按不同的属性名进行值复制
     * @param dest
     * @param source
     * @param destParams
     * @param sourceParams
     */
    export function copyProperties(dest:any, source:any, destParams:string[], sourceParams:string[]):void {
        var i:number, m:number = Math.min(destParams.length, sourceParams.length);

        for (i=0; i<m; i++) {
            dest[destParams[i]] = source[sourceParams[i]];
        }
    }
}