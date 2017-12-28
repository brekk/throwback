import Phaser from 'phaser'

export const CONFIG = Object.freeze({
  friction: 200,
  acceleration: 200,
  powerups: {
    plusOne: {
      sprite: `+1`,
      interval: 100,
      lifetime: 400
    }
  },
  player: {
    baseFireRate: 150,
    baseHp: 3,
    baseBulletSpeed: 10,
    baseBulletSize: 5
  },
  enemies: {
    size: 25,
    baseFireRate: 1000,
    baseBulletSpeed: 3,
    baseBulletSize: 5
  },
  colors: {
    yellow: 0xffff00,
    white: 0xffffff,
    red: 0xff0000,
    black: 0x000000
  }
})

export const GAME_CONFIG = {
  type: Phaser.AUTO,
  parent: `phaser-example`,
  width: 800,
  height: 600,
  physics: {
    default: `impact`, // arcade seems simpler but isn't in V3 yet
    impact: {
      gravity: 0,
      debug: true, // Shows bounding box and acceleration vector
      maxVelocity: 500
    }
  }
}
