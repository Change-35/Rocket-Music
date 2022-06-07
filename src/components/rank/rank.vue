<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="toplist" :data="NewTopList">
      <ul class="ull">
        <li class="item" v-for="(item,index) in NewTopList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songlist" :key="index">
              <span>{{index + 1}}</span>
              <span>{{song.name}} - {{song.singer}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!NewTopList.length">
        <loading></loading>
        </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll.vue'
  import Loading from '../../base/loading/loading.vue'
  import {getTopList} from '../../api/toplist/TopList.js'
  import {getRecommendSong} from '../../api/songs/songsdetail'
  import {playlistMixin} from '../../common/js/mixin'
  import {mapMutations} from 'vuex'
  import {mapGetters} from 'vuex'

  // import {getSingerRank} from '../../api/singerRank/singerRank'


  export default {
    mixins: [playlistMixin],
    data() {
      return{
        NewTopList: []
      }
    },
    components: {
      Scroll,
      Loading
    },
    computed: {
      ...mapGetters([
        'toplist'
      ]),
    },
    created() {
      this._getTopList()
    },
    methods: {
      
      selectItem(item) {
        this.$router.push({
          path:`/rank/${item.id}`
        })
        console.log(item)
        this.setTopList(item)
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length ? '60px' : 0
        this.$refs.rank.style.bottom = bottom
        this.$refs.toplist.refresh()
      },
      _getTopList() {
        getTopList().then(res => {
          let toplist = res.data.list
          toplist.length = 15
          let NewTopList = []
          toplist.forEach(item => {
            let id = item.id
            let songlist = []
            getRecommendSong(id).then(res => {
              let result = res.data.playlist
              result.length = 10
              for(let i = 0;i < result.tracks.length; i++) {
                songlist.push({
                  mid: result.tracks[i].ar[0].id,
                  singer: result.tracks[i].ar[0].name,
                  id: result.tracks[i].id,
                  name: result.tracks[i].name,
                  image: result.tracks[i].al.picUrl,
                  album: result.tracks[i].al.name,
                  duration: result.tracks[i].dt / 1000,
                  url:`http://music.163.com/song/media/outer/url?id=${result.tracks[i].id}.mp3`,
                })
              }
              NewTopList.push({
                id:result.id,
                title: result.name,
                desc: result.description,
                picUrl: result.coverImgUrl,
                songlist: songlist
              })
            }) 
          })
          this.NewTopList = NewTopList
        })
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST'
      })
    }
  }
</script>

<style scoped>
   @import "../../common/css/mixin.css";

  .rank{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
    .rank .toplist{
      height: 100%;
      overflow: hidden;
    }
      .rank .toplist .item{
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;
      }
        .rank .ull .item:last-child{
          padding-bottom: 20px;
        }
        .rank .toplist .icon{
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }
        .rank .toplist .songlist{
          flex: 1;
          display: flex;
          flex-direction: column;
          /* justify-content: center; */
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: var(--color-highlight-background);
          color: var(--color-text-d);
          font-size: var(--font-size-small);
        }
          .rank .toplist .songlist .song{
            white-space: nowrap;
            line-height: 33px;
          }
      .rank .loading-container{
        position: fixed;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
</style>