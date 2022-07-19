<template>
  <div class="center">
     <div class="report-list">
       <div class="report-hd">
         <div class="search-box">
           <input type="text" placeholder="请输入简报名称" v-model="params.reportName">
           <i class="daq-web">&#xe81b;</i>
         </div>
         <div>
           <el-select v-model="params.reportType"  placeholder="报告类型">
             <el-option label="全部" value="all"></el-option>
             <el-option
               v-for="(item, index) in reportType"
               :key="index"
               :label="item.name"
               :value="item.value"
             ></el-option>
           </el-select>
         </div>
         <!--<div>-->
           <!--<el-select v-model="params.status"  placeholder="状态">-->
             <!--<el-option-->
               <!--v-for="(item, index) in status"-->
               <!--:key="index"-->
               <!--:label="item.name"-->
               <!--:value="item.value"-->
             <!--&gt;</el-option>-->
           <!--</el-select>-->
         <!--</div>-->
         <div class="new-mb">
           <el-button type="primary" @click="newReportClick"><i class="daq-web">&#xe69f;</i>创建报告</el-button>
         </div>
       </div>
       <div class="report-bd">
         <el-table
         v-if="list.length"
         :data="list"
         stye="width: 100%"
         border
         :row-class-name="tableRowClassName"
         >
           <el-table-column prop="report_name" label="报告名称"></el-table-column>
           <el-table-column prop="template_name" label="模版选择" width="260"></el-table-column>
           <el-table-column label="报告类型" width="120">
             <template slot-scope="scope">
               {{ scope.row.report_type === 'day_report' ? '日报' : '' }}
               {{ scope.row.report_type === 'month_report' ? '月报' : '' }}
               {{ scope.row.report_type === 'quarter_report' ? '季报' : '' }}
               {{ scope.row.report_type === 'year_report' ? '年报' : '' }}
             </template>
           </el-table-column>
           <el-table-column label="报告周期" width="260">
             <template slot-scope="scope">
               {{ scope.row.report_type | filterTime(scope.row.start_time, scope.row.end_time) }}
             </template>
           </el-table-column>
           <el-table-column prop="create_time" label="创建日期" width="200"></el-table-column>
           <el-table-column label="操作" width="190">
             <template slot-scope="scope">
               <el-button type="text" size="small" class="small-btn" @click="jump({path: 'details',query: {reportName: scope.row.report_name, startTime: scope.row.start_time, endTime: scope.row.end_time, code: scope.row.template_code, type: scope.row.report_type, dataType: 'REAL', menu: 'home'}})"><i class="daq-web icon-small">&#xe650;</i>预览</el-button>
               <!--<el-button type="text" size="small"><i class="daq-web icon-small">&#xe668;</i>编辑</el-button>-->
               <el-button type="text" size="small" class="small-btn" @click="delReport(scope.row.id)"><i class="daq-web icon-small">&#xe631;</i>删除</el-button>
             </template>
           </el-table-column>
         </el-table>
         <d-no-data v-else></d-no-data>
         <div class="page-box">
           <el-pagination
             background
             v-if="list.length"
             layout="prev, pager, next, jumper"
             @current-change="handleCurrentChange"
             :current-page="page.currPage"
             :page-size="page.pageSize"
             :total="page.total">
           </el-pagination>
         </div>
       </div>
     </div>
    <!--创建模版-->
    <el-dialog
    title="创建报告"
    :visible.sync="tmpDialog"
    width="620px"
    >
      <div class="dialog-middle">
        <el-form ref="form" :rules="rules" :model="form" label-width="80px">
          <el-form-item label="报告名称" prop="reportName">
            <el-input v-model="form.reportName" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="使用模版" prop="templateCode">
            <el-select v-model="form.templateCode"  placeholder="请选择模版">
              <el-option
                v-for="(item, index) in tempalteList"
                :key="index"
                :label="item.template_name"
                :value="item.template_code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报告类型" prop="reportType">
            <el-select v-model="form.reportType" placeholder="请选择报告类型">
              <el-option
                v-for="(item, index) in dateDimension"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择时间" required v-if="form.reportType && form.reportType !== 'quarter'">
            <el-col :span="8">
              <el-form-item prop="startTime">
                <el-date-picker
                  :clearable="false"
                  :editable="false"
                  :type="form.reportType === 'day' ? 'date' : form.reportType" :picker-options="sdateOptions" placeholder="开始日期"  v-model="form.startTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="9">
              <el-form-item prop="endTime">
                <el-date-picker
                  :clearable="false"
                  :editable="false"
                  :type="form.reportType === 'day' ? 'date' : form.reportType" :picker-options="edateOptions" placeholder="结束日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5" style="text-align: right;">
              <el-button class="reset" plain @click="resetDate">重 置</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="选择时间" required v-if="form.reportType === 'quarter'">
            <el-col :span="11">
                <!--季度时间选择控件 -->
              <el-form-item prop="startTime">
                <jidu-date-picker
                  ref="jidupicker"
                  @chooseSeason="sChange"
                  :params="{type: 'start', time: ''}"
                ></jidu-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <!--季度时间选择控件 -->
              <el-form-item prop="endTime">
              <jidu-date-picker
                ref="jidupicker"
                @chooseSeason="eChange"
                :params="{type: 'end', time: form.startTime}"
              ></jidu-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveOrUpdateReport('form')">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss">
  .report-list{
    padding: 30px 30px 10px;
    background-color: #fff;
    margin-top: 20px;
    .report-hd{
      display: flex;
      &>div{
        margin-right: 10px;
        height: 36px;
        line-height: 36px;
      }
      .el-input__inner{
        height: 36px;
      }
      .el-button{
        padding: 10px 20px;
      }
      .new-mb{
        i{
          font-weight: bold;
          margin-right: 5px;
        }
      }
    }
    .search-box{
      position: relative;
      width: 240px;
      input{
        border-radius: 4px;
        height: 100%;
        width: 100%;
        border: 1px solid #d2d8e3;
        box-sizing: border-box;
        padding: 0 40px 0 10px;
        &::-webkit-input-placeholder{
          color: #b6c0cf;
        }
        &:focus{
          outline:none;
          border:1px solid #229ef4;
        }
      }
      i{
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 20px;
        line-height: 36px;
        font-weight: bold;
        color: #d2d8e3;
      }
    }
    .page-box{
      text-align: right;
      margin: 20px 0;
      .el-pagination{
        font-weight: normal;
      }
    }
  }
  .el-dialog{
    .el-dialog__header{
      height: 50px;
      box-sizing: border-box;
      padding: 0;
      background-color: #eff2f7;
      border-bottom: 1px solid #dee3ed;
      line-height: 50px;
      .el-dialog__title{
        font-weight: bold;
        color: #1d242f;
        padding: 0 20px;
        line-height: 50px;
        display: inline-block;
        background-color: #fff;
        border-right: 1px solid #dee3ed;
        font-size: 16px;
      }
    }
    .el-dialog__footer{
      text-align: center;
    }
  }
  .dialog-middle{
    padding: 0 60px 0 20px;
    .line{
      text-align: center;
      color: #dee3ed;
    }
  }
