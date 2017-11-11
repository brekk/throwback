import Phaser from 'phaser'

import {GAME_CONFIG} from './config'

import {create} from './create'
import {update} from './update'
import {preload} from './preload'

GAME_CONFIG.scene = {
  preload,
  create,
  update
}

export const game = new Phaser.Game(GAME_CONFIG)
