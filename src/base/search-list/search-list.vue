<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="item in searches"  @click="selectItem(item)" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      deleteOne(item) {
        this.$emit('delete', item)
      }
    }
  }
</script>

<style scoped>

  
    .search-list .search-item{
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
    }
      .search-list .search-item .list-enter-active{
        transition: all 0.1s
      }
      .search-list .search-item .list-leave-active{
        transition: all 0.1s
      }
      .search-list .search-item.list-enter{
        height: 0
      }
      .search-list .search-item .list-leave-to{
        opacity: 0
      }
      .search-list .search-item .text{
        font-size: 14px;
        flex: 1;
        color: var(--color-text-l);
      }
      /* .search-list .search-item .icon{
        extend-click()
      } */
        .search-list .search-item .icon .icon-delete{
          font-size: var(--font-size-small);
          color: var(--color-text-d);
        }
</style>