<template>
  <scroll class="listview" 
          :data="data" ref="scroll" 
          :listenScroll="listenScroll" 
          @scroll="scroll"
          :probeType ="probeType">
    <ul>
      <li v-for="(group, index) in data" 
          :key="index" 
          class="list-group" 
          ref="listgroup"
      >
        <h1 class="list-group-title">{{group.title}}</h1>
        <ul>
          <li v-for="(item, index) in group.items"
              :key="index" 
              class="list-group-item"
              @click="selectItem(item)"
          >
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" 
        @touchstart="onShortcutTouchStart" 
        @touchmove.stop.prevent="onShortcutTouchMove" 
    >
      <ul>
        <li v-for="(item, index) in ShortCutList" 
            class="item"   :key="index"
            :data-index="index"
            :class="{'current': currentIndex == index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h1 class="fixed-title" >{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading/>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from '../scroll/scroll.vue'
  import Loading from '../../base/loading/loading.vue'
  import {getData} from '../../common/js/dom.js'

  //获取锚点高度
  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    data(){
      return{
        scrollY : -1, 
        currentIndex : 0,
        diff: -1
      }
    },
    created(){
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    props:{
      data:{
        type: Array,
        default: []
      }
    },
    computed:{
      ShortCutList() {
        //取出每个title的第一位
        return this.data.map(group => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if(this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods:{
      refresh() {
        this.$refs.scroll.refresh()
      },
      onShortcutTouchStart(e) {
        //获取锚点index
        let anchorIndex = getData(e.target, 'index')

        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        //指定要去到的dom
        this._ScrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        // console.log(1)
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        //获取y轴偏移量 向下取整
        let delta = Math.ceil((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT )
        // console.log(delta)
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta
        this._ScrollTo(anchorIndex)
      },
      _ScrollTo(index){
        // this.scrollY = -this.listHeight[index]
        if(index < 0){
          index = 0
        }else if(index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        //第二个参数含义是 动画时间
        this.$refs.scroll.scrollToElement(this.$refs.listgroup[index], 400)
      },
      scroll(pos){
        this.scrollY =  pos.y
      },
      //计算每个group距离顶部的高度
      _calculateHeight(){
        this.listHeight = []
        const list = this.$refs.listgroup
        let height = 0
        this.listHeight.push(height)
        for(let i = 0; i < list.length; i++){
        //拿到每一个group
          let item = list[i]
        //计算出高度并累加 item是个dom元素 所以可直接利用clientHeight来获取高度
          height += item.clientHeight
        //每次循环往数据push一次高度
          this.listHeight.push(height)
        }
      },
      selectItem(item) {
        //派发事件 告知接收者所点击的元素
        this.$emit('select', item)
      }
    },
    watch:{
      //数据变化到dom的变化通常有17ms的延时 保证在dom渲染好之后再计算高度
      data() {
        setTimeout(() => {
          this._calculateHeight()
        },20)
      },
      scrollY(newY){
        const listHeight = this.listHeight
        //当滚动到顶部， newY>0
        if(newY > 0){
          this.currentIndex = 0
          return
        }
        //在中间部分滚动
        for( let i = 0; i < listHeight.length - 1; i++){
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if(-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            //注意这里newY是负值 所以是加号
            this.diff = height2 + newY
            return
          }
        }
        //滚动到底部 且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length -2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if(this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px , 0)`
      }
    },
    components:{
      Scroll,
      Loading
    }
  }
</script>

<style scoped>
  
  .listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: var(--color-background)
  }
  .listview .list-group{
    padding-bottom: 30px
  }
  .listview .list-group .list-group-title{
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: var(--font-size-small);
    color: var(--color-text-l);
    background: var(--color-highlight-background);
  }
  .listview .list-group .list-group-item{
    display: flex;
    align-items: center;
    padding: 20px 0 0 30px
  }
  .listview .list-group .list-group-item .avatar{
    width: 50px;
    height: 50px;
    border-radius: 50%
  }
  .listview .list-group .name{
    margin-left: 20px;
    color: var(--color-text-l);
    font-size: var(--font-size-medium);
  }
  .listview .list-shortcut{
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: var(--color-background-d);
    font-family: Helvetica;
  }
  .listview .list-shortcut .item{
    padding: 3px;
    line-height: 1;
    color: var(--color-text-l);
    font-size: var(--font-size-small);
  }
  .listview .list-shortcut .current{
    color: var(--color-theme)
  }
  .listview .list-fixed{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%
  }
  .listview .fixed-title{
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: var(--font-size-small);
    color: var(--color-text-l);
    background: var(--color-highlight-background);
  }
  .listview .loading-container{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%)
  }
</style>
