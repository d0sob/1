import SceneInit from "./src/scene";
import Box from "./src/box";
import Sphere from "./src/sphere";

class Main {
  constructor() {
    this.myScene = new SceneInit();
    this.myBox = new Box();
    this.mySphere = new Sphere();

    this.init();
  }

  init() {
    this.myScene.add(this.myBox.getMesh());
    this.myScene.add(this.mySphere.getMesh());
    this.animate();
  }

  animate() {
    const cube = this.myBox.getMesh();
    const sphere = this.mySphere.getMesh();

    function animateFrame() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      this.myScene.render();

      requestAnimationFrame(animateFrame.bind(this));
    }

    animateFrame.call(this);
  }
}

new Main();
