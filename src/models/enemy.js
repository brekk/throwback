import Phaser from 'phaser'
import throttle from 'lodash/fp/throttle'

import {CONFIG} from '../config'
import {WORLD} from '../world'
import {shootTowardsPlayer} from '../behaviors/shootTowardsPlayer'
import {shootInDirection} from '../behaviors/shootInDirection'
import {Vector} from '../util'
import {Triangle} from './base'

const {size, baseFireRate} = CONFIG.enemies
const {Triangle: PTriangle} = Phaser.Geom

const _enemy = ({x, y, length, hitPoints, color, fireRate, shootFunction}) => {
  const geom = Triangle.equilateral({x, y, length})
  let hp = hitPoints
  const draw = () => {
    WORLD.graphics.lineStyle(2, CONFIG.colors.white, 2)
    WORLD.graphics.fillStyle(color, 1)
    WORLD.graphics.fillTriangleShape(geom)
  }
  const animateIdle = () => {
    PTriangle.Rotate(geom, 0.1)
  }
  const throttledShot = throttle(fireRate, shootFunction)
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

const randomShooter = ({x, y}) => {
  const {baseBulletSpeed, baseBulletSize} = CONFIG.enemies
  return _enemy({
    x,
    y,
    length: size,
    hitPoints: 1,
    fireRate: baseFireRate,
    color: CONFIG.colors.yellow,
    shootFunction: () => shootInDirection({x, y}, Vector.random(), baseBulletSize, baseBulletSpeed)
  })
}
const doubleShotRandom = ({x, y}) => {
  const {baseBulletSpeed, baseBulletSize} = CONFIG.enemies
  return _enemy({
    x,
    y,
    length: size,
    hitPoints: 1,
    fireRate: baseFireRate,
    color: CONFIG.colors.green,
    shootFunction: () => {
      const vector = Vector.random()
      const reversed = {x: vector.y, y: vector.x}
      shootInDirection({x, y}, vector, baseBulletSize, baseBulletSpeed)
      shootInDirection({x, y}, reversed, baseBulletSize, baseBulletSpeed)
    }
  })
}
const targetter = ({x, y}) => {
  const {baseBulletSpeed, baseBulletSize} = CONFIG.enemies
  return _enemy({
    x,
    y,
    length: size,
    hitPoints: 3, // More hit points
    fireRate: baseFireRate * 0.85, // Faster shooting speed
    color: CONFIG.colors.red, // different color
    shootFunction: () => shootTowardsPlayer({x, y}, baseBulletSize, baseBulletSpeed)
  })
}

export const Enemy = {
  of: _enemy,
  RANDOM_SHOT: randomShooter,
  RANDOM_DOUBLE_SHOT: doubleShotRandom,
  TARGETTER: targetter
}
