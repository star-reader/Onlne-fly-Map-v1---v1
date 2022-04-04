////(function () {
////    // save these original methods before they are overwritten
////    var proto_initIcon = L.Marker.prototype._initIcon;
////    var proto_setPos = L.Marker.prototype._setPos;

////    var oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

////    L.Marker.addInitHook(function () {
////        var iconOptions = this.options.icon && this.options.icon.options;
////        var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
////        if (iconAnchor) {
////            iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
////        }
////        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom';
////        this.options.rotationAngle = this.options.rotationAngle || 0;

////        // Ensure marker keeps rotated during dragging
////        this.on('drag', function (e) { e.target._applyRotation(); });
////    });

////    L.Marker.include({
////        _initIcon: function () {
////            proto_initIcon.call(this);
////        },

////        _setPos: function (pos) {
////            proto_setPos.call(this, pos);
////            this._applyRotation();
////        },

////        _applyRotation: function () {
////            if (this.options.rotationAngle) {
////                this._icon.style[L.DomUtil.TRANSFORM + 'Origin'] = this.options.rotationOrigin;

////                if (oldIE) {
////                    // for IE 9, use the 2D rotation
////                    this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
////                } else {
////                    // for modern browsers, prefer the 3D accelerated version
////                    this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
////                }
////            }
////        },

////        setRotationAngle: function (angle) {
////            this.options.rotationAngle = angle;
////            this.update();
////            return this;
////        },

////        setRotationOrigin: function (origin) {
////            this.options.rotationOrigin = origin;
////            this.update();
////            return this;
////        }
////    });
////})();
/*
 * Based on comments by @runanet and @coomsie 
 * https://github.com/CloudMade/Leaflet/issues/386
 *
 * Wrapping function is needed to preserve L.Marker.update function
 */
(function () {
	var _old__setPos = L.Marker.prototype._setPos;
	L.Marker.include({
		_updateImg: function (i, a, s) {
			a = L.point(s).divideBy(2)._subtract(L.point(a));
			var transform = '';
			transform += ' translate(' + -a.x + 'px, ' + -a.y + 'px)';
			transform += ' rotate(' + this.options.iconAngle + 'deg)';
			transform += ' translate(' + a.x + 'px, ' + a.y + 'px)';
			i.style[L.DomUtil.TRANSFORM] += transform;
			i.style[L.DomUtil.TRANSFORM + 'Origin'] = '50% 50%';
		},

		_getShortestEndDegree: function (startDegrees, endDegrees) {
			var turnAngle = Math.abs(endDegrees - startDegrees);
			var turnAnglePositive = (endDegrees - startDegrees) >= 0;
			if (turnAngle <= 180) return endDegrees;
			var result = startDegrees + (360 - turnAngle) * (turnAnglePositive ? -1 : 1);
			return result;
		},

		setIconAngle: function (iconAngle) {
			// find shortest angle to turn over
			this.options.iconAngle = this._getShortestEndDegree(this.options.iconAngle || 0, iconAngle);
			if (this._map)
				this.update();
		},

		_setPos: function (pos) {
			if (this._icon)
				this._icon.style[L.DomUtil.TRANSFORM] = '';
			if (this._shadow)
				this._shadow.style[L.DomUtil.TRANSFORM] = '';

			_old__setPos.apply(this, [pos]);

			if (this.options.iconAngle) {
				var defaultIcon = new L.Icon.Default();
				var a = this.options.icon.options.iconAnchor || defaultIcon.options.iconAnchor;
				var s = this.options.icon.options.iconSize || defaultIcon.options.iconSize;
				var i;
				if (this._icon) {
					i = this._icon;
					this._updateImg(i, a, s);
				}
				if (this._shadow) {
					if (this.options.icon.options.shadowAnchor)
						a = this.options.icon.options.shadowAnchor;
					s = this.options.icon.options.shadowSize;
					i = this._shadow;
					this._updateImg(i, a, s);
				}
			}
		}
	});
}());
