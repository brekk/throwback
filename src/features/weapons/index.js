import {conditionWrap} from '../../util'
import {create as inner} from './create'
import {
  updateEphemeraPre as preUpdate,
  updateEphemeraPost as postUpdate
} from './update'

const weaponWiggle = process.env.weaponWiggle

export const FEATURE = {
  weapon: {
    wiggle: weaponWiggle
  }
}
export const create = conditionWrap(weaponWiggle, inner)
export const updateEphemeraPre = conditionWrap(weaponWiggle, preUpdate)
export const updateEphemeraPost = conditionWrap(weaponWiggle, postUpdate)
