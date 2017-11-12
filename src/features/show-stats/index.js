import {conditionWrap} from '../../util'
import {create as inner} from './create'
import {updatePre as updateStatsPre} from './update'

const showStats = process.env.showStats
console.log(`show stats?`, showStats)

export const FEATURE = {
  showStats: showStats
}
const whenShowStatsDo = conditionWrap(showStats)
export const create = whenShowStatsDo(inner)
export const updatePre = whenShowStatsDo(updateStatsPre)
