<template>
  <div class="singer" ref="singer">
    <list-view :data="NewSingers" @select="selectSinger" ref="Listsinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getSingerList} from '../../api/singer/singers.js'
  import HanziToPinyin from '../../base/topinyin/topinyin'
  import ListView from '../../base/listview/listview.vue'
  import {playlistMixin} from '../../common/js/mixin'

  import {mapMutations} from 'vuex'
  // import Singer from '../../common/js/singer'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        NewSingers: []
      }
    },
    components:{
      ListView
    },
    created() {
      this._getSingerList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.Listsinger.refresh()
      },
      _getSingerList() {
        getSingerList()
          .then((res) => {
            let result = res.data.artists
            let Singers = []
              result.forEach(item => {
                Singers.push({
                  id : item.id,
                  name : item.name,
                  //
                  FirstZM : HanziToPinyin.instance.initialTreatment(item.name).toUpperCase(),
                  picUrl : item.picUrl
                })
              })
              this.NewSingers = this._normalizeSinger(Singers)
              // console.log(this.NewSingers) 
          })
          .catch((err) => {
            console.log(err)
          })
      },
      _normalizeSinger(list) {
        //把热门的歌手分类
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item,index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push({
              id: item.id,
              name: item.name,
              avatar: item.picUrl
            })
          }
          
        
          //按首字母分类
          const key = item.FirstZM
          if(!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          //push元素
          map[key].items.push({
            id: item.id,
            name: item.name,
            avatar: item.picUrl
          })
        })
        
        // 为了得到有序列表 我们需要处理 map
        let hot = []
        let ret = []
        for(let key in map) {
          let val = map[key]
          //正则校验 如果title是a-zA-Z的 放到ret数组中
          if(val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }else if(val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        //让字母a-z升序排列
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      selectSinger(singer) {
        console.log(singer)
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
}
</script>

<style scoped>
  .singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%
  }
</style>
