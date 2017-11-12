import Phaser from 'phaser'
import {WORLD} from '../world'
import {GAME_CONFIG, CONFIG} from '../config'
import {create as createFeatures} from '../features'
import {SPRITES} from '../sprites'

const KEYS = Phaser.Input.Keyboard.KeyCodes
console.log(Object.keys(KEYS))

export function create() {
  WORLD.inputs = this.input.keyboard.addKeys({
    up: KEYS.UP,
    down: KEYS.DOWN,
    left: KEYS.LEFT,
    right: KEYS.RIGHT,
    alt: KEYS.SHIFT,
    space: KEYS.SPACE
  })
  console.log(WORLD.inputs.right)
  WORLD.player.image = this.add.image(
    GAME_CONFIG.width / 2,
    GAME_CONFIG.height * 0.25,
    SPRITES.PLAYER
  )
  WORLD.graphics = this.add.graphics()
  WORLD.ephemera.bullets = []
  WORLD.ephemera.powerups = []
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

  // an assemblage of all the features we might want to initialize
  createFeatures()
}
