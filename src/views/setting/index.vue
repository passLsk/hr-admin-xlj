<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="first">
          <RoleManager></RoleManager>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <CompanyInfo></CompanyInfo>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import RoleManager from './components/RoleManager'
import CompanyInfo from './components/CompanyInfo.vue'
export default {
  filters: {},
  components: { RoleManager, CompanyInfo },
  data () {
    return {
      activeName: 'first'
    }
  },
  computed: {},
  watch: {},
  created () { },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
