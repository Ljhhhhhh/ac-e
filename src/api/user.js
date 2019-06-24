import request from '../utils/request'

export default class UserApi {
  login(data) {
    const {username, pwd} = data
    return request({
      url: '/login',
      method: 'POST',
      data: {
        username,
        pwd
      }
    })
  }
}