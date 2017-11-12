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
  bullets: {
    // speed: 7,
    speed: 10,
    fireRate: 150
  },
  colors: {
    yellow: 0xffff00,
    white: 0xffffff
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
