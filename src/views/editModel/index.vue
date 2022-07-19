<template>
  <div class="center">
     <div class="editModel">
       <Models :isFixed="flag" :num="modelCheckList.length" @add="addHandler" :checkId="checkId" :offset="dragBox"></Models>
       <div :class="flag ? 'topLeftFiex ml300' : ''" ref="dragBox">
         <p class="title sm-title">已选模型</p>
         <el-tree
           draggable
           :allow-drop="allowDrop"
           class="model-scorll filter-tree"
           :class="modelCheckList.length ? '' : 'no-tree'"
           :data = "modelCheckList"
           default-expand-all
           empty-text="双击或拖拽左侧系统模型
添加至此区域"
         >
          <template slot-scope="{node}">
            <span class="el-tree-node__label" :title="node.label">{{node.label}}</span>
          </template>
         </el-tree>
       </div>
       <div class="report-show">
         <p class="title">模版内容预览</p>
         <div class="notes">
           <p>注： 1. 在指标描述中含有同比分析的指标项时，如果所选时间段跨年，默认为最近一年内的时间段作为同比区间。</p>
           <p style="text-indent: 32px;">2. 如选择报告周期为2018年1月至2019年12月，在报告中对比体现为2019年同比2018年。</p>
         </div>
         <div class="template-name">
           <el-input placeholder="请输入模版名称" v-model="postData.templateName" maxlength="20"></el-input>
         </div>
         <div class="switch-outline">
           <div>是否开启纲目：</div>
           <div class="switch-box">
             <div class="bg_con">
               <input id="checked_1" type="checkbox" class="switch" v-model="comFlag" @click="compendiumClick()"/>
               <label for="checked_1"></label>
             </div>
           </div>
         </div>
         <div class="compendium" v-show="postData.compendium == 1">
           <p class="compendium-title">提纲</p>
           <ul>
             <li v-for="(item, index) in modelCheckList" :key="index"><span>{{index + 1}}.</span>{{item.title}}</li>
           </ul>
         </div>
         <!--模块展示-->
         <showUseModels v-if="modelCheckList.length>0" :list="modelCheckList" :type="true" :handlerType="handlerType"></showUseModels>
         <noTemplate v-else title="选择系统模板"></noTemplate>
       </div>
     </div>
    <div class="btn-box">
      <p>
        <el-button type="primary" @click="saveTmp()">保 存</el-button>
      </p>
      <p>
        <el-button type="info" @click="back()">返 回</el-button>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
  .compendium{
    position: relative;
    margin-bottom: 20px;
    padding:20px;
    border:1px dashed #d0d8e3;
    border-radius: 6px;
    box-sizing: border-box;
    transition: all .25s ease 0s;
    color: #373e4b;
    font-size: 14px;
    line-height: 32px;
    .compendium-title{
      font-size: 18px;
      line-height: 46px;
    }
    li{
      text-indent:20px;
      span{
        margin-right: 10px;
      }
    }
  }
  .center{
    position: relative;
  }
  .editModel{
    margin-top: 20px;
    position: relative;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: stretch;
    justify-content: flex-end;
    .topLeftFiex{
      position: fixed;
      top: 0;
      z-index: 999;
      bottom: 0;
      left: 20px;
    }
    .ml300 {
      margin-left: 290px;
    }
    & > div{
      background-color: #fff;
      padding: 25px 0;
      border-radius: 6px;
      &:first-child{
        margin-right: 10px;
        width: 280px;
        box-sizing: border-box;
      }
      &:nth-child(2){
        width: 240px;
        border-right: 1px solid #e2e2e2;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        box-sizing: border-box;
      }
      &:last-child{
        padding: 25px;
        width: calc(100% - 680px);
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        margin-right: 100px;
        min-height: 1200px;
      }
    }
    .title{
      color: #1d242f;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .sm-title{
      padding: 0 25px;
    }
    .notes{
      color: red;
      margin-bottom: 20px;
    }
    .search-box{
      position: relative;
      height: 36px;
      margin-bottom: 20px;
      box-sizing: border-box;
      padding: 0 25px;
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
        right: 35px;
        font-size: 20px;
        line-height: 36px;
        font-weight: bold;
        color: #d2d8e3;
      }
    }
    .model-list{
      padding: 0 25px;
      user-select:none;
      ul{
        width: 100%;
        li{
          /*height: 36px;*/
          line-height: 36px;
          color: #373e4b;
          font-size: 14px;
          position: relative;
          margin: 4px 0;
          overflow: hidden;
          &>div{
            margin-left: 12px;
            cursor: pointer;
            height: 34px;
            margin-top: 1px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 10px;
            box-sizing: border-box;
            &:hover{
              border: 1px solid #e2e2e2;
              border-radius: 6px;
              background-color: #f6f9ff;
            }
          }
          &.disabled{
            color: #b1acac;
            &>div{
              background-color: #eee;
              border: 1px solid #e2e2e2;
              border-radius: 6px;
              &:hover{
                background-color: #eee;
              }
            }
          }
          .icon{
            display: inline-block;
            vertical-align: middle;
            height: 16px;
            width: 16px;
            background: url("../../assets/images/model-icon.png") no-repeat;
            margin:0 3px 0 10px;
          }
          .icon_list {
            display: inline-block;
            vertical-align: middle;
            height: 16px;
            width: 16px;
            background: url("../../assets/images/model-icon-list.png") no-repeat;
            margin:0 3px 0 10px;
          }
          &:before{
            content: "";
            height: 100%;
            width: 1px;
            border-left: 1px dashed #e2e2e2;
            position: absolute;
            left: 0;
            top: 0;
          }
          &:after{
            content: "";
            height: 1px;
            width: 10px;
            border-top: 1px dashed #e2e2e2;
            position: absolute;
            left: 2px;
            top: 18px;
          }
          &:first-child:before{
            top: 18px;
          }
          &:last-child:before{
            height: 36px;
            top: -18px;
          }
        }
        ul{
         padding-left: 30px;
          box-sizing: border-box;
          li{
            &:first-child:before{
              top: 0;
            }
          }
        }
      }
      .no-search{
        color: red;
      }
    }
    .el-tree{
      color: #229ef4;
      .el-tree-node__content{
        height: 34px;
        border: 1px dashed #229ef4;
        background-color: #e8f5fe;
        border-radius: 6px;
        margin-bottom: 10px;
        box-sizing: border-box;
        position: relative;
        .el-tree-node__label{
          margin-left: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-right: 10px;
        }
        &:before{
          content: '';
          height: 16px;
          width: 16px;
          background: url("../../assets/images/model-icon.png") no-repeat;
          position: absolute;
          left: 10px;
          top: 9px;
        }
      }
    }
  }
  .template-name{
    margin-bottom: 20px;
  }
  .btn-box{
    position: fixed;
    bottom: 60px;
    width: 80px;
    right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p{
      margin-bottom: 10px;
    }
  }
  .filter-tree{
    height: calc(100% - 53px) !important;
    padding: 0 25px 40px;
    box-sizing: border-box;
  }
  .no-tree{
    border: 1px dashed #d2d8e3;
    background-color: #eff2f7;
    margin: 0 25px;
    padding: 0;
    .el-tree__empty-block{
      span{
        &:before{
          content: '';
          height: 28px;
          width: 28px;
          position: absolute;
          top: -35px;
          left: calc(50% - 14px);
          background: url("../../assets/images/no-tree.png") no-repeat;
          background-size: 100% 100%;
        }
        width: 165px;
      }
    }
  }
  .el-tree__drop-indicator{
    display: none;
  }
  .mb40{
    margin-bottom: 40px;
  }
  .switch-outline{
    display: flex;
    color: #333;
    margin-bottom: 20px;
    &>div:first-child{
      margin-right: 10px;
    }
  }
  .switch-box{
    width:42px;
  }
  .switch-box .switch{
    display:none;
  }
  .switch-box label{
    position:relative;
    display: block;
    padding: 1px;
    border-radius: 18px;
    height: 16px;
    background-color: #eee;
    box-sizing: border-box;
    cursor: pointer;
    vertical-align: top;
    -webkit-user-select: none;
  }
  .switch-box label:before{
    content: '';
    display: block;
    border-radius: 18px;
    height: 16px;
    background-color: #efefef;
    -webkit-transform: scale(1, 1);
    -webkit-transition: all 0.3s ease;
  }
  .switch-box label:after{
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -7px;
    margin-left: -5px;
    width: 16px;
    height: 16px;
    border-radius: 16px;
    background-color: #229ef4;
    box-shadow: 1px 1px 1px 1px rgba(0,0,0,0.08);
    -webkit-transform: translateX(-12px);
    -webkit-transition: all 0.3s ease;
  }
  .switch-box .switch:checked + label:after{
    -webkit-transform: translateX(8px);
  }
  .switch-box .switch:checked + label:before{
    background-color: #e8f5fe;
  }
