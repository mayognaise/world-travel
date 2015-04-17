'use strict'

var TO_RADIANS = Math.PI / 180, /* One degree in radians */
  TO_DEGREES = 180 / Math.PI; /* One radian in degrees */

var Util = {
  /**
   * Converts a latlong to Vector3 for use in Three.js
   */
  latLongToVector3 (lat, lon, radius) {

    var phi = (lat) * TO_RADIANS,
      theta = (lon - 180) * TO_RADIANS;

    var x = -(radius) * Math.cos(phi) * Math.cos(theta),
      y = (radius) * Math.sin(phi),
      z = (radius) * Math.cos(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
  },

  /**
   * Get distance between two positions.
   * unit = the unit you desire for results
   * 'M' is statute miles (default)
   * 'K' is kilometers
   * 'N' is nautical miles
   */
  getDistance (pos1, pos2, unit) {
    var lat1 = pos1.lat,
      lon1 = pos1.lon,
      lat2 = pos2.lat,
      lon2 = pos2.lon,
      radlat1 = TO_RADIANS * lat1,
      radlat2 = TO_RADIANS * lat2,
      radlon1 = TO_RADIANS * lon1,
      radlon2 = TO_RADIANS * lon2,
      theta = lon1 - lon2,
      radtheta = TO_RADIANS * theta,
      dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * TO_DEGREES;
    dist = dist * 60 * 1.1515;
    if (unit=='K') { dist = dist * 1.609344; }
    if (unit=='N') { dist = dist * 0.8684; }
    return dist
  },

  /**
   * Constrain between the ranges
   */
  constrain (val, min, max){
    if(val < min) {
      val = min;
    }
    else if(val > max) {
      val = max;
    }
    return val;
  },

  /**
   * Remove all children of Object3D in Three.js
   */
  removeAllChildren(obj) {
    _.each(obj.children, (child) => {obj.remove(child);});
  }
};

module.exports = Util;