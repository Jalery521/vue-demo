<template>
  <div class="common">
    <LeftNavBar></LeftNavBar>
    <div class="right_content">
      <top-menu></top-menu>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import LeftNavBar from '../../components/leftNavBar/LeftNavBar.vue'
import TopMenu from '../../components/topMenu/TopMenu'
export default {
  created () { },
  mounted () { },
  components: {
    LeftNavBar,
    TopMenu
  },
  data () {
    return {

    }
  },
  methods: {}
}
</script>
<style scoped lang="less">
.common {
  height: 100%;
  width: 100%;
  display: flex;
}
.right_content {
  flex: 1;
}
</style>