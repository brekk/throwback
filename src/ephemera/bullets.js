import throttle from 'lodash/fp/throttle'
import {CONFIG} from '../config'
import {WORLD} from '../world'
import {Circle} from '../util'

const {bullets} = CONFIG
const {fireRate} = bullets // bullets per this as milli
export const fireBullet = throttle(fireRate, () => {
  const {player} = WORLD
  const {physics} = player
  const {body} = physics
  const b = Circle.of({
    x: body.pos.x + body.size.x / 2,
    y: body.pos.y - 15,
    a: 5
  })
  WORLD.ephemeraBullets.push(b)
  WORLD.graphics.fillCircle(b.x, b.y, b.a)
})
