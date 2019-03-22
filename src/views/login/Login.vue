<template>
  <div class="login_bg">
    <div class="login_box">
      <div class="user_icon">
        <img :src="iconUrl"
             alt="">
      </div>
      <div class="form_options">
        <input type="text"
               placeholder="用户名"
               @blur="getUserIcon"
               v-model="userName"
               @keyup.enter="checkUser">
        <input type="password"
               placeholder="密码"
               v-model="password"
               @keyup.enter="checkUser">
        <button type="button"
                @click="checkUser"
                class="btn-default">登录</button>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "../../bus/Bus.js"
export default {
  data () {
    return {
      iconUrl: require("../../assets/img/default.png"),
      userName: '',
      password: null,
      startY: 0,
      endY: 0
    }
  },
  methods: {

    getUserIcon () {
      if (!this.userName.trim().length) {
        return
      }
      this.axios.get('account/getUserIcon', { username: this.userName }).then(res => {
        if (res.state !== 1) {
          alert(res.message)
        } else {
          if (res.data) {
            this.iconUrl = res.data
          }
        }
      })
    },
    checkUser () {
      this.axios.post('account/checkUser', { username: this.userName, password: this.password }).then(res => {
        if (res.state === 1) {
          sessionStorage.setItem("token", res.token)
          sessionStorage.setItem('userInfo', JSON.stringify(res.data))
          bus.$emit('infoChange', res.data)
          this.$router.push('/home')
        } else {
          alert(res.message)
        }
      })
    },
  }
}
</script>

<style scoped lang="less">
.login_bg {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #2f4050;
  .login_box {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 30%;
    width: 400px;
    height: 280px;
    background-color: #fff;
    > .user_icon {
      width: 140px;
      height: 140px;
      margin-top: -70px;
      border-radius: 50%;
      background-color: #fff;
      border: 1px solid #ccc;
      margin-left: 130px;
      > img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        margin: 10px;
      }
    }
    > .form_options {
      margin-top: 30px;
      padding: 0 40px;
      > input {
        border: 1px solid #ccc;
        height: 35px;
        display: block;
        border-radius: 4px;
        text-indent: 10px;
        width: 100%;
        font-size: 12px;
        margin-bottom: 20px;
      }
      > button {
        color: #fff;
        height: 35px;
        line-height: 35px;
        text-align: center;
        width: 100%;
        cursor: pointer;
      }
    }
  }
}
</style>
