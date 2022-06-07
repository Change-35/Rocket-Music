<template>
  <div class="search">
    <div class="search-box-wrapper" >
      <search-box ref="searchbox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortCutWrapper">
      <scroll class="shortcut" ref="shortcut" :data="shortcut" :refreshDelay="100">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="(item , index) in hotKey" :key="index" class="item" @click="addQuery(item.first)">
                <span>{{item.first}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list :searches="searchHistory" @select="addQuery" @delete="deleteOne"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="确定删除所有历史？" @confirm="deleteAll"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '../../base/search-box/search-box.vue'
import {getSearchHot} from '../../api/searchhot/searchhot'
import Suggest from '../suggest/suggest.vue' 
import {mapActions, mapGetters} from 'vuex'
import SearchList from '../../base/search-list/search-list.vue'
import Confirm from '../../base/confirm/confirm.vue'
import Scroll from '../../base/scroll/scroll.vue'
import {playlistMixin, searchMixin} from '../../common/js/mixin'

export default {
  mixins:[playlistMixin, searchMixin],
  name: 'Search',
  components:{
    SearchBox,Suggest,SearchList,
    Confirm,Scroll
  },
  data() {
    return {
      hotKey: [],
    }
  },
  created() {
    this.onQueryChange()
    this._getSearchHot()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      
      this.$refs.shortCutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
      
    },  
    showConfirm() {
      this.$refs.confirm.show()
    },
    _getSearchHot() {
      getSearchHot().then(res => {
        let result = res.data.result.hots
        this.hotKey = result
        console.log(this.hotKey)
      })
    },
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },
    deleteAll() {
      this.clearSearchHistory()
    },
    ...mapActions([
      'clearSearchHistory'
    ])
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    },
    ...mapGetters([
      'searchHistory'
      
    ])
  },
  watch: {
    query(newQuery) {
      if(!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        })
      }
    }
  }
}
</script>

<style scoped>
    .search .search-box-wrapper{
      margin: 20px
    }
    .search .shortcut-wrapper{
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;
    }
      .search .shortcut-wrapper .shortcut{
        height: 100%;
        overflow: hidden;
      }
        .search .shortcut-wrapper .shortcut .hot-key{
          margin: 0 20px 20px 20px;
        }
          .search .shortcut-wrapper .shortcut .hot-key .title{
            margin-bottom: 20px;
            font-size: var(--font-size-medium);
            color: var(--color-text-l);
          }
          .search .shortcut-wrapper .shortcut .hot-key .item{
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: var(--color-highlight-background);
            font-size: var(--font-size-medium);
            color: var(--color-text-d);
          }
        .search .shortcut-wrapper .shortcut .search-history{
          position: relative;
          margin: 0 20px;
        }
          .search .shortcut-wrapper .shortcut .search-history .title{
            display: flex;
            align-items: center;
            height: 40px;
            font-size: var(--font-size-medium);
            color: var(--color-text-l);
          }
            .search .shortcut-wrapper .shortcut .hot-key .title .text{
              flex: 1;
            }
            .search .shortcut-wrapper .shortcut  .search-history .title .clear{
              position: absolute;
              right: 0px;
              flex: 1;
            }
            /* .search .shortcut-wrapper .shortcut  .search-history .title .clear::before{
              content: '';
              position: absolute;
              top: -10px;
              left: -10px;
              right: -10px;
              bottom: -10px;
            } */
              .search .shortcut-wrapper .shortcut  .search-history .title .clear .icon-clear{
                font-size: var(--font-size-medium);
                color: var(--color-text-d);
              }
    .search .search-result{
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
    }
</style>