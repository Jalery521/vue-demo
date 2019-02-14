<template>
  <div class='myEcharts'>
    <div id="myEcharts_total"></div>
    <div id="myEcharts_users"></div>
    <div id="myEcharts_article"></div>
    <div id="myEcharts_comments"></div>
  </div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/chart/pie'
export default {
  created () {
    this.getChart()  },
  mounted () {
    this.totalEcharts = echarts.init(document.getElementById('myEcharts_total'))
    this.usersEcharts = echarts.init(document.getElementById('myEcharts_users'))
    this.commentsEcharts = echarts.init(document.getElementById('myEcharts_comments'))
    this.articleEcharts = echarts.init(document.getElementById('myEcharts_article'))
  },
  components: {},
  data () {
    return {

    }
  },
  methods: {
    getChart () {
      this.axios.get('server/statistics/getChart').then(res => {
        const { commentsChart, postsChart, totalChart, usersChart } = res.data
        this.totalEcharts.setOption({
          title: {
            text: '数据总览'
          },
          tooltip: {},
          xAxis: {
            data: ['用户数', '文章数', '评论数', '分类数']
          },
          yAxis: {},
          series: [{
            name: "数量",
            type: 'bar',
            data: [totalChart.usersCount, totalChart.postsCount, totalChart.commentsCount, totalChart.categoriesCount]
          }]
        })
        this.usersEcharts.setOption({
          title: {
            text: '用户总览'
          },
          series: [
            {
              name: '用户总览',
              type: 'pie',
              radius: '55%',
              data: [
                { value: usersChart.rootCount, name: '超级用户' },
                { value: usersChart.adminCount, name: '普通用户' }
              ]
            }
          ]
        })
        this.commentsEcharts.setOption({
          title: {
            text: '评论总览'
          },
          series: [
            {
              name: '评论总览',
              type: 'pie',
              radius: '55%',
              data: [
                { value: commentsChart.heldCount, name: '待审核评论' },
                { value: commentsChart.approvedCount, name: '已发表评论' },
                { value: commentsChart.rejectedCount, name: '已拒绝评论' },
                { value: commentsChart.trashedCount, name: '已作废评论' }
              ]
            }
          ]
        })
        this.articleEcharts.setOption({
          title: {
            text: '文章总览'
          },
          series: [
            {
              name: '文章总览',
              type: 'pie',
              radius: '55%',
              data: [
                { value: postsChart.draftedCount, name: '草稿数' },
                { value: postsChart.pubilshedCount, name: '已发布' },
                { value: postsChart.trashedCount, name: '已作废' },
              ]
            }
          ]
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
.myEcharts {
  display: flex;
  flex-wrap: wrap;
  align-items: space-around;
  > div {
    box-sizing: border-box;
    width: 50%;
    padding: 20px;
    height: 400px;
  }
}
</style>