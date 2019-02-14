<template>
  <div class="user_center">
    <div class="title">
      <span>我的个人资料</span>
    </div>
    <div class="content">
      <div class="avater">
        <div class="left">
          <span>头像</span>
        </div>
        <div class="right"
             style="position: relative;height:200px;">
          <input type="file"
                 style="display:none">
          <img :src="previewSrc"
               alt="">
        </div>
      </div>
      <div class="username">
        <div class="left">
          <span>用户名</span>
        </div>
        <div class="right">
          <input :value="userInfo.username"
                 type="text"
                 style="background-color:#eeeeee"
                 readonly>
          <span>登录用户名不允许修改</span>
        </div>
      </div>
      <div class="slug">
        <div class="left">
          <span>别名</span>
        </div>
        <div class="right">
          <input type="text"
                 v-model="userInfo.slug">
        </div>
      </div>
      <div class="nickname">
        <div class="left">
          <span>昵称</span>
        </div>
        <div class="right">
          <input type="text"
                 v-model="userInfo.nickname">
          <span>限制在2-16个字符</span>
        </div>
      </div>
      <div class="bio">
        <div class="left">
          <span>简介</span>
        </div>
        <div class="right">
          <textarea v-model="userInfo.bio"
                    cols="30"
                    rows="5"></textarea>
        </div>
      </div>
      <div class="handle">
        <button type="button"
                class="btn-default btn-small"
                @click="updateUser">更新</button>
        <button type="button"
                class="btn-small"
                style="margin-left:10px">修改密码</button>
      </div>
    </div>

  </div>
</template>


<script>
import mixin from "../mixin/mixin.js"
import bus from "../../bus/Bus.js"
export default {
  created () {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    if (!this.userInfo.avatar) {
      this.previewSrc = require("../../assets/img/default.png")
    }
  },
  mixins: [mixin],
  mounted () { },
  components: {},
  props: {},
  data () {
    return {
      previewSrc: ''
    }
  },
  computed: {},
  watch: {},
  methods: {
    updateUser () {
      const isOk = this.checkInfo()
      if (isOk) {
        this.axios.file('server/users/updateUser', this.userInfo).then(res => {
          if (res.state === 1) {

            bus.$emit('infoChange', this.userInfo)
            sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          } else {
            alert(res.message)
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="less">
.user_center {
  background-color: #f8f9fb;
  padding: 20px;
  height: 100%;
  > .title {
    > span {
      font-size: 26px;
    }
  }
  .content {
    width: 55%;
    margin: 20px auto;
    > div {
      display: flex;
      width: 100%;
      font-size: 14px;
      margin-bottom: 30px;
      > .left {
        width: 60px;
      }
      > .right {
        color: #666;
        flex: 1;
        > img {
          width: 160px;
          height: 160px;
          display: inline-block;
          border: 1px solid #ccc;
        }
        input,
        textarea {
          width: calc(100% - 8px);
          border-radius: 4px;
          padding-left: 8px;
        }
        input {
          height: 35px;
        }
        textarea {
          resize: none;
        }
      }
    }
  }
}
</style>
