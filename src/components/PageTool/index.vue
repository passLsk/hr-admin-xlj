<template>
  <el-card>
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <!-- 具名插槽 -->
        <slot name="left"></slot>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
        <!-- 具名插槽 -->
        <slot name="right"></slot>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
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
  methods: {}
}
</script>

<style scoped lang='scss'>
.el-col {
width: unset;
}
</style>
