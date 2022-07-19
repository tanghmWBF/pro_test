<template>
  <div class="center">
     <div class="report-list">
       <div class="report-hd">
         <div class="search-box">
           <input type="text" placeholder="请输入模版名称" v-model="params.name">
           <i class="daq-web">&#xe81b;</i>
         </div>
         <div class="new-mb">
           <el-button type="primary" @click="jump({path: 'editModel',query: {menu: 'modelData'}})"><i class="daq-web">&#xe69f;</i>创建模版</el-button>
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
           <el-table-column prop="template_name" label="模版名称"></el-table-column>
           <el-table-column prop="create_time" label="创建日期" width="190"></el-table-column>
           <el-table-column label="操作" width="240">
             <template slot-scope="scope">
               <el-button type="text" size="small" class="small-btn" @click="jump({path: 'details',query: {id: scope.row.id, code: scope.row.template_code, menu: 'modelData'}})"><i class="daq-web icon-small">&#xe650;</i>预览</el-button>
               <el-button type="text" size="small" class="small-btn" @click="jump({path: 'editModel',query: {id: scope.row.id, code: scope.row.template_code, menu: 'modelData'}})"><i class="daq-web icon-small">&#xe668;</i>编辑</el-button>
               <!--<el-button type="text" size="small"><i class="daq-web icon-small">&#xe615;</i>复制</el-button>-->
               <el-button type="text" size="small" class="small-btn" @click="delTmp(scope.row.template_code)"><i class="daq-web icon-small">&#xe631;</i>删除</el-button>
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
import Toast from '../../components/toast/index'
export default {
  data () {
    return {
      list: [],
      params: {
        name: '',
        currPage: 1,
        pageSize: 12
      },
      page: {}
    }
  },
  mounted () {
    this.getList(this.params)
  },
  methods: {
    tableRowClassName ({ row, rowIndex }) {
      if ((rowIndex % 2) !== 0) {
        return 'ow-row'
      }
    },
    getList (params) {
      Ajax.templateLib(params)
        .then((res) => {
          this.list = res.datas
          this.page = res.page
        })
    },
    handleCurrentChange (val) {
      this.params.currPage = val
    },
    jump (item) {
      this.$router.push({
        path: item.path,
        query: Object.assign(item.query, { region: window.global_config.BASE_REGION })
      })
    },
    // 删除模版
    delTmp (code) {
      this.$confirm('是否要删除该模版?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        Ajax.deleteModel({ templateCode: code })
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
