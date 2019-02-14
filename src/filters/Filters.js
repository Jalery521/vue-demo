import Vue from 'vue'

Vue.filter('stateFilter', state => {
  switch (state) {
    case 'drafted':
      return '草稿'
    case 'published':
      return '已发布'
    case 'trashed':
      return '回收站'
    case 'unactivated':
      return '未激活'
    case 'activated':
      return '已启用'
    case 'forbidden':
      return '已禁用'
    case 'held':
      return '待审核'
    case 'approved':
      return '已通过'
    case 'rejected':
      return '已驳回'
  }
})
const fmt = num => {
  return (num = num < 10 ? `0${num}` : num)
}
Vue.filter('timeFmt', time => {
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()
  return `${year}-${fmt(month)}-${fmt(day)} ${fmt(hour)}:${fmt(min)}:${fmt(sec)}`
})
