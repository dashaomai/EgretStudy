/**
 * Created by Bob Jiang on 2015/3/9.
 */
var tiledmap;
(function (tiledmap) {
    var Layer = (function () {
        function Layer(param) {
            if (!tiledmap.hasProperties(param, 'name', 'x', 'y', 'width', 'height', 'opacity', 'visible', 'data'))
                return;
            this.name = param['name'];
            this.x = param['x'];
            this.y = param['y'];
            this.width = param['width'];
            this.height = param['height'];
            this.opacity = param['opacity'];
            this.visible = param['visible'];
            this.tileIds = param['data'];
        }
        return Layer;
    })();
    tiledmap.Layer = Layer;
    Layer.prototype.__class__ = "tiledmap.Layer";
})(tiledmap || (tiledmap = {}));
