import throttle from 'lodash/fp/throttle'

import {GAME_CONFIG, CONFIG} from '../config'
import {SPRITES} from '../sprites'
import {WORLD} from '../world'
import {Vector} from '../util'
import {Bullet} from './bullet'

const {player: playerConfig, friction, acceleration} = CONFIG

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

const shootTowards = (targetVector, fireFromPosition, _props) => {
  const {bulletSize, bulletSpeed} = _props
  const {x, y} = fireFromPosition
  const b = Bullet.of({x, y, radius: bulletSize, vector: targetVector, speed: bulletSpeed})
  WORLD.ephemera.bullets.push(b)
}

const init = (ctx) => {
  const {image, physics} = createPhaserObjects(ctx)
  const position = () => physics.body.pos
  const fireFromPosition = () => ({
    x: physics.body.pos.x + (physics.body.size.x) / 2,
    y: physics.body.pos.y + (physics.body.size.y) / 2
  })
  const size = () => physics.body.size
  const _props = {
    hp: playerConfig.baseHp,
    fireRate: playerConfig.baseFireRate,
    bulletSpeed: playerConfig.baseBulletSpeed,
    bulletSize: playerConfig.baseBulletSize
  }

  return {
    _engine: {
      image,
      physics
    },
    // ^ I think ideally we don't all of these should be controlled by commands.
    //   still exporting for now but should remove.
    properties: {
      x: () => physics.body.x,
      y: () => physics.body.y,
      hp: () => _props.hp,
      bulletSize: () => _props.bulletSize,
      bulletSpeed: () => _props.bulletSpeed,
      fireRate: () => _props.fireRate,
      position,
      fireFromPosition,
      size
    },
    commands: {
      moveLeft: () => physics.setVelocityX(-acceleration), // See also .setAcceleration
      moveRight: () => physics.setVelocityX(acceleration),
      moveUp: () => physics.setVelocityY(-acceleration),
      moveDown: () => physics.setVelocityY(acceleration),
      shootLeft: throttle(_props.fireRate, () => shootTowards(Vector.LEFT, fireFromPosition(), _props)),
      shootRight: throttle(_props.fireRate, () => shootTowards(Vector.RIGHT, fireFromPosition(), _props)),
      shootUp: throttle(_props.fireRate, () => shootTowards(Vector.UP, fireFromPosition(), _props)),
      shootDown: throttle(_props.fireRate, () => shootTowards(Vector.DOWN, fireFromPosition(), _props))
      // ^ TODO: all of these throttle functions need to be computed too so we can vary fireRate at runtime
      //         yet another case for mobx
    }
  }
}

export const Player = {
  init
}
