import {WORLD} from '../../world'
import {randomize} from '../../util'

export const updateEphemeraPre = (i) => {
  WORLD.wiggleShot.lastTick = WORLD.wiggleShot.tick() + i
  let t = 300 / WORLD.wiggleShot.lastTick
  if (WORLD.wiggleShot.lastTick > 60) {
    WORLD.wiggleShot.resetTick()
  }
  WORLD.wiggleShot.sine = Math.sin(t) * 10
}

export const updateEphemeraPost = (ephemera) => {
  if (ephemera.a > 5) {
    ephemera.a += 1
  }
  ephemera.x += WORLD.wiggleShot.sine
  if ((1e3 * Math.random()) < 1) {
    ephemera.a += 10
  }
  if ((5e3 * Math.random()) < 1) {
    // this is silly right now but I'm imagining that these wobble bullets could eventually
    // become lightning, and these larger bullets would be how it spreads
    WORLD.ephemera.bullets.push(randomize(ephemera))
  }
  return ephemera
}
