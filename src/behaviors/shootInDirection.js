import {WORLD} from '../world'
import {Bullet} from '../models/bullet'

export const shootInDirection = (fireFromPosition, fireToDirection, size, speed) => {
  const {x, y} = fireFromPosition
  const b = Bullet.of({x, y, radius: size, vector: fireToDirection, speed, owner: `enemy`})
  WORLD.ephemera.bullets.push(b)
}
