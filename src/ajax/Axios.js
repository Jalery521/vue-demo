import router from '../routers/Routers.js'
class Axios {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.xhr = new XMLHttpRequest()
  }
  ready(resolve, reject) {
    this.xhr.onreadystatechange = () => {
      if (this.xhr.readyState !== 4) {
        return
      }
      if (this.xhr.status === 200) {
        const res = JSON.parse(this.xhr.responseText)
        if (res.state === 401) {
          router.push('/login')
        } else {
          resolve(res)
        }
      } else {
        reject(new Error('获取数据出错'))
      }
    }
  }
  parse(data) {
    if (typeof data === 'object' && data) {
      let str = ''
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          str += `${key}=${data[key]}&`
        }
      }
      return str.slice(0, -1)
    } else {
      return ''
    }
  }
  addToken() {
    if (sessionStorage.getItem('token')) {
      this.xhr.setRequestHeader('Authorization', sessionStorage.getItem('token'))
    }
  }
  get(url, data) {
    return new Promise((resolve, reject) => {
      data = this.parse(data)
      url = data ? `${this.baseUrl}${url}?${data}` : `${this.baseUrl}${url}`
      this.xhr.open('GET', url)
      this.addToken()
      this.ready(resolve, reject)
      this.xhr.send()
    })
  }
  post(url, data) {
    return new Promise((resolve, reject) => {
      data = this.parse(data)
      this.xhr.open('POST', `${this.baseUrl}${url}`)
      this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      this.addToken()
      this.ready(resolve, reject)
      this.xhr.send(data)
    })
  }
  form(data) {
    const fm = new FormData()
    for (const key in data) {
      fm.append(key, data[key])
    }
    return fm
  }
  file(url, data) {
    return new Promise((resolve, reject) => {
      data = this.form(data)
      this.xhr.open('POST', `${this.baseUrl}${url}`)
      this.addToken()
      this.ready(resolve, reject)
      this.xhr.send(data)
    })
  }
}

export default new Axios('http://127.0.0.1:3000/')
