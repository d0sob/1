import * as THREE from "three";

export default class Plane {
  constructor() {
    this.geometry = new THREE.PlaneGeometry(5, 5);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);

    // Initialize movement properties
    this.goingUp = true;
    this.speed = 0.01;
    this.amplitude = 2;
    this.plane.position.y = 0; // Set initial position
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
