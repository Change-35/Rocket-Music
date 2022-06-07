<template>
  <scroll class="suggest"
          :data="result" 
          :pullup="pullup" 
          ref="suggest"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll">
    <ul class="suggest-list">
      <li  class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
    <div class="no-result-wrapper" v-show="!result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll.vue'
  import {getSearchSuggest} from '../../api/searchsuggest/searchsuggest'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from '../../base/no-result/no-result.vue'

  const TYPE_SINGER = 'singer'

  export default {
    components: {
      Scroll,
        NoResult
    },
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        result: [],
        pullup: true,
        hasMore:true,
        beforeScroll:true
      }
    },  
    created() {
      this.search
    },
    methods: {
      refresh() {
        this.$refs.suggest.refresh()
      },
      getIconCls(item) {
        if(item.type) {
          return 'icon-mine'
        }else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if(item.type) {
          return item.name
        }else {
          return `${item.name} - ${item.singer}`
        }
      },
      search() {
        //上拉加载更多时重置搜索建议
        // this.page = 1,
        // this.hasMore = true
        // this.$refs.suggest.scrollTo(0, 0)
        if(!this.query) {
          return
        }
        getSearchSuggest(this.query).then(res => {
          let ret = res.data.result
          let song = []
          if(ret.artists) {
            ret.artists.forEach(item => {
              song.push({
                name:item.name,
                id: item.id,
                avatar:item.picUrl,
                type: 'singer'
              })
            })
          }
          if(ret.songs) {
            ret.songs.forEach(item => {
            song.push({
              name: item.name,
              mid: item.artists[0].id,
              id: item.id,
              image: item.album.artist.img1v1Url,
              singer: item.artists[0].name,
              album: item.album.name,
              duration: item.duration / 1000,
              url:`http://music.163.com/song/media/outer/url?id=${item.id}.mp3`
            })
          })
          }
          this.result = song
        }).catch(err => {
          console.log(err)
        })
      },
      selectItem(item) {
        if(item.type) {
          this.$router.push(`/singer/${item.id}`)
          this.setSinger(item)
          console.log(item)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      listScroll() {
        this.$emit('listScroll')
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])

      //上拉加载更多 注意使用标志位 hasMore 重新请求数据拼接 配合Scroll的scrollToEnd使用
      // searchMore() {
      //   if (!this.hasMore) {
      //     return
      //   }
      //   this.page++
      //   search(this.query, this.page, this.showSinger, perpage).then((res) => {
      //     if (res.code === ERR_OK) {
      //       this.result = this.result.concat(this._genResult(res.data))
      //       this._checkMore(res.data)
      //     }
      //   })
      // },
      // _checkMore(data) {
      //   const song = data.song
      //   if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
      //     this.hasMore = false
      //   }
      // },
    },
    watch: {
      query() {
        this.search()
      }
    }
  }
</script>

<style scoped >

  .suggest{
    height: 100%;
    overflow: hidden;
  }
    .suggest .suggest-list{
      padding: 0 30px;
    }
      .suggest .suggest-list .suggest-item{
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }
      .suggest .suggest-list .icon{
        flex: 0 0 30px;
        width: 30px;
      }
        .suggest .suggest-list .icon [class^="icon-"]{
          font-size: 14px;
          color: var(--color-text-d);
        }
      .suggest .suggest-list .name{
        flex: 1;
        font-size: var(--font-size-medium);
        color: var(--color-text-d);
        overflow: hidden;
      }
        .suggest .suggest-list .name .text{
          white-space: nowrap;
        }
    .suggest .no-result-wrapper{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
</style>