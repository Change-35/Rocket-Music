//封装一个request（网络请求）模块
import { request } from "../request";

//传入函数 获取request返回的信息
export function getSingerList(){
  return request({
    url:'/top/artists'
  })
}