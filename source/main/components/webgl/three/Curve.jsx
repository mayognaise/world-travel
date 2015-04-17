'use strict'

var Util = require('./Util.jsx');

/**
 *  @brief Curve between two locations
 *
 *  https://github.com/mrdoob/three.js/blob/master/src/math/Vector3.js
 *  http://mflux.tumblr.com/post/28367579774/armstradeviz
 *  http://armsglobe.chromeexperiments.com/
 *  http://armsglobe.chromeexperiments.com/js/visualize_lines.js
 *  http://armsglobe.chromeexperiments.com/js/visualize.js
 *
 *  @param {THREE.Vector3} (required) start
 *  @param {THREE.Vector3} (required) end
 *  @return {THREE.Line}
 */

class Curve {
  constructor(options) {

    /**
     *  The curve looks like this: CubicBezier
     *
     *       midStartAnchor --- midEndAnchor
     *      /                               \
     *     /                                 \
     *    /                                   \
     *  start                                 end
     *
     */

    var {start, end, color, distanceOnMap} = options;
    this._color = color || 0xff0000;
    if(distanceOnMap) console.log('distanceOnMap', distanceOnMap);

    //  The normal from start to end {THREE.Vector3}
    var normal = (new THREE.Vector3()).subVectors(start, end);
    var distance = normal.length();
    var distanceHalf = distance / 2;
    normal.normalize();

    //  Midpoint for the curve {THREE.Vector3}
    var mid = start.clone().lerp(end, 0.5);
    mid.normalize();
    mid.multiplyScalar(100 / distance * distanceOnMap);

    var midStartAnchor = mid.clone().add(normal.clone().multiplyScalar(distanceHalf));
    var midEndAnchor = mid.clone().add(normal.clone().multiplyScalar(-distanceHalf));

    //  Make cubib bezier curve
    //  tttp://threejs.org/docs/#Reference/Extras.Curves/CubicBezierCurve3
    var curve = new THREE.CubicBezierCurve3(start, midStartAnchor, midEndAnchor, end);

    //  How many vertices?
    var totalVertexDesired = Math.floor(distanceOnMap / 50);
    if(totalVertexDesired) console.log('totalVertexDesired', totalVertexDesired);

    //  Collect the vertices
    this._vertices = curve.getPoints(totalVertexDesired);

    return this;
  }

  vertices() {
    return this._vertices;
  }

  color(val) {
    if(val) this._color = val;
    return this._color;
  }

  toObject(amount) {
    var vertices = this.vertices();
    if(amount && _.isNumber(amount)) {
      vertices = vertices.slice(0, amount);
    }

    var geometry = new THREE.Geometry();
    geometry.vertices = vertices;

    var material = new THREE.LineBasicMaterial({ color: this.color() });

    var curveObject = new THREE.Line(geometry, material);

    return curveObject;
  }


}

module.exports = Curve;