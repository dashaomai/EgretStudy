/**
 * Created by Bob Jiang on 2015/3/9.
 */
module tiledmap {
    export class TiledMapParser {
        /**
         * 提供一个 json 地图文件的 id，读取并解析它
         * @param resId
         * @returns {*}
         */
        public static parse(resId:string):tiledmap.Map {
            var mapJson:any = RES.getRes(resId);

            if (!mapJson)
                return null;

            return new Map(mapJson);
        }
    }
}