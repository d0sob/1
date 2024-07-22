import * as THREE from "three";

class Box {
  constructor() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.cube.userData.zoom = true;
  }

  getMesh() {
    return this.cube;
  }
  scale(size) {
    this.cube.scale.set(size, size, size);
  }
}

export default Box;
