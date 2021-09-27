// liuyan.js
import { net,store,ui } from "../../utils/util";

Page({
  data: {
    infoid: null,
    imgChanged: false,
    txt: null,
    txt_length: 0,
    imgs: [],
    imgs_length: 0,
    done: true
  },
  onLoad(options) {
    var that = this
   
    if(options.id){//from url
      this.data.infoid = options.id
      net.post('/info/id/'+this.data.infoid)
      .then(res=>{
        res = res[0]
        that.setData({
          txt: res.txt,
          txt_length: res.txt && res.txt.length || 0,
          imgs: res.imgs,
          imgs_length: res.imgs && res.imgs.length || 0,
        })
        })
    }
  },
  onUnload(){
    var that = this
    that.data.done==false && ui.xuanze('提示','信息有改动，是否提交？',
    '放弃',()=>{
      wx.navigateBack({
        delta: 0,
      })
    },
    '更改',()=>{
      that.submitInfo(that)
    })
  },
  someInput(e){
    var that = this
    that.data.done = false
    const key = e.currentTarget.id
    let obj = new Object()
    obj[key] = e.detail.value
    if(e.type=='input'){
      const lengthKey = key+'_length'
      obj[lengthKey] = e.detail.value.length
    }
    that.setData(obj)
  },  

  chooseImg(){
    var that = this
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        for (let i = 0; i < res.tempFiles.length; i++) {
          if(res.tempFiles[i].size > 2*1024*1024) {
            wx.showToast({ title: '第'+(i+1)+'个文件大小应小于2M' })
            return false
          };
        }
        that.data.done = false
        that.data.imgChanged = true
        that.setData({
          imgs: tempFilePaths,
          imgs_length: tempFilePaths.length
        })
      }
    })
  },
  previewImage: function(e){
    var that = this
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: that.data.imgs // 需要预览的图片http链接列表
      })
  },
  submitInfo(that){
    let data = {
      txt: that.data.txt,
      token: getApp().globalData.userInfo.token
    }
    if(that.data.imgChanged){
      //嵌套图片上传
      let imgs = []
      let c = that.data.imgs.length
      for (let i = 0; i < that.data.imgs.length; i++) {
        const f = that.data.imgs[i];
        net.upload('/uploadimg',f,'imgs')
        .then((res)=>{
          imgs.push(res[0].path)
        })
        .finally(()=>{
          c--
          if(c===0){
            data.imgs = imgs
                net.post('/info/modify/'+that.data.infoid,data)
                .then(result=>{
                  that.data.done = true
                  ui.xuanze('提示','更改成功,请选择操作？',
                  '再改改',()=>{
                  },
                  '预览效果',()=>{
                    wx.navigateBack({
                      delta: 0,
                    })
                  })
                })
          }
        }
        )
      }
    }else{//图片未改动
      data.imgs = null
      net.post('/info/modify/'+that.data.infoid,data)
      .then(result=>{
        that.data.done = true
        ui.xuanze('提示','更改成功,请选择操作？',
        '再改改',()=>{
        },
        '预览效果',()=>{
          wx.navigateBack({
            delta: 0,
          })
        })
      })
    }
  },
  done: function(){
    var that = this
    ui.queren('提示','确定要提交修改么？',()=>{that.submitInfo(that)})
  },
  toMy: function(){
    getApp().toPage('my')
  }
})
