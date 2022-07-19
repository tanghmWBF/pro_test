<template>
  <div class="center modelDetails">
    <div class="report-head" id="report-head">
      <p class="title">{{postData.templateName}}</p>
      <p v-if="params.startTime&&params.endTime">报告周期：{{params.startTime}}~{{params.endTime}}</p>
    </div>
    <div class="report-content">
      <showUseModels v-if="modelCheckList.length>0" :list="modelCheckList" :type="false"></showUseModels>
      <div class="btn-box" v-show="params.startTime&&params.endTime&&params.templateCode">
        <p>
          <el-button type="primary" @click="postReport"><i class="daq-web icon-small" >&#xe615;</i> 下载PDF</el-button>
        </p>
        <p>
          <el-button type="info" @click="backTop(false)"><i class="daq-web icon-small" >&#xe715;</i> 回到顶部</el-button>
        </p>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .report-head{
    padding: 30px;
    background-color: #fff;
    margin-top: 20px;
    p{
      text-align: center;
    }
    .title{
      color: #229ef4;
      font-size: 32px;
      margin: 10px 0;
    }
  }
  .report-content{
    background: #fff;
    position: relative;
    .btn-box{
      position: fixed;
      bottom: 30px;
      width: 240px;
      right: calc(50% - 120px);
      display: flex;
      flex-direction: row;
      justify-content: center;
      z-index: 9999;
      p{
        margin:0 5px;
      }
    }
  }
  .modelDetails{
    margin-bottom: 90px;
  }
</style>
<script>
import Ajax from '../../service/index'
import showUseModels from '../editModel/show-use-models'
import html2canvas from 'html2canvas'
import Toast from '../../components/toast/index'
export default {
  data () {
    return {
      modelCheckList: [], // 选中模型
      postData: {},
      params: {
        id: this.$route.query.id || '',
        startTime: this.$route.query.startTime || '',
        templateCode: this.$route.query.code || '',
        endTime: this.$route.query.endTime || ''
      }
    }
  },
  created () {
    if (this.params.templateCode.length) {
      this.getModel()
    }
  },
  methods: {
    // 预览模版获取数据
    getModel () {
      Ajax.getTemplateLibDetail(this.params)
        .then((res) => {
          this.postData.templateCode = res.data.templateCode
          this.postData.list = res.data.list
          this.postData.templateName = this.$route.query.reportName || res.data.templateName
          this.modelCheckList = this.postData.list
        })
    },
    // 保存报告、导出报告
    postReport () {
      this.backTop(true)
      let reportToast = new Toast({
        show: true,
        message: '报告生成中',
        type: 'loading',
        duration: '100000'
      })
      let element = document.querySelectorAll('.report-preview-wrapper')
      let ele = document.getElementById('report-head')
      let total = 1
      let file = []
      // 截取标题
      html2canvas(ele, {
        scale: 2,
        dpi: 300,
        width: ele.clientWidth,
        height: ele.clientHeight,
        logging: false,
        useCORS: true
      })
        .then((canvas) => {
          let header = canvas.toDataURL('png')
          file.push(header)
          // 截取详情模块
          for (let i = 0; i < element.length; i++) {
            html2canvas(element[i], {
              scale: 2,
              dpi: 300,
              width: element[i].clientWidth,
              height: element[i].clientHeight,
              logging: false,
              useCORS: true
            })
              .then((canvasList) => {
                let img = canvasList.toDataURL('png')
                file.push(img)
                if (total === element.length) {
                  let formData = new FormData()
                  // 添加表单数据
                  formData.append('files', JSON.stringify(file))
                  Ajax.exportReportPdf(formData)
                    .then((res) => {
                      reportToast.show = false
                      let blob = new Blob([res])
                      let fileName = this.postData.templateName + '.pdf'
                      if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        URL.revokeObjectURL(elink.href) // 释放URL 对象
                        document.body.removeChild(elink)
                      } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                      }
                    })
                }
                total++
              })
          }
        })
    },
    // 返回顶部
    backTop (fn) {
      fn ? $('body, html').scrollTop(0) : $('body, html').animate({ scrollTop: 0 }, 500)
    }
  },
  components: {
    showUseModels
  }
}
</script>
