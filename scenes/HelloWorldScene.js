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
    this.load.image("sky", "./public/assets/FondoMenu.jpg");
    this.load.image("ninja", "./public/assets/Ninja.png");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("diamond", "./public/assets/diamond.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("bomb", "./public/assets/bomb.png");
    this.load.image("particle", "./public/assets/particle.png");
  }

  create() {
    // create game objects
    
    this.add.image(400, 300, "sky").setScale(0.7);

    this.platforms = this.physics.add.staticGroup();
 
    this.platforms.create(400, 568, "platform").setScale(2).refreshBody(); // suelo en la parte inferior

    // plataformas en la parte superior


    this.platforms.create(100, 350, "platform").setScale(0.5).refreshBody();

    this.platforms.create(300, 450, "platform").setScale(0.3).refreshBody();

    this.platforms.create(500, 250, "platform").setScale(0.3).refreshBody();

    this.player = this.physics.add.image(400, 500, "ninja").setScale(0.1);

    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    this.particles = this.add.particles("particle");

  this.collectable = this.physics.add.group();

    this.totalscore = 0;
    this.totalcollectable = [0, 0, 0];

    /* const emitter = this.add.particles(400, 300, 'particle', {
      speed: { min: -100, max: 100 },
      lifespan: 1500,
      quantity: 10,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
      
  });

  this.time.delayedCall(3000, () => {      // Desactivar el emisor después de 3 segundos
    emitter.setFrequency(-1); // Detener la emisión de partículas permitiendoles desvanecerse

            // Destruir luego de 2 segundos más (cuando ya murieron todas las partículas)
            this.time.delayedCall(2000, () => {
              emitter.destroy();
          });
}); */


    const textstyle = {
      fontSize: "32px",
      fill: "#fff",
    }

    const textstyle2 = {
      fontSize: "14px",
      fill: "#fff",
    }

    let textstyle3 = {
      fontSize: "16px",
      fill: "#000",
    }
    /* let collectabletext = this.totalcollectable.map((value, index) => { // separa los valores del array con .map y crea una funcion que utiliza su
      if (index === 0) return `Triangles: ${value}`;                    // posicion como "index" para asignar un texto y su valor como "value" para 
      if (index === 1) return `Squares: ${value}`;                      // asignar el valor del collectable
      if (index === 2) return `Diamonds: ${value}`;
    })
    .join("  "); // Unir los textos con una coma y un espacio
    this.totalcollectabletext = this.add.text(16, 60, collectabletext, textstyle2) //muestra el texto de los collectables */



    this.add.image(20, 67, "triangle").setScale(0.3); // contador de triángulos

    this.triangletext = this.add.text(40, 60, this.totalcollectable[0], textstyle3); // texto de triángulos

    this.add.image(70, 69, "square").setScale(0.3); // contador de triángulos

    this.squaretext = this.add.text(90, 60, this.totalcollectable[1], textstyle3); // texto de triángulos

    this.add.image(120, 67, "diamond").setScale(0.38); // contador de triángulos

    this.diamondtext = this.add.text(140, 60, this.totalcollectable[2], textstyle3); // texto de triángulos



    this.tutorialtext = this.add.text(550, 550, `To win score 100 points`, textstyle2);
    this.tutorialtext2 = this.add.text(550, 570, `and collect 2 of each shape`, textstyle2);

    this.gameover = 0;
    console.log("gameover value:", this.gameover);
    this.add.text(16, 16, `Score: `, textstyle);
    this.scoreText = this.add.text(140, 16, `${this.totalscore}`, textstyle); // texto del puntaje

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

      let color = 0x00ff00; // Color verde para collectables

      if (collectable.type == "triangle") {
        color = 0x00ff00; // Color verde para triángulos
      }
      if (collectable.type == "square") {
        color = 0x00fffd; // Color celeste para cuadrados
      }
      if (collectable.type == "diamond") {
        color = 0xaa00ff; // Color violeta para diamantes
      }
      collectable.setDepth(0); // Cambia la profundidad del collectable para que las particulas estén por encima de él
      const emitter1 = this.add.particles(0, 20, 'particle', {
        speedX: { min: -100, max: 100 },
        speedY: { min: -50, max: -200 },
        lifespan: 500,
        quantity: 2,
        scale: { start: 2, end: 0 },
        blendMode: 'DARKEN',
        follow: collectable,
        depth: 0,
        tint: color, // Cambia el color de las partículas según el collectable
        emitZone: {
          source: new Phaser.Geom.Rectangle(-10, -10, 20, 20), // Área de emisión
          type: "random", // Las partículas se emiten desde posiciones aleatorias dentro del área
        },
     
        
    });
    collectable.emitter1 = emitter1; // Asignar el emisor al collectable
    collectable.emitter1.setFrequency(-1); // Detener la emisión de partículas inicialmente

      if (collectable.body.blocked.down) {

        if (collectable.istouchingdown == false) {
        collectable.touchCount++;
        console.log("touchCount:", collectable.touchCount); // Depuración
        collectable.istouchingdown = true; // Cambiar el estado a tocando el suelo

        if (collectable.type !== "bomb") {

         // Emitir 10 partículas en la posición del collectable
  collectable.emitter1.explode(10, collectable.x, collectable.y);


/*         this.time.delayedCall(500, () => {      // Desactivar el emisor después de 3 segundos

          emitter1.setFrequency(-1); // Detener la emisión de partículas permitiendoles desvanecerse


          this.time.delayedCall(2000, () => {
            emitter1.destroy();
          })
        });
         */

        }
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
        if (collectable.texture.key == "bomb") {

          collectable.emitter.setFrequency(-1); // Detener la emisión de partículas permitiendoles desvanecerse

          // Destruir luego de 2 segundos más (cuando ya murieron todas las partículas)
          this.time.delayedCall(2000, () => {
            collectable.emitter.destroy();
            
        });
        }
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
  let velocity = (0, 0);
  if (x == 1) {
    type = "triangle";
    score = 10;
    scale = 0.8;
    
  }
  if (x == 2) {
    type = "square";
    score = 15;
    scale = 0.8;
    
  } 
  if (x == 3) {
    type = "diamond";
    score = 20;
    scale = 1;
    
  }
  if (x == 4) {
    type = "bomb";
    score = -20;
    scale = 0.5;
    velocity = (0, 0);
    
  }

let collectable = this.collectable.create(  Phaser.Math.Between(0, 800), 16, type).setScale(scale);
collectable.setBounce(0.5);
collectable.setCollideWorldBounds(true);
collectable.setVelocity(velocity);

  // Agregar propiedad personalizada para contar las veces que toca el piso
  collectable.touchCount = 0;

  // Agregar propiedad personalizada para almacenar el puntaje
  collectable.score = score; 

  // Agregar propiedad personalizada para determinar si está tocando el suelo
  collectable.istouchingdown = false; 

  collectable.type = type; // Agregar propiedad personalizada para el tipo de collectable

  if (type == "bomb") {
    collectable.setDepth(1); // Cambia la profundidad de la bomba para que esté por encima de los collectables
    const emitter2 = this.add.particles(0, 0, 'bomb', {
      speed: { min: 0, max: 100 },
      lifespan: 400,
      quantity: 1,
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      follow: collectable,
      depth: -1,
      
  });
collectable.emitter = emitter2; // Asignar el emisor al collectable
/*   this.time.delayedCall(3000, () => {      // Desactivar el emisor después de 3 segundos
    emitter2.setFrequency(-1); // Detener la emisión de partículas permitiendoles desvanecerse

            // Destruir luego de 2 segundos más (cuando ya murieron todas las partículas)
            this.time.delayedCall(2000, () => {
              emitter2.destroy();
          });
}); */
  }
}

collectablegrabbed(player, collectable) {
  collectable.disableBody(true, true);

   // Emitir 10 partículas en la posición del collectable
   if (collectable.type !== "bomb") {
   collectable.emitter1.setBlendMode("ADD"); 
   collectable.emitter1.explode(10, collectable.x, collectable.y);
   }

  let scorevalue = Math.abs(collectable.score) - (collectable.touchCount * 5); //calcular el puntaje restando los rebotes
 
if (collectable.texture.key == "bomb") {
  this.totalscore -= scorevalue; // si es una bomba el valor del collectable se resta al puntaje total
  this.player.setTint(0xff0000); // Cambia el color del jugador a rojo

  collectable.emitter.setFrequency(-1); // Detener la emisión de partículas permitiendoles desvanecerse

          // Destruir luego de 2 segundos más (cuando ya murieron todas las partículas)
          this.time.delayedCall(2000, () => {
            collectable.emitter.destroy();
          })
  
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
let color0 = "#fff"

this.totalscore >= 100 ? color0 = "#00ff00" : color0 = "#fff"; // Cambia el color a verde si hay 100 o más puntos


  this.scoreText.setText(this.totalscore).setStyle({fill: color0}); // actualiza el texto del puntaje


/*   this.totalcollectabletext.setText(this.totalcollectable.map((value, index) => { // actualiza el texto de los collectables
    if (index === 0) return `Triangles: ${value}`;
    if (index === 1) return `Squares: ${value}`;
    if (index === 2) return `Diamonds: ${value}`;
  })
.join("  ")
);  */


let color1 = "#000"
let color2 = "#000"
let color3 = "#000"

this.totalcollectable[0] >= 2 ? color1 = "#00ff00" : color1 = "#000"; // Cambia el color a verde si hay 2 o más de cierto collectable
this.totalcollectable[1] >= 2 ? color2 = "#00ff00" : color2 = "#000"; 
this.totalcollectable[2] >= 2 ? color3 = "#00ff00" : color3 = "#000"; 

  this.triangletext.setText(this.totalcollectable[0]).setStyle({fill: color1}); // actualiza el texto de los triángulos
  this.squaretext.setText(this.totalcollectable[1]).setStyle({fill: color2}); // actualiza el texto de los cuadrados
  this.diamondtext.setText(this.totalcollectable[2]).setStyle({fill: color3}); // actualiza el texto de los diamantes



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
