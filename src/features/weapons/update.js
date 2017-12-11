// import Phaser from 'phaser'
import {WORLD} from '../../world'
import {randomize} from '../../util'
// const {Geom} = Phaser
// const {Circle} = Geom

export const updateEphemeraPre = (i) => {
  WORLD.wiggleShot.lastTick = WORLD.wiggleShot.tick() + i
  let t = 300 / WORLD.wiggleShot.lastTick
  if (WORLD.wiggleShot.lastTick > 60) {
    WORLD.wiggleShot.resetTick()
  }
  WORLD.wiggleShot.sine = Math.sin(t) * 10
}

export const updateEphemeraPost = (ephemera) => {
  if (ephemera.radius > 5) {
    ephemera.radius += 1
  }
  const xMod = ephemera.vector.x
  const yMod = ephemera.vector.y
  ephemera.x += WORLD.wiggleShot.sine * yMod
  ephemera.y += WORLD.wiggleShot.sine * xMod
  if ((1e3 * Math.random()) < 1) {
    ephemera.radius += 10
  }
  if ((5e3 * Math.random()) < 1) {
    // this is silly right now but I'm imagining that these wobble bullets could eventually
    // become lightning, and these larger bullets would be how it spreads
    const newBullet = Object.assign(ephemera, {
      x: randomize(xMod, ephemera.x),
      y: randomize(yMod, ephemera.y),
      radius: randomize(ephemera.radius, ephemera.radius)
    })
    WORLD.ephemera.bullets.push(newBullet)
  }
  return ephemera
}
