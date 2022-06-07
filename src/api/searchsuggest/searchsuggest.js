//封装一个request（网络请求）模块
import { request } from "../request";

export function getSearchSuggest(keywords){
  return request({
    url:'/search/suggest',
    params: {keywords}
  })
}