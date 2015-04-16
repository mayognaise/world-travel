'use strict'

class Stars {
  constructor(options) {

    var sphereGeometry = new THREE.SphereGeometry(options.radius, 10, 10);

    var material = new THREE.MeshBasicMaterial( {color: 0xff0000, wireframe: true, wireframeLinewidth: 1} );

    var starMesh = new THREE.Mesh(sphereGeometry, material);

    return starMesh;
  }
}

module.exports = Stars;