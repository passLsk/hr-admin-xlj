<template>
  <div>
    <el-button
      type="primary"
      size="small"
      @click="
        dialogVisibleRole = true;
        isEdit = false;
        addRolesForm = {};
      "
      >新增角色</el-button
    >
    <el-table :data="rolesList" border>
      <el-table-column type="index" label="序号" width="50px"></el-table-column>
      <el-table-column
        prop="name"
        label="角色名"
        sortable
        width="180px"
      ></el-table-column>
      <el-table-column
        prop="description"
        label="描述"
        sortable
      ></el-table-column>
      <el-table-column width="240px">
        <template v-slot="scope">
          <el-button type="text" @click="settingRight(scope)"
            >分配权限</el-button
          >
          <el-button type="text" @click="showEditDialog(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" @click="delRoleFn(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <el-pagination
        :current-page="paramsObj.page"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="paramsObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <!-- tree权限 -->
    <el-dialog title="提示" :visible.sync="dialogVisibleSetting" width="30%">
      <el-tree
        v-if="dialogVisibleSetting"
        ref="myTree"
        :data="permissions"
        default-expand-all
        show-checkbox
        :props="{ label: 'name' }"
        node-key="id"
        :default-checked-keys="selectedPermissions"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleSetting = false">取 消</el-button>
        <el-button type="primary" @click="setTreeSaveFn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增跟编辑角色 -->
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="dialogVisibleRole"
      width="50%"
      @close="resetRoleForm"
    >
      <el-form
        ref="myForm"
        :model="addRolesForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="addRolesForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="addRolesForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="onClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/setting'
import { getPermissions, getPermissionsById, assignPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils/index' // 深层处理权限递归方法
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        pagesize: 5
      },
      rolesList: [],
      total: null,
      dialogVisibleSetting: false,
      permissions: [],
      selectedPermissions: [],
      id: null,
      dialogVisibleRole: false,
      addRolesForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      isEdit: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      this.rolesList = res.rows
      this.total = res.total
      console.log('角色列表', res)
    },
    // 分页联动效果
    handleSizeChange (val) {
      this.paramsObj.pagesize = val
      this.getRoleList()
    },
    handleCurrentChange (val) {
      this.paramsObj.page = val
      this.getRoleList()
    },
    // 删除角色
    delRoleFn (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.rolesList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        } else {
          this.getRoleList()
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 权限分配
    async settingRight (scope) {
      this.dialogVisibleSetting = true
      // 获取所有的权限点
      const res = await getPermissions()
      this.permissions = tranferListToTree(res, '0')
      console.log('权限分配', res, '树形权限数组', this.permissions)
      // 获取角色的权限点
      const res1 = await getPermissionsById(scope.row.id)
      this.id = scope.row.id
      this.selectedPermissions = res1.permIds
      console.log('角色的权限点', res1)
    },
    // 点击tree确定按钮
    async setTreeSaveFn () {
      this.dialogVisibleSetting = false
      await assignPermission({ id: this.id, permIds: this.$refs.myTree.getCheckedKeys() })
    },
    // 新增与编辑角色
    onClick () {
      // 先进行表单二次检验
      this.$refs.myForm.validate(async bool => { // bool是一个布尔值 ajxa请求写在后面回调函数里
        if (!bool) return this.$message.error('表单数据非法')
        if (this.isEdit) {
          await editRole(this.addRolesForm)
          this.$message.success('编辑角色成功')
        } else {
          await addRole(this.addRolesForm)
          this.$message.success('添加角色成功')
        }
      })
      console.log('addform', this.addRolesForm)
      this.getRoleList()
      this.dialogVisibleRole = false
    },
    // 关闭dialog弹出框的时候重置表单 @close事件
    resetRoleForm () {
      this.$refs.myForm.resetFields()
    },
    showEditDialog (row) {
      this.dialogVisibleRole = true
      this.isEdit = true
      this.addRolesForm = { ...row }
    }
  }
}
</script>

<style scoped lang='scss'>
.el-table {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
