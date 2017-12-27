import Phaser from 'phaser'
import {CONFIG} from '../config'
import {WORLD} from '../world'
import {Bullet} from '../models/bullet'
import {Explosion} from '../models/explosion'
import {wave} from '../enemyWaves'
import {fireUp, fireDown, fireLeft, fireRight} from '../ephemera/bullets'
import {addPlusOne} from '../ephemera/powerups'
import {updateEphemeraPost, updateEphemeraPre, updatePre} from '../features'
import {applyVector, ephemeraInBounds, throtLog} from '../util'

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
  // TODO: add powerup model; add draw logic to models.powerups.update
}

function updateBullets() {
  const {ephemera = {}} = WORLD
  const {colors} = CONFIG
  const {yellow, white} = colors
  const {powerups, bullets, enemies} = ephemera
  
  // TODO: scale on acceleration instead so we can tweak this globally
  const {bullets: bulletConfig} = CONFIG
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i]
    updateEphemeraPre(i)
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
    // ^ TODO: move the 'movement' and 'draw' logic to models.bullets.events.update

    const hitPowerups = powerups.filter(
      (x) => Phaser.Geom.Intersects.CircleToCircle(x, movedBullet._circle)
    )
    const hitEnemies = enemies.filter(
      (e) => Phaser.Geom.Intersects.TriangleToCircle(e._triangle, movedBullet._circle)
    )
    if (hitPowerups.length > 0) {
      WORLD.ephemera.powerups = []
    }
    if (hitEnemies.length > 0) {
      hitEnemies.forEach((e) => e.events.onHit())
      WORLD.ephemera.effects.push(Explosion.at({x: newX, y: newY, size: 50}))
    }
    // ^ TODO: collision logic can be moved to somewhere else.
  }

  WORLD.ephemera.bullets = WORLD.ephemera.bullets.filter(ephemeraInBounds)
  // throtLog(`%c$$$$`, `background-color: red;`, WORLD.ephemeraBullets.length)
  // WORLD.ephemeraBullets = filtered
}

function updateEnemies() {
  if (WORLD.ephemera.enemies.length === 0) {
    WORLD.ephemera.wave++
    const _wave = wave(WORLD.ephemera.wave)
    WORLD.ephemera.enemies.push(..._wave)
    console.log(`wave: ${WORLD.ephemera.wave}, numEnemies: ${WORLD.ephemera.enemies.length}`)
  }
  WORLD.ephemera.enemies = WORLD.ephemera.enemies.filter((e) => e.properties.hp() > 0)
  WORLD.ephemera.enemies.forEach((e) => e.events.update())
}

function updateEffects() {
  WORLD.ephemera.effects = WORLD.ephemera.effects.filter((e) => !e.properties.isDone())
  WORLD.ephemera.effects.forEach((e) => e.events.update())
}

export function update() {
  WORLD.graphics.clear()
  // updatePre(this.add.text.bind(this))
  // console.log(`this`, this)
  updatePowerUps()
  updateBullets()
  updateEnemies()
  updateEffects()
  // handleCollisions()
  // handleSpawns()
  //   ie: powerups, new enemy wave, etc.; could think of these as 'handle timers/triggers'
  //   * when(Every.time.seconds(15), spawnPowerup)
  //   * when(WORLD.ephemera.enemies.length === 0, spawnEnemyWave)
  handlePlayerInput()
  // updatePost(WORLD)
}
