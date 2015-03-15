/**
 * Created by Bob Jiang on 2015/3/9.
 */
var tiledmap;
(function (tiledmap) {
    var ObjectGroup = (function () {
        function ObjectGroup(param) {
            if (!tiledmap.hasProperties(param, 'name', 'x', 'y', 'width', 'height', 'opacity', 'visible', 'draworder', 'objects'))
                return;
            tiledmap.copyProperties(this, param, ['name', 'x', 'y', 'width', 'height', 'opacity', 'visible', 'drawOrder'], ['name', 'x', 'y', 'width', 'height', 'opacity', 'visible', 'draworder']);
            this.objects = [];
            var array = param['objects'];
            for (var i = 0, m = array.length; i < m; i++) {
                this.objects.push(new tiledmap.MapObject(array[i]));
            }
        }
        return ObjectGroup;
    })();
    tiledmap.ObjectGroup = ObjectGroup;
    ObjectGroup.prototype.__class__ = "tiledmap.ObjectGroup";
})(tiledmap || (tiledmap = {}));
