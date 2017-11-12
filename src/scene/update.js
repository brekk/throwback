import Phaser from 'phaser'
import {CONFIG} from '../config'
import {WORLD} from '../world'
import {Circle, ephemeraInBounds, throtLog} from '../util'
import {fireBullet} from '../ephemera/bullets'
import {addPlusOne} from '../ephemera/powerups'
import {updateEphemeraPost, updateEphemeraPre, updatePre} from '../features'
// const {Geom} = Phaser
// const {Circle} = Geom

export function update() {
  WORLD.graphics.clear()
  const {acceleration, colors} = CONFIG
  const {yellow, white} = colors
  const {inputs, ephemera = {}} = WORLD
  const {powerups, bullets} = ephemera
  const {left, right, up, down, space} = inputs

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

  // updatePre(this)

  if (!WORLD.powerupIntervalForPlusOne && WORLD.ephemera.powerups.length === 0) {
  // if (alt.isDown) {
    const addOne = addPlusOne()
    console.log(`no powerup interval`, addOne)
    WORLD.powerupIntervalForPlusOne = addOne
    addOne.start()
    setTimeout(() => {
      console.log(`stopping! interval`)
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

  // TODO: scale on acceleration instead so we can tweak this globally
  const {bullets: bulletConfig} = CONFIG
  for (let i = 0; i < bullets.length; i++) {
    updateEphemeraPre(i)

    const movedBullet = updateEphemeraPost(Circle.of({
      x: bullets[i].x,
      y: bullets[i].y - bulletConfig.speed,
      a: bullets[i]._radius
    }))
    WORLD.ephemera.bullets[i] = movedBullet
    WORLD.graphics.lineStyle(2, yellow, 2)
    WORLD.graphics.fillStyle(WORLD.wiggleShot ? white : yellow, 1)
    WORLD.graphics.fillCircle(movedBullet.x, movedBullet.y, movedBullet._radius)

    const hitPowerups = powerups.filter(
      (x) => Phaser.Geom.Intersects.CircleToCircle(x, movedBullet)
    )
    if (hitPowerups.length > 0) {
      WORLD.ephemera.powerups = []
    }
  }

  WORLD.ephemera.bullets = WORLD.ephemera.bullets.filter(ephemeraInBounds)
  // throtLog(`%c$$$$`, `background-color: red;`, WORLD.ephemeraBullets.length)
  // WORLD.ephemeraBullets = filtered

  if (space.isDown) {
    fireBullet()
  }
  // updatePost(WORLD)
}
