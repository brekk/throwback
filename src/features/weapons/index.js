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

const whenWeaponsShouldWiggleDo = conditionWrap(weaponWiggle)
export const create = whenWeaponsShouldWiggleDo(inner)
export const updateEphemeraPre = whenWeaponsShouldWiggleDo(preUpdate)
export const updateEphemeraPost = whenWeaponsShouldWiggleDo(postUpdate)
