'use strict'

var Util = require('./Util.jsx');
var Curve = require('./Curve.jsx');

// Constants
var EARTH_RADIUS = 600,
  POS_X = 0,
  POS_Y = 800,
  POS_Z = 4000,
  FOV = 45,
  NEAR = 1,
  FAR = 150000,
  PI_HALF = Math.PI / 2;

var renderer, camera, scene, pubnub, innerWidth, innerHeight, cameraPosition;
var earth, earthNight, beaconHolder, travelLineHolder, stars;
var travelLineContainer = [];
var renderSpeed;

/**
 *  Creates the Earth sphere
 */
function addEarth () {

  var Earth = require('./Earth.jsx');

  // If mobile, load a small image
  var md = new MobileDetect(window.navigator.userAgent);
  var size = md.mobile()? '-small': '';

  // Check search query if it is a night mode
  var queryString = require('query-string');
  var parsed = queryString.parse(location.search);
  var type = parsed.night === 'true'? '-night': '';

  var image = `/assets/images/world${type}${size}.jpg`;

  earth = new Earth({radius: EARTH_RADIUS, image: image});
  scene.add(earth);
}

function addStars () {

  var Stars = require('./Stars.jsx');

  stars = new Stars({radius: POS_Z});
  scene.add(stars);

}

/**
 *  Adds a beacon to the surface of the Earth
 */
function addBeacon (position) {

  var Beacon = require('./Beacon.jsx');

  var beacon = new Beacon();

  Util.removeAllChildren(beaconHolder);

  beaconHolder.position.x = position.x;
  beaconHolder.position.y = position.y;
  beaconHolder.position.z = position.z;
  beaconHolder.add(beacon);
}

/**
 *  Creates holder of travel line
 */
function addTravelLineHolder () {
  travelLineHolder = new THREE.Object3D();
  travelLineContainer.push(travelLineHolder);
  scene.add(travelLineHolder);
}

/**
 *  Render loop
 */
function animate () {
  requestAnimationFrame(animate);
  render();
}

/**
 *  Runs on each animation frame
 */
function render () {

  if(cameraPosition) {
    var speed = renderSpeed || 0.01;
    camera.position.x += ( cameraPosition.x - camera.position.x ) * speed;
    camera.position.y += ( cameraPosition.y - camera.position.y ) * speed;
    camera.position.z += ( cameraPosition.z - camera.position.z ) * speed;
    camera.lookAt( earth.position );
  }

  drawTravelLine();

  renderer.autoClear = false;
  renderer.clear();
  renderer.render( scene, camera );
}

function init(el) {
  onWindowResize();

  renderer = new THREE.WebGLRenderer({ antialiasing: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setClearColor(0x00000000, 0.0);

  el.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  // add an empty container for the beacons to be added to
  beaconHolder = new THREE.Object3D();
  scene.add(beaconHolder);

  // add an empty container for travelLine
  addTravelLineHolder();

  addEarth();

  camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, NEAR, FAR);
  camera.position.set(POS_X, POS_Y, POS_Z);
  camera.lookAt( earth.position );
  scene.add(camera);

  animate();

  window.addEventListener ('resize', onWindowResize);

}

/**
 *  Updates camera and rendered when browser resized
 */
function onWindowResize () {
  innerWidth = window.innerWidth;
  innerHeight = window.innerHeight;

  if(camera && renderer) {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }
}

var timeoutId, previousPosition;

var travelLineCount;
var travelLine;

function drawTravelLine() {
  if(!travelLineCount || !travelLine) return;
  // console.log('drawTravelLine', travelLineCount);
  var vertices = travelLine.vertices();
  var line = travelLine.toObject(travelLineCount++);
  Util.removeAllChildren(travelLineHolder);
  travelLineHolder.add(line);
  if(travelLineCount > vertices.length) {
    console.log('done!');
    travelLineCount = 0;
    //  add a new travel line
    addTravelLineHolder();
  }
}

function update(latlon, distance) {
  var {lat, lon} = latlon;
  var position = Util.latLongToVector3(lat, lon, EARTH_RADIUS);
  addBeacon(position);
  if(previousPosition && position && distance && previousPosition !== position) {
    travelLine = new Curve({
      start: previousPosition,
      end: position,
      distanceOnMap: distance
    });
    travelLineCount = 1;
  }
  previousPosition = position;

  var cameraInitPos = Util.latLongToVector3(lat, lon, POS_Z),
    cameraZoomPos = Util.latLongToVector3(lat, lon, EARTH_RADIUS + 1000);

  cameraPosition = cameraZoomPos;
  return {
    cameraInitPos: cameraInitPos
  };
}

class Globe {
  constructor(options) {
    this.el = options.el;
    init(this.el);
  }

  update(item) {
    if(!item || !item.id) return;

    this.item = item;

    clearTimeout(timeoutId);

    var self = this;
    var distance;
    var keepZoomDistance = 30000000; // 3000
    var duration = 500;
    var latlon = {
      lat: item.coordinates[0],
      lon: item.coordinates[1]
    };
    if(this.latlon) {
      distance = Util.getDistance(this.latlon, latlon);
    }
    this.latlon = latlon;
    var cb = (() => {
      renderSpeed = 0.03;
      var res = update(latlon, distance);
      self.cameraInitPos = res.cameraInitPos;
    });

    if(this.cameraInitPos && distance && distance > keepZoomDistance) {
      renderSpeed = 0.05;
      cameraPosition = this.cameraInitPos;
      timeoutId = setTimeout(cb, duration);
    } else {
      cb();
    }
  }
}

module.exports = Globe;