// ModelLoader.js
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class ModelLoader {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.loader.load(
      "./src/newHead.glb",
      (gltf) => {
        this.box = new THREE.Box3().setFromObject(gltf.scene);
        this.center = this.box.getCenter(new THREE.Vector3());
        gltf.scene.position.sub(this.center);
        this.scale = 1;
        gltf.scene.scale.set(this.scale, this.scale, this.scale);
        this.model = gltf.scene;
        this.onLoad(); // Model is loaded, call the onLoad method
      },
      undefined,
      (e) => {
        console.error("An error occurred while loading the model", e);
      }
    );
  }

  onLoad() {
    console.log("Model loaded successfully");
    if (this.model && this.scene) {
      this.scene.add(this.model); // Add model to scene once loaded
    } else {
      console.error("Model or scene not available");
    }
  }

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

  glowModel(intensity = 1) {
    if (this.model) {
      this.model.traverse((child) => {
        if (child.isMesh) {
          child.material.emissive = new THREE.Color("pink");
          child.material.emissiveIntensity = intensity;
        }
      });
    } else {
      console.error("model not loaded");
    }
  }
}
