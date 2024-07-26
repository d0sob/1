import * as THREE from "three";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

class SceneInit {
  constructor() {
    this.scene = new THREE.Scene();
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

    // this.loader = new GLTFLoader();
    // this.model = this.loader.load(
    //   "./src/newHead.glb",
    //   (gltf) => {
    //     this.bbox = new THREE.Box3().setFromObject(gltf.scene);
    //     this.center = this.bbox.getCenter(new THREE.Vector3());

    //     gltf.scene.position.sub(this.center);

    //     this.scale = 1;
    //     gltf.scene.scale.set(this.scale, this.scale, this.scale);

    //     this.scene.add(gltf.scene);
    //   },
    //   undefined,
    //   (e) => {
    //     console.error(e);
    //   }
    // );

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
