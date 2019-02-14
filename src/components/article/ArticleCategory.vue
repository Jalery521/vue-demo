<template>
  <div class="article_category">
    <div class="title">
      <span>分类目录</span>
    </div>
    <div class="content">
      <div class="left">
        <p v-show="!isEdit">添加新分类目录</p>
        <p v-show="isEdit">编辑分类目录</p>
        <div class="add_new">
          <label for="category_name">名称</label>
          <input type="text"
                 id="category_name"
                 placeholder="分类名称"
                 v-model="categoryInfo.name">
          <label for="category_slug">别名</label>
          <input type="text"
                 id="category_slug"
                 placeholder="slug"
                 v-model="categoryInfo.slug">
          <button v-show="!isEdit"
                  class="btn-small btn-default"
                  type="button"
                  @click="addCategory">添加</button>
          <button v-show="isEdit"
                  class="btn-small btn-default"
                  @click="updateCategory"
                  type="button">保存</button>
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
              <th v-if="userType"
                  width="150px"><input type="checkbox">&nbsp;全选/全不选</th>
              <th width="200px">名称</th>
              <th width="200px">Slug</th>
              <th v-if="userType">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categories"
                :key="item.id">
              <td v-if="userType"
                  width="150px"><input type="checkbox"
                       :value="item.id"></td>
              <td width="300px">{{item.name}}</td>
              <td width="300px">{{item.slug}}</td>
              <td v-if="userType"><button type="button"
                        class="btn-default btn-small"
                        @click="editCategory(item)">编辑</button><button type="button"
                        class="btn-danger btn-small"
                        style="margin-left:10px;"
                        @click="delCategory(item.id)">删除</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isEdit: false,
      categories: [],
      categoryInfo: {
        name: '',
        slug: ''
      },
      userType: null,
    }
  },
  created () {
    this.getCategories()
    this.userType = JSON.parse(sessionStorage.getItem('userInfo')).isroot === 'yes'
  },
  methods: {
    getCategories () {
      this.axios.get('server/article/getCategories').then(res => {
        if (res.state === 1) {
          this.isEdit = false
          this.categoryInfo = { name: null, slug: null }
          this.categories = res.data
        }
      })
    },
    editCategory (item) {
      this.isEdit = true
      this.categoryInfo = JSON.parse(JSON.stringify(item))
    },
    updateCategory () {
      if (this.categoryInfo.name.trim() && this.categoryInfo.slug.trim()) {
        this.axios.post('server/article/updateCategory', this.categoryInfo).then(res => {
          if (res.state === 1) {
            //证明修改成功
            this.getCategories()
          } else {
            alert(res.message)
          }
        })
      } else {
        alert("名称/别名不能为空")
      }
    },
    cancelEdit () {
      this.isEdit = false
      this.categoryInfo = { name: null, slug: null }
    },
    addCategory () {
      if (!this.categoryInfo.name.trim() || !this.categoryInfo.slug.trim()) {
        alert("名称/别名不能为空")
      } else {
        // 发送请求执行新增操作
        this.axios.post('server/article/addCategory', this.categoryInfo).then(res => {
          if (res.state === 1) {
            this.getCategories()
          }
          else {
            alert(res.message)
          }
        })
      }
    },
    delCategory (id) {
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

<style scoped lang="less">
.article_category {
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
        margin-top: 15px;
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
        tr {
          /*width:100%;*/
          height: 35px;
          th,
          td {
            border: 1px solid #ccc;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
