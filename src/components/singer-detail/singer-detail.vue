<template>
  <transition name="slide">
    <music-list :songs="songList" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import {mapGetters} from 'vuex'
import {getSingerList} from '../../api/singer/singersSong'
import {getSongDetail} from '../../api/songs/songsdetail'
import MusicList from '../../components/music-list/music-list.vue'
// import {createSong} from '../../common/js/song'


export default {
  name:'SingerDetail',
  //对应store getters里面的singer
  computed:{
    ...mapGetters([
      'singer'
    ]),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    }
  },
  components:{
    MusicList
  },
  data(){
    return{
      songList: []
    }
  },
  created(){
    this._getDetail()
    console.log(this.singer)
    
  },
  methods:{
    _getDetail(){
      if(!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerList(this.singer.id)
      .then(res => {
        let result = res.data.songs
        result.length = 30
        let songlist = []
        result.forEach(songs => {
          getSongDetail(songs.privilege.id).then(res => {
            let item = res.data.songs[0]
            // console.log(item)
            songlist.push({
              name: item.name,
              mid: item.ar[0].id,
              id: item.id,
              image: item.al.picUrl,
              singer: item.ar[0].name,
              album: item.al.name,
              duration: item.dt / 1000,
              url:`http://music.163.com/song/media/outer/url?id=${item.id}.mp3`
            })
          })
        })
        this.songList = songlist
        console.log(this.songList)
      })
      .catch(err => {
        console.log(err)
      })
    },
    // _normalizeSongs(list) {
    //   let ret = []
    //   list.forEach(item => {
    //     if(item.id && item.mid) {
    //       ret.push(createSong(list))
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
  /* .singer-detail{
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-background);
  } */
  .slide-enter-active,.slide-leave-active{
    transition: all 0.8s;
  }
  .slide-enter,.slide-leave-to{
    transform: translate3d(100% , 0 , 0);
  }
</style>
