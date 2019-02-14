<template>
  <div class="left_nav_bar">
    <div class="admin_icon">
      <img :src="imgSrc"
           alt="">
      <span>{{adminName}}</span>
    </div>
    <div class="menu_list">
      <ul>
        <li :class="index===selectMenuIndex?'active':''"
            v-for="(item,index) in menuData"
            :key="item.title">
          <a @click="changeState(index)"><i :class="item.iconLeft"></i>{{item.title}} <i v-if="item.iconRight"
               :class="index===selectMenuIndex&&item.selectBoole?item.iconRight[1]:item.iconRight[0]"></i>
          </a>
          <ul v-show="index===selectMenuIndex&&item.selectBoole"
              v-if="item.children">
            <li :class="subitem.selectBoole&&(index===selectMenuIndex)?'active':''"
                v-for="subitem in item.children"
                :key="subitem.subtitle">
              <router-link class="a_link"
                           :to="subitem.path">{{subitem.subtitle}}</router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import bus from "../../bus/Bus.js"
export default {
  data () {
    return {
      imgSrc: '',
      adminName: '',
      selectMenuIndex: 0,                        //默认选中的是第一项
      menuData: [{                                //左侧的菜单相关的数据
        title: "仪表盘",                             //一级菜单
        selectBoole: true,                          //是否是选中激活状态
        path: '/home',                                //对应的路由路径
        iconLeft: 'fa fa-tachometer'                   //左侧的字体图标类名
      }, {
        title: "文章",
        selectBoole: false,
        iconLeft: 'fa fa-thumb-tack',
        iconRight: ['fa fa-angle-right', 'fa fa-angle-down'], //如果有右侧图标,就有二级菜单
        children: [{                                         //二级菜单数据
          subtitle: "所有文章",
          selectBoole: false,                                  //二级菜单是否是选中
          path: "/article/all"                                  //二级菜单的路径
        }, {
          subtitle: "写文章",
          selectBoole: false,
          path: "/article/new"
        }, {
          subtitle: "分类目录",
          selectBoole: false,
          path: "/article/category"
        }]
      }, {
        title: "评论",
        selectBoole: false,
        path: "/comments",
        iconLeft: 'fa fa-comments'
      }, {
        title: "用户",
        selectBoole: false,
        path: "/users",
        iconLeft: 'fa fa-group'
      }, {
        title: "设置",
        selectBoole: false,
        iconLeft: 'fa fa-cogs',
        iconRight: ['fa fa-angle-right', 'fa fa-angle-down'],
        children: [{
          subtitle: "数据图表",
          selectBoole: false,
          path: "/settings/chart"
        }, {
          subtitle: "图片轮播",
          selectBoole: false,
          path: "/settings/slider"
        }, {
          subtitle: "网站设置",
          selectBoole: false,
          path: "/setting/sites"
        }]
      }]
    }
  },
  created () {
    this.watchPath()
    bus.$on('infoChange', data => {
      this.adminName = data.nickname
      this.imgSrc = data.avatar ? data.avatar : require("../../assets/img/default.png")// 图片路径,不传为默认头像
    })
    if (this.adminName === '' && this.imgSrc === '') {
      if (sessionStorage.getItem('userInfo')) {
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.adminName = userInfo.nickname
        this.imgSrc = userInfo.avatar
      }
    }
  },
  watch: {
    // 检测路径变化,改变对应菜单的选中状态,用于其他页面点击跳转到别的路由界面
    $route: function () {
      this.watchPath()
    }
  },
  methods: {
    changeState (_index) {   // 点击一级菜单时触发的事件
      this.menuData.forEach((item, index) => {   //首先遍历数组
        if (index === _index) {
          if (item.children) { // 如果点击的索引有children属性,name更改所有children默认为未选中
            item.children.forEach(subitem => subitem.selectBoole = false)
            item.selectBoole = !item.selectBoole  //并且切换自身的选中状态
          } else {                //如果没有选中项没有children属性,那么一直是true
            item.selectBoole = true
            this.$router.push(this.menuData[_index].path)   //并且切换路由
          }
        } else {             //未被选中的一级菜单都改为false
          item.selectBoole = false
        }
      })
      this.selectMenuIndex = _index     //修改模型中选中的索引
    },
    changeSelectState (_index, _subindex) {            //监听页面路径的变化执行的方法,传入一级索引和二级索引
      this.menuData.forEach((item, index) => {         //根据传入的一级索引更改data中的选中索引
        if (index === _index) {
          this.selectMenuIndex = index                   //并且更改传入索引项的selectBoole为true
          item.selectBoole = true                     //更改其他项的selectBoole为false
        } else {
          item.selectBoole = false
        }
      })
      if (typeof _subindex === 'number') {                 //如果有传二级菜单索引
        this.changeSubSelectState(_index, _subindex)        //那么把选中二级菜单更改为active样式
      }
    },
    changeSubSelectState (_index, _subindex) {
      this.menuData[_index].children.forEach((subitem, subindex) => {  //那么遍历找到对应的二级菜单索引更改为选中状态
        if (subindex === _subindex) {
          subitem.selectBoole = true
        } else {
          subitem.selectBoole = false
        }
      })
    },
    watchPath () {
      switch (this.$route.path) {
        case "/home":
          this.changeSelectState(0)
          break
        case "/article/all":
          this.changeSelectState(1, 0)
          break
        case "/article/new":
          this.changeSelectState(1, 1)
          break
        case "/article/category":
          this.changeSelectState(1, 2)
          break
        case "/comments":
          this.changeSelectState(2)
          break
        case "/users":
          this.changeSelectState(3)
          break
        case "/settings/chart":
          this.changeSelectState(4, 0)
          break
        case "/settings/slider":
          this.changeSelectState(4, 1)
          break
        case "/settings/sites":
          this.changeSelectState(4, 2)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.left_nav_bar {
  width: 180px;
  height: 100%;
  display: flex;
  flex-direction: column;
  > .admin_icon {
    width: 100%;
    height: 177px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #243443;

    > img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-top: 25px;
    }

    > span {
      font-size: 16px;
      color: #a9b0c2;
      margin-top: 30px;
    }
  }

  > .menu_list {
    flex: 1;
    background-color: #2f4050;
    padding-top: 10px;

    ul {
      li {
        > a,
        .a_link {
          height: 40px;
          padding-left: 30px;
          line-height: 40px;
          display: block;
          font-size: 14px;
          position: relative;

          > i {
            margin-right: 10px;

            &:nth-of-type(2) {
              position: absolute;
              right: 10px;
              top: 50%;
              transform: translateY(-50%);
            }
          }

          &:hover {
            background-color: #213140;
            color: #fff;
          }
        }
      }
    }

    .active {
      > a {
        color: #fff;
        background-color: #213140;
      }
    }
  }
}
</style>
