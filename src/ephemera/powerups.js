// import Phaser from 'phaser'
import {curry} from 'ramda'
import {CONFIG, GAME_CONFIG} from '../config'
import {WORLD} from '../world'
import {Circle} from '../models/base'
// import {throtLog} from '../util'

const {powerups} = CONFIG

export const addPowerUp = curry((which, creator) => () => {
  let id
  const base = powerups[which]
  // console.debug(`generating powerup maker for ${base.sprite}`)
  const render = (entity) => {
    // console.debug(`adding powerup ${base.sprite}`)
    // const {entity} = creator(base)
    if (!entity) {
      entity = creator(base)
      WORLD.ephemera.powerups.push(entity)
    }
    WORLD.graphics.lineStyle(2, 0xffff00, 2)
    WORLD.graphics.fillStyle(0xff0000, 1)
    WORLD.graphics.fillCircle(entity.x, entity.y, entity._radius)
    // console.debug(WORLD.graphics, `world gfx`)
  }
  return Object.assign(
    {},
    base,
    {
      interval: base.interval,
      lifetime: base.lifetime,
      render,
      start: () => {
        WORLD.ephemera.powerups = WORLD.ephemera.powerups || []
        id = setTimeout(
          render,
          base.interval
        )
      },
      stop: () => {
        clearInterval(id)
      }
    }
  )
})

export const addPlusOne = addPowerUp(`plusOne`, () => {
  return Circle.of({
    x: Math.round(Math.random() * GAME_CONFIG.width),
    y: Math.round(Math.random() * (GAME_CONFIG.height * 0.75)),
    a: 15
  })
})
