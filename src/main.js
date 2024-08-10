import * as imports from "./imports.js";

new (class Main {
  constructor() {
    this.myScene = new imports.SceneInit();
    this.myPlane = new imports.Plane();
    this.Player = new imports.Capsule();
    this.myBox = new imports.Box();
    this.bullets = []; // Array to store bullets
    this.controls = new imports.Controls(
      this.myScene.getCamera(),
      this.Player.getMesh()
    );

    // Mouse state and firing rate
    this.isMouseDown = false;
    this.fireRate = 0.2; // Time between shots in seconds
    this.lastFireTime = 0;

    this.init();
  }

  init() {
    this.myScene.add(this.myPlane.getMesh());
    this.myScene.add(this.Player.getMesh());
    this.myScene.add(this.myBox.getMesh());

    document.addEventListener("mousedown", (event) => {
      if (event.button === 0) {
        // Left mouse button
        this.isMouseDown = true;
      }
    });

    document.addEventListener("mouseup", (event) => {
      if (event.button === 0) {
        // Left mouse button
        this.isMouseDown = false;
      }
    });

    this.animate();
  }

  fireBullet() {
    // Create a bullet and add it to the scene
    const bulletVelocity = new imports.THREE.Vector3(0, 0, -1).applyQuaternion(
      this.controls.camera.quaternion
    );
    const bulletPosition = this.Player.getMesh().position.clone();
    const bullet = new imports.Bullet(
      bulletPosition,
      bulletVelocity.multiplyScalar(10)
    ); // Adjust speed if necessary

    this.myScene.add(bullet.mesh);
    this.bullets.push(bullet);
  }

  animate() {
    this.animateFrame = (timestamp) => {
      const delta = 0.016; // Assuming a fixed time step (60fps)

      this.myBox.translate();
      this.controls.updateMovement();

      // Fire bullets while the mouse button is held down
      if (this.isMouseDown) {
        if (timestamp - this.lastFireTime >= this.fireRate * 1000) {
          this.fireBullet();
          this.lastFireTime = timestamp;
        }
      }

      // Update bullets
      this.bullets.forEach((bullet, index) => {
        bullet.update(delta);
        if (bullet.lifespan <= 0) {
          this.myScene.remove(bullet.mesh);
          this.bullets.splice(index, 1);
        }
      });

      requestAnimationFrame(this.animateFrame);
    };

    requestAnimationFrame(this.animateFrame);
  }
})();
