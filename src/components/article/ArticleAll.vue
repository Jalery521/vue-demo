<template>
  <div class="article_all">
    <div class="title">
      <span>所有文章</span>
      <router-link to="/article/new"
                   class="to_new">写文章</router-link>
    </div>
    <div class="select_options">
      <select name="category">
        <option value="">所有分类</option>
      </select>
      <select name="state"
              v-model="postsState">
        <option v-if="userType"
                value="">所有状态</option>
        <option value="drafted"
                :selected="userType==='no'">草稿</option>
        <option v-if="userType"
                value="published">已发布</option>
        <option v-if="userType"
                value="trashed">回收站</option>
      </select>
      <button v-show="isShow"
              type="button"
              class="btn-small btn-default"
              @click="updateSome('drafted','published')">批量发布</button>
      <button v-show="isShow"
              type="button"
              class="btn-small btn-warning"
              @click="updateSome('published','trashed')"
              style="margin-left:10px">批量移入回收站</button>
      <button v-show="isShow&&userType"
              type="button"
              class="btn-small btn-danger"
              @click="updateSome('trashed','delete')"
              style="margin-left:10px">批量永久删除</button>
    </div>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th style="width:150px"><input @click="checkAll"
                     :checked="allCheck"
                     type="checkbox">&nbsp;全选/全不选</th>
            <th style="width:300px">标题</th>
            <th>作者</th>
            <th>分类</th>
            <th>发表时间</th>
            <th>状态</th>
            <th style="width:200px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="postsList.length"
              v-for="item in postsList"
              :key="item.id">
            <td style="width:120px"><input @click="checkOne(item)"
                     :checked="item.checkBoole"
                     type="checkbox"></td>
            <td style="width:300px">{{item.title}}</td>
            <td>{{item.username}}</td>
            <td>{{item.name}}</td>
            <td>{{item.created | timeFmt}}</td>
            <td>{{item.status | stateFilter}}</td>
            <td v-if="item.status==='drafted'"><button type="button"
                      @click="changeState(item.id,'published')"
                      class="btn-default btn-small">发布</button><button type="button"
                      class="btn-warning btn-small"
                      @click="changeState(item.id,'trashed')"
                      style="margin-left:8px">移入回收站</button></td>
            <td v-else-if="item.status==='published'"><button v-if="userType"
                      type="button"
                      class="btn-warning btn-small"
                      @click="changeState(item.id,'trashed')">移入回收站</button></td>
            <td v-else-if="item.status==='trashed'"><button v-if="userType"
                      type="button"
                      class="btn-danger btn-small"
                      @click="changeState(item.id,'delete')">永久删除</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination :cur-page="pageIndex"
                :total-page="totalPage"
                @pageChange="curPageChange"></Pagination>
  </div>
</template>

<script>
import Pagination from '../subComponents/Pagination.vue'
export default {
  components: {
    Pagination
  },
  created () {
    this.getPosts()
    this.userType = JSON.parse(sessionStorage.getItem('userInfo')).isroot === 'yes'
    if (!this.userType) {
      this.postsState = 'drafted'
    }
  },
  data () {
    return {
      pageIndex: 1, // 默认页码为1
      pageSize: 15, // 默认页容量
      postsList: [],  // 文章列表
      totalPage: null,
      checkList: [],
      allCheck: false,
      postsState: '',  // 要获取的文章状态类型 
      isShow: false,
      userType: null,
    }
  },
  watch: {
    postsState: function () {
      this.pageIndex = 1
      this.getPosts()
    }
  },
  methods: {
    // 获取分页文章内容
    getPosts () {
      this.axios.get('server/article/getPosts', { pageIndex: this.pageIndex, pageSize: this.pageSize, postsState: this.postsState }).then(res => {
        if (res.state === 1) {
          res.data.forEach(item => {
            item.checkBoole = false
          })
          this.isShow = false
          this.allCheck = false
          this.checkList = []
          this.totalPage = Math.ceil(res.totalCount / this.pageSize)
          this.postsList = res.data
        }
      })
    },
    // 监听子组件页码变更
    curPageChange (num) {
      this.pageIndex = num
      this.getPosts()
    },
    // 全选/全不选功能
    checkAll () {
      this.allCheck = !this.allCheck
      this.postsList.forEach(item => {
        item.checkBoole = this.allCheck
        if (this.allCheck) {
          this.isShow = true
          this.checkList.push(item)
        } else {
          this.isShow = false
          this.checkList = []
        }
      })
    },
    // 单挑数据的单选功能
    checkOne (obj) {
      obj.checkBoole = !obj.checkBoole
      if (obj.checkBoole) {
        this.isShow = true
        this.checkList.push(obj)
        if (this.checkList.length === this.postsList.length) {
          this.allCheck = true
        }
      } else {
        this.checkList.forEach((item, index) => {
          if (item.id === obj.id) {
            this.checkList.splice(index, 1)
            if (this.allCheck) {
              this.allCheck = false
            }
          }
        })
        if (!this.checkList.length) this.isShow = false
      }
    },
    // 对文章状态的操作
    changeState (id, state) {
      this.axios.post('server/article/updatePost', { id, state }).then(res => {
        if (res.state === 1) {
          if (this.postsList.length <= 1) {
            this.pageIndex--
          }
          this.getPosts()
        }
      })
    },
    // 批量操作
    updateSome (oldState, state) {
      const updateList = this.checkList.filter(item => item.status === oldState)
      if (!updateList.length) {
        alert('无符合条件的文章!')
        return
      }
      if (updateList.length === this.postsList.length && this.pageIndex === this.totalPage) {
        this.pageIndex--
      }
      const idsArr = []
      updateList.forEach(item =>
        idsArr.push(item.id))
      const ids = idsArr.join()
      this.axios.post('server/article/updateSome', { ids, state }).then(res => {
        if (res.state === 1) {
          this.getPosts()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.article_all {
  background-color: #f8f9fb;
  padding: 20px;
  height: 100%;
  > .title {
    > span {
      font-size: 26px;
    }
    > .to_new {
      font-size: 12px;
      border-radius: 4px;
      padding: 4px 8px;
      background-color: #40586d;
      color: #fff;
      margin-left: 8px;
      cursor: pointer;
    }
  }
  > .select_options {
    height: 30px;
    display: flex;
    margin-top: 20px;
    > select {
      margin-right: 8px;
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 12px;
    }
  }
  .content {
    min-height: 640px;
    margin: 20px 0;
    > table {
      width: 100%;
      border-collapse: collapse;
      background-color: #fff;
      tr {
        height: 40px;
      }
      th,
      td {
        border: 1px solid #ccc;
        text-align: center;
      }
    }
  }
}
</style>
