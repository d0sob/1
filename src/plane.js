import * as THREE from "three";

export default class Plane {
  constructor() {
    this.geometry = new THREE.PlaneGeometry(10, 10);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });
    this.plane = new THREE.InstancedMesh(this.geometry, this.material, 1);
    this.plane.rotation.x = Math.PI / 2;
    this.plane.receiveShadow = true;

    this.goingUp = true;
    this.speed = 0.01;
    this.amplitude = 2;
    this.plane.position.y = 0;
  }

  getMesh() {
    return this.plane;
  }

  movePlane() {
    if (this.goingUp) {
      this.plane.position.y += this.speed;
      if (this.plane.position.y >= this.amplitude) {
        this.goingUp = false;
      }
    } else {
      this.plane.position.y -= this.speed;
      if (this.plane.position.y <= -this.amplitude) {
        this.goingUp = true;
      }
    }
  }
}
