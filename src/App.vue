<template>
  <div id="app">
    <Mheader></Mheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Player from './components/player/player.vue'
import Mheader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'

export default {
  name: 'App',
  components:{
    Mheader,
    Tab,
    Player
  },
  created(){
    
  }
}
</script>

<style scoped>
  #app{
    color: var(--color-theme);
  }

</style>