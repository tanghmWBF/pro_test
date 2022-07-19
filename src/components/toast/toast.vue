<template>
  <transition enter-active-class="animation-fade-in" leave-active-class="animation-fade-out">
  <div class="daq-toast" v-if="show">
    <div class="daq-toast-mask"></div>
    <div class="daq-toast-wrap" :class="icon.className">
      <span class="icon daq-web" v-if="icon.html" v-html="icon.html"></span>
      <span class="text" v-if="icon.title">{{icon.title}}</span>
    </div>
  </div>
  </transition>
</template>
<script>
export default {
  name: 'daq-toast',
  props: {
    show: Boolean,
    type: {
      type: String,
      default: 'html',
      validator: (value) => {
        return ['html', 'loading', 'sucess', 'error'].indexOf(value) !== -1
      }
    },
    message: String
  },
  computed: {
    icon () {
      let html = ''
      let title = ''
      let className = ''
      switch (this.type) {
        case 'loading':
          html = '&#xe62c;'
          title = this.message || '数据加载中'
          className = 'loading'
          break
        case 'html':
          html = ''
          title = this.message
          className = ''
          break
        case 'sucess':
          html = '&#xe61e;'
          title = this.message
          className = 'sucess'
          break
        case 'error':
          html = '&#xe622;'
          title = this.message
          className = 'error'
          break
      }
      return {
        html: html,
        title: title,
        className: className
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .daq-toast{
    position:fixed;
    left:0;
    right:0;
    bottom:0;
    top:0;
    z-index:1000000;
    display:flex;
    justify-content:center;
    align-items:center;
    &-mask{
      position:absolute;
      left:0;
      right:0;
      bottom:0;
      top:0;
      z-index:1;
    }
    &-wrap{
      position:relative;
      z-index:2;
      padding:10px;
      min-width:120px;
      text-align:center;
      background:rgba(0,0,0,.7);
      border-radius:5px;
      color:#fff;
      overflow:hidden;
    }
    .text{
      display:block;
      font-size:14px;
    }
    .daq-web{
      display:inline-block;
      width:50px;
      height:50px;
      line-height:50px;
      text-align: center;
      border-radius:50%;
      font-size:35px;
    }
    .loading,
    .sucess,
    .error{
      padding:20px 0;
    }
    .loading{
      .daq-web{
        animation: rotate linear 3s infinite
      }
      @keyframes rotate {
        0% {
            transform:rotate(0deg)
        }

        to {
            transform:rotate(720deg)
        }
      }
    }

  }
</style>
