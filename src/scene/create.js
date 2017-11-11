import Phaser from 'phaser'
import {WORLD} from '../world'
import {GAME_CONFIG, CONFIG} from '../config'
import {FEATURES as FLAGS} from '../features'
import {makeTick} from '../util'

export function create() {
  const keys = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.UP,
    down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    left: Phaser.Input.Keyboard.KeyCodes.LEFT,
    right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    space: Phaser.Input.Keyboard.KeyCodes.SPACE
  })
  WORLD.up = keys.up
  WORLD.down = keys.down
  WORLD.left = keys.left
  WORLD.right = keys.right
  WORLD.space = keys.space
  WORLD.playerImage = this.add.image(
    GAME_CONFIG.width / 2,
    GAME_CONFIG.height * 0.25,
    `spaceship`
  )
  WORLD.graphics = this.add.graphics()
  WORLD.bullets = []
  // Add boundaries at the screen edge
  this.physics.world.setBounds()

  const playerPhysics = this.physics.add
    .body(GAME_CONFIG.width / 2, GAME_CONFIG.height * 0.75)
    .setActive()
    .setVelocity(0, 0)
    .setBounce(0.4) // This is the rebound when player hits the edge of screen

  playerPhysics.setGameObject(WORLD.playerImage, false)
  const {friction} = CONFIG
  playerPhysics.setFriction(friction, friction)
  playerPhysics.setBodySize(107, 95) // Physics bounding box
  playerPhysics.setBodyScale(0.8)
  WORLD.playerPhysics = playerPhysics

  if (FLAGS.wiggleShot) {
    WORLD.wiggleShot = makeTick()
  }
}
