<template>
  <ul class="pagination">
    <li @click="toFirst"
        style="background-color:#008792;color:#fff">|&lt;</li>
    <li :class="curPage===1?'disabled':''"
        @click="lessNum">&lt;</li>
    <li :class="n===curPage?'active':''"
        @click="changeNum(n)"
        v-for="n in totalPage"
        :key="n">{{n}}</li>
    <li :class="curPage===totalPage?'disabled':''"
        @click="addNum">&gt;</li>
    <li @click="toEnd"
        style="background-color:#008792;color:#fff">&gt;|</li>
  </ul>
</template>

<script>
export default {
  props: {
    totalPage: Number,
    curPage: Number,
  },
  methods: {
    lessNum () {
      if (this.curPage > 1) {
        this.emitNum(this.curPage - 1)
      }
    },
    addNum () {
      if (this.curPage < this.totalPage) {
        this.emitNum(this.curPage + 1)
      }
    },
    changeNum (num) {
      this.emitNum(num)
    },
    emitNum (num) {
      this.$emit('pageChange', num)
    },
    toFirst () {
      this.emitNum(1)
    },
    toEnd () {
      this.emitNum(this.totalPage)
    }
  }
}
</script>
<style scoped lang="less">
.pagination {
  > li {
    float: left;
    width: 30px;
    height: 30px;
    text-align: center;
    font-size: 14px;
    background-color: #fff;
    color: #000;
    line-height: 30px;
    margin: 0 5px;
    border-radius: 4px;
    cursor: pointer;
    &.active {
      color: #fff;
      background-color: #213140;
    }
    &.disabled {
      background-color: #ccc;
    }
  }
}
</style>