// TODO: not sure where this file belongs yet -- move if you have the onus
import {times} from 'ramda'

import {GAME_CONFIG} from './config'
import {Enemy} from './models/enemy'

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
  const doubleRandomShooter = times(() => Enemy.DOUBLE_PULSER(getInboundsSpawnPosition()), numMedium)
  const randomShooter = times(() => Enemy.PULSER(getInboundsSpawnPosition()), numEasy)
  console.debug(`wave ${n} randos: ${randomShooter.length}, doubleRandos: ${doubleRandomShooter.length}|, targetters: ${targetters.length}`)
  return [...randomShooter, ...doubleRandomShooter, ...targetters]
}
