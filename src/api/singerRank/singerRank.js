import { request } from "../request";

export function getSingerRank() {
  return request({
    url:'/toplist/artist',
  })
}