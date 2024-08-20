import * as THREE from "three";

class Capsule {
  constructor() {
    this.geometry = new THREE.CapsuleGeometry(1, 2, 10, 30);
    const randomColor = new THREE.Color(Math.random(), Math.random(), 0.5);
    this.material = new THREE.MeshToonMaterial({ color: randomColor });
    this.capsule = new THREE.Mesh(this.geometry, this.material);
  }
  getMesh() {
    return this.capsule;
  }
}
export default Capsule;
