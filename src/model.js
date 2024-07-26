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
  spin(speed = 0) {
    if (this.model) {
      this.model.rotation.y += speed;
    }
  }
  changeSize(speed = 0.01, scaleFactor = 0.005) {
    if (this.model) {
      const scale = 1 + Math.sin(Date.now() * speed) * scaleFactor;
      this.model.scale.set(scale, scale, scale);
    }
  }
  glowModel(intentensity = 1) {
    if (this.model) {
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color("pink"); // Green glow
          child.material.emissiveIntensity = intentensity;
        }
      });
    } else {
      console.error("model not loaded");
    }
  }
}
