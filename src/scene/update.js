import {CONFIG} from '../config'
import {WORLD} from '../world'
import {FEATURES} from '../../features'
import {ephemeraOutsideBounds, randomize} from '../util'
import {fireBullet} from '../commands/bullets'

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
    if (FEATURES.wiggleShot) {
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
    if (FEATURES.wiggleShot) {
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
        WORLD.ephemera.bullets.push(randomize(movedBullet))
      }
      //  movedBullet.a = 1000 / (GAME_CONFIG.height - movedBullet.y)
    }
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
