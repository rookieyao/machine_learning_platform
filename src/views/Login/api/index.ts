import request from '@/utils/request'
// const authApi = {
//   login: '/api/skieernlpweb/auth/login',
//   logout: '/api/skieernlpweb/auth/logout',
//   register: '/api/skieernlpweb/auth/auth/register',
//   userInfo: '/api/skieernlpweb/user/me/',
//   auth: '/api/skieernlpweb/auth/auth/'
// }
const authApi = {
  login: '/api/skieernlpweb/api/auth/login',
  logout: '/api/skieernlpweb/api/auth/logout',
  register: '/api/auth/auth/register',
  userInfo: '/api/skieernlpweb/api/user/me/',
  auth: '/api/auth/auth/'
}

class Service {
  static postLogin(data: any) {
    return request({
      url: authApi.login,
      method: 'POST',
      json: false,
      contentType: 'application/x-www-form-urlencoded',
      data
    }).then((res) => {
      if (res.token_type == 'bearer') {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static postLogout() {
    return request({
      url: authApi.logout,
      method: 'POST',
      json: false
    }).then((res) => {
    
      if (res) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static postRegister(params: any) {
    return request({
      url: authApi.register,
      method: 'POST',
      json: true,
      params
    }).then((res) => {
      if (res.status === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static getUserInfo() {
    return request({
      url: authApi.userInfo,
      method: 'get',
      json: true
    }).then((res) => {
      if (res) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  static getAuth() {
    return request({
      url: authApi.auth,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}
export default Service
