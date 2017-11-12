import {curry, map} from 'ramda'
import {GAME_CONFIG} from './config'

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

export const ephemeraOutsideBounds = (b) => (
  b.y <= GAME_CONFIG.height ||
  b.y > 0 ||
  b.x > GAME_CONFIG.width ||
  b.x <= 0
)

export const conditionWrap = curry((condition, inner) => {
  return (x) => {
    if (condition) {
      return inner(x)
    } else {
      return x
    }
  }
})
