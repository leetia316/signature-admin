<template>
  <Layout class="main-container">
    <Header :style="{ position: 'fixed', width: '100%', zIndex: 1000 }">
      <header-bar @changeNode="changeNode" :node="clickNode"></header-bar>
    </Header>
    <Content
      :style="{
        height: '100%',
        margin: '75px 7px 0',
        padding: '5px',
        background: '#fff',
        minHeight: '500px',
      }"
    >
      <!--<keep-alive>-->
      <router-view @changeNode="changeNode"></router-view>
      <!--</keep-alive>-->
    </Content>
    <Footer class="footer-banner">
      <p>Copyright © 2018&nbsp; &nbsp;All Rights Reserved.</p>
    </Footer>
  </Layout>
</template>

<script>
import HeaderBar from "_c/HeaderBar";

export default {
  name: "Main",
  components: { HeaderBar },
  data() {
    return {
      clickNode: "1",
    };
  },
  computed: {},

  created() {},

  mounted() {},
  methods: {
    changeNode(node) {
      this.clickNode = node;
    },
  },
};
</script>

<style scoped lang="scss">
.ivu-layout-header {
  padding: 0;
}
.main-container {
  height: 100%;
  width: 100%;
}

.footer-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  height: 30px;
  background: rgba(255, 255, 255, 0);
  p {
    color: #28262b;
    font-size: 13px;
    text-align: center;
  }
}
</style>
