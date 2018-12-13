<template>
  <div id="app" v-cloak>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
}
</script>

<style >
    [v-cloak]{
        display: none;
    }
    html,
    body {
        width: 100%;
        height: 100%;
        /*overflow: hidden;*/
        margin: 0;
        padding: 0;
        background-color: white;
    }
    #app {
        width: 100%;
        height: 100%;
    }

</style>
