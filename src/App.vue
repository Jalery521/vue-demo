<template>
  <div id="app">
    <LeftNavBar></LeftNavBar>
    <div class="right_content">
      <top-menu></top-menu>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import LeftNavBar from './components/leftNavBar/LeftNavBar.vue'
  import TopMenu from './components/topMenu/TopMenu'
  export default {
    name: 'app',
    components: {
      LeftNavBar,
      TopMenu
    },
    
  }
</script>
<style lang="less">
@import 'assets/css/common.less';
  #app {
    height: 100%;
    width: 100%;
    display: flex;
  }
  .right_content {
    flex:1;
  }
</style>
