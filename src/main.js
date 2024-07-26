import SceneInit from "./scene.js";
import Plane from "./plane.js";
// import ModelLoader from "./model.js";
class Main {
  constructor() {
    this.myScene = new SceneInit();
    this.myPlane = new Plane();

    // this.loader = new ModelLoader();
    // this.loader.onLoad = this.init.bind(this);
    this.init();
  }

  init() {
    // if (this.loader.getMesh()) {
    //   this.myScene.add(this.loader.getMesh());
    // } else {
    //   console.error("model not loaded");
    // }

    this.myScene.add(this.myPlane.getMesh());
    this.animate();
  }

  animate() {
    function animateFrame() {
      // this.loader.spin(0.1);
      // this.loader.changeSize(0.001, 3);
      // this.loader.glowModel(0.6);
      // this.myScene.render();
      this.myPlane.getMesh().rotation.y += 0.01;
      this.myPlane.movePlane();

      requestAnimationFrame(animateFrame.bind(this));
    }

    animateFrame.call(this);
  }
}

new Main();
