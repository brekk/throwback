// import Phaser from 'phaser'
import {curry} from 'ramda'
import {CONFIG, GAME_CONFIG} from '../config'
import {WORLD} from '../world'
import {Circle, throtLog} from '../util'

// const {Geom} = Phaser
// const {Circle} = Geom

const {powerups} = CONFIG
/*
 */

export const addPowerUp = curry((which, creator) => () => {
  let id
  const base = powerups[which]
  console.log(`generating powerup maker for ${base.sprite}`)
  const render = (entity) => {
    console.log(`adding powerup ${base.sprite}`)
    // const {entity} = creator(base)
    if (!entity) {
      entity = creator(base)
      WORLD.ephemera.powerups.push(entity.graphic)
    }
    WORLD.graphics.lineStyle(2, 0xffff00, 2)
    WORLD.graphics.fillStyle(0xff0000, 1)
    WORLD.graphics.fillCircle(entity.graphic.x, entity.graphic.y, entity.graphic._radius)
    // console.log(WORLD.graphics, `world gfx`)
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

export const addPlusOne = addPowerUp(`plusOne`, (base) => {
  const plusOne = Circle.of({
    x: Math.round(Math.random() * GAME_CONFIG.width),
    y: Math.round(Math.random() * (GAME_CONFIG.height * 0.75)),
    a: 15
  })
  return {
    base,
    graphic: plusOne
  }
})
