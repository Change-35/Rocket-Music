import {request} from '../request'

export function getSearchHot () {
  return request({
    url: '/search/hot'
  })
}