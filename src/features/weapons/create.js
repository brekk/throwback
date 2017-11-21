import {WORLD} from '../../world'
import {makeTick} from '../../util'

export const create = () => {
  WORLD.wiggleShot = makeTick()
}
