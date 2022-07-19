<!--应用在舆情总览与简报模块-->
<template>
  <div
    :class="className"
    :style="{height: flag ? '380px' : 'auto'}"
    class="box">
    <div
      :class="{'no-border': !isBorder}"
      class="box-hd"
      v-if="flag">
      <h2 class="title">{{ title }}</h2>
      <div class="operation">
        <slot name="operation" />
      </div>
    </div>
    <div class="box-bd" :class="showClass">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'module',
  props: {
    // 标题
    title: String,
    // 是否显示下边框
    isBorder: {
      type: Boolean,
      default: false
    },
    // 添加class
    className: String,
    // 类型
    type: String,
    // 是否显示头部
    flag: Boolean
  },
  data () {
    return {
      dataType: this.$route.query.dataType || ''
    }
  },
  computed: {
    showClass () {
      if (this.type === 'table' || this.type === 'lineUpBar' || this.type === 'compose') {
        return ''
      } else {
        return 'db-300'
      }
      // return this.type === 'table'  ? '' : 'db-300'
      /**
      if (this.dataType === 'REAL') {
        return this.type === 'table' ? '' : 'db-300'
      } else {
        return this.type === 'table' ? 'db-min' : 'db-300'
      }
      **/
    }
  }
}
</script>

<style scoped lang="scss">
.box{
    background:#fff;
    height: 380px;
    &-hd{
      display: flex;
      align-items: center;
      margin:0 30px;
      height: 60px;
      border-bottom:1px solid #dcdcdc;
      &.no-border{
        border:none;
      }
      .title{
        flex:1;
        font-size: 18px;
        line-height: 60px;
        color:#788393;
      }
      .operation{}
      .tab{
      }
      .tab-item{
        display: inline-block;
        height: 30px;
        padding:0 15px;
        line-height: 30px;
        min-width: 45px;
        text-align: center;
        border:1px solid #dee3ed;
        box-sizing: border-box;
        background:#fff;
        margin-left:-1px;
        cursor: pointer;
        transition: all .25s ease 0s;
        &:first-child{
          border-top-left-radius: 3px;
          border-bottom-left-radius: 3px;
        }
        &:last-child{
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;
        }
        &:hover,
        &.on{
          border:1px solid #00a2ff;
          background:#00a2ff;
          color:#fff;
        }
      }
    }
    &-bd{
      position: relative;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 4px;
        height: 6px;
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
  .db-300{
    height: 300px;
  }
  .db-min{
    min-height:300px;
  }
  }
</style>
