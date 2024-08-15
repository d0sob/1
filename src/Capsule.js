import * as THREE from "three";

class Capsule {
  constructor() {
    this.geometry = new THREE.CapsuleGeometry(1, 2, 10, 30);
    this.material = new THREE.MeshBasicMaterial({ color: "Green" });
    this.capsule = new THREE.Mesh(this.geometry, this.material);
  }
  getMesh() {
    return this.capsule;
  }
}
export default Capsule;
