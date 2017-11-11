import throttle from 'lodash/fp/throttle'
import {CONFIG} from '../config'
import {WORLD} from '../world'

const {bulletFireRate} = CONFIG // bullets per this as milli
export const fireBullet = throttle(bulletFireRate, () => {
  const {player} = WORLD
  const {physics} = player
  const {body} = physics
  const newBullet = {
    x: body.pos.x + body.size.x / 2,
    y: body.pos.y - 15,
    a: 5
  }
  WORLD.ephemera.bullets.push(newBullet)
  WORLD.graphics.fillCircle(newBullet.x, newBullet.y, newBullet.a)
})
