export default class Song {
  constructor({id,mid,singer,name,album,duration,image,url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

// export function createSong(musicData) {
//   return new Song({
//     id : musicData.id,
//     mid : musicData.mid,
//     singer : musicData.singer,
//     name : musicData.name,
//     album : musicData.album,
//     duration : musicData.duration,
//     image : musicData.image,
//     url : musicData.url 
//   })
// }