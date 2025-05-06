// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init(data) {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
    this.topscore = data.topscore || 0;
  }

  preload() {
    // load assets
    this.load.image("sky", "./public/assets/Cielo.webp");
    this.load.image("ninja", "./public/assets/Ninja.png");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("diamond", "./public/assets/diamond.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("bomb", "./public/assets/bomb.png");
  }

  create() {
    // create game objects
    
    this.add.image(400, 300, "sky").setScale(2);

    this.platforms = this.physics.add.staticGroup();
 
    this.platforms.create(400, 568, "platform").setScale(2).refreshBody(); // suelo en la parte inferior

    // plataformas en la parte superior


    this.platforms.create(100, 350, "platform").setScale(0.5).refreshBody();

    this.platforms.create(300, 450, "platform").setScale(0.3).refreshBody();

    this.platforms.create(500, 250, "platform").setScale(0.3).refreshBody();

    this.player = this.physics.add.image(400, 300, "ninja").setScale(0.1);

    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

  this.collectable = this.physics.add.group();

    this.totalscore = 0;
    this.totalcollectable = [0, 0, 0];

    const textstyle = {
      fontSize: "32px",
      fill: "#fff",
    }

    const textstyle2 = {
      fontSize: "14px",
      fill: "#000",
    }
    this.totalcollectabletext = this.add.text(16, 60, `Collectables: ${this.totalcollectable}`, textstyle2)
    this.tutorialtext = this.add.text(570, 550, `To win score 100 points`, textstyle2);
    this.tutorialtext2 = this.add.text(570, 570, `and collect 2 of each shape`, textstyle2);

    this.gameover = 0;
    console.log("gameover value:", this.gameover);
    this.scoreText = this.add.text(16, 16, `Score: ${this.totalscore}`, textstyle);

    this.physics.add.collider(this.player, this.platforms);

    this.physics.add.collider(this.collectable, this.platforms);
 
    this.physics.add.overlap(
      this.player,
      this.collectable,
      this.collectablegrabbed,
      null,
      this
    );

    this.collectableevent = this.time.addEvent({
      delay: 500,
      callback: this.spawnCollectable,
      callbackScope: this,
     
      loop: true,
    });

    this.cursors = this.input.keyboard.createCursorKeys();

          // Tiempo inicial en segundos
          this.initialTime = 15;

          // Texto del temporizador
      this.timerText = this.add.text(620, 16, `Time: ${this.initialTime}`, textstyle);
  
        // Evento del temporizador que cuenta hacia abajo
        this.timerEvent = this.time.addEvent({
          delay: 1000, // 1 segundo
          callback: this.updateTimer,
          callbackScope: this,
          loop: true,
      });
      this.keysZ = this.input.keyboard.addKeys("Z");
  }

  update() {
    // update game objects

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }
  if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-330);
    }
  if (this.cursors.down.isDown) {
    this.player.setVelocityY(this.player.body.velocity.y + 10)
  }

    // game over != 0 significa que se ha perdido o ganado

    if (this.gameover === 1 || this.gameover === 2) {

      this.scene.start("game-over", { totalscore: this.totalscore, gameover: this.gameover, topscore: this.topscore }); // Cambia a la escena de Game Over y manda el puntaje y el estado
    }

    this.collectable.children.iterate((collectable) => {
      if (!collectable.active) {
        return; // Si está desactivado, no hacer nada
      }

      if (collectable.body.blocked.down) {

        if (collectable.istouchingdown == false) {
        collectable.touchCount++;
        collectable.istouchingdown = true; // Cambiar el estado a tocando el suelo
        }
       
        this.time.delayedCall(1000, () => { // garantiza que si el collectable deja de rebotar sea eliminado despues de un tiempo
          collectable.istouchingdown = false;
        });

      }
      else{
        collectable.istouchingdown = false; // Cambiar el estado a no tocando el suelo
        }

      if (collectable.touchCount * 5 >=  Math.abs(collectable.score)) {
        collectable.disableBody(true, true); // Desactivar el collectable cuando su puntaje sea menor o igual a 0
      }
    });
    if (this.keysZ.Z.isDown) {
      this.gameover = Phaser.Math.Between(1, 2); // Cambia el valor de gameover a perder o ganar
    }
}

spawnCollectable() {

let x = Phaser.Math.Between(1, 4);
  let type = "";
  let score = 0;
  let scale = 0;
  if (x == 1) {
    type = "triangle";
    score = 10;
    scale = 1;
  }
  if (x == 2) {
    type = "square";
    score = 15;
    scale = 1;
  } 
  if (x == 3) {
    type = "diamond";
    score = 20;
    scale = 1;
  }
  if (x == 4) {
    type = "bomb";
    score = -20;
    scale = 0.8;
  }

let collectable = this.collectable.create(  Phaser.Math.Between(0, 800), 16, type).setScale(scale);
collectable.setBounce(0.5);
collectable.setCollideWorldBounds(true);
collectable.setVelocity(0 , 0);

  // Agregar propiedad personalizada para contar las veces que toca el piso
  collectable.touchCount = 0;

  // Agregar propiedad personalizada para almacenar el puntaje
  collectable.score = score; 

  // Agregar propiedad personalizada para determinar si está tocando el suelo
  collectable.istouchingdown = false; 
  
}

collectablegrabbed(player, collectable) {
  collectable.disableBody(true, true);

  let scorevalue = Math.abs(collectable.score) - (collectable.touchCount * 5); //calcular el puntaje restando los rebotes
 
if (collectable.texture.key == "bomb") {
  this.totalscore -= scorevalue; // si es una bomba el valor del collectable se resta al puntaje total
  this.player.setTint(0xff0000); // Cambia el color del jugador a rojo
  
  this.time.delayedCall(300, () => {
    this.player.clearTint(); // Quitar el tint rojo despues de 1 segundo
  });
  if (this.totalscore < 0) {
    this.totalscore = 0; // Asegurarse de que el puntaje no sea negativo
  }
}
  else {
  this.totalscore += scorevalue; // si no es una bomba el valor del collectable se suma al puntaje total

  if (collectable.texture.key == "triangle") {
    this.totalcollectable[0] += 1;
  }
  if (collectable.texture.key == "square") {
    this.totalcollectable[1] += 1;
  }
  if (collectable.texture.key == "diamond") {
    this.totalcollectable[2] += 1;
  }
}
  this.scoreText.setText(`Score: ${this.totalscore}`);
  this.totalcollectabletext.setText(`collectables: ${this.totalcollectable}`); // Actualizar el texto
}

updateTimer() {
  if (this.initialTime > 0) {
      this.initialTime--; // Reducir el tiempo en 1 segundo
      this.timerText.setText(`Time: ${this.initialTime}`); // Actualizar el texto
  } else {
        // si se consiguen mas de 100 puntos o se consiguen 2 o mas de cada collectable se gana al terminar el tiempo
    if (this.totalscore >= 100 && this.totalcollectable.every(num => num >= 2)){ 

      this.gameover = 1; 

    }
      else{
      this.gameover = 2; // cambia el valor de gameover a perder
      this.timerText.setText("Time: 0"); // Asegurarse de mostrar 0
      }
  }
}

}
