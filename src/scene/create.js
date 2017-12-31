import Phaser from 'phaser'
import {GAME_CONFIG} from '../config'
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
  WORLD.ui.scoreText = this.add.text(15, 15, [`Score: 0`, `Wave: 1`], {
    font: `16px Courier`,
    fill: `#00ff00`
  })
  // ^ colors formatted like in in config don't work for these
  WORLD.ui.gameOverText = this.add.text((GAME_CONFIG.width / 2) - 150, (GAME_CONFIG.height / 2) - 50, [``], {
    font: `52px Courier`,
    fill: `#ff0000`
  })
  // ^ colors formatted like in in config don't work for these
  WORLD.ephemera.bullets = []
  WORLD.ephemera.powerups = []
  WORLD.ephemera.wave = 0
  // Add boundaries at the screen edge
  this.physics.world.setBounds()
  WORLD.player = Player.init(this)

  // an assemblage of all the features we might want to initialize
  createFeatures()
}
