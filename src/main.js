import SceneInit from "./scene.js";
import Box from "./box.js";
import Sphere from "./sphere.js";
import Capsule from "./Capsule.js";

class Main {
  constructor() {
    this.myScene = new SceneInit();
    this.myBox = new Box();
    this.mySphere = new Sphere();
    this.myCapsule = new Capsule();

    this.init();
  }

  init() {
    // this.myScene.add(this.myBox.getMesh());
    this.myScene.add(this.mySphere.getMesh());
    this.myScene.add(this.myCapsule.getMesh());

    this.animate();
  }

  animate() {
    const cube = this.myBox.getMesh();
    const sphere = this.mySphere.getMesh();
    const capsule = this.myCapsule.getMesh();
    const radius = 3;
    const angleStep = (2 * Math.PI) / 10;

    for (let i = 0; i < 10; i++) {
      this.newCapsule = new Capsule();
      this.myScene.add(this.newCapsule.getMesh());

      const angle = i * angleStep;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);

      this.newCapsule.getMesh().position.set(x, 0, z);
    }

    // capsule.position.x = 3;
    //   this.newCapsule = new Capsule();
    //   this.myScene.add(this.newCapsule.getMesh());
    //   this.newCapsule.getMesh().position.z = capsule.position.z + i;
    // }

    function animateFrame() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      sphere.rotation.x -= 0.01;
      // sphere.rotation.y += 0.01;
      this.myScene.render();

      requestAnimationFrame(animateFrame.bind(this));
    }

    animateFrame.call(this);
  }
}

new Main();
