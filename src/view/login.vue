<template>
  <div class="login">
    <!--<img src="../assets/login/login_bg.png" class="login-back-img"/>-->
    <div class="login-container">
      <Spin fix v-if="spinShow">
        <Icon type="ios-loading" size="30" class="demo-spin-icon-load"></Icon>
        <div style="margin-top: 10px">登录中...</div>
      </Spin>
      <p style="margin-bottom: 30px">电子签名系统</p>
      <Form :model="form">
        <FormItem prop="userName">
          <span class="ios-person"></span>
          <AutoComplete
            v-model="form.username"
            @on-search="handleSearch2"
            placeholder="请输入用户名"
          >
            <Option v-for="item in data2" :value="item" :key="item">{{
              item
            }}</Option>
          </AutoComplete>
          <!--<Input v-model="form.username" prefix="ios-person" prefix="md-lock" placeholder="请输入用户名" />-->
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
          />
        </FormItem>
        <FormItem>
          <Button @click="login" type="success" long>登录</Button>
        </FormItem>
      </Form>
    </div>
    <div class="footer-banner">
      <p>Copyright © 2018&nbsp; &nbsp;All Rights Reserved.</p>
    </div>
  </div>
</template>

<script>
import { setToken } from "../common/js/util";
import qs from "qs";
export default {
  name: "login",
  data() {
    return {
      spinShow: false,
      form: {
        username: "",
        password: "",
      },
      userNameRules: {
        type: Array,
        default: () => {
          return [{ required: true, message: "账号不能为空", trigger: "blur" }];
        },
      },
      passwordRules: {
        type: Array,
        default: () => {
          return [{ required: true, message: "密码不能为空", trigger: "blur" }];
        },
      },
      data2: [],
    };
  },
  computed: {
    rules() {
      return {
        username: this.userNameRules,
        password: this.passwordRules,
      };
    },
  },

  created() {
    let that = this;
    document.onkeydown = function (e) {
      let key = window.event.keyCode;
      if (key == 13) {
        that.login();
      }
    };
  },

  mounted() {},

  methods: {
    handleSearch2(value) {
      this.data2 =
        !value || value.indexOf("@") >= 0
          ? []
          : [value + "@petrochina.com.cn", value + "@cnpc.com.cn"];
    },
    login() {
      if (!this.form.username || !this.form.password) {
        return this.$Message.warning("请检查输入");
      }
      /*{
                    name: this.form.username ,
                    passwd: this.form.password
                },*/
      this.spinShow = true;
      this.axios
        .post(
          "/rxswt/user/login?name=" +
            this.form.username +
            "&passwd=" +
            this.form.password /*,{
                    headers: {
                        'Content-Type':'application/json; charset=UTF-8'
                    }
                }*/
        )
        .then((res) => {
          if (res.data.code === 200) {
            let _this = this;
            this.$Message.info("登录成功");
            setToken(res.data.data.id);
            localStorage.setItem("userInfoPC", JSON.stringify(res.data.data));
            _this.$router.push({
              name: "processList",
            });
          } else {
            this.$Message.error("登录失败，请检查用户名密码");
          }
          this.spinShow = false;
        })
        .catch((err) => {
          this.spinShow = false;
          console.log(err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.ivu-spin-fix {
  background-color: rgba(255, 255, 255, 0.65);
}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}

@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.login {
  height: 100vh;
  width: 100vw;
  background: url("../assets/login_bg.png") no-repeat 100% 100%;
  .login-back-img {
    width: 100%;
    height: 100%;
  }
  .login-container {
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 50px 30px;
    /*background: rgba(255, 255, 255, 0.83);*/
    /*background: linear-gradient(to bottom,#5a4ba3 0%,#7b3795 100%);*/
    /*background: linear-gradient(to bottom, #ffae9d 0%, #df776b 100%);*/
    background: linear-gradient(to bottom, #a5cbf3 0%, #69adf5 100%);
    width: 350px;
    min-height: 300px;
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    p {
      font-size: 16px;
    }
  }
  .footer-banner {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    margin: 0 auto;
    height: 30px;
    background: rgba(255, 255, 255, 0);
    p {
      color: white;
      font-size: 13px;
      text-align: center;
    }
  }
}
</style>
