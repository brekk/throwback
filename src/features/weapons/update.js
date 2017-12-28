// import Phaser from 'phaser'
import {WORLD} from '../../world'
import {Circle} from '../../models/base'
import {Bullet} from '../../models/bullet'
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
  const {position, vector, radius, speed, owner} = ephemera.properties
  let newRadius = radius()
  if (radius() > 5) {
    newRadius += 1
  }
  const {x: xMod, y: yMod} = vector()
  const {x, y} = position()
  const newX = x + WORLD.wiggleShot.sine * yMod
  const newY = y + WORLD.wiggleShot.sine * xMod
  if ((1e3 * Math.random()) < 1) {
    newRadius += 10
  }
  if ((5e3 * Math.random()) < 1) {
    // this is silly right now but I'm imagining that these wobble bullets could eventually
    // become lightning, and these larger bullets would be how it spreads
    const spreadBullet = Bullet.of({
      x: randomize(xMod, x),
      y: randomize(yMod, y),
      radius: randomize(radius(), radius()),
      vector: vector(),
      speed: speed(),
      owner: owner()
    })
    WORLD.ephemera.bullets.push(spreadBullet)
  }
  
  return Bullet.of({
    x: newX,
    y: newY,
    radius: newRadius,
    vector: vector(),
    speed: speed(),
    owner: owner()
  })
}
