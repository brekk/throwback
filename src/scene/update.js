import Phaser from 'phaser'
import {CONFIG} from '../config'
import {WORLD} from '../world'
import {Explosion} from '../models/explosion'
import {wave} from '../enemyWaves'
import {addPlusOne} from '../ephemera/powerups'
import {updateEphemeraPost, updateEphemeraPre, updatePre} from '../features'
import {ephemeraInBounds, throtLog} from '../util'

const {colors} = CONFIG
const {red} = colors

function handlePlayerInput() {
  const {inputs, player} = WORLD
  const {left, right, up, down, w, a, s, d} = inputs

  if (left.isDown) {
    player.commands.moveLeft()
  } else if (right.isDown) {
    player.commands.moveRight()
  }
  
  // If rather than else if here so they can move left & up at the same time, etc.
  /* userConfig.invertXY <- here is where config can solve this crisis :) */
  if (up.isDown) {
    player.commands.moveUp()
  } else if (down.isDown) {
    player.commands.moveDown()
  }

  // Can only fire in one direction at a time.
  if (w.isDown) {
    player.commands.shootUp()
  } else if (a.isDown) {
    player.commands.shootLeft()
  } else if (s.isDown) {
    player.commands.shootDown()
  } else if (d.isDown) {
    player.commands.shootRight()
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
  const bullets = WORLD.ephemera.bullets
  bullets.forEach((b, i) => {
    const isPlayerBullet = b.properties.owner() === `player`
    if (isPlayerBullet) {
      updateEphemeraPre(i)
    }
    b.update()
    if (isPlayerBullet) {
      const newBullet = updateEphemeraPost(b)
      bullets[i] = newBullet
      // ^ TODO: this should all be moved into the bullet
      //         so we don't have to overwrite the array spot
    }
    b.draw()
  })

  WORLD.ephemera.bullets = bullets.filter(ephemeraInBounds)
  // throtLog(`%c$$$$`, `background-color: red;`, WORLD.ephemeraBullets.length)
  // WORLD.ephemeraBullets = filtered
}

function handleCollisions() {
  const {ephemera = {}, player} = WORLD
  const {powerups, bullets, enemies} = ephemera
  const colliders = Phaser.Geom.Intersects

  bullets.forEach((b) => {
    const isPlayerBullet = b.properties.owner() === `player`
    const {x, y} = b.properties.position()

    if (isPlayerBullet) {
      const hitPowerups = powerups.filter((p) => colliders.CircleToCircle(p, b._engine._circle()))
      const hitEnemies = enemies.filter((e) => colliders.TriangleToCircle(e._triangle, b._engine._circle()))
      if (hitPowerups.length > 0) {
        WORLD.ephemera.powerups = []
      }
      if (hitEnemies.length > 0) {
        hitEnemies.forEach((e) => e.events.onHit(b))
        WORLD.ephemera.effects.push(Explosion.at({x, y, size: b.properties.radius() * 10}))
      }
    }
    if (!isPlayerBullet) {
      const hitPlayer = colliders.TriangleToCircle(player._engine._triangle(), b._engine._circle())
      if (hitPlayer) {
        player.events.onHit(b)
        WORLD.ephemera.effects.push(Explosion.at({x, y, size: b.properties.radius() * 10, color: red}))
      }
    }
  })
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
  updateEnemies()
  updateBullets()
  updateEffects()
  if (!WORLD.player.properties.isDead()) {
    updatePowerUps()
    handleCollisions()
    // handleSpawns()
    //   ie: powerups, new enemy wave, etc.; could think of these as 'handle timers/triggers'
    //   * when(Every.time.seconds(15), spawnPowerup)
    //   * when(WORLD.ephemera.enemies.length === 0, spawnEnemyWave)
    handlePlayerInput()
  } else {
  }
  // updatePost(WORLD)
}
