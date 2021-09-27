// app.js
import { net, store } from "./utils/util";
const authPages =['my','mylist','liuyan','editinfo']

App({
  onLaunch() {
    var that = this
    net.post('/app',{})
    .then(res=>{
      that.globalData.appInfo=res[0]
    })
    wx.onAppShow(res=>{
      that.globalData.appImport = res
    })
    store.get('2jtk').then(res=>{
      res === null
      ? that.globalData.isLogin = false
      : that.tklogin(res)
    })
  },
  tklogin: function (...params) {
    const [token] = params
    var that = this
    net.post('/user/tklogin',{token:token}).then(res=>{
      that.globalData.userInfo = res[0]
      that.globalData.isLogin = true
      store.set('2jtk',that.globalData.userInfo.token)
    })
  },
  // needLogin: function () {
  //   this.globalData.isLogin || this.toPage('about')
  // },
  toPage: function(...params){
    const [page,data] = params

    const objtoquery = function (d) {
      let ret=''
      const props = Object.getOwnPropertyNames(d)
      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        ret += i==0 ?  "?" + prop + "=" + d[prop] : "&" + prop + "=" + d[prop]
      }
      return ret
    }
    console.log('toPage:  ' + page)
    if(getApp().globalData.isLogin || authPages.indexOf(page)==-1){
      const url = data ? '/pages/'+page+'/'+page + objtoquery(data) : '/pages/'+page+'/'+page
      console.log('toPage:  '+url)
      wx.navigateTo({
        url: url,
      })
    }else{
      wx.navigateTo({
        url: '/pages/about/about',
      })
    }
  },
  globalData: {
  }
})
