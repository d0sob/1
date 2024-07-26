import * as THREE from "three";

class SceneInit {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0xccccccc, 16, 1);
    this.scene.background = new THREE.Color("skyblue");
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.render.bind(this));
    document
      .getElementById("threejs-stuff")
      .appendChild(this.renderer.domElement);

    this.renderer.toneMapping = THREE.NeutralToneMapping;

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    this.directionalLight.position.set(-5, 10, -7.5);
    this.scene.add(this.directionalLight);
    this.target = new THREE.Vector3(0, 0, 0);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.camera.lookAt(this.target);
    this.camera.position.z = -10;

    this.renderer.render(this.scene, this.camera);
  }

  add(object) {
    this.scene.add(object);
  }
}

export default SceneInit;
