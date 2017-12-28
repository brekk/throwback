import Phaser from 'phaser'
import {WORLD} from '../world'
import {create as createFeatures} from '../features'
import {Player} from '../models/player'

const KEYS = Phaser.Input.Keyboard.KeyCodes
export function create() {
  WORLD.inputs = this.input.keyboard.addKeys({
    up: KEYS.UP,
    down: KEYS.DOWN,
    left: KEYS.LEFT,
    right: KEYS.RIGHT,
    alt: KEYS.SHIFT,
    space: KEYS.SPACE,
    w: KEYS.W,
    a: KEYS.A,
    s: KEYS.S,
    d: KEYS.D
  })
  WORLD.graphics = this.add.graphics()
  WORLD.ephemera.bullets = []
  WORLD.ephemera.powerups = []
  WORLD.ephemera.wave = 0
  // Add boundaries at the screen edge
  this.physics.world.setBounds()
  WORLD.player = Player.init(this)

  // an assemblage of all the features we might want to initialize
  createFeatures()
}
