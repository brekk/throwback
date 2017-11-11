import Phaser from 'phaser'
import {WORLD} from '../world'
import {GAME_CONFIG, CONFIG} from '../config'
import {FEATURES} from '../../features'
import {SPRITES} from '../sprites'
import {makeTick} from '../util'

export function create() {
  WORLD.inputs = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.UP,
    down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    left: Phaser.Input.Keyboard.KeyCodes.LEFT,
    right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    space: Phaser.Input.Keyboard.KeyCodes.SPACE
  })
  WORLD.player.image = this.add.image(
    GAME_CONFIG.width / 2,
    GAME_CONFIG.height * 0.25,
    SPRITES.PLAYER
  )
  WORLD.graphics = this.add.graphics()
  WORLD.ephemera.bullets = []
  // Add boundaries at the screen edge
  this.physics.world.setBounds()

  const playerPhysics = this.physics.add
    .body(GAME_CONFIG.width / 2, GAME_CONFIG.height * 0.75)
    .setActive()
    .setVelocity(0, 0)
    .setBounce(0.4) // This is the rebound when player hits the edge of screen

  playerPhysics.setGameObject(WORLD.player.image, false)
  const {friction} = CONFIG
  playerPhysics.setFriction(friction, friction)
  playerPhysics.setBodySize(107, 95) // Physics bounding box
  playerPhysics.setBodyScale(0.8)
  WORLD.player.physics = playerPhysics

  if (FEATURES.wiggleShot) {
    WORLD.wiggleShot = makeTick()
  }
}
