import { asyncRoutes, constantRoutes } from '@/router'
// 权限管理的模块化vuex vue组件中的数据只能在data props vuex中才能使用
const state = {
  routes: []
}
// mutation只能写同步
const mutations = {
  setRoutes (state, payload) {
    state.routes = payload
  }
}
// action里面可以写同步，异步
const actions = {
  filter (context, menus) {
    // 筛选出该用户的权限点
    const newRoutes = asyncRoutes.filter(item => menus.includes(item.meta.name))
    // 合并静态与筛选后的动态路由
    context.commit('setRoutes', [...constantRoutes, ...newRoutes])
   // 权限管理
    return newRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
