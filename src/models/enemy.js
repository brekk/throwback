import Phaser from 'phaser'

import {CONFIG} from '../config'
import {WORLD} from '../world'
import {Triangle} from './base'

const enemySize = CONFIG.enemies.size
const {Triangle: PTriangle} = Phaser.Geom

const _enemy = (x, y, length, hitPoints, color) => {
  const geom = Triangle.equilateral(x, y, length)
  let angle = 0
  let hp = hitPoints
  const draw = () => {
    WORLD.graphics.lineStyle(2, CONFIG.colors.white, 2)
    WORLD.graphics.fillStyle(color, 1)
    WORLD.graphics.fillTriangleShape(geom)
  }
  const animateIdle = () => {
    PTriangle.Rotate(geom, 0.1)
  }
  const applyBehavior = () => {
    // TODO!
    //  ie: BEHAVIOR.bobAndWeave, or BEHAVIOR.chasePlayer
    //  * should be passed in at creation and changed based on state etc.
    //  * like an enemy that has 'phases' triggered by hitpoints etc.
  }
  const update = () => {
    animateIdle()
    applyBehavior()
    draw()
  }
  const onHit = () => hp--
  draw()
  return {
    _triangle: geom,
    properties: {
      x: () => x,
      y: () => y,
      length: () => length,
      angle: () => angle,
      hp: () => hp
    },
    events: {
      onHit,
      update
    }
  }
  // ^ think this would all be a good fit for something like MobX
}

export const Enemy = {
  of: _enemy,
  EASY: ({x, y}) => _enemy(x, y, enemySize, 1, CONFIG.colors.yellow),
  HARD: ({x, y}) => _enemy(x, y, enemySize, 3, CONFIG.colors.red)
}
