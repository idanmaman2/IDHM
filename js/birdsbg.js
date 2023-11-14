import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader';
const myCanvas = document.querySelector('#myCanvas');
const axes = new THREE.AxesHelper();


var clock = new THREE.Clock();
var mixer ; 
var parrot ; 
var sx,sy,sz ; 
var factor = 1 ; 
var radius = 100 ; 
const scene = new THREE.Scene();
scene.add(axes);
var parrot ; 

const camera = new THREE.PerspectiveCamera(
  50,
  myCanvas.offsetWidth / myCanvas.offsetHeight
);
camera.position.set(1, 20, 230);
camera.lookAt(scene.position);

const hemiLight = new THREE.HemisphereLight( 0xccFFFF, 0xffffff, 4.5 );
hemiLight.color.setHSL( 0.6, 1, 0.6, THREE.SRGBColorSpace );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75, THREE.SRGBColorSpace );
hemiLight.position.set( 0, 50, 0 );
scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0x00CED1, 2.0 );
dirLight.color.setHSL( 0.1, 1, 0.95, THREE.SRGBColorSpace );
dirLight.position.set( - 1, 1.75, 1 );
dirLight.position.multiplyScalar( 30 );
scene.add( dirLight );

const renderer = new THREE.WebGLRenderer({ canvas: myCanvas });
renderer.setClearColor(0xffffff, 1.0); 
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(myCanvas.offsetWidth, myCanvas.offsetHeight);


const loader = new GLTFLoader();

loader.load( '/css/threejs/model/Parrot.glb', function ( gltf ) {
  const model = gltf.scene.children[0];
  const clip = gltf.animations[0];
  parrot = model ; 
  mixer = new THREE.AnimationMixer( gltf.scene );
        
  gltf.animations.forEach( ( clip ) => {
    
      mixer.clipAction( clip ).play();
    
  } );
  orbitControls.target.copy(model.position);
  scene.add( model );
  sx = model.position.x ; 
  sy = model.position.y ; 
  sz = model.position.z;
}, undefined, function ( error ) {

	console.error( error );

} );


const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.maxPolarAngle = Math.PI * 0.5;
orbitControls.minDistance = 0.1;
orbitControls.maxDistance = 100;
orbitControls.autoRotate = true;
orbitControls.enabled = false;
orbitControls.autoRotateSpeed = 1.0; 
camera.aspect = window.innerWidth / window.innerHeight
camera.updateProjectionMatrix()
renderer.setSize(window.innerWidth, window.innerHeight)
animate()

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}


function cantorPairing(k1 , k2 ){
  return (k1 + k2)(k1 + k2 + 1)/2 + k2;

}
function cantorDePairing(z){
  var n =Math.floor((-1 + Math.sqrt(1 + 8 * z ))/2) 
  var Tn = (n * (n+1)) /2 
  var y =  z - Tn   
  var x = n  - y
  return [x,y]

}
var ptime = 0;
function animate() {
  let convertToRad = (angle)=> (angle/180) * Math.PI/180
  requestAnimationFrame( animate );
  
  var delta = clock.getDelta();
  ptime++;
  var time = ptime / 100 ;
  // so we will seperate it to 2 numbers using this formula : 
  if(time % 50 == 0 ){
    factor =  Math.random() ; 
  }
  var [angle1 , angle2 ] = [time  , time] ; 
  if ( mixer ) {
    mixer.update( delta );
    parrot.position.x = sx - 40  + Math.cos(angle1) * radius ;
    parrot.position.y= sy + Math.sin(angle1) *  radius ; 
    parrot.position.z = sz + Math.sin(angle1) * radius ; 
    parrot.rotation.x =  Math.cos(angle1) * Math.PI/3

  }
  

  renderer.render( scene, camera );

}






