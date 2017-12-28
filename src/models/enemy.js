import Phaser from 'phaser'
import throttle from 'lodash/fp/throttle'

import {CONFIG} from '../config'
import {WORLD} from '../world'
import {shootTowardsPlayer} from '../behaviors/shootTowardsPlayer'
import {Triangle} from './base'

const {size, baseFireRate, baseBulletSpeed, baseBulletSize} = CONFIG.enemies
const {Triangle: PTriangle} = Phaser.Geom

const _enemy = ({x, y, length, hitPoints, color, fireRate}) => {
  const geom = Triangle.equilateral(x, y, length)
  let hp = hitPoints
  const draw = () => {
    WORLD.graphics.lineStyle(2, CONFIG.colors.white, 2)
    WORLD.graphics.fillStyle(color, 1)
    WORLD.graphics.fillTriangleShape(geom)
  }
  const animateIdle = () => {
    PTriangle.Rotate(geom, 0.1)
  }
  console.log(`shot... fireRate: ${fireRate}, bulletSize: ${baseBulletSize}`)
  const throttledShot = throttle(fireRate, () => shootTowardsPlayer({x, y}, baseBulletSize, baseBulletSpeed))
  const applyBehavior = () => {
    throttledShot()
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
    // ^ Todo: This should become a computed property so we don't have to update it when everything else updates.
    properties: {
      x: () => x,
      y: () => y,
      length: () => length,
      hp: () => hp
    },
    events: {
      onHit,
      update
    }
  }
  // ^ think this would all be a good fit for something like MobX
}

const easy = ({x, y}) => {
  return _enemy({
    x,
    y,
    length: size,
    hitPoints: 1,
    fireRate: baseFireRate,
    color: CONFIG.colors.yellow
  })
}
const hard = ({x, y}) => {
  return _enemy({
    x,
    y,
    length: size,
    hitPoints: 3, // More hit points
    fireRate: baseFireRate * 0.85, // Faster shooting speed
    color: CONFIG.colors.red // different color
  })
}

export const Enemy = {
  of: _enemy,
  EASY: easy,
  HARD: hard
}
