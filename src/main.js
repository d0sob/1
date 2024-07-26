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
      this.loader.spin(0.1);
      this.loader.changeSize(0.001, 3);
      this.loader.glowModel(0.6);
      this.myScene.render();
      requestAnimationFrame(animateFrame.bind(this));
    }

    animateFrame.call(this);
  }
}

new Main();
