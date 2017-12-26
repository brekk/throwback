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
)

export const ephemeraInBounds = (b) => (
  b.y < GAME_CONFIG.height &&
  b.y > 0 &&
  b.x < GAME_CONFIG.width &&
  b.x > 0
)

export const Vector = {
  of: (x = 0, y = 0) => ({ x, y }),
  UP: {x: 0, y: -1},
  DOWN: {x: 0, y: 1},
  LEFT: {x: -1, y: 0},
  RIGHT: {x: 1, y: 0}
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
