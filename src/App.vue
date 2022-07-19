<template>
  <div id="app">
    <!--头部 start-->
    <div class="header">
      <div class="h-top">
        <div class="center">
            <div class="logo">
              <!--<img src="./assets/images/logo.png" alt="旅游大数据分析报告系统">-->
              {{ webTitle }}
            </div>
            <div class="user-info">
              <!--<div class="user-head">-->
                <!--<img src="./assets/images/user-h.png" alt="费脑壳">-->
              <!--</div>-->
              <!--<span>费脑壳</span>-->
              <!--<div class="hanle">-->
                <!--<span>退出</span>-->
              <!--</div>-->
            </div>
        </div>
      </div>
      <div class="nav">
          <div class="center">
            <ul class="nav-list">
              <li  class="nav-item"
                   v-for="(item, index) in navList"
                   :key="index"
                   :class="{curr: item.actived}"
                   @click="jump(item, index)"
              >
                <i class="daq-web" v-html="item.icon"></i>
                {{item.name}}
              </li>
            </ul>
          </div>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
import './assets/reset.css'
import Ajax from './service/index'
export default {
  name: 'APP',
  data () {
    return {
      // 网站标题
      webTitle: '',
      // 菜单列表
      navList: [
        {
          name: '报告列表',
          index: 'home',
          icon: '&#xe718;',
          actived: true
        },
        {
          name: '模板库',
          index: 'modelData',
          icon: '&#xe7fc;',
          actived: false
        },
        {
          name: '系统模型',
          index: 'systemModel',
          icon: '&#xe777;',
          actived: false
        }
      ],
      // 选中获取栏目
      menu: this.$route.query.menu || '',
      regionCode: '510129'
    }
  },
  mounted () {
    this.$router.onReady(() => {
      // 获取region 不走配置
      console.log(this.$route.query)
      if (this.$route.query && this.$route.query.secret) {
        this.navList.length = 1
      }
      if (this.$route.query && this.$route.query.region) {
        window.global_config.BASE_REGION = this.strRegEx(this.$route.query.region) || '510129'
        this.regionCode = window.global_config.BASE_REGION
        this.getTitle()
      } else {
        // window.global_config.BASE_REGION = '510129'
        this.regionCode = window.global_config.BASE_REGION
        this.webTitle = window.global_config.BASE_TITle
        $('title').html(window.global_config.BASE_TITle)
      }
    })
  },
  methods: {
    /**
     * 防止XSS过滤特殊字符
     */
    strRegEx (s) {
      let pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      let rs = ''
      for (let i = 0; i < s.length; i++) {
        rs += s.substr(i, 1).replace(pattern, '')
      }
      return rs
    },
    /**
     * 跳转
     */
    jump (item) {
      this.$router.push({
        name: item.index,
        query: {
          region: this.regionCode
        }
      })
      this.init(item.index)
    },
    /**
     * 获取平台名称
     */
    getTitle () {
      // console.log(window.global_config)
      Ajax.getTitle()
        .then((res) => {
          window.global_config.BASE_TITle = res.data || '文旅大数据分析报告系统'
          this.webTitle = window.global_config.BASE_TITle
          $('title').html(window.global_config.BASE_TITle)
        })
    },
    /**
     * 判断选择
     */
    init (name) {
      this.navList.forEach((item) => {
        if (item.index === name || name.indexOf(item.index) !== -1) {
          item.actived = true
        } else {
          item.actived = false
        }
      })
    }
  },
  watch: {
    '$route' (to) {
      if (to.query.menu) {
        this.init(to.query.menu)
      } else {
        this.init(to.name)
      }
      if (this.$route.path === '/details') {
        document.getElementsByTagName('body')[0].style.cssText = 'overflow-x: auto; min-width: 1366px;'
      } else {
        document.getElementsByTagName('body')[0].style.cssText = ''
      }
    }
  }
}
</script>
<style lang="scss">
  #app{
    background-color: #eff2f7;
    height: 100%;
  }
  .center{
    position: relative;
    box-sizing: border-box;
    margin: 0 20px;
  }
  .header{
    .h-top{
      height: 70px;
      background: url("./assets/images/head_bg.jpg") repeat-x;
      .center{
        display: flex;
        justify-content: space-between;
        height: 100%;
        line-height: 70px;
      }
      .logo{
        color: #fff;
        font-size: 28px;
        font-family: "黑体";
        margin-left: 30px;
        img{
          height: 50px;
          vertical-align: middle;
          margin-left: 30px;
        }
      }
      .user-info{
        display: flex;
        font-size: 16px;
        color: #fff;
        font-weight: bold;
        .user-head{
          margin-right: 10px;
          img{
            height: 45px;
            width: 45px;
            vertical-align: middle;
            border-radius: 45px;
          }
        }
        .hanle{
          position: relative;
          margin-left: 20px;
          padding-left: 20px;
          &:before{
            content: '';
            width: 1px;
            height: 18px;
            position: absolute;
            top: 50%;
            left: 0;
            background-color: #fff;
            margin-top: -9px;
          }
        }
      }
    }
    .nav{
      height: 54px;
      line-height: 54px;
      background-color: #fff;
      border-bottom: 1px solid #e2e2e2;
      transition: all .25s ease 0s;
      .center{
        display: flex;
        height: 100%;
        .nav-list{
          display: flex;
          margin-left: 30px;
        }
        .nav-item{
          height: 55px;
          width: 140px;
          text-align: center;
          font-size: 16px;
          color: #373e4b;
          box-sizing: border-box;
          cursor: pointer;
          &> .daq-web{
            font-size: 18px;
            margin-right: 6px;
          }
          &.curr{
            font-weight: bold;
            color: #229ef4;
            background-color: #eff2f7;
            border: 1px solid #e2e2e2;
            border-bottom: none;
            border-top: none;
          }
        }
      }
    }

  }
</style>
