'use strict'

class Beacon {
  constructor(options) {

    var sphereGeometry = new THREE.SphereGeometry(1, 10, 10);

    var material = new THREE.MeshBasicMaterial( {color: 0xff0000, wireframe: true, wireframeLinewidth: 1} );

    var mesh = new THREE.Mesh(sphereGeometry, material);

    return mesh;


  }
}

module.exports = Beacon;


