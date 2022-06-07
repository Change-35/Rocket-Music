<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgimage" :songs="song" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '../music-list/music-list.vue'
import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'toplist'
      ]),
      title() {
        return this.toplist.title
      },
      bgimage() {
        if(this.song.length) {
          return this.song[0].image
        }
        return this.toplist.picUrl
      },
      song() {
        return this.toplist.songlist
      }
    },
    created() {
      this.refresh()
    },
    components: {
      MusicList
    },
    methods: {
      refresh() {
        if(!this.toplist.songlist) {
          this.$router.go(-1)
        }
      }
    },
    data() {
      return {
        rank: true
      }
    }
  }
</script>

<style scoped>
  .slide-enter-active, .slide-leave-active{
    transition: all 0.3s ease
  }

  .slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0)
  }
</style>