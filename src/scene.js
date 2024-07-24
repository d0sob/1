import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
    document
      .getElementById("threejs-stuff")
      .appendChild(this.renderer.domElement);

    this.renderer.toneMapping = THREE.NeutralToneMapping;

    // ADDING LIGHTS
    ////////////////////////////////////////////////////
    // this.ambientLight = new THREE.PointLight(0xffffff, 1);
    // this.ambientLight.position.set(2, 4, 3);
    // this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    this.directionalLight.position.set(-5, 10, -7.5);
    this.scene.add(this.directionalLight);
    /////////////////////////////////////////////////

    // ADDING MODEL
    this.loader = new GLTFLoader();
    this.model = this.loader.load(
      "./src/newHead.glb",
      (gltf) => {
        this.bbox = new THREE.Box3().setFromObject(gltf.scene);
        this.center = this.bbox.getCenter(new THREE.Vector3());

        // Correct typo here: 'positon' should be 'position'
        gltf.scene.position.sub(this.center);

        this.scale = 1;
        gltf.scene.scale.set(this.scale, this.scale, this.scale);

        // Correct typo here: 'gtlf' should be 'gltf'
        this.scene.add(gltf.scene);
      },
      undefined,
      (e) => {
        console.error(e);
      }
    );

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener("mousemove", (e) => this.onMouseMove(e), false);

    this.radius = 8;
    this.speed = 0.01;
    this.angle = 0;
    this.target = new THREE.Vector3(0, 0, 0);

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
        child.material = new THREE.MeshBasicMaterial({
          color: "white",
          wireframe: true,
          transparent: true,
          opacity: 0,
        });
      }
    });
    intersects.forEach((intersect) => {
      if (
        intersect.object instanceof THREE.Mesh &&
        intersect.object.userData.zoom == true
      ) {
        intersect.object.scale.set(2, 2, 2);
        intersect.object.material = new THREE.MeshBasicMaterial({
          color: "#00FF00",
          wireframe: true,
        });
      }
    });
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.angle += this.speed;
    const x = this.target.x + this.radius * Math.cos(this.angle);
    const z = this.target.z + this.radius * Math.sin(this.angle);
    this.camera.position.set(x, this.camera.position.y, z);
    this.directionalLight.position.set(x, this.directionalLight.position.y, z);
    this.camera.lookAt(this.target);

    this.renderer.render(this.scene, this.camera);
  }

  add(object) {
    this.scene.add(object);
  }
}

export default SceneInit;
