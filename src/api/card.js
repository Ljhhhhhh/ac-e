import request from '../utils/request'

export default class CardApi {
  getList({page = 1, card_no = ""}) {
    return request({
      url: '/card',
      method: 'post',
      data: {
        page,
        card_no
      }
    })
  }

  addCard() {
    return request({
      url: '/card/add',
      method: 'POST'
    })
  }
}