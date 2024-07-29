import * as THREE from "three";

class Capsule {
  constructor() {
    this.geometry = new THREE.CapsuleGeometry();
    this.material = new THREE.MeshNormalMaterial();
    this.capsule = new THREE.Mesh(this.geometry, this.material);
    this.capsule.position.y = 2;
  }
  getMesh() {
    return this.capsule;
  }
}
export default Capsule;
