import {WORLD} from '../world'
import {Bullet} from '../models/bullet'
import {Vector} from '../util'

export const shootTowardsPlayer = (fireFromPosition, size, speed) => {
  const {player} = WORLD
  const targetVector = Vector.fromTo(fireFromPosition, player.properties.position())
  console.log(targetVector)
  const {x, y} = fireFromPosition
  const b = Bullet.of({x, y, radius: size, vector: targetVector, speed, owner: `enemy`})
  WORLD.ephemera.bullets.push(b)
}
