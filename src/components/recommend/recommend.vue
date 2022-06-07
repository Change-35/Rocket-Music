<template>
  <div class="recommend" ref="recommend">
    <Scroll class="recommend-content" :data="songList" ref="scroll">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.url">
                <img class="needsclick" @load="ImageLoad" :src="item.imageUrl" />
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in songList" :key="index" class="item" @click="selectitem(item)">
              <div class="icon">
                <img v-lazy="item.picUrl" width="65" height="65">
              </div>
              <div class="text">
                <h2 class="name">{{item.name}}</h2>
                <p class="desc">播放总数:{{item.playCount}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!songList.length">
        <loading></loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getBanner } from '../../api/banner/banner'
  import { getSongList } from '../../api/recommend/recommend'

  import Slider from '../../base/slider/slider.vue'
  import Scroll from '../../base/scroll/scroll.vue'
  import loading from '../../base/loading/loading.vue'
  import {playlistMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        recommends: [],
        songList: [],
      }
    },
    components:{
      Slider,
      Scroll,
      loading
    },
    created() {
      this._getBanner()
      this._getSongList()
    },
    methods:{
      selectitem(item) {
        this.$router.push({
          path:`/recommend/${item.id}`
        })
        this.setDisc(item)
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getBanner(){
        getBanner()
          .then(res => {
            let result = res.data.banners
            result.length = 5
            this.recommends = result
          })
          .catch(err => {
          console.log(err);
        })
      },
      _getSongList(){
        getSongList()
          .then(res => {
            let result = res.data.result
            result.length = 15
            this.songList = result
          })
          .catch(err => {
          console.log(err);
        })
      },
      ImageLoad(){
        if(!this.checkLoad){
          this.$refs.scroll.refresh()
          this.checkLoad = true
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    
  }
</script>

<style scoped>

  .recommend{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0
  }
  .recommend  .recommend-content{
    height: 100%;
    overflow: hidden
  }
  .recommend .recommend-content .slider-wrapper{
    position: relative;
    width: 100%;
    overflow: hidden
  }
  
  .recommend-list .list-title{
    height: 65px;
    line-height: 65px;
    text-align: center;
    font-size: var(--font-size-medium);
    color:var(--color-theme)
  }
  .recommend .recommend-content .item{
    display: flex;
    box-sizing: border-box;
    
    /* align-items: center; */
    padding: 0 20px 20px 20px
  }
  .recommend .recommend-content .icon{
    flex: 0 0 60px;
    width: 60px;
    padding-right: 20px
  }
  .recommend .recommend-content .text{
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-bottom: 15px;
    line-height: 20px;
    overflow: hidden;
    font-size: var(--font-size-medium)
  }
  .recommend .recommend-content .name{
    margin-bottom: 10px;
    color: var(--color-text)
  }
  .recommend .recommend-content .desc{
    color: var(--color-text-d)
  }
  .recommend .loading-container{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%)
  }
</style>