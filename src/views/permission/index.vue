<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTool style="margin-bottom: 20px">
        <template #right>
          <el-button type="primary" size="mini" @click="showDialog('0')"
            >添加权限</el-button
          >
        </template>
      </PageTool>
      <el-card>
        <el-table border :data="tableData" row-key="id" default-expand-all="">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="标识" prop="code"></el-table-column>
          <el-table-column label="描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                v-if="scope.row.type === 1"
                type="text"
                @click="showDialog(scope.row.id)"
                >添加</el-button
              >
              <span v-else style="width: 3em; display: inline-block"></span>
              <el-button type="text" @click="editDialog(scope.row)"
                >编辑</el-button
              >
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      @close="handleClose"
    >
      <el-form
        ref="permissionRef"
        label-width="80px"
        :model="permissionForm"
        :rules="permissionFormRules"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name"></el-input>
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="permissionForm.code"></el-input>
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="permissionForm.description"></el-input>
        </el-form-item>
        <el-form-item label="开启" prop="enVisible">
          <el-switch v-model="permissionForm.enVisible"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissions, addPermission, editPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      permissionForm: {
        enVisible: false,
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      },
      id: null,
      permissionFormRules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title () {
      console.log('computed', this.id)
      return this.id ? '新增权限' : '编辑权限'
    }
  },
  watch: {},
  created () {
    this.getPermissions()
  },
  methods: {
    async getPermissions () {
      let res = await getPermissions()
      console.log('权限管理', res)
      res = tranferListToTree(res, '0')
      console.log('树形数据权限管理', res)
      this.tableData = res
    },
    showDialog (id) {
      this.dialogVisible = true
      this.id = id
      console.log('新增窗口', id)
    },
    // 关闭dialog 清空表单数据
    handleClose () {
      this.$refs.permissionRef.resetFields()
      // this.dialogVisible = false
    },
    // 添加权限
    async save () {
      // 一级权限
      if (this.id) {
        this.permissionForm.pid = this.id || '0'
        this.permissionForm.type = this.id === '0' ? 1 : 2
        await addPermission(this.permissionForm)
      } else {
        // 编辑权限
        await editPermission(this.permissionForm)
      }
      this.getPermissions()
      this.dialogVisible = false
    },
    // 编辑权限
    editDialog (row) {
      this.id = null
      this.permissionForm = { ...row }
      this.dialogVisible = true
      console.log('编辑权限', row)
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
