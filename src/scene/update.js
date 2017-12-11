import Phaser from 'phaser'
import {CONFIG} from '../config'
import {WORLD} from '../world'
import {Bullet, applyVector, ephemeraInBounds, throtLog} from '../util'
import {fireUp, fireDown, fireLeft, fireRight} from '../ephemera/bullets'
import {addPlusOne} from '../ephemera/powerups'
import {updateEphemeraPost, updateEphemeraPre, updatePre} from '../features'
// const {Geom} = Phaser
// const {Circle} = Geom

function handlePlayerInput() {
  const {inputs} = WORLD
  const {acceleration} = CONFIG
  const {left, right, up, down, w, a, s, d} = inputs

  // We also tried player.physics.setVelocity(0, 0) here instead of friction
  if (left.isDown) {
    WORLD.player.physics.setVelocityX(-acceleration) // See also .setAcceleration
  } else if (right.isDown) {
    WORLD.player.physics.setVelocityX(acceleration)
  }

  // Not else if here so they can move left & up at the same time, etc.
  if (up.isDown) {
    WORLD.player.physics.setVelocityY(-acceleration)
  // this seems existential
  } else if (down.isDown) {
    WORLD.player.physics.setVelocityY(acceleration)
  }

  // Can only fire in one direction at a time.
  if (w.isDown) {
    fireUp()
  } else if (a.isDown) {
    fireLeft()
  } else if (s.isDown) {
    fireDown()
  } else if (d.isDown) {
    fireRight()
  }
}

function updatePowerUps() {
  const {ephemera = {}} = WORLD
  const {powerups} = ephemera
  
  if (!WORLD.powerupIntervalForPlusOne && WORLD.ephemera.powerups.length === 0) {
    // if (alt.isDown) {
    const addOne = addPlusOne()
    WORLD.powerupIntervalForPlusOne = addOne
    addOne.start()
    setTimeout(() => {
      delete WORLD.powerupIntervalForPlusOne
      addOne.stop()
    }, addOne.lifetime)
  }
  // TODO: make this re-usable as a render method instead of this hardcoded
  for (let x = 0; x < powerups.length; x++) {
    let powerup = powerups[x]
    WORLD.graphics.lineStyle(2, 0xffff00, 2)
    WORLD.graphics.fillStyle(0xff0000, 1)
    WORLD.graphics.fillCircle(powerup.x, powerup.y, powerup._radius)
  }
}

function updateBullets() {
  const {ephemera = {}} = WORLD
  const {colors} = CONFIG
  const {yellow, white} = colors
  const {powerups, bullets} = ephemera
  
  // TODO: scale on acceleration instead so we can tweak this globally
  const {bullets: bulletConfig} = CONFIG
  for (let i = 0; i < bullets.length; i++) {
    updateEphemeraPre(i)
    const bullet = bullets[i]
    const {x: newX, y: newY} = applyVector(bullet, bullet.vector, bulletConfig.speed)
    const movedBullet = updateEphemeraPost(Bullet.of({
      x: newX,
      y: newY,
      radius: bullet.radius,
      vector: bullet.vector
    }))
    WORLD.ephemera.bullets[i] = movedBullet
    WORLD.graphics.lineStyle(2, yellow, 2)
    WORLD.graphics.fillStyle(WORLD.wiggleShot ? white : yellow, 1)
    WORLD.graphics.fillCircle(movedBullet.x, movedBullet.y, movedBullet.radius)

    const hitPowerups = powerups.filter(
      (x) => Phaser.Geom.Intersects.CircleToCircle(x, movedBullet._circle)
    )
    if (hitPowerups.length > 0) {
      WORLD.ephemera.powerups = []
    }
  }

  WORLD.ephemera.bullets = WORLD.ephemera.bullets.filter(ephemeraInBounds)
  // throtLog(`%c$$$$`, `background-color: red;`, WORLD.ephemeraBullets.length)
  // WORLD.ephemeraBullets = filtered
}

export function update() {
  WORLD.graphics.clear()
  // updatePre(this.add.text.bind(this))
  // console.log(`this`, this)
  updatePowerUps() // update.powerups.js?
  updateBullets() // update.bullets.js?
  handlePlayerInput() // update.player.js?
  // updatePost(WORLD)
}
