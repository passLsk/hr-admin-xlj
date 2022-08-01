<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="登录账户设置" name="first">
          <el-form
            ref="userForm"
            style="width: 400px; margin-left: 300px; margin-top: 30px"
            :model="userInfo"
            :rules="userInfoRules"
            label-width="80px"
          >
            <el-form-item prop="username" label="用户名">
              <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="userInfo.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">更新</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <UserInfo :id="id"></UserInfo>
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <JobInfo></JobInfo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getUserDetailById, saveUserInfo } from '@/api/user'
import UserInfo from './components/UserInfo'
import JobInfo from './components/JobInfo'
export default {
  filters: {},
  components: { UserInfo, JobInfo },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: ''
      },
      userInfoRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getUserDetailById()
  },
  methods: {
    // tabs标签页
    handleClick () {

    },
    async getUserDetailById () {
      const res = await getUserDetailById(this.id)
      console.log(res)
      res.password = null
      this.userInfo = res
      console.log(this.userInfo)
    },
    // 更细员工信息
    save () {
      this.$refs.userForm.validate(async bool => {
        if (!bool) return this.$message.error('表单检验失败')
        const res = await saveUserInfo(this.id, this.userInfo)
        console.log('更新用户信息', res)
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
