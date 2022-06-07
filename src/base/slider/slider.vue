<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" 
          v-for="(item, index) in dots" :key="index" 
          :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Bscroll from 'better-scroll'
import { addClass } from '../../common/js/dom.js'

  export default {
    name: 'Slider',
    components:{
      Bscroll
    },
    data(){
      return{
        dots: [],
        currentPageIndex:0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 2000
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
        
        if(this.autoPlay){
          this._play()
        }
      },20)

      //屏幕大小改变时 重新设置宽度
      window.addEventListener('resize', () => {
        if(!this.slider) {
          return
        }
        this._setSliderWidth(true)
        this.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth(isResize){
        //拿到子元素
        this.children = this.$refs.sliderGroup.children
        //轮播总宽度
        let width = 0
        //获取父元素的宽度
        let sliderWidth = this.$refs.slider.clientWidth
        
        for (let i = 0; i < this.children.length; i++){
          let child = this.children[i]
          addClass(child,'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }

        if(this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initSlider(){
        this.slider = new Bscroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          snapSpeed: 400
        })

        this.slider.on('scrollEnd',() => {
          let pageIndex = this.slider.getCurrentPage().pageX
          if(this.loop){
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _initDots(){
        this.dots = new Array(this.children.length)

      },
      _play(){
        let pageIndex = this.currentPageIndex + 1
        if(this.loop){
          pageIndex += 1
        } 
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0 , 400)
        },this.interval)
      }
    }
  }
</script>

<style scoped rel="stylesheet/css">
  .slider{
    min-height: 1px
  }
  .slider .slider-group{
    position: relative;
    overflow: hidden;
    white-space: nowrap
  }
  .slider .slider-group .slider-item{
    float: left;
    box-sizing: border-box;
    overflow: hidden;
    text-align: center
  }
  .slider .slider-group a{
    display: block;
    width: 100%;
    overflow: hidden;
    text-decoration: none
  }
  .slider .slider-group img{
    display: block;
    width: 100%
  }
  .slider .dots{
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0
  }
  .slider .dot{
    display: inline-block;
    margin: 0 4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-text-l)
  }
  .dots .active{
    width: 20px;
    border-radius: 5px;
    background: var(--color-text-ll)
  }
</style>