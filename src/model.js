import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class ModelLoader {
  constructor() {
    new GLTFLoader().load(
      "./src/newHead.glb",
      (gltf) => {
        this.box = new THREE.Box3().setFromObject(gltf.scene);
        this.center = this.box.getCenter(new THREE.Vector3());

        gltf.scene.position.sub(this.center);

        this.scale = 1;
        gltf.scene.scale.set(this.scale, this.scale, this.scale);

        this.model = gltf.scene;

        this.onLoad();
      },
      undefined,
      (e) => {
        console.error(e);
      }
    );
  }
  onLoad() {}
  getMesh() {
    return this.model;
  }
}
