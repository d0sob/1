import * as THREE from "three";

export default class Plane {
  constructor() {
    this.geometry = new THREE.PlaneGeometry(50, 40);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    });
    this.plane = new THREE.InstancedMesh(this.geometry, this.material, 1);
    this.plane.rotation.x = Math.PI / 2;
    this.plane.receiveShadow = true;

    this.goingUp = true;
    this.speed = 0.01;
    this.amplitude = 2;
    this.position = new THREE.Vector3();
    this.position.set(0, 0, 0);
  }

  getMesh() {
    return this.plane;
  }
  getPosition() {
    return this.position;
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
