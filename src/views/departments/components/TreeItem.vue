<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; padding: 30px 140px; font-size: 14px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      :title="isEdit ? '编辑部门' : '添加部门'"
      :visible.sync="dialogVisible"
      width="50%"
      :model="addDepartmentsForm"
      :rules="rules"
      @click.native.stop
      @close="handlerAddFormReset"
    >
      <!-- @click.native.stop 阻止冒泡 -->
      <el-form
        ref="addDepartmentsForm"
        label-width="90px"
        :model="addDepartmentsForm"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentsForm.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="addDepartmentsForm.code"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <!-- <el-input
            v-model="addDepartmentsForm.manager"
            placeholder="1-50个字符"
          ></el-input> -->
          <el-select
            v-model="addDepartmentsForm.manager"
            placeholder="请选择"
            style="width: 100%"
            filterable
          >
            <!-- filterable 加了这个属性 可以实现搜索功能 -->
            <!-- label是展示的数据 value里面放唯一标识 相当于对应项的key -->
            <el-option
              v-for="item in users"
              :key="item.id"
              :label="item.username"
              :value="item.username"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentsForm.introduce"
            placeholder="1-50个字符"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDepartmentsFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSimpleUserList } from '@/api/user'
import { delDepartmentsList, addDepartment, getDepartmentsList, editDepartmentsApi } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    // rule 代表当前的检验规则
    // value 要检验的数据 就是输入框输入的value
    // callback 相当于next
    const validateName = async (rule, value, callback) => {
      const res = await getDepartmentsList()
      // 判断是编辑还是添加
      if (this.isEdit) {
        // 编辑不存在标题 所以不需要三元表达式判断
        const pid = this.node.data.pid // 把当前要编辑的部门父级的id找到了 然后根据这个pid去找所有兄弟元素
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback() // 筛选出除自己以为的所有兄弟元素
      } else {
        // 待筛选的所有的子部门的pid
        const id = this.node.data ? this.node.data.id : ''
        // filter 筛选 只要子部门pid和当前部门id一样 说明就是它的子部门
        // some 在当前部门所属的子部门里排查是否有和输入框输入的名称一样的部门
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    return {
      dialogVisible: false,
      addDepartmentsForm: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门负责人
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
        { min: 3, max: 10, message: '部门名称3-10个字符', trigger: 'blur' },
        { validator: validateName, trigger: 'change' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
        { min: 3, max: 10, message: '部门编码3-10个字符', trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人名字不能为空', trigger: 'blur' },
        { min: 2, max: 10, message: '部门负责人2-10个字符', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
        { min: 2, max: 100, message: '部门介绍2-100个字符', trigger: 'blur' }]
      },
      users: '',
      isEdit: false // 判断打开的是编辑还是添加dialog 约定false是添加 true是编辑
    }
  },
  computed: {},
  watch: {},
  created () {
  },
  methods: {
    async onCommand (key) {
      // 这个ajax只需要发一次就可以 所以写在外面做判断 只要users有数据就不再发起请求
      if (this.users.length === 0) {
        this.getSimpleUserList()
      }
      if (key === 'a') {
        this.isEdit = false
        console.log('添加部门')
        this.dialogVisible = true
      } else if (key === 'b') {
        this.isEdit = true
        this.dialogVisible = true
        this.addDepartmentsForm = { ...this.node.data }
        console.log('编辑部门')
      } else {
        try {
          await this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          console.log('用户确定了')
          const res = await delDepartmentsList(this.node.data.id)
          this.$emit('delDepartment') // 自定义事件 调用父组件的getDepartmentsList ajxa请求 刷新数据
          console.log(res)
        } catch (err) {
          console.log(err)
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      this.users = res
      console.log(res)
    },
    handlerAddFormReset () {
      // 关闭添加部门dialog弹窗 让表单重置
      this.$refs.addDepartmentsForm.resetFields()
    },
    async addDepartmentsFn () {
      if (this.isEdit) {
        // 编辑部门
        delete this.addDepartmentsForm.children // 移除对象中的children属性
        await editDepartmentsApi(this.addDepartmentsForm) // 发起编辑部门的ajax请求
      } else {
        // 添加部门
        this.addDepartmentsForm.pid = this.node.data ? this.node.data.id : this.node.id
        await addDepartment(this.addDepartmentsForm)
      }
      this.$emit('delDepartment') // 子传父 调用父亲上的delDepartment点击事件 触发刷新数据
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
