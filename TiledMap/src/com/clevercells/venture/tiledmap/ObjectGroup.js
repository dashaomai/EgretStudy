/**
 * Created by Bob Jiang on 2015/3/9.
 */
var tiledmap;
(function (tiledmap) {
    var ObjectGroup = (function () {
        function ObjectGroup(param) {
            if (!hasProperties(param, 'name', 'x', 'y', 'width', 'height', 'opacity', 'visible', 'draworder', 'objects'))
                return;
            copyProperties(this, param, ['name', 'x', 'y', 'width', 'height', 'opacity', 'visible', 'drawOrder'], ['name', 'x', 'y', 'width', 'height', 'opacity', 'visible', 'draworder']);
            this.objects = [];
            var array = param['objects'];
            for (var i = 0, m = array.length; i < m; i++) {
                this.objects.push(new MapObject(array[i]));
            }
        }
        return ObjectGroup;
    })();
    tiledmap.ObjectGroup = ObjectGroup;
})(tiledmap || (tiledmap = {}));
//# sourceMappingURL=ObjectGroup.js.map