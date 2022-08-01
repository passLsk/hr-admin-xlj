<template>
  <span @click="handleClick"
    ><svg-icon
      icon-class="fullscreen"
      style="color: #fff; font-size: 20px; margin-right: 8px"
  /></span>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async handleClick () {
      if (document.fullscreenElement) { // 判断是否处于全屏状态
        await document.exitFullscreen() // 退出全屏状态
      } else {
        await document.documentElement.requestFullscreen() // 进入全屏
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
