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
    const onKeyDown = function (e) {
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
    };
    const onKeyUp = function (e) {
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
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
  }
  updateMovement() {
    // this.time = performance.now();
    // this.cameraMoveSpeed = 0.1;
    // this.camera.position.copy(this.gamer.position);
    // this.cameraDirection = new THREE.Vector3(0, 0, -1);
    // this.cameraDirection.applyQuaternion(this.camera.quaternion);
    // this.cameraRotation = new THREE.Euler(0, 0, 0, "YXZ");
    // this.cameraRotation.setFromQuaternion(this.camera.quaternion);
    // this.moveDirection = new THREE.Vector3();
    // if (this.moveForward) {
    //   this.moveDirection.add(this.cameraDirection);
    // }
    // if (this.moveBackward) {
    //   this.moveDirection.sub(this.cameraDirection);
    // }
    // if (this.moveRight) {
    //   this.rightDirection = this.cameraDirection
    //     .clone()
    //     .applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2);
    //   this.moveDirection.add(this.rightDirection);
    // }
    // if (this.moveLeft) {
    //   this.leftDirection = this.cameraDirection
    //     .clone()
    //     .applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    //   this.moveDirection.add(this.leftDirection);
    // }
    // this.moveDirection.normalize();
    // this.moveDirection.multiplyScalar(this.cameraMoveSpeed);
    // this.gamer.position.z += this.moveDirection.z;
    // this.gamer.position.x += this.moveDirection.x;
    // this.prevTime = this.time;
    // this.camera.position.lerp(this.gamer.position, this.cameraMoveSpeed);
  }
}
