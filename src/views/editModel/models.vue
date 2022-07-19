<template>
    <div :class="isFixed ? 'topLeftFiex': ''">
      <p class="title sm-title">系统模型</p>
      <div class="search-box">
        <input type="text" placeholder="请输入简报名称" v-model="keywords" @keyup.enter="search" maxlength="18">
        <i class="daq-web" @click="search">&#xe81b;</i>
      </div>
      <div class="model-list model-scorll">
        <ul v-if="modelListTwo.length > 0" class="mb40">
          <li v-for="(item, index) in modelListTwo" :key="index" @dblclick.stop="DoubleClick(item)" @click.stop="item.open ? item.open = false : item.open = true">
            <div :title="item.modelName">
              <i :class="item.child ? 'icon_list' : 'icon'"></i>
              {{item.modelName}}
            </div>
            <ul v-if="item.child" v-show="item.open">
              <li :class="checkId.indexOf(childItem.id) === -1 ? '' : 'disabled'" v-for="(childItem, childIndex) in item.child" :key="childIndex" @dblclick.stop="DoubleClick(childItem, (checkId.indexOf(childItem.id) === -1 ? true : false))" @click.stop="">
                <div :draggable="checkId.indexOf(childItem.id) === -1 ? true : false" :title="childItem.modelName" @dragstart="dragstart(childItem)" @dragend="dragend(childItem)">
                    <i class="icon"></i>
                    {{childItem.modelName}}
                </div>
              </li>
            </ul>
          </li>
        </ul>
        <div class="no-search" v-else>未搜索到相关模型</div>
      </div>
    </div>
</template>

<script>
import Ajax from '../../service/index'
export default {
  name: 'models',
  props: {
    num: Number,
    isFixed: Boolean,
    offset: Object,
    checkId: Array
  },
  data () {
    return {
      keywords: '', // 搜索关键词
      modelListTwo: [], // 搜索重定义
      /**
       * line 折线图
       * pie 饼图
       * table 表格
       * tableDb 复合表格表格
       * bar 正常柱状图
       * lineUpBar 横向柱状图
       * compose 组合模型
       * radar 雷达图
       * mix 混合
       */
      modelList: [
        {
          id: '1',
          modelName: '国内游客量变化',
          open: 'true',
          parentId: 0,
          title: '国内游客量变化',
          child: [
            {
              api: '/rest/inlandTouristAmountAnalyze/touristRegionAndAmount?indexType=1&regionType=0&countType=tableCrosswise',
              checkType: 'tableDb',
              id: 2,
              info: '',
              modelName: '国内游客量变化',
              open: 'true',
              parentId: 1,
              title: '国内游客量变化',
              type: 'tableDb',
              compose: 'tableDb'
            }
          ]
        }
      ]
      /**
       * {
        id: '1',
        modelName: '国内游客量变化',
        open: 'true',
        parentId: 0,
        title: '国内游客量变化',
        child: [
          {
            api: '/rest/inlandTouristAmountAnalyze/touristRegionAndAmount?indexType=1&regionType=0&countType=tableCrosswise',
            checkType: 'compose',
            id: 2,
            info: '',
            modelName: '国内游客量变化',
            open: 'true',
            parentId: 1,
            title: '国内游客量变化',
            type: '',
            compose: 'line,table'
          }
        ]
      }
       */
    }
  },
  created () {
    this.getModelList()
//     this.modelListTwo = this.modelList
  },
  methods: {
    // 双击新增模型
    DoubleClick (item, flag) {
      if (item.child) {
        return void 0
      }
      if (item.child && flag) {
        return void 0
      }
      let pushFlag = true
      for (let i = 0; i < this.$parent.modelCheckList.length; i++) {
        if (item.id === this.$parent.modelCheckList[i].id) {
          pushFlag = false
        }
      }
      if (pushFlag) {
        let checkItem = {
          id: null,
          modeTreeId: item.id,
          title: item.title,
          label: item.modelName,
          info: item.info,
          api: item.api,
          checkType: item.checkType,
          type: item.type,
          compose: item.compose
        }
        this.$emit('add', checkItem)
      }
    },
    // 搜索
    search () {
      let keywords = this.keywords
      if (keywords) {
        this.modelListTwo = this.modelList.filter(function (item) {
          if (item.modelName.indexOf(keywords) !== -1) {
            return item
          }
        })
      } else { this.modelListTwo = this.modelList }
    },
    // 模型获取
    getModelList () {
      Ajax.getSysModelTree({ modelName: this.keywords })
        .then((res) => {
          this.modelList = res.datas
          for (let i = 0; i < this.modelList.length; i++) {
            this.modelList[i].essentials = ''
          }
          this.modelListTwo = this.modelList
        })
    },
    // 拖拽添加
    dragstart (item) {
      this.$emit('dragItem', item)
    },
    dragend (item) {
      let x = event.pageX - this.offset.x
      let y = event.pageY - this.offset.y
      if (x > 0 && x < this.offset.dragW && y > 0) {
        this.DoubleClick(item)
      }
    }
  },
  watch: {
    keywords: function () {
      this.getModelList()
    }
  }
}
</script>
<style lang="scss">
  .model-scorll {
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 110px);
    &::-webkit-scrollbar {
      width: 4px;
      height: 16px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      -webkit-box-shadow: inset 0 0 5px rgba(34,158,244,0.4);
      background: rgba(34,158,244,0.4);
    }
    &::-webkit-scrollbar-track{
      -webkit-box-shadow: inset 0 0 5px rgba(232,245,254,1);
      border-radius: 0;
      background: rgba(232,245,254,1);
    }
  }
</style>
