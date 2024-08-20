import * as THREE from "three";

class Box {
  constructor() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.InstancedMesh(this.geometry, this.material, 1);
    this.position = new THREE.Vector3();
    this.position.set(2, 8, 0);
  }

  getMesh() {
    return this.cube;
  }
  scale(size) {
    this.cube.scale.set(size, size, size);
  }
  getPosition() {
    return this.position;
  }
  translate() {
    if (this.cube.position.y <= 5) {
      this.cube.translateOnAxis(new THREE.Vector3(0, 0.01, 0.015), 10);
    }
  }
}

export default Box;
