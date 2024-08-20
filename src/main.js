import {
  THREE,
  Bullet,
  Controls,
  Capsule,
  Plane,
  SceneInit,
} from "./imports.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const socket = io();

class Game {
  constructor() {
    this.players = {};
    this.bullets = [];
    this.prevTime = performance.now();
    this.isFiring = false;
    this.fireRate = 150; // Milliseconds between shots
    this.bulletSpeed = 100;

    this.initScene = new SceneInit();
    this.createShader();
    this.init();
    this.animate();
  }
  createShader() {
    // Vertex Shader
    const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

    // Fragment Shader
    const fragmentShader = `
    uniform sampler2D map;
uniform vec3 lightColor;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vec4 textureColor = texture2D(map, vUv);
  
  // Simulated light intensity
  float intensity = max(dot(normalize(vNormal), normalize(vec3(0.5, 0.8, 1.0))), 0.0);
  
  // Apply toon shading (smoothstep for a gradual transition)
  float toonIntensity = smoothstep(0.2, 0.8, intensity);
  
  // Enhance color saturation
  vec3 saturatedColor = textureColor.rgb * 1.5; // Increase saturation factor as needed
  
  // Combine texture with toon shading
  vec3 colorWithShading = saturatedColor * toonIntensity * lightColor;
  
  // Apply dark blue tint
  vec3 blueTint = vec3(0.0, 0.0, 0.2); // Adjust the blue value for the desired tint
  vec3 tintedColor = mix(colorWithShading, blueTint, 0.2); // Adjust the mix factor for tint strength
  
  // Ensure brightness is not too low
  vec3 brightColor = mix(tintedColor, saturatedColor, 0.3); // Adjust the mix factor for desired brightness
  
  // Final color output
  gl_FragColor = vec4(brightColor, textureColor.a);
}

`;

    // Create Shader Material
    this.shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        map: { type: "t", value: null },
        lightColor: { type: "c", value: new THREE.Color(0xffffff) },
      },
    });
  }

  init() {
    this.camera = this.initScene.getCamera();
    this.scene = this.initScene.getScene();
    this.capsule = new Capsule().getMesh();
    this.scene.add(this.capsule);
    this.capsule.position.y = 3;

    this.controls = new Controls(this.camera, this.capsule);

    const loader = new GLTFLoader();
    loader.load(
      "./src/collision-world.glb",
      (gltf) => {
        this.map = gltf.scene;
        this.map.traverse((child) => {
          if (child.isMesh) {
            // Preserve original texture
            const originalTexture = child.material.map;

            // Apply shader material
            const material = this.shaderMaterial.clone();
            material.uniforms.map.value = originalTexture; // Assign the original texture

            child.material = material;
          }
        });
        // this.map.scale.set(2, 2, 2);
        this.scene.add(this.map);
        console.log("Model loaded successfully");
        // Now it's safe to proceed with code that depends on the model
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the model:", error);
      }
    );

    this.setupSocketListeners();
    this.setupEventListeners();
  }

  setupSocketListeners() {
    socket.on("currentPlayers", (currentPlayers) => {
      Object.keys(currentPlayers).forEach((id) => {
        if (id !== socket.id) {
          this.addPlayer(currentPlayers[id]);
          // ALL PLAYERS IN LOBBY EXCEPT YOU
          // console.log(`${id} joined.`);
        }
      });
    });

    socket.on("newPlayer", (player) => {
      this.addPlayer(player);
      // NEW PLAYER JOINED
      console.log(`Player ${player.id} joined.`);
    });

    socket.on("playerMoved", (player) => {
      if (this.players[player.id]) {
        this.players[player.id].mesh.position.set(
          player.position.x,
          player.position.y,
          player.position.z
        );
        // THIS GIVES OTHER PLAYERS POSITION
        // console.log(
        //   `Player ${player.id} position @ (${player.position.x},${player.position.y}, ${player.position.z})`
        // );
      }
    });

    socket.on("playerShot", (data) => {
      const bullet = new Bullet(
        new THREE.Vector3(
          data.bulletData.position.x,
          data.bulletData.position.y,
          data.bulletData.position.z
        ),
        new THREE.Vector3(
          data.bulletData.velocity.x,
          data.bulletData.velocity.y,
          data.bulletData.velocity.z
        )
      );
      this.scene.add(bullet.mesh);
      this.bullets.push(bullet);
    });

    socket.on("playerDisconnected", (id) => {
      if (this.players[id]) {
        this.scene.remove(this.players[id].mesh);
        delete this.players[id];
      }
    });
  }

  setupEventListeners() {
    document.addEventListener("mousedown", () => this.startFiring());
    document.addEventListener("mouseup", () => this.stopFiring());
    window.addEventListener("blur", () => this.stopFiring());
    window.addEventListener("focus", () => {
      if (this.isFiring) this.startFiring();
    });
  }

  startFiring() {
    if (!this.isFiring) {
      this.isFiring = true;
      this.fire();
    }
  }

  stopFiring() {
    this.isFiring = false;
  }

  fire() {
    if (this.isFiring) {
      this.shoot();
      setTimeout(() => this.fire(), this.fireRate);
    }
  }

  shoot() {
    const bulletVelocity = new THREE.Vector3();
    this.camera.getWorldDirection(bulletVelocity); // Get the direction the camera is facing
    bulletVelocity.multiplyScalar(this.bulletSpeed); // Adjust bullet speed as needed

    const bullet = new Bullet(this.camera.position.clone(), bulletVelocity);
    this.scene.add(bullet.mesh);
    this.bullets.push(bullet);

    // Emit the shoot event to the server
    socket.emit("shoot", {
      position: {
        x: bullet.mesh.position.x,
        y: bullet.mesh.position.y,
        z: bullet.mesh.position.z,
      },
      velocity: {
        x: bullet.velocity.x,
        y: bullet.velocity.y,
        z: bullet.velocity.z,
      },
    });
  }

  addPlayer(playerInfo) {
    const playerMesh = new Capsule().getMesh();
    playerMesh.position.set(
      playerInfo.position.x,
      playerInfo.position.y,
      playerInfo.position.z
    );
    this.scene.add(playerMesh);
    this.players[playerInfo.id] = {
      mesh: playerMesh,
      position: playerMesh.position,
    };
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.controls.updateMovement();
    const time = performance.now();
    const delta = (time - this.prevTime) / 1000;

    this.camera.position.y += 1.5;

    socket.emit("playerMove", { position: this.capsule.position });

    // Update bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(delta);

      // Remove expired bullets
      if (bullet.lifespan <= 0) {
        this.scene.remove(bullet.mesh);
        this.bullets.splice(i, 1);
      }
    }

    this.prevTime = time;
    this.initScene.render();
  }
}

new Game();
