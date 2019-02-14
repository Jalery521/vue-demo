<template>
  <div class="new_article">
    <div class="title">
      <span>写文章</span>
    </div>
    <form method="post"
          class="content">
      <div class="left">
        <label for="article_title">标题 *</label>
        <input required="required"
               v-model="articleData.title"
               type="text"
               id="article_title"
               placeholder="文章标题">
        <label for="article_content">内容 *</label>
        <Editor @editorChange="changeContent"
                id="article_content"></Editor>
      </div>
      <div class="right">
        <label for="article_slug">别名</label>
        <input v-model="articleData.slug"
               type="text"
               id="article_slug"
               placeholder="slug">
        <label for="article_img">特色图像</label>
        <input @change="getImg"
               type="file"
               id="article_img">
        <label for="article_category">所属分类 *</label>
        <select v-model="articleData.category_id"
                name="article_category"
                id="article_category">
          <option v-for="item in categories"
                  :key="item.id"
                  :value="item.id">{{item.name}}</option>
        </select>
        <label for="article_time">发布时间 *</label>
        <input @change="getTime"
               type="datetime-local"
               id="article_time">
        <label for="article_state">状态 *</label>
        <select v-model="articleData.status"
                name="article_state"
                id="article_state">
          <option value="drafted"
                  selected>草稿</option>
          <option value="published">已发布</option>
        </select>
        <button type="button"
                class="btn-default btn-middle"
                @click="getArticleData">提交</button>
      </div>
    </form>
  </div>
</template>

<script>
import Editor from "../subComponents/Editor.vue"
export default {
  components: {
    Editor
  },
  created () {
    this.getCategories()
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.articleData.user_id = userInfo.id
  },
  data () {
    return {
      categories: {},
      articleData: {
        title: '',
        content: '',
        slug: '',
        img: '',
        category_id: '',
        created: '',
        status: 'drafted',
        user_id: null
      },
      article_text: ''
    }
  },
  methods: {
    getCategories () {
      this.axios.get('server/article/getCategories').then(res => {
        if (res.state === 1) {
          this.categories = res.data
        }
      })
    },
    getArticleData () {
      if (this.articleData.title.trim() === '') {
        alert("标题不能为空")
        return
      }
      if (this.article_text.trim() === '') {
        alert("内容不能为空")
        return
      }
      if (this.articleData.category === '') {
        alert('分类不能为空')
        return
      }
      if (this.articleData.created === '') {
        this.articleData.created = new Date().toLocaleString().replace(/年|月|日|\//g, "-").replace(/上午|下午|晚上/g, '')
      }
      this.axios.file('server/article/addPost', this.articleData).then(res => {
        if (res.state === 1) {
          this.$router.push('/article/all')
        } else {
          alert('文章保存失败,请稍后重试')
        }
      })

    },
    getImg (e) {
      this.articleData.img = e.srcElement.files[0]
    },
    changeContent (html, text) {
      this.articleData.content = html
      this.article_text = text

    },
    getTime (e) {
      this.articleData.created = e.srcElement.value.replace(/T/, " ")
    }
  }
}
</script>

<style scoped lang="less">
.new_article {
  background-color: #f8f9fb;
  padding: 20px;
  height: 100%;
  > .title {
    > span {
      font-size: 26px;
    }
  }
  > .content {
    margin-top: 30px;
    display: flex;
    label {
      display: block;
      width: 100%;
      height: 30px;
      font-size: 14px;
      line-height: 30px;
    }
    input {
      width: calc(100% - 12px);
      padding-left: 12px;
      margin-bottom: 15px;
      font-size: 16px;
    }
    > .left {
      flex: 1;
      padding-right: 40px;
      input {
        height: 40px;
        line-height: 40px;
      }
    }
    > .right {
      width: 400px;
      input {
        height: 30px;
        line-height: 30px;
      }
      select {
        height: 30px;
        line-height: 30px;
        padding: 4px 10px;
      }
      > button {
        display: block;
        margin-top: 20px;
      }
    }
  }
}
</style>
