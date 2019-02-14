export default {
  data() {
    return {
      userInfo: {
        username: '',
        avatar: '',
        slug: '',
        nickname: '',
        password: '',
        bio: '',
        id: null,
      },
    }
  },
  methods: {
    checkInfo() {
      if (!this.userInfo.username || !this.userInfo.username.trim()) {
        alert('用户名不能为空')
        return false
      }
      if (!this.userInfo.slug || !this.userInfo.slug.trim()) {
        alert('别名不能为空')
        return false
      }
      if (!this.userInfo.nickname || !this.userInfo.nickname.trim()) {
        alert('昵称不能为空')
        return false
      }
      if (!this.userInfo.password || !this.userInfo.password.trim()) {
        alert('密码不能为空')
        return false
      }
      return true
    },
  },
}
