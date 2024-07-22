import * as THREE from "three";

class Sphere {
  constructor() {
    this.geometry = new THREE.SphereGeometry(1, 32, 16);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
    });
    this.sphere = new THREE.Mesh(this.geometry, this.material);
  }
  getMesh() {
    return this.sphere;
  }
}
export default Sphere;
