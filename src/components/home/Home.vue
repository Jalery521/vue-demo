<template>
  <div class="content_home">
    <div class="curtain">
      <h2>One world,One Earth</h2>
      <p>new Day,new life</p>
      <button class="btn-default btn-large"
              type="button"
              @click="toNewArticle">写文章</button>
    </div>
    <table>
      <thead>
        <tr>
          <td>站点内容统计:</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{statistics.postsCount}}篇文章 ({{statistics.draftedPostsCount}}篇草稿)</td>
        </tr>
        <tr>
          <td>{{statistics.categoriesCount}}个分类</td>
        </tr>
        <tr>
          <td>{{statistics.commentsCount}}条评论 ({{statistics.heldCommentsCount}}条待审核)</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  created () {
    this.getStatistics()
  },
  data () {
    return {
      statistics: {}
    }
  },
  methods: {
    toNewArticle () {
      this.$router.push("/article/new")
    },
    getStatistics () {
      this.axios.get('server/statistics/getStatistics').then(res => {
        if (res.state === 1) { this.statistics = res.data }
      })
    }
  }
}
</script>

<style scoped lang="less">
.content_home {
  padding: 20px;
  > .curtain {
    background-color: #eeeeee;
    width: 100%;
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    > h2 {
      margin-top: 50px;
      font-size: 60px;
      font-weight: 400;
    }
    > p {
      line-height: 30px;
      font-size: 20px;
      margin-top: 10px;
    }
    > button {
      font-size: 16px;
      cursor: pointer;
      margin-top: 20px;
    }
  }
  > table {
    margin-top: 30px;
    width: 500px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-collapse: collapse;
    > thead {
      background-color: #f5f5f5;
      font-size: 16px;
    }
    tr {
      height: 40px;
      > td {
        padding-left: 15px;
        line-height: 40px;
      }
      &:nth-of-type(n + 1) {
        border-top: 1px solid #ccc;
      }
    }
  }
}
</style>
 v
