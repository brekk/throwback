import Phaser from 'phaser'
import throttle from 'lodash/fp/throttle'

import {GAME_CONFIG, CONFIG} from '../config'
import {SPRITES} from '../sprites'
import {WORLD} from '../world'
import {Vector} from '../util'
import {Explosion} from './explosion'
import {Bullet} from './bullet'
import {Triangle} from './base'

const {player: playerConfig, friction, acceleration} = CONFIG

const createPhaserObjects = (ctx) => {
  const image = ctx.add.sprite(
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
  const b = Bullet.of({x, y, radius: bulletSize, vector: targetVector, speed: bulletSpeed, owner: `player`})
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
  const isDead = () => _props.hp <= 0

  return {
    _engine: {
      image,
      physics,
      _triangle: () => Triangle.equilateral({
        x: physics.body.pos.x,
        y: physics.body.pos.y,
        length: physics.body.size.x
      })
      // ^ Naive; used for bullet collision detection. I'm sure phaser has something better.
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
      size,
      isDead
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
    },
    update: () => {
      if (isDead()) {
        image.angle += 0.55
      }
    },
    events: {
      onHit: () => {
        _props.hp--
        console.debug(`Player Hit! HP: ${_props.hp}`)
        if (_props.hp <= 0) {
          const {x, y} = position()
          const baseSize = 6
          const red = CONFIG.colors.red
          WORLD.ephemera.effects.push(Explosion.at({x, y, size: baseSize * 10, color: red}))
          WORLD.ephemera.effects.push(Explosion.at({x: x + 5, y, size: baseSize * 11, color: red}))
          WORLD.ephemera.effects.push(Explosion.at({x: x + 5, y: y - 5, size: baseSize * 8, color: red}))
          WORLD.ephemera.effects.push(Explosion.at({x: x - 5, y: y + 5, size: baseSize * 4, color: red}))
          WORLD.ephemera.effects.push(Explosion.at({x: x - 2, y: y + 5, size: baseSize * 10, color: red}))
          WORLD.ephemera.effects.push(Explosion.at({x, y: y - 5, size: baseSize * 9, color: red}))
        }
      },
      onDeadIdle: () => {
        
      }
    }
  }
}

export const Player = {
  init
}
