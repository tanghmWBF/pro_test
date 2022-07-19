<template>
<div class="daq-uploader">
  <ul class="daq-uploader-list">
    <li class="daq-uploader-item daq-uploader-file">
      <div class="pic-wrap">
        <form action="javascript:;" method="post"
                enctype="multipart/form-data" @change="fileImage($event)">
          <input type="file" name="Filedata" class="file" multiple accept="image/*"/>
          <input type="hidden" name="path" value="geekerUI-mobile"/>
        </form>
      </div>
    </li>
  </ul>
  <div class="explain">建议尺寸 400*50</div>
  <div v-if="pic" class="daq-uploader-show">
    <div class="pic-wrap fl">
      <img :src="pic" alt="">
    </div>
    <!--<div class="btn fl">-->
      <!--<span class="submit">保存</span>-->
    <!--</div>-->
  </div>
</div>
</template>
<script>
import axios from 'axios'
import Toast from '../toast/index.js'
export default {
  name: 'daq-uploader',
  props: {},
  data () {
    return {
      pic: ''
    }
  },
  methods: {
    /**
     * [提交form表单]
     */
    fileImage: function (e) {
      let file = e.target.value
      if (!file) {
        return false
      }
      if (!/.(gif|jpg|jpeg|png|GIF|JPG|bmp)$/.test(file)) {
        Toast({
          type: 'error',
          message: '请正确上传图片'
        })
        return false
      }
      let formData = new FormData(e.currentTarget)
      event.preventDefault()
      this.submitForm(formData)
      return false
    },
    /**
     * [ajax请求]
     */
    submitForm (params) {
      let _this = this
      axios.post('http://file.geeker.com.cn/uploadOSS', params)
        .then((data) => {
          _this.pic = data.url
          _this.$emit('getPic', _this.pic)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    /**
     * [删除list指定下标的数据]
     */
    deleteHandler (index) {
      this.list.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.daq-uploader{
  &-list{
    display: flex;
    flex-wrap:wrap;
  }
  &-show{
    display: flex;
    margin: 20px 0;
    .pic-wrap{
      height: 77px;
      width: 400px;
      overflow: hidden;
      border: 1px solid #eee;
      img{
        height: 100%;
        width: 100%;
      }
    }
    .btn {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      span{
        display: inline-block;
        width: 100px;
        height: 40px;
        line-height: 40px;
        color:#fff;
        text-align: center;
        border-radius: 3px;
        cursor: pointer;
        background:#00a2ff;
        transition: all .25s ease 0s;
        margin-left: 16px;
        &:hover{
          background:#0089d7;
        }
      }
    }

  }
  &-item{
    position:relative;
    width:180px;
    height:180px;
    padding:20px 0;
    .pic-wrap{
      width:100%;
      height:100%;
      background:#fafafa;
      overflow:hidden;
    }
    .close{
      position:absolute;
      top:-.25rem;
      right:-.25rem;
      width:.8rem;
      height:.8rem;
      &:after{
        content: '+';
        position:absolute;
        left:50%;
        top:50%;
        width:.3rem;
        height:.3rem;
        margin:-.15rem 0 0 -.15rem;
        background:red;
        color:#fff;
        font-size:.26rem;
        text-align:center;
        line-height:.24rem;
        border-radius:50%;
        transform:rotate(45deg)
      }
    }
    img{
      width:100%;
      height:100%;
    }
  }
  &-file{
    .pic-wrap{
      position:relative;
      border:1px solid #e2e2e2;
      &:after,
      &:before{
        content: '';
        position:absolute;
        background:#b4b4b4;
        left:50%;
        top:50%;
      }
      &:after{
        width:40px;
        height:4px;
        margin:-2px 0 0 -20px;
      }
      &:before{
        height:40px;
        width:4px;
        margin:-20px 0 0 -2px;
      }
      &:hover{
        &:after,
        &:before{
          background:#000;
        }
      }
      &:active{
        background:#e2e2e2;
        &:after,
        &:before{
          background:#00a2ff;
        }
      }
    }
    form{
      position:absolute;
      left:0;
      top:0;
      z-index:1;
      width:100%;
      height:100%;
    }
    .file{
      width:100%;
      height:100%;
      opacity: 0;
    }
  }
  &-disabled{
    form{
      display: none;
    }
    .pic-wrap{
      background:#fafafa;
      &:after,
      &:before{
        background:#e5e5e5;
      }
      .text{
        color:#c8c8c8;
      }
      &:active{
        background:#fafafa;
        &:after,
        &:before{
          background:#e5e5e5;
        }
        .text{
          color:#c8c8c8;
        }
      }
    }
  }
}
</style>
