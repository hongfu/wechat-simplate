// liuyan.js
import { net,store,ui } from "../../utils/util";

Page({
  data: {
    txt: null,
    txt_length: 0,
    imgs: [],
    imgs_length: 0,
    kouling: '',
    // can_sale: true,
    // sale_price: 0,
    // can_exchange: false,
    // can_give: false,
    done: true
  },
  onUnload(){
    this.data.done==false && store.set('lsti',this.data)
  },
  onShow(){
    var that = this

    //检查退出缓存
    store.pop('lsti').then(res=>{
      if(res!=null){
        ui.queren('提示','有未完成的信息，是否继续？',()=>{
          that.setData({
            kouling: res.kouling,
            title: res.title,
            title_length: res.title_length,
            txt: res.txt,
            txt_length: res.txt_length,
            imgs: res.imgs,
            imgs_length: res.imgs_length,
          })
        })
      }
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
  // changeStatus(e){
  //   console.log(e)
  //   var that = this
  //   that.data.done = false
  //   const key = e.currentTarget.id
  //   let obj = new Object()
  //   obj[key] = !that.data[key]
  //   that.setData(obj)
  // },
  chooseImg(){
    var that = this
    that.data.done = false
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
  submitInfo(that,modify=false){
    let data = {
      kouling: that.data.kouling,
      title: that.data.title,
      txt: that.data.txt,
      token: getApp().globalData.userInfo.token
    }
    let imgs = []
    let c = that.data.imgs.length
    //嵌套图片上传
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
              net.post('/info/insert',data)
              .then(result=>{
                that.data.done = true
                ui.xuanze('提示','你是要继续上新，还是去预览？',
                '继续上新',()=>{
                  wx.redirectTo({
                    url: '/pages/liuyan/liuyan',
                  })
                },
                '预览成果',()=>{
                  wx.redirectTo({
                    url: '/pages/mylist/mylist',
                  })
                })
              })
            //}
        }
      }
      )
    }
  },
  done: function(){
    var that = this
    ui.queren('提示','作为新信息提交？',()=>{that.submitInfo(that)})
  },
  toMy: function(){
    getApp().toPage('my')
  }
})
