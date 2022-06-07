<template>
  <div class="player" v-show="playlist.length>0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle"
             @touchstart="middelTouchStart"
             @touchmove="middelTouchMove"
             @touchend="middelTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">
                {{playingLyric}}
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                   class="text"
                   v-for="(line, index) in currentLyric.lines"
                   :key="index"
                   :class="{'current':currentLineNum === index}">{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': current === 'cd'}"></span>
            <span class="dot" :class="{'active': current === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(this.currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @currentTime="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="playMode" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="playOrstop" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next"  @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon" @click.stop="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i :class="miniIcon" @click.stop="playOrstop" class="icon-mini"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playlist"></play-list>
    <audio ref="audio" 
           :src="currentSong.url" 
           @play="ready" 
           @error="error" 
           @timeupdate="updateTime"
           @ended="end"
    ></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations, mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from '../../common/js/dom'
import progressBar from '../../base/progress-bar/progress-bar.vue'
import ProgressCircle from '../../base/progress-circle/progress-circle.vue'
import {playMode} from '../../common/js/config'
import {getLyric} from '../../api/lyric/lyric'
import Lyric from 'lyric-parser'
import Scroll from '../../base/scroll/scroll.vue'
import PlayList from '../playlist/playlist.vue'
import {playerMixin} from '../../common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

  export default {
    mixins:[playerMixin],
  components: { progressBar , ProgressCircle , Scroll, PlayList},
    data() {
      return {
        songReady:false,
        currentTime: 0,
        radius:32,
        currentLyric: null,
        currentLineNum: 0,
        current: 'cd',
        playingLyric: ''
      }
    },
    created() {
      this.touch = {}
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playing',
        'currentIndex',
      ]),
      id() {
        return this.currentSong.id
      },
      playMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' :  'icon-random'
      },
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      }
    },
    methods: {
      showPlayList() {
        this.$refs.playlist.show()
      },
      GetLyric() {
        let id = this.id
        
        getLyric(id).then(res => {
          // if(this.currentSong.lrc !== res.data.lrc){
          //   return
          // }
          console.log(res)
          let lyric =  res.data.lrc.lyric
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
          console.log(this.currentLyric)
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },
      middelTouchStart(e) {
        //定义是否初始化
        this.touch.init = true
        const touch = e.touches[0]
        //定义第一次坐标
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middelTouchMove(e) {
        //没有初始化就返回
        if(!this.touch.init) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        const left = this.current === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.max(-window.innerWidth, left + deltaX)
        this.touch.percent =  Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        //让cd背景渐隐
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middelTouchEnd() {
        let offsetWidth
        let opacity
        if(this.current === 'cd') {
          if(this.touch.percent > 0.2) {
            offsetWidth = -window.innerWidth
            this.current = 'lyric'
            opacity = 0
          } else {
            opacity = 1
            offsetWidth = 0
          }
        }else {
          if(this.touch.percent < 0.8) {
            offsetWidth = 0
            this.current = 'cd'
            opacity = 1
          }else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 400
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 6) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        }else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      end() {
        if(this.mode === playMode.loop) {
          this.loop()
        }else {
          this.next()
        }
      },
      onProgressBarChange(percent) {
        const currenttime = this.currentSong.duration  * percent
        this.$refs.audio.currentTime = currenttime
        if(!this.playing) {
          this.playOrstop()
        }
        if(this.currentLyric) {
          this.currentLyric.seek(currenttime * 1000)
        }
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      format(interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad(num, n = 2) {
        let len = num.toString().length
        while(len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      error() {
        this.songReady = true
      },
      ready() {
        this.songReady = true
        this.savePlayHistory(this.currentSong)
      },
      playOrstop() {
        if(!this.songReady) {
          return
        }
        this.setPlayingState(!this.playing)
        if(this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      loop() {
        if(this.playlist.length === 1) {
          this.loop()
        }else{
          this.$refs.audio.currentTime = 0
          this.$refs.audio.play()
          if(this.currentLyric) {
            this.currentLyric.seek(0)
          }
        }
      },
      prev() {
        if(!this.songReady) {
          return
        }
        if(this.playlist.length === 1) {
          this.loop()
          return
        }else {
            let index = this.currentIndex - 1
          if(index === -1) {
            index = this.playlist.length - 1
          }
          this.setCurrentIndex(index)
          if(!this.playing) {
            this.playOrstop()
          }
          this.songReady = false
        }
      },
      next() {
        if (!this.songReady) {
          return
        }
        if (this.playlist.length === 1) {
          this.loop()
          return
        } else {
          let index = this.currentIndex + 1
          if (index === this.playlist.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.playOrstop()
          }
        }
        this.songReady = false
      },
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      },
      _getPosAndScale() {
        const targetWidth = 40
        const paddingLeft = 40
        const paddingBottom = 30
        const paddingTop = 80
        const width = window.innerWidth * 0.8
        const scale = targetWidth / width
        const x = -(window.innerWidth / 2 - paddingLeft)
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
        return {
          x,
          y,
          scale
        }
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()
        
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      ...mapActions([
        'savePlayHistory'
      ]),
      ...mapMutations({
        //提交mutations改变state
        setFullScreen:'SET_FULL_SCREEN',
        setPlayingState:'SET_PLAYING_STATE',
        setCurrentIndex:'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      
    },
    watch: {
      currentSong(newSong, oldSong) {
        if (!newSong.id) {
          return
        }
        if(newSong.id === oldSong.id) {
          return
        }
        if(this.currentLyric) {
          this.currentLyric.stop()
        }
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.$refs.audio.play()
          this.GetLyric()
        },1000)
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    }
  }
</script>

<style scoped>
@import url('../../common/css/mixin.css');

  .player .normal-player{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: var(--color-background)
  }
  .player .normal-player .background{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px)
  }
  .player .normal-player .top{
    position: relative;
    margin-bottom: 25px;
  }
  .player .normal-player .top .back{
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50
  }
  .player .normal-player .top .back .icon-back{
    display: block;
    padding: 9px;
    font-size: var(--font-size-large-x);
    color: var(--color-theme);
    transform: rotate(-90deg);
  }
  .player .normal-player .top .title{
    width: 70%;
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    white-space: nowrap;
    font-size: var(--font-size-large);
    color: var(--color-text);
  }
  .player .normal-player .top .subtitle{
    line-height: 20px;
    text-align: center;
    font-size: var(--font-size-medium);
    color: var(--color-text);
  }
  .player .normal-player .middle{
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;
  }
  .player .normal-player .middle .middle-l{
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
  }
  .player .normal-player .middle .middle-l .cd-wrapper{
    position: absolute;
    left: 10%;
    top: 0;
    width: 80%;
    height: 100%;
  }
  .player .normal-player .middle .middle-l .cd-wrapper .cd{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 10px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
  .player .normal-player .middle .middle-l .cd-wrapper .play{
    animation: rotate 20s linear infinite
  }
  .player .normal-player .middle .middle-l .cd-wrapper .pause{
    animation-play-state: paused;
  }
  .player .normal-player .middle .middle-l .cd-wrapper .cd .image{
    /* position: absolute; */
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .player .normal-player .middle .middle-l .playing-lyric-wrapper{
    width: 80%;
    margin: 30px auto 0 auto;
    overflow: hidden;
    text-align: center
  }
  .player .normal-player .middle .middle-l .playing-lyric-wrapper .playing-lyric{
    height: 20px;
    line-height: 20px;
    font-size: var(--font-size-medium);
    color: var(--color-text-l);
  }
  .player .normal-player .middle .middle-r{
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .player .normal-player .middle .middle-r .lyric-wrapper{
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
  }
  .player .normal-player .middle .middle-r .lyric-wrapper .text{
    line-height: 32px;
    color: var(--color-text-l);
    font-size: var(--font-size-medium);
  }
  .player .normal-player .middle .middle-r .lyric-wrapper .current{
    color: var(--color-text)
  }
  .player .normal-player .bottom{
    position: absolute;
    bottom: 50px;
    width: 100%;
  }
  .player .normal-player .bottom .dot-wrapper{
    text-align: center;
    font-size: 0;
  }
  .player .normal-player .bottom .dot-wrapper .dot{
    display: inline-block;
    vertical-align: middle;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-text-l);
  }
  .player .normal-player .bottom .dot-wrapper .active{
    width: 20px;
    border-radius: 5px;
    background: var(--color-text-ll);
  }
  .player .normal-player .bottom .progress-wrapper{
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0px auto;
    padding: 10px 0;
  }
  .player .normal-player .bottom .progress-wrapper .time{
    color: var(--color-text);
    font-size: var(--font-size-small);
    flex: 0 0 30px;
    line-height: 30px;
    width: 30px;
  }
  .player .normal-player .bottom .progress-wrapper .time-l{
    text-align: left
  }
  .player .normal-player .bottom .progress-wrapper .time-r{
    text-align: right;
    
  }
  .player .normal-player .bottom .progress-wrapper  .progress-bar-wrapper{
    flex: 1
  }
  .player .normal-player .bottom .operators{
    display: flex;
    align-items: center;
  }
  .player .normal-player .bottom .operators .icon{
    flex: 1;
    color: var(--color-theme);
  }
  .player .normal-player .bottom .operators .disable{
    color: var(--color-theme-d)
  }
  .player .normal-player .bottom .operators .icon i{
    font-size: 30px
  }
  .player .normal-player .bottom .operators .i-left{
    text-align: right
  }
  .player .normal-player .bottom .operators .i-center{
    padding: 0 20px;
    text-align: center
  }
  .player .normal-player .bottom .operators .i-center i{
    font-size: 40px
  }
  .player .normal-player .bottom .operators .i-right{
    text-align: left
  }
  .player .normal-player .bottom .operators .icon-favorite{
    color: var(--color-sub-theme)
  }
  /* transition标签的动画效果 */
  .normal-enter-active,.normal-leave-active{
    transition: all 0.5s
  }
  .normal-enter-active .top{
    transition: all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  }
  .normal-enter-active .bottom{
    transition: all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32)
  }
  .normal-enter,.normal-leave-to{
    opacity: 0
  }
  .normal-enter .top{
    transform: translate3d(0, -100px, 0)
  }
  .normal-leave-to .top{
    transform: translate3d(0, -100px, 0)
  }
  .normal-enter .bottom{
    transform: translate3d(0, 100px, 0)
  }
  .normal-leave-to .bottom{
    transform: translate3d(0, 100px, 0)
  }
  .mini-player{
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: var(--color-highlight-background);
  }
  .mini-enter-active, .mini-leave-active{
    transition: all 0.4s
  }
  .mini-enter, .mini-leave-to{
    opacity: 0
  }
  .mini-player .icon{
    flex: 0 0 40px;
    width: 40px;
    padding: 0 7px 0 5px;
  }
  .mini-player .icon img{
    border-radius: 50%
  }
  .mini-player .play{
    animation: rotate 10s linear infinite
  }
  .mini-player .pause{
    animation-play-state: paused
  }
  .mini-player .text{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
  }
  .mini-player .text .name{
    margin-bottom: 2px;
    white-space: nowrap;
    font-size: var(--font-size-medium);
    color: var(--color-text);
  }
  .mini-player .text .desc{
    white-space: nowrap;
    font-size: var(--font-size-small);
    color: var(--color-text-d);
  }
  .mini-player .control{
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
  }
  .mini-player .icon-play-mini, .icon-pause-mini{
    font-size: 30px;
    color: var(--color-theme-d);
  }
  .mini-player .control .icon-playlist{
    height: 30px;
    font-size: 30px;
    color: var(--color-theme-d);
  }
  .mini-player .control .icon-mini{
    font-size: 32px;
    position: absolute;
    left: 0;
    top: 0;
  }

  @keyframes rotate{
    0%{
      transform: rotate(0)
    }
    100%{
      transform: rotate(360deg)
    }
  }
</style>