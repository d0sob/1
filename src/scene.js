import * as THREE from "three";

class SceneInit {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setAnimationLoop(this.render.bind(this));
    document.body.appendChild(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("mousemove", (e) => this.onMouseMove(e), false);

    this.camera.position.z = 5;

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.ray.origin.copy(this.camera.position);
    this.raycaster.ray.direction
      .set(this.mouse.x, this.mouse.y, 1)
      .unproject(this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children);

    this.scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh && child.userData.zoom == true) {
        child.scale.set(1, 1, 1);
      }
    });
    intersects.forEach((intersect) => {
      if (
        intersect.object instanceof THREE.Mesh &&
        intersect.object.userData.zoom == true
      ) {
        intersect.object.scale.set(2, 2, 2);
      }
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  add(object) {
    this.scene.add(object);
  }
}

export default SceneInit;
