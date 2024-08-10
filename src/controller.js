import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

// https://github.com/d0sob/FirstPersonMovement/blob/main/index.html try from here
export default class Controls {
  constructor(camera, gamer) {
    this.camera = camera;
    this.gamer = gamer;
    this.rendererElement = document.getElementById("threejs-stuff");
    this.controls = new PointerLockControls(this.camera, this.rendererElement);
    document.addEventListener("click", () => {
      this.controls.lock();

      this.handleKeyStrokes();
      this.updateMovement();

      this.raycaster = new THREE.Raycaster(
        new THREE.Vector3(),
        new THREE.Vector3(0, -1, 0),
        0,
        1.5 // Adjust the ray length as needed
      );
    });
  }
  handleKeyStrokes() {
    document.addEventListener("keydown", (e) => {
      // console.log(`Key down: ${e.code}`);
      switch (e.code) {
        case "KeyW":
          this.moveForward = true;
          break;
        case "KeyS":
          this.moveBackward = true;
          break;
        case "KeyA":
          this.moveLeft = true;
          break;
        case "KeyD":
          this.moveRight = true;
          break;
      }
    });

    document.addEventListener("keyup", (e) => {
      // console.log(`Key up: ${e.code}`);
      switch (e.code) {
        case "KeyW":
          this.moveForward = false;
          break;
        case "KeyS":
          this.moveBackward = false;
          break;
        case "KeyA":
          this.moveLeft = false;
          break;
        case "KeyD":
          this.moveRight = false;
          break;
      }
    });
  }

  updateMovement() {
    // console.log("Move Forward:", this.moveForward);
    // console.log("Move Backward:", this.moveBackward);
    // console.log("Move Left:", this.moveLeft);
    // console.log("Move Right:", this.moveRight);
    const delta = 0.1; // Movement speed factor
    const direction = new THREE.Vector3();

    if (this.moveForward) {
      direction.z -= delta;
      // console.log("moving forward");
    }
    if (this.moveBackward) {
      direction.z += delta;
      // console.log("moving backward");
    }
    if (this.moveLeft) {
      direction.x -= delta;
      // console.log("moving left");
    }
    if (this.moveRight) {
      direction.x += delta;
      // console.log("moving right");
    }

    // Apply the movement direction to the camera
    direction.applyQuaternion(this.camera.quaternion);
    this.gamer.position.add(direction);
    this.camera.position.copy(this.gamer.position);
  }
}
