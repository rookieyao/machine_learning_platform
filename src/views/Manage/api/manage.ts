import request from '@/utils/request'

const api = '/api'
const managerApi = {
  userManageApi: api + '/manage/users',
  allRolesManageApi: api + '/manage/all_roles',
  updateInfoApi: api + '/manage/user/info',
  registerApi: api + '/auth/register',
  registerAliceApi: api + '/task/user/add',
  routeApi: api + '/manage/route',
  routerApi: api + '/manage/router',
  allrabcApi: api + '/manage/roles',
  authApiApi: api + '/manage/all_path',
  aliceApiApi: api + '/alice/all_path',
  sceneApiApi: api + '/scene/all_path',
  toolsApiApi: api + '/tools/all_path',
  aiPlatformApi: api + '/skieernlpweb/common/getAllUrls',
  createRoleApi: api + '/manage/role_policy',
  deleteRoleApi: api + '/manage/role_policy/delete'
}

class manageServe {
  /**
   *获取所有角色权限名称
   * @param data
   * @returns
   */
  static getAllRoles() {
    return request({
      url: managerApi.allRolesManageApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *获取所有auth用户
   * @param data
   * @returns
   */
  static getUser(data: any) {
    return request({
      url: managerApi.userManageApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *修改用户信息
   * @param data
   * @returns
   */
  static updateInfo(data: any) {
    return request({
      url: managerApi.updateInfoApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *新建用户
   * @param data
   * @returns
   */
  static register(data: any) {
    return request({
      url: managerApi.registerApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.user) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *新建用户-alice
   * @param data
   * @returns
   */
  static registerAlice(data: any) {
    return request({
      url: managerApi.registerAliceApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *更新前端路由权限
   * @param data
   * @returns
   */
  static routeChange(data: any) {
    return request({
      url: managerApi.routeApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *获取所有前端路由权限
   * @param data
   * @returns
   */
  static allRoute() {
    return request({
      url: managerApi.routerApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *获取所有的rbac权限
   * @returns
   */
  static allrabc() {
    return request({
      url: managerApi.allrabcApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *获取Auth所有的api
   * @returns
   */
  static authApi() {
    return request({
      url: managerApi.authApiApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *获取Alice所有的api
   * @returns
   */
  static aliceApi() {
    return request({
      url: managerApi.aliceApiApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *获取Scene所有的api
   * @returns
   */
  static sceneApi() {
    return request({
      url: managerApi.sceneApiApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *获取tools所有的api
   * @returns
   */
  static toolsApi() {
    return request({
      url: managerApi.toolsApiApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *获取tools所有的api
   * @returns
   */
  static aiPlatformApi() {
    return request({
      url: managerApi.aiPlatformApi,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *创建一个rbac权限
   * @returns
   */
  static createRoleApi(data: any) {
    return request({
      url: managerApi.createRoleApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   *删除一个rbac权限
   * @returns
   */
  static deleteRoleApi(data: any) {
    return request({
      url: managerApi.deleteRoleApi,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}
export default manageServe
