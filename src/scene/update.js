import Phaser from 'phaser'
import {CONFIG} from '../config'
import {WORLD} from '../world'
import {ephemeraOutsideBounds, throtLog} from '../util'
import {fireBullet} from '../ephemera/bullets'
import {addPlusOne} from '../ephemera/powerups'
import {updateEphemeraPost, updateEphemeraPre} from '../features'
const {Geom} = Phaser
const {Circle} = Geom

export function update() {
  WORLD.graphics.clear()
  const {acceleration, colors} = CONFIG
  const {yellow, white} = colors
  const {inputs, ephemera} = WORLD
  const {bullets, powerups} = ephemera
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
  let addOne
  if (!WORLD.powerupIntervalForPlusOne && WORLD.ephemera.powerups.length === 0) {
  // if (alt.isDown) {
    addOne = addPlusOne()
    console.log(`no powerup interval`, addOne)
    WORLD.powerupIntervalForPlusOne = addOne
    addOne.start()
    setTimeout(() => {
      console.log(`stopping! interval`)
      delete WORLD.powerupIntervalForPlusOne
      addOne.stop()
    }, addOne.lifetime)
  }
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

    const movedBullet = updateEphemeraPost(new Circle(
      bullets[i].x,
      bullets[i].y - bulletConfig.speed,
      bullets[i]._radius
    ))
    const outOfBounds = ephemeraOutsideBounds(movedBullet)
    WORLD.ephemera.bullets[i] = movedBullet
    WORLD.graphics.lineStyle(2, yellow, 2)
    WORLD.graphics.fillStyle(WORLD.wiggleShot ? white : yellow, 1)
    WORLD.graphics.fillCircle(movedBullet.x, movedBullet.y, movedBullet._radius)

    // if (powerups.filter((x) => {
    //   const intersects = Phaser.Geom.Intersects.CircleToCircle(x, movedBullet)
    //   console.log(`x`, intersects)
    //   return intersects
    // }).length > 0) {
    //   console.log(`Intersection occurred`)
    // }
  }

  const filtered = WORLD.ephemera.bullets.filter(
    ephemeraOutsideBounds
  )
  throtLog(`%c$$$$`, `background-color: red;`, filtered.length, `vs`, WORLD.ephemera.bullets.length)
  // WORLD.ephemera.bullets = filtered

  if (space.isDown) {
    fireBullet()
  }
  throtLog(`bullets`, bullets.length, powerups.length)
}
