import { THREE } from "./imports.js";

export default class Bullet {
  constructor(position, velocity) {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: "red" })
    );
    this.mesh.position.copy(position);
    this.velocity = velocity;
    this.lifespan = 2;
  }

  update(delta) {
    // Move the bullet
    this.mesh.position.addScaledVector(this.velocity, delta);

    // Decrease lifespan
    this.lifespan -= delta;
  }
}
