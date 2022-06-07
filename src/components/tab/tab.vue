<template>
  <div class="tab">
    <!-- <router-link 
      tag="div" class="tab-item" to="/recommend" 
      v-for="(item, index) in ['推荐','歌手','排行','搜索']" :key="index"
      @click.native="tabclick(index)">
      <span class="tab-link" :class="{active:index == currentIndex}">{{item}}</span>
    </router-link> -->
    <router-link tag="div" class="tab-item" to="/recommend" >
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name:'Tab',
    data(){
      return{
        currentIndex:0
      }
    },
    methods:{
      tabclick(index){
        console.log(1);
        this.currentIndex = index
      }
    }
  }
</script>

<style scoped  rel="stylesheet/css">
  .tab{
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: var(--font-size-medium);
  }
  .tab .tab-item{
    flex: 1;
    text-align: center
  }
  .tab .tab-item .tab-link{
    padding-bottom: 5px;
    color: var(--color-text-l)
  } 

  .tab .router-link-active .tab-link{
    color: var(--color-theme);
    border-bottom: 2px solid var(--color-theme)
  }
</style>