</style>
<style lang="scss">
  .report-bd{
    margin-top: 20px;
    .icon-small{
      margin-right: 5px;
    }
    .el-table .ow-row{
      background: #f6f9ff;
    }
    .el-table th>.cell{
      font-weight: bold;
      color: #373e4b;
      font-size: 14px;
    }
    .small-btn{
      padding: 0 !important;
    }
  }
</style>
<script>
import Ajax from '../../service/index'
import noData from '../../components/no-data/index'
import Toast from '../../components/toast/index'
import jiduDatePicker from '../../components/jidu-picker/index'
import { fmtDate } from '../utils'
export default {
  data () {
    return {
      options: [
        {
          value: '年报',
          label: '年报'
        },
        {
          value: '月报',
          label: '月报'
        },
        {
          value: '季报',
          label: '季报'
        }
      ],
      tmpDialog: false,
      params: {
        reportType: '',
        reportName: '',
        status: '',
        currPage: 1,
        pageSize: 12
      },
      page: {},
      reportType: [],
      status: [],
      dateDimension: [],
      list: [],
      tempalteList: [],
      form: {
        templateCode: '',
        reportName: '',
        reportType: '',
        startTime: '',
        endTime: '',
        id: '',
        status: ''
      },
      // 验证规则
      rules: {
        reportName: [
          { required: true, message: '请输入报告名称', trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: '请选择模版', trigger: 'change' }
        ],
        reportType: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      // 日报选择规则
      sdateOptions: {
        disabledDate: (time) => {
          return this.dealdisabledDate(time, 's')
        }
      },
      edateOptions: {
        disabledDate: (time) => {
          return this.dealdisabledDate(time, 'e')
        }
      }
    }
  },
  mounted () {
    // 筛选类别
    this.getDic({ dictType: 'reportType' })
    // this.getDic({ dictType: 'status' })
    this.getDic({ dictType: 'dateDimension' })
    // 请求列表
    this.getList(this.params)
    // 获取模版列表
    this.getTmp()
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if ((rowIndex % 2) !== 0) {
        return 'ow-row'
      }
    },
    dealdisabledDate (time, type) {
      switch (this.form.reportType) {
        case 'day':
          if (type === 's') {
            return time.getTime() > Date.now()
          } else {
            if (this.form.startTime !== '') {
              let currentTime = this.form.startTime
              let threeMonths = currentTime.setMonth(currentTime.getMonth() + 1)
              currentTime.setMonth(currentTime.getMonth() - 1)
              return time.getTime() < this.form.startTime || time.getTime() >= threeMonths || time.getTime() > Date.now()
            } else {
              return time.getTime() > Date.now()
            }
          }
        case 'month':
          if (type === 's') {
            return time.getTime() > Date.now()
          } else {
            if (this.form.startTime !== '') {
              let currentTime = this.form.startTime
              let threeMonths = currentTime.setMonth(currentTime.getMonth() + 11)
              currentTime.setMonth(currentTime.getMonth() - 11)
              return time.getTime() < this.form.startTime || time.getTime() > threeMonths || time.getTime() > Date.now()
            } else {
              return time.getTime() > Date.now()
            }
          }
        case 'year':
          if (type === 's') {
            return time.getTime() > Date.now()
          } else {
            if (this.form.startTime !== '') {
              let currentTime = this.form.startTime
              let threeMonths = currentTime.setMonth(currentTime.getMonth() + 72)
              currentTime.setMonth(currentTime.getMonth() - 72)
              return time.getTime() < this.form.startTime || time.getTime() > threeMonths || time.getTime() > Date.now()
            } else {
              return time.getTime() > Date.now()
            }
          }
      }
    },
    sChange (val) {
      this.form.startTime = val
      this.form.endTime = ''
    },
    eChange (val) {
      this.form.endTime = val
    },
    // 字典查询
    getDic (params) {
      Ajax.getReportTypeList(params)
        .then((res) => {
          if (params.dictType === 'reportType') {
            this.reportType = res.datas
          }
          if (params.dictType === 'status') {
            this.status = res.datas
          }
          if (params.dictType === 'dateDimension') {
            this.dateDimension = res.datas
          }
        })
    },
    // 报告列表
    getList (params) {
      if (params.reportType === 'all') {
        params.reportType = ''
      }
      Ajax.reportList(params)
        .then((res) => {
          this.list = res.datas
          this.page = res.page
        })
    },
    // 模版列表
    getTmp () {
      Ajax.getTemplateLibType()
        .then((res) => {
          this.tempalteList = res.datas
        })
    },
    // 创建报告点击
    newReportClick () {
      if (this.tempalteList.length) {
        this.tmpDialog = true
      } else {
        this.$confirm('暂无模版，请先新增模版！', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.jump({ path: 'editModel', query: { menu: 'modelData', region: window.global_config.BASE_REGION } })
        })
      }
    },
    // 报告保存、编辑
    saveOrUpdateReport (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let formData = {
            endTime: this.form.reportType === 'quarter' ? this.formatQuarter(this.form.endTime) : this.formatDate(this.form.endTime, this.form.reportType),
            startTime: this.form.reportType === 'quarter' ? this.formatQuarter(this.form.startTime) : this.formatDate(this.form.startTime, this.form.reportType),
            reportType: this.form.reportType + '_report',
            reportName: this.form.reportName,
            status: this.form.status,
            id: this.form.id,
            templateCode: this.form.templateCode
          }
          Ajax.saveOrUpdateReport(formData)
            .then((res) => {
              this.tmpDialog = false
              Toast({
                type: 'sucess',
                message: '保存成功',
                callback: () => {
                  this.$refs['form'].resetFields()
                  this.getList(this.params)
                }
              })
            })
        }
      })
    },
    handleCurrentChange (val) {
      this.params.currPage = val
    },
    delReport (id) {
      this.$confirm('是否要删除该报告?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        Ajax.deleteReport({ id: id })
          .then((res) => {
            if (res.code === 0) {
              Toast({
                message: '删除成功',
                callback: () => {
                  this.getList(this.params)
                }
              })
            } else {
              Toast({
                message: res.message
              })
            }
          })
      })
    },
    /**
     * 跳转
     */
    jump (item) {
      this.$router.push({
        path: item.path,
        query: Object.assign(item.query, { region: window.global_config.BASE_REGION })
      })
    },
    /**
     * 时间转换
     */
    formatDate (value, type) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      switch (type) {
        case 'day':
          return y + '-' + MM + '-' + d
        case 'month':
          return y + '-' + MM
        case 'year':
          return y
      }
    },
    // 重置时间
    resetDate () {
      this.form.startTime = ''
      this.form.endTime = ''
    },
    /**
     * 季度时间转换
     */
    formatQuarter (value) {
      let year = value.split('-')[0]
      let month = value.split('-')[1]
      let season = ''
      if (month <= 3) {
        season = 1
      } else if (month > 3 && month <= 6) {
        season = 2
      } else if (month > 6 && month <= 9) {
        season = 3
      } else if (month > 9 && month <= 12) {
        season = 4
      }
      return year + '-' + season
    }
  },
  filters: {
    filterTime (type, stime, etime) {
      switch (type) {
        case 'day_report':
          stime = fmtDate(new Date(stime), 'yyyy年MM月dd日')
          etime = fmtDate(new Date(etime), 'yyyy年MM月dd日')
          return stime + ' - ' + etime
        case 'year_report':
          stime = fmtDate(new Date(stime), 'yyyy年')
          etime = fmtDate(new Date(etime), 'yyyy年')
          return stime + ' - ' + etime
        case 'month_report':
          stime = fmtDate(new Date(stime), 'yyyy年MM月')
          etime = fmtDate(new Date(etime), 'yyyy年MM月')
          return stime + ' - ' + etime
        case 'quarter_report':
          stime = fmtDate(new Date(stime), 'yyyy年MM') + '季度'
          etime = fmtDate(new Date(etime), 'yyyy年MM') + '季度'
          return stime + ' - ' + etime
      }
    }
  },
  components: {
    'd-no-data': noData,
    'jidu-date-picker': jiduDatePicker
  },
  watch: {
    'form.reportType': {
      handler: function () {
        this.form.startTime = ''
        this.form.endTime = ''
      },
      deep: true
    },
    'form.startTime': {
      handler: function (now) {
        if (this.form.reportType !== 'quarter') {
          this.form.endTime = now
        }
        if (this.form.reportType === 'quarter') {
          this.form.endTime = ''
        }
      },
      deep: true
    },
    params: {
      handler: function (now) {
        this.getList(now)
      },
      deep: true
    }
  }
}
</script>
