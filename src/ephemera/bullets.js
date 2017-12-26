import throttle from 'lodash/fp/throttle'
import {CONFIG} from '../config'
import {WORLD} from '../world'
import {Bullet} from '../models/bullet'
import {Vector} from '../util'

const {bullets} = CONFIG
const {fireRate} = bullets // bullets per this as milli

const fireBullet = (vector) => throttle(fireRate, () => {
  const {player} = WORLD
  const {physics} = player
  const {body} = physics
  const offset = bullets.speed
  const bulletX = body.pos.x + (body.size.x / 2) + (offset * vector.x)
  const bulletY = body.pos.y + (body.size.y / 2) + (offset * vector.y)
  const b = Bullet.of({
    x: bulletX,
    y: bulletY,
    radius: 5,
    vector
  })
  WORLD.ephemera.bullets.push(b)
  WORLD.graphics.fillCircle(b.x, b.y, b.radius)
})

// We should move these to the player maybe?
export const fireLeft = fireBullet(Vector.LEFT)
export const fireRight = fireBullet(Vector.RIGHT)
export const fireUp = fireBullet(Vector.UP)
export const fireDown = fireBullet(Vector.DOWN)
