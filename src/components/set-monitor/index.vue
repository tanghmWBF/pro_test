<!--应用在舆情总览无方案时、舆情列表无方案时、舆情简报-模板库无模版、舆情简报-简报列表无列表-->
<template>
    <div class="set-monitor">
      <span class="set-monitor-icon"></span>
      <p class="text">您还未{{ title }}，暂无数据！</p>
      <span class="button" @click="jump" v-if="path">{{ title }}</span>
    </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    title: {
      type: String,
      default: '设置监测方案'
    },
    path: {
      type: String
    },
    query: Object
  },
  methods: {
    jump () {
      this.$router.push({
        path: this.path,
        query: this.query
      })
    }
  }
}
</script>

<style scoped lang="scss">
.set-monitor{
  height: 550px;
  margin-top:25px;
  padding-top:140px;
  text-align: center;
  background: #fff;
  box-sizing: border-box;
  &-icon{
    display: inline-block;
    width: 260px;
    height: 230px;
    background: url("../../assets/images/no-data.png") no-repeat;
  }
  .text{
    padding:30px 0 25px 0;
    line-height: 1;
    font-size:16px;
  }
  .button{
    display: inline-block;
    width: 162px;
    height: 45px;
    cursor: pointer;
    line-height: 45px;
    text-align: center;
    font-size:14px;
    color:#fff;
    text-decoration: none;
    border-radius: 5px;
    background:#00a2ff;
    &:hover{
      background:#039bf2;
    }
  }
}
</style>
