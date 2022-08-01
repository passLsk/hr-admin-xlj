import router from '@/router'
// NProgress Loading进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  // 开启进度条效果
  NProgress.start()
  const token = store.state.user.token
  if (token) {
    if (to.path === '/login') {
      NProgress.done()
      next('/')
    } else {
      if (!store.state.user.userInfo.id) {
        // 调用getInfo请求数据
        // 获取该用户的所有权限点
        const userInfo = await store.dispatch('user/getInfo') // 后面没写参数可以获取对应的getInfo里return出来的值
        // 后面写了参数就是向filter函数里传参对应的是menus
        // 权限管理newRoutes 是筛选后的动态路由表
        const newRoutes = await store.dispatch('permission/filter', userInfo.roles.menus)
        router.addRoutes([...newRoutes, // 404 page must be placed at the end !!!
        { path: '*', redirect: '/404', hidden: true }])
        // to.path 是当前的路由路径 从新打开一次这个路径 防止退出登录 重新登录的时候页面没有渲染好 直接空白页面
        next(to.path)
        console.log('用户的权限点', userInfo)
      }
      next()
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
router.afterEach(() => {
  // 在后置路由守卫中关闭进度条效果
  NProgress.done()
})
 // 1.在登录完成的时候再去筛选->我们在src/permission.js中筛选
 // 2.sidebar/index.vue中能使用的数据只有data，props，vuex--我们就要创建一个permission的vuex模块，因为这样就可以保证被筛选出来的routes能在组件中使用
