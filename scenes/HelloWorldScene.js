// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("hello-world");
  }

  init() {
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // load assets
    this.load.image("sky", "./public/assets/Cielo.webp");
    this.load.image("background", "./public/assets/FondoMenu.jpg");
    this.load.image("ninja", "./public/assets/Ninja.png");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("diamond", "./public/assets/diamond.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("triangle", "./public/assets/triangle.png");
  }

  create() {
    // create game objects
    this.add.image(400, 300, "sky").setScale(2);

    this.platforms = this.physics.add.staticGroup();
 
    this.platforms.create(400, 568, "platform").setScale(2).refreshBody();

    this.player = this.physics.add.image(400, 100, "ninja").setScale(0.1);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

  this.collectable = this.physics.add.group();

    this.totalscore = 0;
    this.totalcollectable = [0, 0, 0];

    this.gameover = 0;

    this.scoreText = this.add.text(16, 16, `Score: ${this.totalscore}`, {
      fontSize: "32px",
      fill: "#fff",
    });

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
      delay: 1000,
      callback: this.spawnCollectable,
      callbackScope: this,
     
      loop: true,
    });

    this.cursors = this.input.keyboard.createCursorKeys();


  }

  update() {
    // update game objects

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }
  if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    if (this.totalcollectable.every(num => num >= 2)) {
      this.scoreText.setText(`Game Over! Score: ${this.totalscore}`);
    }

}

spawnCollectable() {

var x = Phaser.Math.Between(1, 3);
  var type = "";
  if (x == 1) {
    type = "triangle";
  }
  if (x == 2) {
    type = "square";
  } 
  if (x == 3) {
    type = "diamond";
  }

var collectable = this.collectable.create(  Phaser.Math.Between(0, 800), 16, type).setScale(1);
collectable.setBounce(1);
collectable.setCollideWorldBounds(true);
collectable.setVelocity(0 , 20);
}

collectablegrabbed(player, collectable) {
  collectable.disableBody(true, true);

  if (collectable.texture.key == "triangle") {
    this.totalscore += 10;
    this.totalcollectable[0] += 1;
  }
  if (collectable.texture.key == "square") {
    this.totalscore += 20;
    this.totalcollectable[1] += 1;
  }
  if (collectable.texture.key == "diamond") {
    this.totalscore += 30;
    this.totalcollectable[2] += 1;
  }
  this.scoreText.setText(`Score: ${this.totalscore}`);

}

}
