const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  name: state => state.user.userInfo.username,
  avatar: state => state.user.userInfo.staffPhoto,
  companyId: state => state.user.userInfo.companyId,
  // 权限管理简写
  routes: state => state.permission.routes,
  points: state => state.user.userInfo.roles.points
}
export default getters
