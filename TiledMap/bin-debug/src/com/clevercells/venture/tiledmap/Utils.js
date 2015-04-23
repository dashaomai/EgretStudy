/**
 * Created by Bob Jiang on 2015/3/10.
 */
var tiledmap;
(function (tiledmap) {
    /**
     * 检查一个参数对象内是否存在所有的属性
     * @param param
     * @param propName
     * @returns {boolean}
     */
    function hasProperties(param) {
        var propName = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            propName[_i - 1] = arguments[_i];
        }
        var result = true;
        var name;
        for (var i = 0, m = propName.length; i < m; i++) {
            name = propName[i];
            if (param[name] === undefined) {
                result = false;
                break;
            }
        }
        return result;
    }
    tiledmap.hasProperties = hasProperties;
    /**
     * 将一个文件路径转换为 RES 类可识别的资源 Id。
     * 该工具认定对应的资源已经被配置到资源描述文件当中，并且已经被加载。
     *
     * @param path
     * @returns {string}
     */
    function convertResPathToId(path) {
        var result;
        var pos = path.lastIndexOf('/');
        if (pos !== -1)
            result = path.substring(pos + 1);
        else
            result = path;
        result = result.replace('.', '_');
        egret.Logger.info('convert path from: ' + path + ' to: ' + result);
        return result;
    }
    tiledmap.convertResPathToId = convertResPathToId;
    /**
     * 在两个对象之间按不同的属性名进行值复制
     * @param dest
     * @param source
     * @param destParams
     * @param sourceParams
     */
    function copyProperties(dest, source, destParams, sourceParams) {
        var i, m = Math.min(destParams.length, sourceParams.length);
        for (i = 0; i < m; i++) {
            dest[destParams[i]] = source[sourceParams[i]];
        }
    }
    tiledmap.copyProperties = copyProperties;
})(tiledmap || (tiledmap = {}));
