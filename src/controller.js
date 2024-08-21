import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export default class Controls {
  constructor(camera, player, map) {
    this.camera = camera;
    this.player = player;
    this.map = map;
    this.gravity = -0.0008;
    this.velocityY = 0;
    this.falling = true;

    this.rendererElement = document.getElementById("threejs-stuff");
    this.controls = new PointerLockControls(this.camera, this.rendererElement);
    document.addEventListener("click", () => {
      this.controls.lock();
      this.handleKeyStrokes();
    });
    this.raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0),
      0,
      5
    );

    this.createArrowHelper();
  }
  createArrowHelper() {
    this.rayDirection = new THREE.Vector3(0, -1, 0).normalize();
    const rayOrigin = this.player.position.clone();
    const length = 5;

    this.arrowHelper = new THREE.ArrowHelper(
      this.rayDirection,
      rayOrigin,
      length,
      0xff0000
    );
    return this.arrowHelper;
  }
  updateArrow() {
    this.arrowHelper.position.copy(this.player.position);
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    this.arrowHelper.setDirection(camDir);
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
        case "Space":
          this.moveUp = true;
          break;
        case "ShiftLeft":
          this.moveDown = true;
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
        case "Space":
          this.moveUp = false;
          break;
        case "ShiftLeft":
          this.moveDown = false;
          break;
      }
    });
  }
  chooseMovement(smm = false) {
    if (smm == true) {
      this.spectatorModeMovement();
    } else {
      this.normalMovement();
    }
  }
  normalMovement() {
    const delta = 0.1;
    const direction = new THREE.Vector3();

    if (this.falling) {
      this.velocityY += this.gravity;
      direction.y += this.velocityY;
    }

    // Ensure raycaster is defined before using it
    if (this.raycaster) {
      this.raycaster.ray.origin.copy(this.player.position);

      if (this.map) {
        const intersects = this.raycaster.intersectObject(this.map, true);

        if (intersects.length > 0) {
          const distanceToGround = intersects[0].distance;
          console.log(distanceToGround);
          if (distanceToGround <= 10) {
            this.velocityY = 0;
            this.falling = false;
            this.player.position.y = intersects[0].point.y;
          } else {
            this.falling = true;
          }
        } else {
          this.falling = true;
        }
      }
    }

    // Movement logic
    if (this.moveForward) {
      direction.z -= delta;
    }
    if (this.moveBackward) {
      direction.z += delta;
    }
    if (this.moveLeft) {
      direction.x -= delta;
    }
    if (this.moveRight) {
      direction.x += delta;
    }

    direction.applyQuaternion(this.camera.quaternion);
    this.player.position.add(direction);
    this.camera.position.copy(this.player.position);
  }

  spectatorModeMovement() {
    const delta = 0.1; // Movement speed factor
    const direction = new THREE.Vector3();

    if (this.moveForward) {
      direction.z -= delta;
    }
    if (this.moveBackward) {
      direction.z += delta;
    }
    if (this.moveLeft) {
      direction.x -= delta;
    }
    if (this.moveRight) {
      direction.x += delta;
    }
    if (this.moveUp) {
      direction.y += delta;
    }
    if (this.moveDown) {
      direction.y -= delta;
    }

    // Apply the movement direction to the camera
    direction.applyQuaternion(this.camera.quaternion);
    this.player.position.add(direction);
    this.camera.position.copy(this.player.position);
    this.updateArrow();
  }
}
