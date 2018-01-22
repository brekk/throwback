import {conditionWrap} from '../../util'
import {create as inner} from './create'
import {updatePre as updateStatsPre} from './update'

const joystick = process.env.joystick
// console.debug(`show stats?`, joystick)

export const FEATURE = {
  joystick
}

// this makes our functions feature-flag specific
const whenShowStatsDo = conditionWrap(joystick)
export const create = whenShowStatsDo(inner)
export const updatePre = whenShowStatsDo(updateStatsPre)
