import throttle from 'lodash/fp/throttle'

import {GAME_CONFIG, CONFIG} from '../config'
import {SPRITES} from '../sprites'
import {WORLD} from '../world'
import {Vector} from '../util'
import {Bullet} from './bullet'

const {bullets, friction, acceleration} = CONFIG
const {fireRate} = bullets // bullets per this as milli

const createPhaserObjects = (ctx) => {
  const image = ctx.add.image(
    GAME_CONFIG.width / 2,
    GAME_CONFIG.height * 0.25,
    SPRITES.PLAYER
  )
  const physics = ctx.physics.add
    .body(GAME_CONFIG.width / 2, GAME_CONFIG.height * 0.75)
    .setActive()
    .setVelocity(0, 0)
    .setBounce(0.4) // This is the rebound when player hits the edge of screen

  physics.setGameObject(image, false)
  // We also tried player.physics.setVelocity(0, 0) instead of friction
  physics.setFriction(friction, friction)
  physics.setBodySize(107, 95) // Physics bounding box
  physics.setBodyScale(0.8)
  return {image, physics}
}

const shootTowards = (origin, size, targetVector) => throttle(fireRate, () => {
  const offset = bullets.speed
  const bulletX = origin.x + (size.x / 2) + (offset * targetVector.x)
  const bulletY = origin.y + (size.y / 2) + (offset * targetVector.y)
  const b = Bullet.of({
    x: bulletX,
    y: bulletY,
    radius: 5,
    vector: targetVector
  })
  WORLD.ephemera.bullets.push(b)
})

const init = (ctx, hp) => {
  const {image, physics} = createPhaserObjects(ctx)
  const position = () => ({x: physics.body.pos.x, y: physics.body.pos.y})
  const size = () => ({x: physics.body.size.x, y: physics.body.size.y})
  const _props = {hp}

  return {
    _engine: {
      image,
      physics
    },
    properties: {
      x: () => physics.body.x,
      y: () => physics.body.y,
      hp: () => _props.hp,
      position,
      size
    },
    commands: {
      moveLeft: physics.setVelocityX(-acceleration), // See also .setAcceleration
      moveRight: physics.setVelocityX(acceleration),
      moveUp: physics.setVelocityY(-acceleration),
      moveDown: physics.setVelocityY(acceleration),
      shootLeft: shootTowards(position, size, Vector.LEFT),
      shootRight: shootTowards(position, size, Vector.RIGHT),
      shootUp: shootTowards(position, size, Vector.UP),
      shootDown: shootTowards(position, size, Vector.DOWN)
    }
  }
}

export const Player = {
  init
}
