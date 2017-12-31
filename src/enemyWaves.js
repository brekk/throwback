// TODO: not sure where this file belongs yet -- move if you have the onus
import {times} from 'ramda'

import {GAME_CONFIG} from './config'
import {Enemy} from './models/enemy'

/**
 * Get a pseudo-random spawn position according to these rules:
 * * width * .8 + width * .1 -- don't spawn enemies too close to the edges
 * * height / 2 -- only spawn on the top half of the screen
 * @returns {object} x, y -- the x, y location to spawn in
 */
const getInboundsSpawnPosition = () => {
  const x = Math.random() * (GAME_CONFIG.width * 0.8) + GAME_CONFIG.width * 0.1
  const y = Math.random() * (GAME_CONFIG.height / 2)

  // TODO: very naive; should make sure it doesn't spawn under the player
  //       or on a bullet or on another enemy etc.
  //       or maybe better, we can have some predefined pools ala isaac
  return {x, y}
}

export const wave = (n) => {
  const numHard = Math.floor(n / 6)
  const numMedium = Math.floor(n / 3)
  const numEasy = n - numHard
  const targetters = times(() => Enemy.TARGETTER(getInboundsSpawnPosition()), numHard)
  const doubleRandomShooter = times(() => Enemy.RANDOM_DOUBLE_SHOT(getInboundsSpawnPosition()), numMedium)
  const randomShooter = times(() => Enemy.RANDOM_SHOT(getInboundsSpawnPosition()), numEasy)
  console.debug(`wave ${n} randos: ${randomShooter.length}, doubleRandos: ${doubleRandomShooter.length}|, targetters: ${targetters.length}`)
  return [...randomShooter, ...doubleRandomShooter, ...targetters]
}
