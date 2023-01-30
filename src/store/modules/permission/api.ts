import request from '@/utils/request'

const permissionApi = {
  queryAuthedPermission: '/api/skieernlpweb/api/auth/routes'
}

class Service {
  /**
   * @description POST 查询授权菜单权限
   */
  static postAuthPermission(data:any) {

    // // var data = {
    // //   "status": 200,
    // //   "data": {
    // //     "authedRoutes": [
    // //       "/aiPlatform/train",
    // //       "/aiPlatform/model",
    // //       "/aiPlatform/data",
    // //       "/aiPlatform/approving",
    // //       "/aiPlatform"
    // //     ]
    // //   }
    // // };
    // return data;
    return request({
      url: permissionApi.queryAuthedPermission,
      method: 'get',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        // res.data.authedRoutes.push('/manage')

        // var data = {
        //   "status": 200,
        //   "data": {
        //     "authedRoutes": [
        //       "/aiPlatform/train",
        //       "/aiPlatform/model",
        //       "/aiPlatform/data",
        //       "/aiPlatform/approving",
        //       "/aiPlatform"
        //     ]
        //   }
        // };
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}
export default Service
