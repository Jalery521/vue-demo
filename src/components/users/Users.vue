<template>
  <div class="users">
    <div class="title">
      <span>用户</span>
    </div>
    <div class="content">
      <div class="left"
           v-if="userType">
        <p v-show="!isEdit">添加新用户(*号项为必填项)</p>
        <p v-show="isEdit">编辑用户信息(*号项为必填项)</p>
        <div class="add_new">
          <label for="userInfo_name">用户名 *</label>
          <input type="text"
                 id="userInfo_name"
                 placeholder="用户名"
                 v-model="userInfo.username">
          <label for="userInfo_img">用户头像 </label>
          <input type="file"
                 name="userInfo_avatar"
                 id="userInfo_img"
                 @change="getAvatar">
          <img :src="previewImg"
               style="width:200px;height:auto;margin-top:10px"
               alt="">
          <label for="userInfo_slug">别名 *</label>
          <input type="text"
                 id="userInfo_slug"
                 placeholder="slug"
                 v-model="userInfo.slug">
          <label for="userInfo_nickname">昵称 *</label>
          <input type="text"
                 id="userInfo_nickname"
                 placeholder="昵称"
                 v-model="userInfo.nickname">
          <label for="userInfo_password">密码 *</label>
          <input type="password"
                 id="userInfo_password"
                 placeholder="密码"
                 v-model="userInfo.password">
          <label for="userInfo_bio">个性签名</label>
          <textarea name="userInfo_bio"
                    id="userInfo_bio"
                    cols="54"
                    rows="3"
                    v-model="userInfo.bio"
                    style="resize:none;border-radius:4px;border:1px solid #ccc">
                 </textarea>
          <button v-show="!isEdit"
                  type="button"
                  class="btn-small btn-default"
                  @click="addUser">添加</button>
          <button v-show="isEdit"
                  type="button"
                  class="btn-small btn-default"
                  @click="updateUser(getUsers)">保存</button>
          <button v-show="isEdit"
                  class="btn-warning btn-small"
                  type="button"
                  style="margin-left:10px"
                  @click="cancelEdit">取消</button>
        </div>
      </div>
      <div class="right">
        <table>
          <thead>
            <tr>
              <th width="150px"
                  v-if="userType"><input type="checkbox">&nbsp;全选/全不选</th>
              <th width="200px">头像</th>
              <th>用户名</th>
              <th>超级管理员</th>
              <th>别名</th>
              <th>昵称</th>
              <th>状态</th>
              <th v-if="userType">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in userList"
                :key="item.id">
              <td width="150px"
                  v-if="userType"><input type="checkbox"
                       :value="item.id"></td>
              <td width="150px"><img style="width:100px;height:100px;"
                     :src="item.avatar"
                     alt=""></td>
              <td>{{item.username}}</td>
              <td v-if="item.isroot==='yes'">是</td>
              <td v-else>否</td>
              <td>{{item.slug}}</td>
              <td>{{item.nickname}}</td>
              <td>{{item.status | stateFilter}}</td>
              <td v-if="userType"><button type="button"
                        class="btn-default btn-small"
                        @click="editUser(item)">编辑</button><button type="button"
                        class="btn-danger btn-small"
                        style="margin-left:10px;"
                        @click="delUser(item.id)">删除</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import mixin from "../mixin/mixin.js"
import bus from "../../bus/Bus.js"
export default {
  created () {    this.getUsers()
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.userType = userInfo.isroot === 'yes'
    this.loginedId = userInfo.id
  },
  mixins: [mixin],
  mounted () { },
  components: {},
  props: {},
  data () {
    return {
      userList: [],
      isEdit: false,
      previewImg: '',
      userType: null,
      loginedId: null,
    }
  },
  computed: {},
  watch: {},
  methods: {
    getUsers () {
      this.axios.get('server/users/getUsers').then(res => {
        if (res.state === 1) {
          res.data.forEach(item => {
            if (!item.avatar) {
              item.avatar = require("../../assets/img/default.png")
            }
          })
          this.isEdit = false
          this.previewImg = ''
          this.userInfo = {
            username: '',
            avatar: '',
            slug: '',
            nickname: '',
            password: '',
            bio: ''          }
          this.userList = res.data
        }
      })
    },
    getAvatar (e) {
      this.userInfo.avatar = e.path[0].files[0]
      this.previewImg = URL.createObjectURL(this.userInfo.avatar)
    },
    editUser (item) {
      this.isEdit = true
      this.userInfo = JSON.parse(JSON.stringify(item))
      this.previewImg = this.userInfo.avatar
    },
    updateUser () {
      const isOk = this.checkInfo()
      if (isOk) {
        this.axios.file('server/users/updateUser', this.userInfo).then(res => {
          if (res.state === 1) {
            if (this.userInfo.id === this.loginedId) {
              bus.$emit('infoChange', this.userInfo)
              sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
            }
            this.getUsers()
          } else {
            alert(res.message)
          }
        })
      }
    },
    cancelEdit () {
      this.isEdit = false
      this.userInfo = {
        username: '',
        avatar: '',
        slug: '',
        nickname: '',
        password: '',
        bio: ''      }
    },
    addUser () {
      const isOk = this.checkInfo()
      if (isOk) {
        this.axios.file('server/users/addUser', this.userInfo).then(res => {
          if (res.state === 1) {
            this.getUsers()
          } else {
            alert(res.message)
          }
        })
      }
    },
    delUser (id) {
      this.axios.post('server/article/delCategory', { id }).then(res => {
        if (res.state === 1) {
          this.getCategories()
        } else {
          alert(res.message)
        }
      })
    }
  }
}
</script>
<style scoped lang='less'>
.users {
  background-color: #f8f9fb;
  padding: 20px;
  height: 100%;
  > .title {
    > span {
      font-size: 26px;
    }
  }
  > .content {
    display: flex;
    margin-top: 30px;
    > .left {
      width: 400px;
      padding-right: 30px;
      label,
      input {
        width: 100%;
        height: 30px;
      }
      label {
        font-size: 12px;
        line-height: 30px;
        margin-top: 10px;
        display: block;
      }
      input {
        height: 30px;
        padding-left: 10px;
        width: calc(100% - 10px);
      }
      button {
        margin-top: 20px;
      }
    }
    > .right {
      flex: 1;
      padding: 10px 20px;
      > table {
        width: 100%;
        border-collapse: collapse;
        > thead {
          tr {
            height: 35px;
            th {
              border: 1px solid #ccc;
              text-align: center;
            }
          }
        }
        > tbody {
          tr {
            height: 120px;
            td {
              border: 1px solid #ccc;
              text-align: center;
            }
          }
        }
      }
    }
  }
}
</style>