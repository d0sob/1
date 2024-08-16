import {
  THREE,
  Bullet,
  Controls,
  Capsule,
  Plane,
  SceneInit,
} from "./imports.js";

const socket = io();

class Game {
  constructor() {
    this.players = {};
    this.bullets = [];
    this.camera = null;
    this.scene = null;
    this.controls = null;
    this.capsule = null;
    this.prevTime = performance.now();
    this.isFiring = false;
    this.fireRate = 500; // Milliseconds between shots

    this.initScene = new SceneInit();
    this.init();
    this.animate();
  }

  init() {
    this.camera = this.initScene.getCamera();

    this.scene = this.initScene.getScene();

    this.capsule = new Capsule().getMesh();
    this.scene.add(this.capsule);
    this.capsule.position.y = 3;

    this.controls = new Controls(this.camera, this.capsule);

    const floor = new Plane().getMesh();
    this.scene.add(floor);
    floor.position.y = -2;

    this.setupSocketListeners();
    this.setupEventListeners();
  }
  checkBulletHit(shooterId, bullet) {
    // Iterate over all players except the shooter
    Object.keys(this.players).forEach((id) => {
      if (id !== shooterId) {
        const player = this.players[id];
        const distance = bullet.mesh.position.distanceTo(player.mesh.position);
        const playerRadius = 1.5; // Adjust this based on your player size
        const bulletRadius = 0.5; // Adjust this based on your bullet size

        if (distance < playerRadius + bulletRadius) {
          console.log(`Client: Player ${shooterId} hit Player ${id}`);
          // You could add visual effects here, like reducing player health, etc.
        }
      }
    });
  }
  setupSocketListeners() {
    socket.on("currentPlayers", (currentPlayers) => {
      Object.keys(currentPlayers).forEach((id) => {
        if (id !== socket.id) {
          this.addPlayer(currentPlayers[id]);
        }
      });
    });

    socket.on("newPlayer", (player) => {
      this.addPlayer(player);
    });

    socket.on("playerMoved", (player) => {
      if (this.players[player.id]) {
        this.players[player.id].mesh.position.set(
          player.position.x,
          player.position.y,
          player.position.z
        );
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

      this.checkBulletHit(data.shooterId, bullet);
    });
    socket.on("bulletHit", (data) => {
      console.log(
        `Client: Player ${data.shooterId} hit Player ${data.targetId}`
      );
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
    bulletVelocity.multiplyScalar(50); // Adjust bullet speed as needed

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
    const playerGeo = new THREE.CapsuleGeometry(1, 2, 10, 30);
    const playerMat = new THREE.MeshBasicMaterial({ color: "white" });
    const playerMesh = new THREE.Mesh(playerGeo, playerMat);
    playerMesh.position.set(
      playerInfo.position.x,
      playerInfo.position.y,
      playerInfo.position.z
    );
    this.scene.add(playerMesh);
    this.players[playerInfo.id] = {
      mesh: playerMesh,
      position: playerMesh.position,
      health: playerInfo.health,
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
