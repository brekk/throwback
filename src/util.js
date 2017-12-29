import {curry, map} from 'ramda'
import throttle from 'lodash/fp/throttle'
import {GAME_CONFIG} from './config'

export const throtLog = throttle(300, console.log)

export const makeTick = () => {
  let time = 0
  return {
    resetTick: () => {
      time = 0
    },
    tick: () => {
      time += 1
      return time
    }
  }
}

export const randomize = curry(
  (amount, input) => map(
    (x) => (Math.random() * x * amount),
    input
  )
  // ^ We should strongly considered switching to 'seeded' randomness
  //   this would allow us to reproduce exact runs in test
  //   this approach seems great to me:
  //   https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/23304189#23304189
)

export const ephemeraInBounds = (b) => {
  const {x, y} = b.properties.position()
  return y < GAME_CONFIG.height &&
  y > 0 &&
  x < GAME_CONFIG.width &&
  x > 0
}

const _vector = (x = 0, y = 0) => ({ x, y })

/**
 * Returns a _normalized_ vector from the origin to the target.
 * 'Normalized' will scale the vector such that it will have a magnitude of 1
 * @param {object} origin an object with x, y)
 * @param {object} target an object with x, y)
 * @returns {vector} a normalized vector from origin to target
 */
const vectorFromTo = (origin, target) => {
  const {x: x1, y: y1} = origin
  const {x: x2, y: y2} = target
  const newX = x2 - x1
  const newY = y2 - y1
  const magnitude = Math.sqrt((newX ** 2) + (newY ** 2))
  return {x: newX / magnitude, y: newY / magnitude}
}

export const Vector = {
  of: _vector,
  fromTo: vectorFromTo,
  random: () => _vector(Math.random(), Math.random()),
  UP: _vector(0, -1),
  DOWN: _vector(0, 1),
  LEFT: _vector(-1, 0),
  RIGHT: _vector(1, 0)
}

export const applyVector = (target, vector, speed) => {
  return {
    x: target.x + (vector.x * speed),
    y: target.y + (vector.y * speed)
  }
}

// the idea is that you can basically have simpler conditional functions
// which only take effect when a certain condition is true
// in this case, this was originally designed to pull feature flags into a condition
// and then render only when / if the feature flag is on
export const conditionWrap = curry(function wrap(condition, inner) {
  return (x) => (
    condition ?
      inner(x) :
      x
  )
})
