<template>
  <div class="headerBar">
    <div class="title">
      <img src="../assets/logo.png" />
      <span>电子签名系统</span>
    </div>
    <div class="right-menu-container">
      <Menu
        mode="horizontal"
        theme="dark"
        :active-name="node"
        @on-select="changeActiveName"
      >
        <MenuItem name="1" to="/processList">
          <Icon type="ios-paper" />
          流程列表
        </MenuItem>
        <!-- <MenuItem name="2"  to="/index">
                    <Icon type="ios-stats"/>
                    表单设置
                </MenuItem>-->
        <!-- <MenuItem name="3" to="/user">
                    <Icon type="ios-people"/>
                    用户管理
                </MenuItem>
                <MenuItem name="4"  to="/signManage">
                    <Icon type="ios-construct"/>
                    签章管理（测试）
                </MenuItem>
                <MenuItem name="5" to="/audit">
                    <Icon type="ios-paper"/>
                    审批（移动端）
                </MenuItem>-->
      </Menu>
      <div class="user-menu">
        <!--<fullscreen v-model="isFullscreen" style="margin-right: 10px;"/>-->
        <span>{{ user }}</span>
        <Divider type="vertical" />
        <a style="color: aliceblue" @click="goBack()"
          ><span
            class="iconfont icon-tuichu1"
            style="margin-left: 10px; font-size: 16px"
            >退出</span
          ></a
        >
      </div>
    </div>
  </div>
</template>
<script>
// import fullscreen from '_c/fullscreen'
import { getToken } from "../common/js/common";
export default {
  name: "HeaderBar",
  props: ["node"],
  // components:{fullscreen},
  data() {
    return {
      // activeName: localStorage.getItem("defautChosen") || "1",
      isFullscreen: false,
      user: "测试用户",
    };
  },
  watch: {
    node: function (newV, oldV) {
      // alert(newV);
    },
  },
  methods: {
    goBack() {
      this.$Message.info("退出成功");
      localStorage.clear();
      this.$router.push("login");
    },
    changeActiveName(name) {
      // localStorage.setItem("defautChosen", name);
      this.$emit("changeNode", name);
    },
  },
  created() {
    if (getToken && localStorage.getItem("userInfoPC")) {
      this.user = JSON.parse(localStorage.getItem("userInfoPC")).name;
    }
  },
};
</script>
<style scoped lang="scss">
.ivu-menu-horizontal {
  height: 50px;
  line-height: 50px;
}
.headerBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .title {
    display: flex;
    align-items: center;
    > img {
      margin-left: 25px;
      width: 40px;
      height: 40px;
    }
    > span {
      margin: 0 15px;
      font-size: 18px;
      color: white;
    }
  }
  > .right-menu-container {
    display: flex;
    align-items: center;
    > .user-menu {
      color: white;
      display: flex;
      align-items: center;
      margin: 0 15px 0 30px;
    }
  }
}
</style>
