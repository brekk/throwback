import {CONFIG} from '../config'
import {WORLD} from '../world'
import {ephemeraOutsideBounds} from '../util'
import {fireBullet} from '../ephemera/bullets'
import {updateEphemeraPost, updateEphemeraPre} from '../features'

export function update() {
  WORLD.graphics.clear()
  const {acceleration, colors} = CONFIG
  const {yellow, white} = colors
  const {inputs, ephemera} = WORLD
  const {bullets} = ephemera
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

  const {bulletSpeed} = CONFIG // TODO: scale on acceleration instead so we can tweak this globally
  for (let i = 0; i < bullets.length; i++) {
    updateEphemeraPre(i)

    const movedBullet = updateEphemeraPost({
      x: bullets[i].x,
      y: bullets[i].y - bulletSpeed,
      a: bullets[i].a
    })

    WORLD.ephemera.bullets[i] = movedBullet
    WORLD.graphics.lineStyle(2, yellow, 2)
    WORLD.graphics.fillStyle(WORLD.wiggleShot ? white : yellow, 1)
    WORLD.graphics.fillCircle(movedBullet.x, movedBullet.y, movedBullet.a)
  }

  WORLD.ephemera.bullets = WORLD.ephemera.bullets.filter(
    ephemeraOutsideBounds
  )

  if (space.isDown) {
    fireBullet()
  }
}
