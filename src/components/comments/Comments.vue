<template>
  <div class="comments">
    <div class="title">
      <span>所有评论</span>
    </div>
    <div class="select_options">
      <select name="category">
        <option value="">所有分类</option>
      </select>
      <select name="state"
              v-model="commentsState">
        <option v-if="userType"
                value="">所有状态</option>
        <option value="held">待审核</option>
        <option v-if="userType"
                value="approved">已通过</option>
        <option v-if="userType"
                value="rejected">已拒绝</option>
        <option v-if="userType"
                value="trashed">回收站</option>
      </select>
      <button v-show="isShow"
              type="button"
              class="btn-small btn-default"
              @click="updateSome('held','approved')">批量通过</button>
      <button v-show="isShow"
              type="button"
              class="btn-small btn-warning"
              @click="updateSome('held','rejected')"
              style="margin:0 10px">批量拒绝</button>
      <button v-show="isShow&&userType"
              type="button"
              class="btn-small btn-warning"
              @click="updateSome('approved','trashed')"
              style="margin-right:10px">批量移入回收站</button>
      <button v-show="isShow&&userType"
              type="button"
              class="btn-small btn-danger"
              @click="updateSome('trashed','delete')">批量永久删除</button>
    </div>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th style="width:150px"><input @click="checkAll"
                     :checked="allCheck"
                     type="checkbox">&nbsp;全选/全不选</th>
            <th>作者</th>
            <th class="comment_content">评论内容</th>
            <th>评论于</th>
            <th>发表时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in commentsList"
              :key="item.id">
            <td style="width:150px"><input @click="checkOne(item)"
                     type="checkbox"
                     :value="item.id"
                     :checked="item.checkBoole"></td>
            <th>{{item.author}}</th>
            <td class="comment_content">{{item.content}}</td>
            <td>{{item.title}}</td>
            <td>{{item.created | timeFmt}}</td>
            <td>{{item.status | stateFilter}}</td>
            <td v-if="item.status==='held'"><button type="button"
                      @click="changeState(item.id,'approved')"
                      class="btn-default btn-small">通过</button><button type="button"
                      class="btn-warning btn-small"
                      @click="changeState(item.id,'rejected')"
                      style="margin-left:8px">拒绝</button></td>
            <td v-else-if="item.status==='approved'"><button type="button"
                      class="btn-warning btn-small"
                      v-if="userType"
                      @click="changeState(item.id,'trashed')">移入回收站</button></td>
            <td v-else-if="item.status==='rejected'"><button type="button"
                      @click="changeState(item.id,'trashed')"
                      v-if="userType"
                      class="btn-default btn-small">移入回收站</button>
            </td>
            <td v-else><button type="button"
                      @click="changeState(item.id,'delete')"
                      v-if="userType"
                      class="btn-danger btn-small">永久删除</button>
            </td>
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
import Pagination from "../subComponents/Pagination.vue"
export default {
  components: {
    Pagination
  },
  data () {
    return {
      pageIndex: 1, // 默认页码为1
      pageSize: 15, // 默认页容量
      commentsList: [],  // 评论列表
      totalPage: null,
      checkList: [],
      allCheck: false,
      commentsState: '',  // 要获取的文章状态类型
      isShow: false,
      userType: null
    }
  },
  created () {
    this.getComments()
    this.userType = JSON.parse(sessionStorage.getItem('userInfo')).isroot === 'yes'
    if (!this.userType) {
      this.commentsState = 'held'
    }
  },
  watch: {
    commentsState: function () {
      this.pageIndex = 1
      this.getComments()
    }
  },
  methods: {
    getComments () {
      this.axios.get('server/comments/getComments', { pageIndex: this.pageIndex, pageSize: this.pageSize, commentsState: this.commentsState }).then(res => {
        if (res.state === 1) {
          this.isShow = false
          this.allCheck = false
          this.checkList = []
          this.totalPage = Math.ceil(res.totalCount / this.pageSize)
          res.data.forEach(item => {
            item.checkBoole = false
          })
          this.commentsList = res.data
        } else {
          alert(res.message)
        }
      })
    },
    curPageChange (num) {
      this.pageIndex = num
      this.getComments()
    },
    // 全选/全不选功能
    checkAll () {
      this.allCheck = !this.allCheck
      this.commentsList.forEach(item => {
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
        if (this.checkList.length === this.commentsList.length) {
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
      this.axios.post('server/comments/updateComment', { id, state }).then(res => {
        if (res.state === 1) {
          if (this.commentsList.length <= 1) {
            this.pageIndex--
          }
          this.getComments()
        }
      })
    },
    updateSome (oldState, state) {
      const updateList = this.checkList.filter(item => item.status === oldState)
      if (!updateList.length) {
        alert('无符合条件的数据')
        return
      }
      if (updateList.length === this.commentsList.length && this.pageIndex === this.totalPage) {
        this.pageIndex--
      }
      const idsArr = []
      updateList.forEach(item => {
        idsArr.push(item.id)
      })
      const ids = idsArr.join()
      this.axios.post('server/comments/updateSome', { ids, state }).then(res => {
        if (res.state === 1) {
          this.getComments()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.comments {
  background-color: #f8f9fb;
  padding: 20px;
  height: 100%;
  > .title {
    > span {
      font-size: 26px;
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
  > .content {
    background-color: #fff;
    margin: 20px 0;
    min-height: 640px;
    table {
      width: 100%;
      border-collapse: collapse;
      tr {
        height: 40px;
      }
      th,
      td {
        border: 1px solid #ccc;
        text-align: center;
      }
      .comment_content {
        max-width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
