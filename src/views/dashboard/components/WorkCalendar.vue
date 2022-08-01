<template>
  <div>
    <el-row type="flex" justify="end" :gutter="8">
      <el-col :span="5">
        <el-select v-model="year" size="mini" @change="handleChange">
          <el-option v-for="item in 11" :key="item" :value="year - 6 + item">{{
            year - 6 + item
          }}</el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="month" size="mini" @change="handleChange">
          <el-option v-for="num in 12" :key="num" :value="num">{{
            num
          }}</el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-calendar ref="calendar" v-model="value">
      <template #dateCell="scope">
        {{ scope.date.getDate() }}
        <div
          v-if="scope.date.getDay() === 0 || scope.date.getDay() === 6"
          class="rest"
        >
          休
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {
      month: (new Date().getMonth() + 1),
      year: (new Date().getFullYear()),
      value: new Date()
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () {
    const that = this
    this.$refs.calendar.$el.addEventListener('click', function () {
      that.month = new Date(that.$refs.calendar.realSelectedDay).getMonth() + 1
      that.year = new Date(that.$refs.calendar.realSelectedDay).getFullYear()
    })
  },
  methods: {
    handleChange () {
      const str = this.year + '-' + this.month
      this.value = new Date(str)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .el-calendar__header {
  display: none;
}
::v-deep .el-calendar__body {
  padding: 0;
}
::v-deep .el-calendar-table td {
  line-height: 45px;
  text-align: center;
  border: none;
}
::v-deep .el-calendar-table tr td:first-child {
  border: none;
}
::v-deep .el-calendar-table tr:first-child td {
  border: none;
}
::v-deep .el-calendar-table .el-calendar-day {
  height: 60px;
}
.rest {
  width: 18px;
  height: 18px;
  background-color: orangered;
  border-radius: 50%;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  color: #fff;
  display: inline-block;
  vertical-align: middle;
}
</style>
