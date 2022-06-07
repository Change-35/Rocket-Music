<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songs" 
            class="list" 
            ref="list" 
            :probe-type="probeType" 
            :listen-scroll="listenScroll"
            @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
      <div v-show="!songs.length">
        <loading/>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from '../../base/loading/loading.vue'
import Scroll from '../../base/scroll/scroll.vue'
import SongList from '../../base/songlist/song-list.vue'
import {prefixStyle} from '../../common/js/dom'
import {mapActions} from 'vuex'
import {playlistMixin} from '../../common/js/mixin'

  const RESERVE_HEIGHT = 40
  const transform = prefixStyle('transform')
  const backdrop = prefixStyle('backdrop-filter')

  export default {
    mixins: [playlistMixin],
    components:{
      Scroll,
      SongList,
      Loading
    },
    props: {
      bgImage: { 
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        scrollY: 0
      }
    },
    created(){
      this.probeType = 3
      this.listenScroll = true
    },
    methods:{
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      selectItem(song, index) {
        this.selectPlay({
          list: this.songs,
          index 
        })
      },
      random() {
        this.randomPlay({
          list:this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    },
    mounted(){
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESERVE_HEIGHT
      this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    },
    watch:{
      scrollY(newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        let zIndex = 0
        let scale = 1
        let blur = 0
        this.$refs.layer.style['transform'] = `translate3d(0, ${translateY}px, 0)`
        if( newY < this.minTranslateY ){
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = `${RESERVE_HEIGHT}px`
          this.$refs.playBtn.style.display = 'none'
        }else{
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = ''
        }
        this.$refs.bgImage.style.zIndex = zIndex
        //下拉图片放大
        
        const percent = Math.abs(newY/this.imageHeight)
        if(newY > 0) {
          zIndex = 11
          scale = 1+ percent
        }else{
          blur = Math.min(8 * percent, 8)
        }
        // blur 模糊效果
        this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    computed:{
      bgStyle() {
        return `background-image:url(${this.bgImage})`
      }
    },
    
  }
</script>

<style scoped>
  @import "../../common/css/mixin.css";

  .music-list{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: var(--color-background)
  }
  .music-list .back{
    position:absolute;
    top: 0;
    left: 6px;
    z-index: 50;
  }
  .music-list .icon-back{
    display: block;
    padding: 10px;
    font-size: var(--font-size-large-x);
    color: var(--color-theme);
  }
  .music-list .title{
    text-overflow: ellipsis;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 15%;
    z-index: 40;
    width: 80%;
    white-space: nowrap;
    text-align: center;
    line-height: 40px;
    font-size: var(--font-size-large);
    color: var(--color-text);
  }
  .music-list .bg-image{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover
  }
  .play-wrapper{
    position: absolute;
    bottom: 20px;
    z-index: 50;
    width: 100%;
  }
  .play-wrapper .play{
    box-sizing: border-box;
    width: 140px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid var(--color-theme);
    color: var(--color-theme);
    border-radius: 100px;
    font-size: 0;
  }
  .play-wrapper .play .icon-play{
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 1px;
    margin-right: 6px;
    font-size: var(--font-size-medium-x)
  }
  .play-wrapper .play .text{
    display: inline-block;
    vertical-align: middle;
    font-size: var(--font-size-small)
  }
  .filter{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
  }
  .music-list .bg-layer{
    position: relative;
    height: 100%;
    background: var(--color-background)
  }
  .music-list .list{
    /* overflow: hidden; */
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: var(--color-background)
  }
  .music-list .song-list-wrapper{
    /* border: .5px solid var(--color-theme); */
    /* z-index: 11; */
    /* box-shadow: 0 0 5px 0 var(--color-theme) inset; */
    padding: 20px 30px
  }
  .music-list .loading-container{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%)
  }
</style>