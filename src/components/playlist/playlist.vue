<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="100">
          <transition-group name="list" tag="ul">
            <li ref="listItem" v-for="(item,index) in sequenceList" class="item" :key="item.id" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="getFavoriteIcon(item)" ></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div  class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" text="确定清空播放列表吗？" @confirm="confirmClear"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapActions, mapGetters,mapMutations} from 'vuex'
  import {playMode} from '../../common/js/config'
  import Scroll from '../../base/scroll/scroll.vue'
  import Confirm from '../../base/confirm/confirm.vue'
  import {playerMixin} from '../../common/js/mixin'
  import AddSong from '../add-song/add-song.vue'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false,
        refreshDelay: 120
      }
    },
    computed: {
       modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      },
      ...mapGetters([
        'sequenceList',
        'currentSong',
        'playlist',
        'mode'
      ])
    },
    methods: {
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ]),
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayingState: 'SET_PLAYING_STATE'
      }),
      show() {
        this.showFlag = true
        setTimeout(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
      hide() {
        this.showFlag = false
      },
      
      showConfirm() {
        this.$refs.confirm.show()
      },
      confirmClear() {
        this.deleteSongList()
        this.hide()
      },
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
      selectItem(item, index) {
        if (this.mode === playMode.random) {
          index = this.playlist.findIndex((song) => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      scrollToCurrent(current) {
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id
        })
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
      },
      deleteOne(item) {
        console.log(item)
        this.deleteSong(item)
        if (!this.playlist.length) {
          this.hide()
        }
      },
      addSong() {
        this.$refs.addSong.show()
      },
      
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        setTimeout(() => {
          this.scrollToCurrent(newSong)
        }, 20)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style scoped>
  @import "../../common/css/mixin.css";
.playlist{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: var(--color-background-d);
  }
    .list-fade-enter-active, .list-fade-leave-active{
      transition: opacity 0.3s;
    }
      .list-fade-enter-active, .list-fade-leave-active .playlist .list-wrapper{
        transition: all 0.3s;
      }
    .list-fade-enter, .list-fade-leave-to{
      opacity: 0;
    }
      /* .playlist .list-wrapper{
        transform: translate3d(0, 56%, 0);
      } */
    /* &.list-fade-enter */
    .playlist .list-wrapper{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: var(--color-highlight-background);
    }
      .playlist .list-wrapper .list-header{
        position: relative;
        padding: 20px 30px 10px 20px;
      }
        .playlist .list-wrapper .list-header .title{
          display: flex;
          align-items: center;
        }
          .playlist .list-wrapper .list-header .title .icon{
            margin-right: 10px;
            font-size: 30px;
            color: var(--color-theme-d);
          }
          .playlist .list-wrapper .list-header .title .text{
            
            flex: 1;
            
            font-size: var(--font-size-medium);
            color: var(--color-text-l);
          }
          /* .playlist .list-wrapper .list-header .title .clear{
            extend-click();
          } */
            .playlist .list-wrapper .list-header .title .clear .icon-clear{
              font-size: var(--font-size-medium);
              color: var(--color-text-d);
            }
      .playlist .list-wrapper .list-content{
        max-height: 240px;
        overflow: hidden;
      }
        .playlist .list-wrapper .list-content .item{
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
        }
          .list-enter-active{
            transition: all 0.1s linear
          }
          .list-leave-active{
            transition: all 0.1s linear
          }
          .list-enter{
            height: 0
          }
          .list-leave-to{
            height: 0
          }
          .playlist .list-wrapper .list-content .current{
            flex: 0 0 20px;
            width: 20px;
            font-size: var(--font-size-small);
            color: var(--color-theme-d);
          }
          .playlist .list-wrapper .list-content .text{
            text-overflow:ellipsis;
            overflow: hidden;
            flex: 1;
            white-space: nowrap;
            font-size: var(--font-size-medium);
            color: var(--color-text-d);
          }
          .playlist .list-wrapper .list-content .like{
            /* extend-click(); */
            margin-right: 15px;
            font-size: var(--font-size-small);
            color: var(--color-theme);
          }
            .playlist .list-wrapper .list-content .like .icon-favorite{
              color: var(--color-sub-theme);
            }
          .playlist .list-wrapper .list-content .delete{
            /* extend-click() */
            font-size: var(--font-size-small);
            color: var(--color-theme);
          }
      .playlist .list-wrapper .list-operate{
        width: 140px;
        margin: 20px auto 30px auto;
      }
        .playlist .list-wrapper .list-operate .add{
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid var(--color-text-l);
          border-radius: 100px;
          color: var(--color-text-l);
        }
          .playlist .list-wrapper .list-operate .add .icon-add{
            margin-right: 5px;
            font-size: var(--font-size-small-s);
          }
          .playlist .list-wrapper .list-operate .add .text{
            font-size: var(--font-size-small);
          }
      .playlist .list-wrapper .list-close{
        text-align: center;
        line-height: 50px;
        background: var(--color-background);
        font-size: var(--font-size-medium-x);
        color: var(--color-text-l);
      }
</style>