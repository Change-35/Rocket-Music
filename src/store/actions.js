// 异步操作 封装 对mutations做一些修改
import { shuffle } from '../common/js/util'
import {playMode} from '../common/js/config'
import * as types from './mutation-types'
import {saveSearch} from '../common/js/catch'
import {deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from '../common/js/catch'

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export const selectPlay = function({commit, state}, {list, index}) {
  //提交
  commit(types.SET_SEQUENCE_LIST, list)
  //随机模式下 list被打乱该怎么做：
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  }else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST,list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX,0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  //记录当前歌曲
  let currentSong = playlist[currentIndex]
  //查找当前列表是否有与待插入的歌曲相同的歌曲 并返回索引
  let fpIndex = findIndex(playlist, song)
  //插入歌曲 索引+1
  currentIndex ++
  //插入歌曲到当前索引
  playlist.splice(currentIndex, 0, song)
  //如果已包含歌曲
  if(fpIndex > -1) {
    if(currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex --
    }else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList,song)

  sequenceList.splice(currentSIndex, 0, song)
  if(fsIndex > -1) {
    if(currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    }else{
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function({commit,state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex

  let pIndex = findIndex(playlist,song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList,song)
  sequenceList.splice(sIndex, 1)

  if(currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST,playlist)
  commit(types.SET_SEQUENCE_LIST,sequenceList)
  commit(types.SET_CURRENT_INDEX,currentIndex)

  if(!playlist.length) {
    commit(types.SET_PLAYING_STATE,false)
  }else {
    commit(types.SET_PLAYING_STATE,true)
  }
}

export const deleteSongList = function({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
}

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY,savePlay(song))
}

export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST,saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST,deleteFavorite(song))
}
