//封装一个request（网络请求）模块
import { request } from "../request";

//传入函数 获取request返回的信息
export function getSongDetail(ids) {
  return request({
    url:'/song/detail',
    params:{
      ids
    }
  })
}

export function getRecommendSong(id) {
  return request({
    url:'/playlist/detail',
    params:{
      id
    }
  })
}