</style>
<script>
import Ajax from '../../service/index'
import Models from './models'
import showUseModels from './show-use-models'
import noTemplate from '../../components/set-monitor/index'
import Toast from '../../components/toast/index'
export default {
  data () {
    return {
      modelCheckList: [], // 选中模型
      checkId: [],
      modelProps: {
        children: 'children',
        label: 'label'
      },
      // 测试
      type: 1,
      handlerType: 'create',
      flag: false,
      isSave: false,
      comFlag: false,
      postData: {
        templateName: '',
        templateCode: this.$route.query.code || '',
        id: this.$route.query.id || '',
        list: [],
        compendium: '0'
      },
      dragBox: {}
    }
  },
  created () {
    if (this.postData.templateCode.length) {
      this.getModel()
    }
  },
  mounted () {
    this.scrollHander()
    // 获取放置box
    let dragEle = this.$refs.dragBox
    this.dragBox = {
      x: this.getElemPos(dragEle).x,
      y: this.getElemPos(dragEle).y,
      dragW: dragEle.offsetWidth,
      dragH: dragEle.offsetHeight
    }
  },
  methods: {
    // 添加模型
    addHandler (item) {
      item.essentials = ''
      this.modelCheckList.push(item)
    },
    // 纲目开启关闭
    compendiumClick () {
      this.comFlag ? this.postData.compendium = 0 : this.postData.compendium = 1
    },
    // 拖拽添加模型
    dragItem (item) {
      return item
    },
    // 编辑模版获取数据
    getModel () {
      Ajax.getTemplateLibDetail({ templateCode: this.postData.templateCode })
        .then((res) => {
          this.postData.compendium =  res.data.compendium || '0'
          this.comFlag = res.data.compendium == 1 ? true : false
          this.postData.templateCode = res.data.templateCode
          this.postData.list = res.data.list
          console.log(this.postData.list)
          this.postData.templateName = res.data.templateName
          this.modelCheckList = this.postData.list
          this.$store.dispatch('common/GET_LIST', { data: this.modelCheckList })
        })
    },
    // 保存模版
    saveTmp () {
      if (!this.postData.templateName.length) {
        Toast({
          message: '请输入模版名称'
        })
        return false
      }
      this.postData.list = this.modelCheckList
      if (!this.postData.list.length) {
        Toast({
          message: '至少选择一个模型哦'
        })
        return false
      }
      Ajax.saveOrUpdateTemplateLib(this.postData)
        .then((res) => {
          Toast({
            type: 'sucess',
            message: '保存成功',
            callback: () => {
              this.isSave = true
              this.jump({ path: 'modelData' })
            }
          })
        })
    },
    // 拖拽位置
    allowDrop (draggingNode, dropNode, type) {
      if (draggingNode.data.aboveId === dropNode.data.aboveId) {
        return type === 'prev' || type === 'next'
      } else {
        return type === 'prev' || type === 'next' || type === 'inner'
      }
    },
    // 获取ele坐标
    getElemPos (obj) {
      let pos = { top: 0, left: 0 }
      if (obj.offsetParent) {
        while (obj.offsetParent) {
          pos.top += obj.offsetTop
          pos.left += obj.offsetLeft
          obj = obj.offsetParent
        }
      } else if (obj.x) {
        pos.left += obj.x
      } else if (obj.x) {
        pos.top += obj.y
      }
      return { x: pos.left, y: pos.top }
    },
    /**
     * 滚动事件
     */
    scrollHander () {
      let _this = this
      $(document).scroll(function () {
        if ($(document).scrollTop() > 146) {
          _this.flag = true
        } else {
          _this.flag = false
        }
      })
    },
    back () {
      this.jump({ path: '/modelData' })
    },
    /**
     * 跳转
     */
    jump (item) {
      console.log(window.global_config.BASE_REGION)
      this.$router.push({
        path: item.path,
        query: {...item.query, ...{ region: window.global_config.BASE_REGION }}
      })
    }
  },
  components: {
    showUseModels,
    Models,
    noTemplate
  },
  watch: {
    modelCheckList: {
      handler: function (now) {
        this.checkId = []
        now.forEach((item) => {
          this.checkId.push(item.modeTreeId.toString())
        })
        this.$store.dispatch('common/GET_LIST', { data: now })
      },
      deep: true
    }
  }
}
</script>
