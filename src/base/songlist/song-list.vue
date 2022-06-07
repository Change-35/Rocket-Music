<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array, 
        default: []
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    methods:{
      getDesc(song){
        return `${song.singer} - ${song.album}`
      },
      selectItem(song, index){
        this.$emit('select', song, index)
      },
      getRankCls(index) {
        if(index <= 2) {
          return `icon icon${index}`
        }else {
          return 'text'
        }
      },
      getRankText(index) {
        if(index > 2) {
          return index + 1
        }
      }
    }
  }
</script>
  
<style scoped>
  @import url('../../common/css/mixin.css');

  
  .song-list .item{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: var(--font-size-medium)
  }
  .song-list .rank{
    flex: 0 0 25px;
    width: 25px;
    margin-right: 30px;
    text-align: center
  }
  .song-list .icon{
    display: inline-block;
    width: 25px;
    height: 24px;
    background-size: 25px 24px
  }
  .song-list .icon0{
    /* bg-image('first') */
    background-image: url('./first@2x.png');
  }
  .song-list .icon1{
    /* bg-image('second') */
    background-image: url('./second@2x.png')
  }
  .song-list .icon2{
    /* bg-image('third') */
    background-image: url('./third@2x.png');
  }
  .song-list .text{
    color: var(--color-theme);
    font-size: var(--font-size-large)
  }
  .content{
    flex: 1;
    line-height: 20px;
    overflow: hidden
  }
  .song-list .item .content .name{
    white-space: nowrap;
    color: var(--color-text)
  }
  .song-list .item .content .desc{
    margin-top: 4px;
    white-space: nowrap;
    color: var(--color-text-d)
  }
</style>