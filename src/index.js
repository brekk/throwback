import 'phaser';

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
      preload: preload,
      create: create,
      update: update
    },
    physics: {
      default: 'impact', // arcade seems simpler but isn't in V3 yet
      impact: {
        gravity: 0,
        debug: true, // Shows bounding box and acceleration vector
        maxVelocity: 500
      }
    }
};

const game = new Phaser.Game(config);
let playerImage, playerPhysics
let up, down, left, right

function preload () {
  this.load.image('spaceship', 'assets/blue_ship.png')
}

function create () {
  const keys = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.UP, 
    down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    left: Phaser.Input.Keyboard.KeyCodes.LEFT,
    right: Phaser.Input.Keyboard.KeyCodes.RIGHT
  });
  up = keys.up
  down = keys.down
  left = keys.left
  right = keys.right
  
  playerImage = this.add.image(game.canvas.width / 2, game.canvas.height * .25, 'spaceship');
   
  // Add boundaries at the screen edge
  this.physics.world.setBounds()

  playerPhysics = this.physics.add
    .body(game.canvas.width / 2, game.canvas.height *.75)
    .setActive()
    .setVelocity(0, 0)
    .setBounce(.4) // This is the rebound when player hits the edge of screen

  playerPhysics.setGameObject(playerImage, false)
  const friction = 200
  playerPhysics.setFriction(friction, friction)
  playerPhysics.setBodySize(107, 95) // Physics bounding box
  playerPhysics.setBodyScale(.8)
}

function update () {
  //  Reset the players velocity (movement)
  const factor = 200
  
  // We also tried playerPhysics.setVelocity(0, 0) here instead of friction

  if (left.isDown)
  {
    playerPhysics.setVelocityX(-factor) // See also .setAcceleration
  }
  else if (right.isDown)
  {
    playerPhysics.setVelocityX(factor)
  }

  // Not else if here so they can move left & up at the same time, etc.
  if (up.isDown)
  {
    playerPhysics.setVelocityY(-factor)
  }
  else if (down.isDown)
  {
    playerPhysics.setVelocityY(factor)
  }
}