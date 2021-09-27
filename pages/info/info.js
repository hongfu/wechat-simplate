const { net } = require("../../utils/util")

// pages/info/info.js
Page({
  data: {},
  onLoad: function (options) {
    var that = this
    //getApp().globalData.isLogin && that.setData({userid:getApp().globalData.userInfo.userid})
    const {id} = options
    net.post('/info/id/'+id)
    .then(res=>{
      that.setData({
        info: res[0]
      })
    })
    net.post('/info/comment/infoid/'+id)
    .then(res=>{
      that.setData({
        comments: res
      })
    })
  },
  // editInfo: function(e){
  //   getApp().toPage('liuyan',{infoid:e.currentTarget.id})
  // },
  previewImage: function (e) {
    var that = this
    const id = e.currentTarget.id
    wx.previewImage({
      current: that.data.info.imgs[id], // 当前显示图片的http链接
      urls: that.data.info.imgs // 需要预览的图片http链接列表
    })
  }
})