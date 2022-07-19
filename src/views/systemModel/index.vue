<template>
  <div class="center">
     <div class="report-list">
       <div class="report-hd">
         <div class="search-box">
           <input type="text" placeholder="请输入关键词" v-model="params.sysModelName">
           <i class="daq-web">&#xe81b;</i>
         </div>
         <div>
           <el-select v-model="params.modelType" placeholder="模型类型">
             <el-option label="全部" value="all"></el-option>
             <el-option
               v-for="(item, index) in chartType"
               :key="index"
               :label="item.name"
               :value="item.value"
             ></el-option>
           </el-select>
         </div>
         <!--<div>-->
           <!--<el-select v-model="params.dimensionality" placeholder="对比维度">-->
             <!--<el-option label="全部" value=""></el-option>-->
             <!--<el-option-->
             <!--v-for="(item, index) in reportType"-->
             <!--:key="index"-->
             <!--:label="item.name"-->
             <!--:value="item.value"-->
             <!--&gt;</el-option>-->
           <!--</el-select>-->
         <!--</div>-->
         <div>
           <el-select v-model="params.supportTable" placeholder="是否支持表格">
             <el-option label="全部" value="all"></el-option>
             <el-option label="支持" value="1"></el-option>
             <el-option label="不支持" value="0"></el-option>
           </el-select>
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
           <el-table-column prop="sys_model_name" label="模型名称"></el-table-column>
           <el-table-column prop="charts_type" label="支持图表类型"></el-table-column>
           <el-table-column label="支持表格" width="90">
             <template slot-scope="scope">
                {{ scope.row.support_table ? '支持' : '不支持' }}
             </template>
           </el-table-column>
           <el-table-column prop="create_time" label="创建日期" width="190"></el-table-column>
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

<script>
import Ajax from '../../service/index'
import noData from '../../components/no-data/index'
export default {
  data () {
    return {
      tmpDialog: false,
      list: [],
      reportType: [],
      chartType: [],
      page: {},
      params: {
        dimensionality: '',
        supportTable: '',
        modelType: '',
        sysModelName: '',
        currPage: 1,
        pageSize: 12
      }
    }
  },
  mounted () {
    // 筛选类别
    // this.getDic({ dictType: 'reportType' })
    this.getDic({ dictType: 'chartType' })
    // 列表
    this.getList(this.params)
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if ((rowIndex % 2) !== 0) {
        return 'ow-row'
      }
    },
    getDic (params) {
      Ajax.getReportTypeList(params)
        .then((res) => {
          if (params.dictType === 'reportType') {
            this.reportType = res.datas
          }
          if (params.dictType === 'chartType') {
            this.chartType = res.datas
          }
        })
    },
    getList (params) {
      if (params.modelType === 'all') {
        params.modelType = ''
      }
      if (params.supportTable === 'all') {
        params.supportTable = ''
      }
      Ajax.sysModelList(params)
        .then((res) => {
          this.list = res.datas
          this.page = res.page
        })
    },
    handleCurrentChange (val) {
      this.params.currPage = val
    }
  },
  components: {
    'd-no-data': noData
  },
  watch: {
    params: {
      handler: function (now) {
        this.getList(now)
      },
      deep: true
    }
  }
}
</script>
