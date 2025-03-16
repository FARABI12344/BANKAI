const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let obstacles;
let coins;
let score = 0;
let scoreText;

function preload() {
  // Load assets
  this.load.image('background', 'assets/background.png');
  this.load.image('ground', 'assets/ground.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('obstacle', 'assets/obstacle.png');
  this.load.image('coin', 'assets/coin.png');
}

function create() {
  // Add background
  this.add.image(400, 300, 'background');

  // Add ground
  const ground = this.physics.add.staticGroup();
  ground.create(400, 568, 'ground').setScale(2).refreshBody();

  // Add player
  player = this.physics.add.sprite(100, 450, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Add obstacles
  obstacles = this.physics.add.group();
  createObstacle();

  // Add coins
  coins = this.physics.add.group();
  createCoin();

  // Collisions
  this.physics.add.collider(player, ground);
  this.physics.add.collider(player, obstacles, hitObstacle, null, this);
  this.physics.add.overlap(player, coins, collectCoin, null, this);

  // Input
  cursors = this.input.keyboard.createCursorKeys();

  // Score
  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#fff'
  });
}

function update() {
  // Player movement
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function createObstacle() {
  const obstacle = obstacles.create(800, 500, 'obstacle');
  obstacle.setVelocityX(-200);
  obstacle.setCollideWorldBounds(false);
  obstacle.checkWorldBounds = true;
  obstacle.outOfBoundsKill = true;

  // Spawn new obstacles
  this.time.delayedCall(1500, createObstacle, [], this);
}

function createCoin() {
  const coin = coins.create(800, Phaser.Math.Between(100, 500), 'coin');
  coin.setVelocityX(-200);
  coin.setCollideWorldBounds(false);
  coin.checkWorldBounds = true;
  coin.outOfBoundsKill = true;

  // Spawn new coins
  this.time.delayedCall(1000, createCoin, [], this);
}

function hitObstacle(player, obstacle) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  scoreText.setText('Game Over');
}

function collectCoin(player, coin) {
  coin.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
}
