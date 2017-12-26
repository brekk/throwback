import Phaser from 'phaser'

import {CONFIG} from '../config'
import {WORLD} from '../world'
import {Triangle} from './base'

const {Triangle: PTriangle} = Phaser.Geom

const EXPLOSION_DURATION = 5

const _explosion = ({x, y, size, color}) => {
  const geom = Triangle.equilateral(x, y, size)
  let ticks = 0
  let isDone = false
  const draw = () => {
    WORLD.graphics.lineStyle(2, CONFIG.colors.white, 2)
    WORLD.graphics.fillStyle(color, 1)
    WORLD.graphics.fillTriangleShape(geom)
  }
  const animateIdle = () => {
    PTriangle.Rotate(geom, 5)
  }
  const update = () => {
    if (ticks > EXPLOSION_DURATION) {
      isDone = true
    }
    ticks++
    animateIdle()
    draw()
  }
  draw()
  return {
    _triangle: geom,
    properties: {
      x: () => x,
      y: () => y,
      isDone: () => isDone
    },
    events: {
      update
    }
  }
}

export const Explosion = {
  at: ({x, y, size = 14, color = CONFIG.colors.white}) => _explosion({x, y, size, color})
}
