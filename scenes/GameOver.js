export default class GameOver extends Phaser.Scene {
    constructor() {
      // key of the scene
      // the key will be used to start the scene by other scenes
      super("game-over");
    }
  
    init(data) {
      // this is called before the scene is created
      // init variables
      // take data passed from other scenes
      // data object param {}
      console.log("Datos recibidos en gameover:", data); // Depuración

        this.totalscore = data.totalscore; // Get the final score from the data passed
        this.gameover = data.gameover; // Get the game over status from the data passed
       
    }
    preload() {
      // load assets
      this.load.image("background", "./public/assets/FondoMenu.jpg");
    }
      
     create() {
        // create game objects
        this.add.image(400, 270, "background").setScale(0.7);
      
        const style = { font: "80px Arial", fill: "#fff" };


        this.add.text(400, 100, "Game Over", style).setOrigin(0.5, 0.5);

      
        const style2 = { font: "20px Arial", fill: "#fff" };

  
      
        this.input.keyboard.on("keydown-R", () => {
          this.scene.start("hello-world"); // Restart the game scene
        });
        if (this.gameover === 1) {
          this.add.text(400, 200, "You win!", { font: "80px Arial", fill: " #008000" }).setOrigin(0.5, 0.5);;
        }
        else {
          this.add.text(400, 200, "You lose!", { font: "80px Arial", fill: " #FF0000" }).setOrigin(0.5, 0.5);;
        }

        this.add.text(400, 280, `Score: ${this.totalscore}`, style2).setOrigin(0.5, 0.5);
        
        this.add.text(400, 320, "Press R to restart", style2).setOrigin(0.5, 0.5);
     }
      update() {
        // update game objects
        // this is called every frame
        // update game logic
      }

}
