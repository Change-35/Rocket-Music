<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="image" :songs="playlist"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '../music-list/music-list.vue'
import {getRecommendSong} from '../../api/songs/songsdetail'
import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        playlist: []
      }
    },
    computed:{
      title() {
        return this.disc.name
      },
      image() {
        return this.disc.picUrl
      },
      ...mapGetters([
        'disc'
      ])
    },
   components: {
     MusicList
   },
   created() {
     this._getRecommendSong()
   },
   methods: {
     GetLyric() {
        let mid = this.mid
        getLyric(mid).then(res => {
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
    _getRecommendSong(){
       if(!this.disc.id) {
         this.$router.go(-1)
         return
       }
      let id = this.disc.id
      getRecommendSong(id)
        .then(res => {
          let result = res.data.playlist.tracks
          console.log(result)
          const list = []
          result.forEach(item => {
            list.push({
              name: item.name,
              singer: item.ar[0].name,
              id: item.id,
              mid: item.ar[0].id,
              duration: item.dt / 1000,
              album: item.al.name,
              image: item.al.picUrl,
              url:`http://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
            })
          })
          this.playlist = list
          console.log(this.playlist)
        })
        .catch(err => {
          console.log(err)
        })
     }
   }
  }
</script>

<style scoped>
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s
  }

  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)
  }
</style>