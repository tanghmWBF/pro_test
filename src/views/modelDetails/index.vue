<template>
  <div class="center modelDetails">
    <div class="report-head" id="report-head" >
      <p class="title">{{postData.templateName}}</p>
      <p v-if="params.startTime&&params.endTime&&this.reportType !== 'quarter_report'">报告周期：{{params.startTime}}~{{params.endTime}}</p>
      <p v-if="params.startTime&&params.endTime&&this.reportType === 'quarter_report'">报告周期：{{params.startTime}}季度~{{params.endTime}}季度</p>
    </div>
    <div class="compendiumDetails report-preview-wrapper" v-if="compendium == 1">
      <p class="compendium-title">提纲</p>
      <ul>
        <li v-for="(item, index) in modelCheckList" :key="index"><span>{{index + 1}}、</span>{{item.title}}</li>
      </ul>
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
  .compendiumDetails{
    position: relative;
    padding:20px;
    box-sizing: border-box;
    transition: all .25s ease 0s;
    color: #373e4b;
    background-color: #fff;
    font-size: 16px;
    font-weight: bold;
    line-height: 32px;
    .compendium-title{
      font-size: 18px;
      line-height: 46px;
      font-weight: bold;
    }
    li{
      text-indent:2em;
      span{
        /*margin-right: 10px;*/
      }
    }
  }
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
      right: 50px;
      z-index: 9999;
      p{
        margin:5px 0;
      }
    }
  }
  .modelDetails{
    // width: 1200px;
    margin: 0 auto 120px;
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
      compendium: '0',
      modelCheckList: [], // 选中模型
      reportType: this.$route.query.type,
      postData: {},
      imgFlag: true,
      reportToast: '',
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
          this.compendium = res.data.compendium
          this.postData.templateCode = res.data.templateCode
          this.postData.list = res.data.list
          this.postData.templateName = this.$route.query.reportName || res.data.templateName
          this.modelCheckList = this.postData.list
          this.$store.dispatch('common/GET_LIST', { data: this.modelCheckList })
        })
    },
    // 保存报告、导出报告
    postReport () {
      this.backTop(true)
      let element = document.querySelectorAll('.report-preview-wrapper')
      let ele = document.getElementById('report-head')
      let total = 0
      let code = this.createCode()
      this.imgFlag = true
      this.reportToast = new Toast({
        show: true,
        message: '报告生成中',
        type: 'loading',
        duration: 100000
      })
      console.log('宽度', ele.clientWidth, element[0].clientWidth)
      // 截取标题
      html2canvas(ele, {
        scale: 1,
        dpi: 150,
        width: 820,
        height: 820,
        logging: false,
        useCORS: true
      })
        .then((canvas) => {
          let header = canvas.toDataURL('png')
          this.postImg(header, code, total)
          // 截取详情模块
          for (let i = 0; i < element.length; i++) {
            if (this.imgFlag) {
              html2canvas(element[i], {
                scale: 0.5,
                dpi: 150,
                width: element[i].clientWidth,
                height: element[i].clientHeight,
                logging: false,
                useCORS: true
              })
                .then((canvasList) => {
                  let img = canvasList.toDataURL('png')
                  total++
                  // 截取完成后 开始上传
                  if (total === element.length) {
                    this.postImg(img, code, total, true)
                  } else {
                    this.postImg(img, code, total)
                  }
                })
            }
          }
        })
    },
    // 生成随机码
    createCode () {
      let code = ''
      let codeLength = 32
      let codeChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
      for (var i = 0; i < codeLength; i++) {
        let charNum = Math.floor(Math.random() * 52)
        code += codeChars[charNum]
      }
      return code
    },
    // 上传图片
    postImg (img, code, index, flag) {
      let formData = new FormData()
      // 添加表单数据
      formData.append('files', JSON.stringify(img))
      formData.append('index', index)
      formData.append('operationCode', code)
      Ajax.signalPdf(formData)
        .then((res) => {
          if (res.code !== 0) {
            this.imgFlag = false
            Toast({
              type: 'error',
              message: res.message || '生成报告图片失败'
            })
          } else {
            if (flag) {
              this.getPDF(code)
            }
          }
        })
    },
    // 下载pdf
    getPDF (code) {
      let formData = new FormData()
      // 添加表单数据
      formData.append('operationCode', code)
      Ajax.exportReportPdf(formData)
        .then((res) => {
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
            this.reportToast.show = false
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
            this.reportToast.show = false
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
