<template>
    <div>
      <div
        class="report-preview-wrapper"
        v-for="(item, index) in list"
        :key="index"
        :class="type ? '' : 'disabled-wrapper'"
      >
        <div class="report-preview-hd">
          <div class="title">
            <input v-if="type" type="text" placeholder="请输入标题" v-model="item.title" maxlength="20">
            <p class="detail-p" v-else>{{index + 1}}、{{item.title}}</p>
          </div>
          <span v-if="type" class="daq-web delete" @click="deleteHandler(index)">&#xe830;</span>
          <div class="type-box" v-if="item.type.length > 1 && type">
            <span>{{ typeObj[item.checkType].name }}<span class="web-iconfont">&#xe665;</span></span>
            <ul>
              <li v-for="(typeName, i) in item.type.split(',')" :key="i" class="checkBtn">
                <el-button size="medium" @click="clickCheck(index, typeName)" plain :type="typeName === item.checkType ? 'primary' : ''">
                  <span class="web-iconfont" v-html="typeObj[typeName].icon"></span>{{ typeObj[typeName].name }}
                </el-button>
              </li>
            </ul>
          </div>
        </div>
        <div class="report-preview-bd" :style="type ? '' : 'padding-top: 0px;'">
          <div class="textarea-wrap" v-if="type">
            <textarea placeholder="请输入描述信息" v-model="item.info" maxlength="100"></textarea>
          </div>
          <p class="detail-p detail-p2" v-else>{{item.info}}</p>
          <div class="textarea-wrap disabledText" v-if="item.essentials&&type">
            {{item.essentials}}
          </div>
          <p class="detail-p detail-p2" v-else-if="item.essentials">{{item.essentials}}</p>
          <component
            :is="item.checkType + 'Model'"
            :cdata="item"
            :index="index"
            :type = "type"
            :key = "index"
          >
          </component>
        </div>
      </div>
    </div>
</template>

<style lang="scss" scoped>
  .report-preview{
    &-wrapper{
      position: relative;
      margin-bottom: 20px;
      padding:20px;
      border:1px dashed #d0d8e3;
      border-radius: 6px;
      box-sizing: border-box;
      transition: all .25s ease 0s;
      color: #373e4b;
      // 文本模块
      &.text-model{
        .title{
          display: none;
        }
        .report-preview-bd{
          padding:0;
        }
        .textarea-wrap{
          border:none;
          padding:0;
          height: 80px;
          width: 100%;
          overflow: hidden;
        }
      }
      &:hover{
        border-color:#0da7ff;
        z-index: 99;
      }
      &.disabled-wrapper{
        border: none;
        .detail-p{
          text-indent: 2em;
          margin: 4px 0;
          font-size: 32px;
        }
        .detail-p2{
          font-size: 22px;
        }
      }
    }
    &-hd{
      display: flex;
      .title{
        line-height: 32px;
        flex:1;
        input{
          height: 100%;
          width: 460px;
          padding:0 10px;
          font-size: 14px;
          border:1px solid #d2d8e3;
          font-weight: normal;
        }
        p{
          color: #373e4b;
          font-weight: bold;
          font-size: 16px;
          border-top: 1px solid #999;
          box-sizing: border-box;
          padding-top: 20px;
        }
      }
      .operation{
        position: absolute;
        right: 0;
        top:0;
        z-index:1;
      }
      >span{
        width: 36px;
        height: 36px;
        display: inline-block;
        cursor: pointer;
        text-align: center;
        line-height: 36px;
        background:#eff2f7;
        color:#8490a0;
        transition: all .25s ease 0s;
        &:hover{
          background:#00a2ff;
          color:#fff;
        }
      }
      .delete{
        position: absolute;
        top: 0;
        right: 0;
      }
      .type-box{
        position: absolute;
        right: 42px;
        top: 0;
        z-index: 30;
        color: #8490a0;
        .el-button{
          color: #8490a0;
        }
        .el-button--primary.is-plain, .el-button--primary.is-plain{
          color: #409eff;
        }
        .el-button--primary.is-plain:focus, .el-button--primary.is-plain:hover {
          background: #ecf5ff;
          border-color: #b3d8ff;
        }
        >span{
          display: block;
          text-align: center;
          background: #eff2f7;
          box-sizing: border-box;
          line-height: 36px;
          padding: 0 10px;
          cursor: pointer;
          &:hover{
            background:#00a2ff;
            color:#fff;
            ul{
              display: block;
            }
          }
        }
        ul{
          position: absolute;
          top: 36px;
          right: 0;
          display: none;
          padding: 10px 10px;
          background: #eff2f7;
          z-index: 99;
          li{
            margin: 6px 0;
          }
        }
        &:hover{
          ul{
            display: block;
          }
        }
        .web-iconfont{
          font-size: 14px;
          margin: 0 3px;
        }
      }
    }
    &-bd{
      position: relative;
      padding-top:10px;
      .textarea-wrap{
        width: 100%;
        height: 60px;
        padding:5px 10px;
        border:1px solid #d5d8e1;
        box-sizing: border-box;
        &.disabledText{
          height: auto;
          border: none;
          padding: 0 10px;
          margin: 6px 0;
        }
        &.noborder {
          border: none;
        }
        textarea{
          width: 100%;
          height: 100%;
          border:none;
        }
      }
      .edit{
        position: absolute;
        right: 0;
        top:90px;
        z-index:10;
        width: 95px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        border:1px solid #d2d8e3;
        background:#eff2f7;
        color:#8590a0;
        border-radius: 3px;
        cursor: pointer;
        transition: all .25s ease 0s;
        &:hover{
          color:#fff;
          background:#00a2ff;
        }
      }
    }
  }
  .mb20{
    margin-bottom: 20px;
  }
