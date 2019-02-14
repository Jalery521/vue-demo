<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang="less">
@import "assets/css/common.less";
#app {
  width: 100%;
  height: 100%;
}
</style>
