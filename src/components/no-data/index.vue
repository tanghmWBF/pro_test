<template>
    <div class="no-data">
      <span class="no-data-icon"></span>
      <p class="text">暂无匹配数据……</p>
    </div>
</template>

<script>
export default {
  name: 'no-data'
}
</script>

<style scoped lang="scss">
.no-data{
  height: 550px;
  padding-top:160px;
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
}
</style>
