<template>
  <div class="top_bar">
    <div class="left">
      <a @click="menuShow=!menuShow"><i class="fa fa-reorder"></i></a>
      <ul class="sub_menu"
          v-show="menuShow">
        <li><a>菜单一</a></li>
        <li><a>菜单二</a></li>
        <li><a>菜单三</a></li>
      </ul>
    </div>
    <div class="right">
      <router-link to="/userCenter"><i class="fa fa-user"></i>个人中心</router-link>
      <a @click="logOut"><i class="fa fa-sign-out"></i>退出</a>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuShow: false
    }
  },

  methods: {
    logOut () {
      sessionStorage.removeItem('userInfo')
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="less">
.top_bar {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eeeeee;
  a:hover {
    background-color: #eeeeee;
  }
  > .left {
    margin-left: 20px;
    > a {
      font-size: 16px;
      line-height: 34px;
      margin: 8px;
      width: 34px;
      text-align: center;
      display: block;
      color: #000;
    }
    .sub_menu {
      background-color: #fff;
      z-index: 10;
      a {
        color: #000;
        height: 30px;
        width: 100%;
        line-height: 30px;
      }
    }
  }
  > .right {
    flex: 1;
    text-align: right;
    > a {
      line-height: 30px;
      font-size: 14px;
      display: inline-block;
      padding: 10px 20px;
      color: #000;
    }
  }
}
</style>
} =
