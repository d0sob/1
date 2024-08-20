import { THREE } from "./imports.js";

export default class Bullet {
  constructor(position, velocity) {
    const randomColor = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    );
    this.position = position.clone(); // Initialize position
    this.velocity = velocity.clone(); // Initialize velocity
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1, 8, 8),
      new THREE.MeshToonMaterial({ color: randomColor })
    );
    this.mesh.position.copy(this.position);
    this.lifespan = 7; // Bullet lifespan in seconds
    this.creationTime = performance.now();
    this.gravity = -100.81; // Gravity effect
  }

  update(delta) {
    // Apply gravity to the vertical velocity
    this.velocity.y += this.gravity * delta;

    // Update the position based on velocity
    this.position.addScaledVector(this.velocity, delta);
    this.mesh.position.copy(this.position); // Update mesh position

    // Decrease lifespan
    this.lifespan -= delta;

    // Remove the bullet if its lifespan is up
    if (this.lifespan <= 0) {
      // Logic to remove the bullet from the scene
    }
  }
}
