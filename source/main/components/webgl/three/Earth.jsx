'use strict'

class Earth {
  constructor(options) {

    var sphereGeometry = new THREE.SphereGeometry(options.radius, 50, 50);

    var shader = require('./Shaders').earth;
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms['texture'].value = THREE.ImageUtils.loadTexture(options.image);

    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader
    });

    var material2 = new THREE.MeshBasicMaterial( {color: 0xff0000, wireframe: true, wireframeLinewidth: 1} );

    var earthMesh = new THREE.Mesh(sphereGeometry, material);
    return earthMesh;
  }
}

module.exports = Earth;