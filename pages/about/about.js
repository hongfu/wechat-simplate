// pages/about/about.js
import { net,store } from "../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ani: 'start',
    progre: 0,
    isLogin: false
  },

  onReady: function (options) {
    var that = this
    console.log(getApp().globalData)
    getApp().globalData.isLogin
    ? that.setData({
      progre:100,
      isLogin: getApp().globalData.isLogin,
      appInfo: getApp().globalData.appInfo
    })
    : that.setData({
        progre:50,
        isLogin: getApp().globalData.isLogin,
        appInfo: getApp().globalData.appInfo
      })
  },

  wxupdate: function(e) {
    var that = this
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        const{nickName,avatarUrl,gender,province,city} = res.userInfo
        //前端登录微信
        wx.login({
          success: res => {
            const {code} = res
            //后端存储微信登录信息
            net.post('/user/wxregister',{
              jiuma: true,
              code: code,
              nick_name: nickName,
              avatar_url: avatarUrl,
              gender: gender,
              address: province+' '+city
            }).then(res=>{
                //本地保存用户信息
                that.setData({ 
                  progre: 100,
                  isLogin: true
                 })
                getApp().globalData.userInfo = res[0]
                getApp().globalData.isLogin = true
                store.set('2jtk',getApp().globalData.userInfo.token)
            })
           
          }
        })
      }
    })
  },
  toMy: function(){
    getApp().toPage('my')
  },
  buttonShow: function(){
    this.setData({
      ani: 'done'
    })
  }
})