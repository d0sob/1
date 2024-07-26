import SceneInit from "./scene.js";
import ModelLoader from "./model.js";
class Main {
  constructor() {
    this.myScene = new SceneInit();

    this.loader = new ModelLoader();
    this.loader.onLoad = this.init.bind(this);
  }

  init() {
    if (this.loader.getMesh()) {
      this.myScene.add(this.loader.getMesh());
    } else {
      console.error("model not loaded");
    }

    this.animate();
  }

  animate() {
    function animateFrame() {
      this.myScene.render();
      requestAnimationFrame(animateFrame.bind(this));
    }

    animateFrame.call(this);
  }
}

new Main();
