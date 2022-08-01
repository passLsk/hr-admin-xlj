<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool>
        <!-- 使用具名插槽 -->
        <template #left>
          <el-alert
            :title="`共有${total}条记录`"
            type="info"
            show-icon
            :closable="false"
          >
          </el-alert>
        </template>
        <template #right>
          <el-button type="danger" size="mini" @click="exportExcel"
            >普通excel导出</el-button
          >
          <el-button type="info" size="mini" @click="exportExcel1"
            >复杂表头excel导出</el-button
          >
          <!-- $router 用来实现路由切换 相当于VueRouter实例 路由守卫的钩子函数 beforeEach和afterEach 写在这里面
          $route 获取路由相关参数胡 query params 指的是当前路由 -->
          <el-button
            type="success"
            size="mini"
            @click="$router.push('/import?type=uesr')"
            >excel导入</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="addEmployeeVisible = true"
            >新增员工</el-button
          >
        </template>
      </PageTool>
      <el-card style="margin-top: 14px">
        <!-- correctionTime: "2018-11-30"
departmentName: "总裁办"
formOfEmployment: "1"
id: "604f764971f93f3ac8f365c2"
mobile: "13800000002"
password: "e10adc3949ba59abbe56e057f20f883e"
staffPhoto: "https://hr-1312965400.cos.ap-beijing.myqcloud.com/default.jpg"
timeOfEntry: "2018-11-02"
username: "音音"
workNumber: "1111" -->
        <el-table :data="employeeList" border>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            sortable
          ></el-table-column>
          <el-table-column prop="staffPhoto" label="头像">
            <template v-slot="scope">
              <img
                v-imgerror
                :src="scope.row.staffPhoto"
                alt=""
                style="width: 40px"
                @click="showQrDialog(scope.row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="workNumber" label="工号"></el-table-column>
          <!-- el-table组件里是自带的格式化内容属性formatter -->
          <el-table-column
            prop="formOfEmployment"
            label="聘用形式"
            :formatter="formatterEmployment"
          ></el-table-column>
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <!-- 作用域插槽形式的格式化内容 配合过滤器使用 -->
            <template v-slot="scope">{{
              scope.row.formOfEmployment | formatFormType
            }}</template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门">
          </el-table-column>
          <el-table-column prop="timeOfEntry" label="入职时间"
            ><template v-slot="scope">
              {{ scope.row.timeOfEntry | formateDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="状态">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="280px" align="center">
            <template v-slot="scope">
              <!-- 路由url传参 -->
              <el-button type="text" @click="$router.push('employee/detail/' + scope.row.id)">查看</el-button>
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="showRoleDialog(scope.row.id)"
                >角色</el-button
              >
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 角色 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <!-- checkList数组里放的是复选框被选中label对应的数据 rolesList是请求过来要做循环的数据 -->
      <el-checkbox-group v-model="checkList">
        <el-checkbox
          v-for="item in rolesList"
          :key="item.id"
          :label="item.id"
          >{{ item.name }}</el-checkbox
        >
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRolesFn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增员工 -->
    <el-dialog
      title="提示"
      :visible.sync="addEmployeeVisible"
      width="40%"
      @close="handleClose"
    >
      <el-form
        ref="employeeRef"
        label-width="80px"
        :model="employeeForm"
        :rules="employeeFormRules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="employeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="employeeForm.formOfEmployment"
            placeholder="请选择"
          >
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="employeeForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            @focus="showDepartment"
          ></el-input>
          <!-- 没有数据的话 会显示暂无数据文字 用v-if="departmentList.length > 0" 这个来隐藏这段文字
          :props="{ label: 'name' }" 改变label的对应属性名 -->
          <el-tree
            v-if="departmentList.length > 0"
            :data="departmentList"
            default-expand-all
            :props="{ label: 'name' }"
            @node-click="handlerDepartmentTree"
          ></el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addEmployeeVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 二维码dialog -->
    <el-dialog title="图片二维码" :visible.sync="showQrVisible">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { getDepartmentsList } from '@/api/departments'
import { validMobile } from '@/utils/validate'
import { getEmployee, assignRoles } from '@/api/employees'
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
// import { tranferListToTree } from '@/utils'
import employee from '@/constant/employees'
export default {
  name: 'Employee',
  filters: {
    // 格式化内容的过滤器
    // employee是constant里封装的约定函数
    //  hireType: [{id: 1,value: '正式'},{id: 2,value: '非正式'}],
    // return出去的是筛选好的hireType里的value值
    formatFormType (id) {
      const obj = employee.hireType.find(item => item.id === id - 0)
      if (obj) {
        return employee.hireType.find(item => item.id === id - 0).value
      } else {
        return '未知'
      }
    }
  },
  components: {},
  data () {
    const validateMobile = (rule, value, callback) => {
      validMobile(value) ? callback() : callback(new Error('手机号格式不正确'))
    }
    return {
      paramsObj: {
        page: 1,
        size: 5
      },
      employeeList: [],
      total: null,
      dialogVisible: false,
      checkList: [],
      rolesList: [],
      id: null,
      addEmployeeVisible: false,
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      employeeFormRules: {
        mobile: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      hireType: employee.hireType,
      departmentList: [],
      showQrVisible: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getEmployee()
  },
  methods: {
    // 生成二维码
    showQrDialog (src) {
      this.showQrVisible = true
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, src, function (error) {
        if (error) console.error(error)
        console.log('success!')
      })
      })
    },
    // 组织名称输入框赋值
    handlerDepartmentTree (obj) { // obj 是组件自定义事件带的参数 本行的数据
      this.employeeForm.departmentName = obj.name
      this.departmentList = []
    },
    // 组织名称
    async showDepartment () {
      const res = await getDepartmentsList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.departmentList = tranferListToTree(res.depts, '')
    },
    // 关闭新增员工dialog弹出框
    handleClose () {
      this.$refs.employeeRef.resetFields()
      this.departmentList = [] // 关闭dialog清空数据
    },
    // 分配角色权限
    async assignRolesFn () {
      const res = await assignRoles({ id: this.id, roleIds: this.checkList })
      console.log('角色分配权限', res)
      this.dialogVisible = false
    },
    // 角色编辑
    async showRoleDialog (id) {
      this.id = id
      this.dialogVisible = true
      const { rows } = await getRoleList({ page: 1, size: 9999 })
      this.rolesList = rows
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
      console.log('roleIds', roleIds)
      console.log('角色列表', rows)
    },
    // 获取员工列表
    async getEmployee () {
      const res = await getEmployee(this.paramsObj)
      this.employeeList = res.rows
      this.total = res.total
      console.log('员工列表', res)
    },
    // el-table组件里是自带的格式化内容属性formatter
    formatterEmployment (row, column, cellValue, index) {
      // employee是constant里封装的约定函数
      //  hireType: [{id: 1,value: '正式'},{id: 2,value: '非正式'}],
      // return出去的是筛选好的hireType里的value值
      const obj = employee.hireType.find(item => item.id === cellValue - 0)
      if (obj) {
        return employee.hireType.find(item => item.id === cellValue - 0).value
      } else {
        return '未知'
      }
    },
    // excel导出
    async exportExcel () {
      // 获取所有员工的数据
      const { rows } = await getEmployee({ page: 1, size: 9999 })
      console.log('所有的员工数据', rows)
      // 遍历数组 删除两个对应的属性
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })
      // 处理数据 把excel需要的data数据变为二维数组
      const data = []
      rows.forEach(item => {
        data.push(Object.values(item)) // Object.values(obj) 可以获得对象中所有属性值组成的数组
      })
      // 创建一个中英文映射关系表
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      // 处理表头数据 把表头数组里的对应项变成对应的中文名字
      const tHeader = Object.keys(rows[0]).map(item => (headers[item]))
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          // const tHeader = ['编号','姓名']
          // const data = [[1, '张三'], [2, '李四']]
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '人力资源表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    // 复杂表头写法 类似于合并单元格
    exportExcel1 () {
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
