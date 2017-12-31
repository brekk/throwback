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
const randomTopHalfSpawnPosition = () => {
  const x = Math.random() * (GAME_CONFIG.width * 0.8) + GAME_CONFIG.width * 0.1
  const y = Math.random() * (GAME_CONFIG.height / 2)

  // TODO: very naive; should make sure it doesn't spawn under the player
  //       or on a bullet or on another enemy etc.
  //       or maybe better, we can have some predefined pools ala isaac
  return {x, y}
}

const ONE_TENTH_WIDTH = GAME_CONFIG.width * 0.1
const ONE_TENTH_HEIGHT = GAME_CONFIG.height * 0.1
const EIGHT_TENTHS_WIDTH = GAME_CONFIG.width * 0.8
const EIGHT_TENTHS_HEIGHT = GAME_CONFIG.height * 0.8

const randomTopLeftCornerPosition = () => {
  const x = Math.random() * ONE_TENTH_WIDTH + ONE_TENTH_HEIGHT
  const y = Math.random() * ONE_TENTH_HEIGHT + ONE_TENTH_HEIGHT

  return {x, y}
}
const randomTopRightCornerPosition = () => {
  const x = Math.random() * ONE_TENTH_WIDTH + EIGHT_TENTHS_WIDTH
  const y = Math.random() * ONE_TENTH_HEIGHT + ONE_TENTH_HEIGHT

  return {x, y}
}
const randomBottomLeftCornerPosition = () => {
  const x = Math.random() * ONE_TENTH_WIDTH + ONE_TENTH_WIDTH
  const y = Math.random() * ONE_TENTH_HEIGHT + EIGHT_TENTHS_HEIGHT

  return {x, y}
}
const randomBottomRightCornerPosition = () => {
  const x = Math.random() * ONE_TENTH_WIDTH + EIGHT_TENTHS_WIDTH
  const y = Math.random() * ONE_TENTH_HEIGHT + EIGHT_TENTHS_HEIGHT

  return {x, y}
}

const easyWaves = [
  (n) => {
    const hard = Math.floor(n / 10)
    const med = Math.floor(n / 5)
    const easy = n - med - hard
    return topHalves(easy, med, hard)
  }
]

const hardWaves = [
  (n) => topHalves(Math.floor(n / 3) + 1, Math.floor(n / 5), Math.floor(n / 10)),
  (n) => corners(n)
]

const corners = (n) => {
  console.log(`Using corners spawner...`)
  let enemyType = Enemy.RANDOM_SHOT
  if (n > 7) {
    enemyType = Enemy.RANDOM_DOUBLE_SHOT
  }
  if (n > 15) {
    enemyType = Enemy.TARGETTER
  }
  const topLeft = times(() => enemyType(randomTopLeftCornerPosition()), 1)
  const topRight = times(() => enemyType(randomTopRightCornerPosition()), 1)
  const bottomLeft = times(() => enemyType(randomBottomLeftCornerPosition()), 1)
  const bottomRight = times(() => enemyType(randomBottomRightCornerPosition()), 1)
  return [...topLeft, ...topRight, ...bottomLeft, ...bottomRight]
}

const topHalves = (easy, medium, hard) => {
  console.log(`Using top halves spawner...`)
  const targetters = times(() => Enemy.TARGETTER(randomTopHalfSpawnPosition()), hard)
  const doubleRandomShooter = times(() => Enemy.RANDOM_DOUBLE_SHOT(randomTopHalfSpawnPosition()), medium)
  const randomShooter = times(() => Enemy.RANDOM_SHOT(randomTopHalfSpawnPosition()), easy)
  return [...randomShooter, ...doubleRandomShooter, ...targetters]
}

export const wave = (n) => {
  // rarely give a harder spawn varient
  const hardWave = Math.random() > 0.85
  if (hardWave) {
    console.log(`Bad luck-- HARD WAVE!`)
  }
  const spawner = hardWave ? randomArrayItem(hardWaves) : randomArrayItem(easyWaves)
  // ^ pick a random 'spawner'
  return spawner(n)
}

const randomArrayItem = (a) => a[Math.floor(Math.random() * a.length)]
