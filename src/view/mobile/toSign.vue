<template>
  <div>
    <Loading v-show="showLoading"/>
    <div id="canvasBox" :style="getHorizontalStyle">
      <van-nav-bar
        title="我的签字"
        left-text="返回"
        right-text="我的签字"
        left-arrow
        @click-right="viewMySign"
        @click-left="goBack">
      </van-nav-bar>
      <div class="greet">
       <!-- <a @touchstart="clear" @mousedown="clear">清屏</a>
        <a @touchstart="download" @mousedown="download">下载</a>-->
        <div class="selectStyle">
          <select v-model="degree">
            <option v-for="item in scope" :value="item.value">{{item.title}}</option>
          </select>
        </div>
        <div style=" display: inline-block;float: right;">
        <!--  <van-button style="margin-right: 10px;" @click="download" size="small" type="primary">下载</van-button>-->
          <van-button style="margin-right: 10px;"  @click="clear" size="small" type="warning">清屏</van-button>
          <van-button @click="upload" size="small" type="danger">保存</van-button>
        </div>
      </div>
      <canvas></canvas>
    </div>
  </div>
</template>

<script>
import Draw from '../../utils/draw';
import {getToken} from "../../common/js/common";
import ImagePreview from "vant/es/image-preview/index";
import Toast from "vant/es/toast/index";
export default {
  name: 'toSign',
  data() {
    return {
      showLoading: false,
      userId: getToken(),
      degree: 0, // 屏幕整体旋转的角度, 可取 -90,90,180等值
      scope: [
        {
          value: 0,
          title: '正常',
        },
        {
          value: 90,
          title: '顺时针旋转90°',
        },
        {
          value: 180,
          title: '顺时针旋转180°',
        },
        {
          value: -90,
          title: '逆时针旋转90°',
        },
      ],
    };
  },
  components: {
    Draw,
  },
  mounted() {
    this.canvasBox = document.getElementById('canvasBox');
    this.initCanvas();
  },
  computed: {
    getHorizontalStyle() {
      const d = document;
      const w = window.innerWidth || d.documentElement.clientWidth || d.body.clientWidth;
      const h = window.innerHeight || d.documentElement.clientHeight || d.body.clientHeight;
      let length = (h - w) / 2;
      let width = w;
      let height = h;

      switch (this.degree) {
        case -90:
          length = -length;
        case 90:
          width = h;
          height = w;
          break;
        default:
          length = 0;
      }
      if (this.canvasBox) {
        this.canvasBox.removeChild(document.querySelector('canvas'));
        this.canvasBox.appendChild(document.createElement('canvas'));
        setTimeout(() => {
          this.initCanvas();
        }, 200);
      }
      return {
        transform: `rotate(${this.degree}deg) translate(${length}px,${length}px)`,
        width: `${width}px`,
        height: `${height}px`,
        transformOrigin: 'center center',
      };
    },
  },
  methods: {
      viewMySign(){
          let userInfo = JSON.parse(localStorage.getItem('userInfo'));
          if(!userInfo){
              Toast("会话失效");
          }else if(userInfo.accessSign){
              ImagePreview({
                  images: [userInfo.accessSign],
                  // startPosition: 1,
                  onClose() {
                      // do something
                  }
              });
          }else{
              Toast("没有图片");
          }

      },
    initCanvas() {
      const canvas = document.querySelector('canvas');
      this.draw = new Draw(canvas, -this.degree);
    },
    clear() {
      this.draw.clear();
    },
    download() {
      this.draw.downloadPNGImage(this.draw.getPNGImage());
    },
    goBack() {
        if(this.$route.params.procedureDetailId){
            this.$router.push({
                name: 'toAudit',
                params: {
                    procedureDetailId: this.$route.params.procedureDetailId,
                    pass: this.$route.params.pass,
                    message: this.$route.params.message
                }
            });
        }else{
            this.$router.back();
        }
    },
    upload() {
      if(!this.draw.hasPoint){
          return  this.$Message.info("请绘制签名");
      }
      const image = this.draw.getPNGImage();
      const blob = this.draw.dataURLtoBlob(image);
      let formdataImage = new FormData();
      formdataImage.append('image', blob, 'sign');
      formdataImage.append("userId",this.userId);
      let config = {
          headers:{'Content-Type':'multipart/form-data'}
      };  //添加请求头
      this.showLoading = true;
      this.axios.post('/rxswt/user/uploadSign',formdataImage,config).then(res=>{
          if(res.data.code === 200){
              this.$Message.info(res.data.message);
              let userInfo = JSON.parse(localStorage.getItem('userInfo'));
              userInfo.accessSign = res.data.data;
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              if(this.$route.params.procedureDetailId){
                  this.$router.push({
                      name: 'toAudit',
                      params: {
                          procedureDetailId: this.$route.params.procedureDetailId,
                          pass: this.$route.params.pass,
                          message: this.$route.params.message
                      }
                  });
              }else{
                  this.$router.back();
              }
              this.$nextTick(()=>{
                  this.showLoading = false;
              });
          }
      }).catch(err=>{
          this.showLoading = false;
      })
      /*const url = '';
      const successCallback = (response) => {
        console.log(response);
      };
      const failureCallback = (error) => {
        console.log(error);
      };
      this.draw.upload(blob, url, successCallback, failureCallback);*/
    },
  },
};


</script>

<style>
#canvasBox {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.greet {
  padding: 10px;
  font-size: 12px;
  user-select: none;
}
.greet a {
  cursor: pointer;
}
.greet select {
  font-size: 14px;
}
canvas {
  height: 40%;

 position: relative;
 top:40%;
 transform:translateY(-50%);
  cursor: crosshair;
  border: 1px solid;
  overflow: hidden;
}

.selectStyle {
  display: inline-block;
  width: 120px;
  position: relative;
  vertical-align: middle;
  padding: 0;
  overflow: hidden;
  background-color: #fff;
  color: #555;
  border: 1px solid #aaa;
  text-shadow: none;
  border-radius: 4px;
  transition: box-shadow 0.25s ease;
  z-index: 2;
}

.selectStyle:hover {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.selectStyle:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top-color: #ccc;
  top: 10px;
  right: 5px;
  cursor: pointer;
  z-index: -2;
}
.selectStyle select {
  cursor: pointer;
  padding: 4px;
  width: 100%;
  border: none;
  background: transparent;
  background-image: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.selectStyle select:focus {
  outline: none;
}

</style>
