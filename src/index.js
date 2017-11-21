import Phaser from 'phaser'

import {GAME_CONFIG} from './config'

import {create, update, preload} from './scene'

GAME_CONFIG.scene = {
  preload,
  create,
  update
}

export const game = new Phaser.Game(GAME_CONFIG)
