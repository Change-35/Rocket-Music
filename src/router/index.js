import Vue from 'vue'
import Router from 'vue-router'

const Rank = () => import('../components/rank/rank.vue')
const Recommend = () => import('../components/recommend/recommend.vue')
const Singer = () => import('../components/singer/singer.vue')
const Search = () => import('../components/search/search.vue')
const SingerDetail = () => import('../components/singer-detail/singer-detail.vue')
const Disc = () => import('../components/disc/disc.vue')
const TopList = () => import('../components/top-list/top-list.vue')
const UserCenter = () => import('../components/user-center/user-center.vue')

Vue.use(Router)

// const Recommend = (resolve) => {
//   import ('../components/recommend/recommend.vue').then((module) => {
//     resolve(module)
//   })
// }

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/recommend'
    },
    {
      path: '/rank',
      component:Rank,
      children:[
        {
          path:':id',
          component:TopList
        }
      ]
    },
    {
      path: '/recommend',
      component:Recommend,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
      path: '/singer',
      component:Singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component:Search,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component:UserCenter,
    },
  ]
})
