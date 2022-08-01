<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/jpg,image/jpeg,image/png,image/gif"
      :limit="limit"
      :class="{ hidden: filesList.length === limit }"
      :on-change="handleChange"
      :file-list="filesList"
      :on-remove="handleRemove"
      :http-request="handleRequest"
    >
      <!-- :class="{ hidden: filesList.length === limit }" 判断的是上传的图片数量是否等于上传图片的限制数量 然后隐藏后面的添加图片框 -->
      <!-- :on-change  是el-upload里的属性-->
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-progress :percentage="percent"></el-progress>
    <el-dialog :visible.sync="dialogVisible" title="预览图片">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
// 腾讯云对象存储
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKID2tVs0tXv4yd2C6lBMHxNYUAbPyIMBk48',
  SecretKey: 'sUrzsVt2wc2D8oFRN3VhjV1IK7ewznL6'
})
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      filesList: [],
      percent: 0
    }
  },
  methods: {
    handleRemove (file) {
      console.log(file)
      this.filesList = this.filesList.filter(item => item.uid !== file.uid)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    // el-upload里的属性 上传的图片数量改变的时候触发 filesList 是自定义的变量
    handleChange (file, fileList) {
      this.filesList = fileList
    },
    // 腾讯云上传图片函数
    handleRequest (obj) {
      var that = this
      cos.putObject({
        Bucket: 'xlj-1313062346', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: Date.now() + obj.file.name, /* 必须 腾讯云本地桶要创建的文件名称 自定义 */
        StorageClass: 'STANDARD',
        Body: obj.file, // 上传文件对象
        onProgress: function (progressData) {
          that.percent = Math.ceil(progressData.loaded / progressData.total * 100)
        }
      }, function (err, data) {
        console.log(err || data)
      })
      console.log(123)
    }
  }
}
</script>

<style scoped lang='scss'>
// 原理：hidden类名是动态绑定
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
