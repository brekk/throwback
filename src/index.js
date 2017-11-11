import 'phaser'
import {throttle} from './util'
import {map} from 'ramda'

var GAME_CONFIG = {
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
}

const game = new Phaser.Game(GAME_CONFIG)
const WORLD = {
  graphics: null,
  playerImage: null,
  playerPhysics: null,
  bullets: null,
  up: null,
  down: null,
  left: null,
  right: null,
  space: null
}

const CONFIG = Object.freeze({
  friction: 200,
  acceleration: 200,
  bulletSpeed: 7,
  bulletFireRate: 150,
  colors: {
    yellow: 0xffff00,
    white: 0xffffff
  }
})
const FLAGS = Object.freeze({
  wiggleShot: true
})

function preload () {
  this.load.image('spaceship', 'assets/blue_ship.png')
}

const makeTick = () => {
  let time = 0
  return {
    resetTick: () => {
      time = 0
    },
    tick: () => {
      time += 1
      return time
    }
  }
}
if (FLAGS.wiggleShot) {
  WORLD.wiggleShot = makeTick()
}

function create () {
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
  WORLD.playerImage = this.add.image(game.canvas.width / 2, game.canvas.height * .25, 'spaceship')
  WORLD.graphics = this.add.graphics()
  WORLD.bullets = []
  // Add boundaries at the screen edge
  this.physics.world.setBounds()

  const playerPhysics = this.physics.add
    .body(game.canvas.width / 2, game.canvas.height *.75)
    .setActive()
    .setVelocity(0, 0)
    .setBounce(.4) // This is the rebound when player hits the edge of screen

  playerPhysics.setGameObject(WORLD.playerImage, false)
  const {friction} = CONFIG
  playerPhysics.setFriction(friction, friction)
  playerPhysics.setBodySize(107, 95) // Physics bounding box
  playerPhysics.setBodyScale(.8)
  WORLD.playerPhysics = playerPhysics
}

const randomize = map((x) => Math.random() * x * 1)

function update () {
  //  Reset the players velocity (movement)
  const {acceleration, colors} = CONFIG
  const {yellow, white} = colors
  WORLD.graphics.clear()
  const {left, right, up, down, space, bullets} = WORLD

  // We also tried playerPhysics.setVelocity(0, 0) here instead of friction

  if (left.isDown) {
    WORLD.playerPhysics.setVelocityX(-acceleration) // See also .setAcceleration
  }
  else if (right.isDown) {
    WORLD.playerPhysics.setVelocityX(acceleration)
  }

  // Not else if here so they can move left & up at the same time, etc.
  if (up.isDown) {
    WORLD.playerPhysics.setVelocityY(-acceleration)
  }
  // this seems existential
  else if (down.isDown) {
    WORLD.playerPhysics.setVelocityY(acceleration)
  }

  const {bulletSpeed} = CONFIG // TODO: scale on acceleration instead so we can tweak this globally
  for(let i = 0; i < bullets.length; i++) {
    if (FLAGS.wiggleShot) {
      WORLD.wiggleShot.lastTick = WORLD.wiggleShot.tick() + i
      let t = 300 / WORLD.wiggleShot.lastTick
      if (WORLD.wiggleShot.lastTick > 60) {
        WORLD.wiggleShot.resetTick()
      }
      WORLD.wiggleShot.sine = Math.sin(t) * 10
    }

    // const sinWave = Math.sin(t)
    const movedBullet = {
      x: bullets[i].x,
      y: bullets[i].y - bulletSpeed,
      a: bullets[i].a
    }
    if (FLAGS.wiggleShot) {
       if (movedBullet.a > 5) {
         movedBullet.a += 1
       }
       movedBullet.x += WORLD.wiggleShot.sine
       if ((1e3 * Math.random()) < 1) {
         movedBullet.a += 10
       }
       if ((5e3 * Math.random()) < 1) {
         // this is silly right now but I'm imagining that these wobble bullets could eventually
         // become lightning, and these larger bullets would be how it spreads
         WORLD.bullets.push(randomize(movedBullet))
       }
      //  movedBullet.a = 1000 / (GAME_CONFIG.height - movedBullet.y)
    }
    WORLD.bullets[i] = movedBullet
    WORLD.graphics.lineStyle(2, yellow, 2)
    WORLD.graphics.fillStyle(WORLD.wiggleShot ? white : yellow, 1)
    WORLD.graphics.fillCircle(movedBullet.x, movedBullet.y, movedBullet.a)
  }

  WORLD.bullets = WORLD.bullets.filter((b) => b.y > 0 || b.x > GAME_CONFIG.width || b.x < 0)

  if(space.isDown) {
    fireBullet()
  }
}

const {bulletFireRate} = CONFIG // bullets per this as milli
const fireBullet = throttle(() => {
  const {playerPhysics} = WORLD
  const newBullet = {
    x: playerPhysics.body.pos.x + playerPhysics.body.size.x / 2,
    y: playerPhysics.body.pos.y - 15,
    a: 5
  }
  WORLD.bullets.push(newBullet)
  WORLD.graphics.fillCircle(newBullet.x, newBullet.y, newBullet.a)
}, bulletFireRate)
