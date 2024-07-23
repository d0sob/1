import * as THREE from "three";

class Sphere {
  constructor() {
    this.geometry = new THREE.SphereGeometry(2, 16, 8);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    this.sphere = new THREE.Mesh(this.geometry, this.material);
    this.sphere.userData.zoom = true;
  }
  getMesh() {
    return this.sphere;
  }
}
export default Sphere;
