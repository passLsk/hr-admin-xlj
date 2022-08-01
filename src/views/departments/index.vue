<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card v-loading="isLoading">
        <el-tabs>
          <el-tab-pane label="组织架构">
            <!-- 用了一个行列布局 -->
            <TreeItem
              :node="titleObj"
              @delDepartment="getDepartmentsList"
            ></TreeItem>
            <el-tree :data="data" default-expand-all>
              <template v-slot="scope">
                <!-- {{scope.node.label}} -->
                <!-- @delDepartment 自定义事件 子组件点击了这个事件 重新调用一下getDepartmentsList 更新数据-->
                <TreeItem
                  :node="scope.node"
                  @delDepartment="getDepartmentsList"
                ></TreeItem>
              </template>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import TreeItem from './components/TreeItem.vue'
import { getDepartmentsList } from '@/api/departments'
export default {
  filters: {},
  components: { TreeItem },
  data () {
    return {
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1'
        }]
      }],
      titleObj: {},
      isLoading: true
    }
  },
  computed: {},
  watch: {},
  created () {
    this.getDepartmentsList()
  },
  methods: {
    async getDepartmentsList () {
      const res = await getDepartmentsList()
      console.log(res)
      function transfer (list, pid) {
        const list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = transfer(list, item.id)
          }
        })
        return list1
      }
      const res1 = transfer(res.depts, '')
      console.log(res1)
      this.data = res1
      this.titleObj = res.depts[0]
      // 数据加载完毕 让loading圈圈隐藏
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-tree-node {
  padding: 10px !important;
  span,
  div {
    font-size: 20px;
  }
}
::v-deep .el-tree-node__content {
  padding: 20px 0 !important;
}
</style>
