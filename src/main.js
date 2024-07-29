import * as imports from "./imports.js";

class Main {
  constructor() {
    this.myScene = new imports.SceneInit();
    this.myPlane = new imports.Plane();
    this.Player = new imports.Capsule();
    this.myBox = new imports.Box();
    this.controls = new imports.Controls(
      this.myScene.getCamera(),
      this.Player.getMesh()
    );

    this.init();
    this.startPhysics();
  }

  async startPhysics() {
    this.myphysics = new imports.Physics();
    await this.myphysics.initPhysics(
      this.myBox.getMesh(),
      this.myBox.getPosition(),
      this.myScene.getScene()
    );
  }

  init() {
    this.myScene.add(this.myPlane.getMesh());
    this.myScene.add(this.Player.getMesh());
    this.myScene.add(this.myBox.getMesh());

    console.log("objects added");
    this.animate();
  }

  animate() {
    this.animateFrame = () => {
      requestAnimationFrame(this.animateFrame);
    };

    this.animateFrame();
  }
}

new Main();
