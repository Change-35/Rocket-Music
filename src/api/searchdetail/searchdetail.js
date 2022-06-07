import {request} from '../request'

export function SearchDetail (keyword) {
  return request({
    url: '/search',
    params: keyword
  })
}