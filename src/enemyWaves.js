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
  const numHard = Math.floor(n / 3)
  const numEasy = n - numHard
  const hardEnemies = times(() => Enemy.HARD(getInboundsSpawnPosition()), numHard)
  const easyEnemies = times(() => Enemy.EASY(getInboundsSpawnPosition()), numEasy)
  console.debug(`wave ${n} easy: ${easyEnemies.length}, hard: ${hardEnemies.length}`)
  return [...easyEnemies, ...hardEnemies]
}
