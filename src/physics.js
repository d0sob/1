import * as THREE from "three";
import { AmmoPhysics } from "three/addons/physics/AmmoPhysics.js";

export default class Physics {
  async initPhysics(DynamicObject, initPosition, scene) {
    console.log("physics started");
    this.physics = await AmmoPhysics();
    DynamicObject.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    DynamicObject.userData.physics = { mass: 1 };
    this.physics.addScene(scene);
    this.physics.setMeshPosition(DynamicObject, initPosition);
    // this.myBox.getMesh().instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    // this.myBox.getMesh().userData.physics = { mass: 1 };
    // this.myPlane.getMesh().instanceMatrix.setUsage(THREE.StaticDrawUsage);
    // this.myPlane.getMesh().userData.physics = { mass: 0 };

    // this.physics.addScene(this.myScene.getScene());

    // this.physics.setMeshPosition(this.myBox.getMesh(), this.position);
  }
}
