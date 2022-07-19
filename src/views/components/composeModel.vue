<template>
  <module className="hot-analysis mt10" title="来源渠道分析"  :isBorder="true" type="compose">
    <div slot="content" style="height: 100%;width: 100%;">
      <div v-for="(item, cindex) in cdata.compose.split(',')" :key="cindex" class="item-list edit" :class="type ? '' : 'no-border'">
        <span v-if="cdata.compose.split(',').length > 1 && type" class="daq-web delete" @click="deleteHandler(cindex)">&#xe830;</span>
        <component
          :is="item + 'Model'"
          :cdata="cdata"
          :index="index"
          :kye="index"
        >
        </component>
      </div>
    </div>
  </module>
</template>

<style lang="scss" scoped>
  .item-list{
    border: 1px dashed #d0d8e3;
    margin-top: 10px;
    &.edit{
      padding: 30px 10px 0 10px;
    }
    position: relative;
    &:hover{
      border-color: #0da7ff;
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
      z-index: 999;
    }
    &.no-border{
      border: none;
    }
  }
</style>
<script>
import module from './module'
import lineModel from './lineModel'
import barModel from './barModel'
import tableModel from './tableModel'
import textModel from './textModel'
import pieModel from './pieModel'
import radarModel from './radarModel'
import mixModel from './mixModel'
import lineUpBarModel from './lineUpBarModel'
export default {
  name: 'composeModel',
  props: {
    cdata: Object,
    index: Number,
    type: Boolean
  },
  methods: {
    /**
     * 删除子模块
     * @param index
     */
    deleteHandler (index) {
      this.$confirm('是否要删除该模块?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let compose = this.cdata.compose.split(',')
        compose.splice(index, 1)
        this.$parent.$parent.modelCheckList[this.index].compose = compose.toString()
      })
    }
  },
  components: {
    module,
    lineModel,
    barModel,
    tableModel,
    textModel,
    pieModel,
    radarModel,
    mixModel,
    lineUpBarModel
  }
}
</script>
