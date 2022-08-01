import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// 把所有按需导出的全部导入到一个对象中
import * as directives from '@/directives' // 导入自定义指令
// 批量导入自定义指令，简化指令代码 配合directives文件夹使用
Object.keys(directives).forEach(item => {
  Vue.directive(item, directives[item])
})
import * as filters from '@/filters'
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
import component from '@/components'
// 打印的插件
import Print from 'vue-print-nb'
// Global instruction
// mixin的用法
import mixins from './mixins'
Vue.mixin(mixins)
Vue.use(Print)
Vue.use(component)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
import i18n from '@/lang'
Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
