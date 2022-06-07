<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" 
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from '../../common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      //用于共享数据
      this.touch = {}
    },
    methods: {
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        this.currentTime()
      },
      progressTouchStart(e) {
        this.touch.init = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if(!this.touch.init) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.init = false
        this.currentTime()
      },
      currentTime() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('currentTime' , percent)
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.init) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped>

  .progress-bar{
    height: 30px
  }
  .progress-bar .bar-inner{
    border-radius: 9px;
    position: relative;
    top: 13px;
    height: 5px;
    background: rgba(0, 0, 0, 0.3);
  }
  .progress-bar .bar-inner .progress{
    position: absolute;
    height: 100%;
    background: var(--color-theme)
  }
  .progress-bar .bar-inner .progress-btn-wrapper{
    position: absolute;
    left: -8px;
    top: -13px;
    width: 30px;
    height: 30px;
  }
  .progress-bar .bar-inner .progress-btn-wrapper .progress-btn{
    position: relative;
    top: 7px;
    left: 7px;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    border: 2px solid var(--color-text);
    border-radius: 50%;
    background: var(--color-theme);
  }
</style>