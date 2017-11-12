import {curry} from 'ramda'
import {CONFIG, GAME_CONFIG} from '../config'
import {WORLD} from '../world'

const {powerups} = CONFIG
/*
 */

export const addPowerUp = curry((which, creator) => () => {
  let id
  const base = powerups[which]
  console.log(`generating powerup maker for ${base.sprite}`)
  const add = (entity) => {
    console.log(`adding powerup ${base.sprite}`)
    // const {entity} = creator(base)
    if (!entity) {
      entity = creator(base)
      WORLD.ephemera.powerups.push(entity)
    }
    WORLD.graphics.lineStyle(2, 0xffff00, 2)
    WORLD.graphics.fillStyle(0xff0000, 1)
    WORLD.graphics.fillCircle(entity.x, entity.y, entity.a)
    // console.log(WORLD.graphics, `world gfx`)
  }
  return Object.assign(
    {},
    base,
    {
      interval: base.interval,
      lifetime: base.lifetime,
      add,
      start: () => {
        WORLD.ephemera.powerups = WORLD.ephemera.powerups || []
        id = setTimeout(
          add,
          base.interval
        )
      },
      stop: () => {
        clearInterval(id)
      }
    }
  )
})

export const addPlusOne = addPowerUp(`plusOne`, (base) => {
  const plusOne = {
    x: Math.round(Math.random() * GAME_CONFIG.width),
    y: Math.round(Math.random() * GAME_CONFIG.height),
    a: 15
  }
  return Object.assign({},
    base,
    {
      entity: plusOne
    }
  )
})