</style>
<script>
import lineModel from '../components/lineModel'
import barModel from '../components/barModel'
import tableModel from '../components/tableModel'
import tableDbModel from '../components/tableDbModel'
import textModel from '../components/textModel'
import pieModel from '../components/pieModel'
import radarModel from '../components/radarModel'
import mixModel from '../components/mixModel'
import lineUpBarModel from '../components/lineUpBarModel'
import composeModel from '../components/composeModel'
import { mapState } from 'vuex'
export default {
  name: 'show-use-models',
  props: {
    // 模块列表
    // list: Array,
    // 选择类型
    handlerType: String,
    type: Boolean
  },
  data () {
    return {
      modelType: '',
      typeObj: {
        line: {
          name: '折线图',
          icon: '&#xe6f4;',
          type: 'line'
        },
        pie: {
          name: '饼状图',
          icon: '&#xe6f0;',
          type: 'pie'
        },
        bar: {
          name: '柱状图',
          icon: '&#xe6f5;',
          type: 'bar'
        },
        table: {
          name: '表格',
          icon: '&#xe6f5;',
          type: 'table'
        },
        tableDb: {
          name: '复合表格',
          icon: '&#xe6f5;',
          type: 'tableDb'
        },
        text: {
          name: '文本框',
          icon: '&#xe65f;',
          type: 'text'
        },
        map: {
          name: '地图',
          icon: '&#xe6f6;',
          type: 'map'
        },
        radar: {
          name: '雷达图',
          icon: '&#xe6f7;',
          type: 'radar'
        },
        mix: {
          name: '混合图',
          icon: '&#xe6f4;',
          type: 'mix'
        },
        lineUpBar: {
          name: '横排柱状图',
          icon: '&#xe6f5;',
          type: 'lineUpBar'
        },
        compose: {
          name: '混合图',
          icon: '&#xe6f5;',
          type: 'compose'
        }
      }
    }
  },
  computed: mapState({
    // 获取vuex存储东西
    list: state => state.common.list
  }),
  methods: {
    /**
     * 删除简报模块
     * @param index
     */
    deleteHandler (index) {
      this.$confirm('是否要删除该模型?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$parent.modelCheckList.splice(index, 1)
      })
    },
    /**
     * 点击切换类型
     */
    clickCheck (index, type) {
      this.$parent.modelCheckList[index].checkType = type
    }
  },
  components: {
    lineModel,
    barModel,
    tableModel,
    tableDbModel,
    textModel,
    pieModel,
    radarModel,
    mixModel,
    lineUpBarModel,
    composeModel
  }
}
</script>
