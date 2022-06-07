<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box @query="search" :placeholder="placeholder" ref="searchbox"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :currentIndex="currentIndex" :switches="switches" @switchItem="switchItem"></switches>
        <div class="list-wrapper">
          <scroll v-if="currentIndex === 0" :data="playHistory" class="list-scroll" ref="songList" :refreshDelay="100">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" v-if="currentIndex === 1" :data="searchHistory" ref="searchList" :refreshDelay="100">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲以添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from '../../base/scroll/scroll.vue'
import SearchBox from '../../base/search-box/search-box.vue'
import Switches from '../../base/switches/switches.vue'
import {searchMixin} from '../../common/js/mixin'
import Suggest from '../suggest/suggest.vue'
import {mapGetters, mapActions} from 'vuex'
import SongList from '../../base/songlist/song-list.vue'
import Song from '../../common/js/song'
import SearchList from '../../base/search-list/search-list.vue'
import TopTip from '../../base/top-tip/top-tip.vue'


  export default {
    mixins: [searchMixin],
    data() {
      return {
        placeholder:'搜索歌曲',
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        songs: [],
        switches: [
          {
            name: '最近播放'
          },
          {
            name: '搜索历史'
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
      search(query) {
        this.query = query
      },
      hide() {
        this.showFlag = false
      },
      selectSong(song, index) {
        if (index !== 0) {
          this.insertSong(new Song(song))
          this.$refs.topTip.show()
        }
      },
      selectSuggest() {
        this.$refs.topTip.show()
        this.saveSearch()
      },
      switchItem(index) {
        this.currentIndex = index
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      SearchBox,
      SongList,
      SearchList,
      TopTip,
      Suggest,
      Switches,
      Scroll,
    }
  }
</script>

<style scoped>
  @import "../../common/css/mixin.css";

  .add-song{
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: var(--color-background);
  }
    .slide-enter-active{
      transition: all 0.3s
    }
    .slide-leave-active{
      transition: all 0.3s
    }
    .slide-enter{
      transform: translate3d(100%, 0, 0)
    }
    .slide-leave-to{
      transform: translate3d(100%, 0, 0)
    }
    .add-song .header{
      position: relative;
      height: 44px;
      text-align: center;
    }
      .add-song .header .title{
        line-height: 44px;
        font-size: var(--font-size-large);
        color: var(--color-text);
      }
      .add-song .header .close{
        position: absolute;
        top: 0;
        right: 8px;
      }
        .icon-close{
          display: block;
          padding: 12px;
          font-size: 20px;
          color: var(--color-theme);
        }

    .add-song .search-box-wrapper{
      margin: 20px
    }
    
      .shortcut .list-wrapper{
        position: absolute;
        top: 165px;
        bottom: 0;
        width: 100%;
      }
        .shortcut .list-wrapper .list-scroll{
          height: 100%;
          overflow: hidden;
        }
          .shortcut .list-wrapper .list-scroll .list-inner{
            padding: 20px 30px;
          }
    .add-song .search-result{
      position: fixed;
      top: 124px;
      bottom: 0;
      width: 100%;
    }
    .add-song .tip-title{
      text-align: center;
      padding: 18px 0;
      font-size: 0;
    }
      .add-song .tip-title .icon-ok{
        font-size: var(--font-size-medium);
        color: var(--color-theme);
        margin-right: 4px;
      }
      .add-song .tip-title .text{
        font-size: var(--font-size-medium);
        color: var(--color-text);
      }
</style>