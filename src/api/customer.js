import request from '../utils/request'

export default class CustomerApi {
  active(data) {
    return request({
      url: '/active',
      method: 'POST',
      data
    })
  }

  fetchList({page = 1, username = '', card_no = ''}) {
    return request({
      url: '/customer_list',
      method: 'POST',
      data: {
        page,
        username,
        card_no
      }
    })
  }

  getInfo(card_no) {
    return request({
      url: '/customer/' + card_no
    })
  }
}