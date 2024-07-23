import * as THREE from "three";

class Capsule {
  constructor() {
    this.geometry = new THREE.CapsuleGeometry(0.1, 4);
    this.material = new THREE.MeshNormalMaterial();
    this.capsule = new THREE.Mesh(this.geometry, this.material);
  }
  getMesh() {
    return this.capsule;
  }
}
export default Capsule;
