// pages/infos/infos.js
import { net,store,ui } from "../../utils/util";

Page({
  data: {
    managePage: false,
    currentId: null,
    currentItem: null
  },
  onReady: function (options) {
    //判断强制刷新
    //var that = this
    
    // const {force} = options||false
    // if(force){that.getInfos();return true}
    // store.get('miExTm').then(res=>{
    //   res === null && that.getInfos()
    //   res>new Date().getTime()
    //   ? store.get('myinfos').then(res=>{
    //     that.setData({
    //       infos: res,
    //       appInfo: getApp().globalData.appInfo
    //     })
    //     store.set('myinfos',res)
    //   })
    //   : that.getInfos()
    // })
  },
  onShow: function(){
    this.getInfos()
  },
  getInfos: function () {
    var that = this
    net.post('/info/mylist',{token: getApp().globalData.userInfo.token})
      .then(res => {
          that.setData({
            infos: res,
            appInfo: getApp().globalData.appInfo
          });
          store.set('myinfos',res).then((store.set('miExTm',new Date().getTime()+10*1000)))
      })
  },
  toInfo: function (e) {
    getApp().toPage('info',{id:e.currentTarget.id})
  },
  toEdit: function (e) {
    console.log(e)
    getApp().toPage('editinfo',{id:e.currentTarget.dataset.infoId})
  },
  previewImage: function(e){
    var that = this
    const id = e.currentTarget.id
    wx.previewImage({
        current: that.data.infos[id].imgs[0], // 当前显示图片的http链接
        urls: that.data.infos[id].imgs // 需要预览的图片http链接列表
    })
  },
  openManage(e){
    net.post('/info/id/'+e.currentTarget.dataset.infoId).then(res=>{
      this.setData({
        currentId: e.currentTarget.dataset.infoId,
        currentItem: res[0],
        managePage: true
      })
    })
  },
  changeStatus(e){
    var that = this
    if(e.currentTarget.id == "is_done" || e.currentTarget.id == "is_deleted"){
      ui.xuanze('提示','完成或删除的信息，将无法再编辑或管理！！！',
      '确定',()=>{
        let url = '/info/manage/' + that.data.currentId + '/' + e.currentTarget.id + '/' + !that.data.currentItem[e.currentTarget.id]
        net.post(url,{token: getApp().globalData.userInfo.token}).then(res=>{
          wx.navigateBack({
            delta: 0,
          })
        })
      },
      '放弃',()=>{})
      return
    }else{
      let url = '/info/manage/' + that.data.currentId + '/' + e.currentTarget.id + '/' + !that.data.currentItem[e.currentTarget.id]
      net.post(url,{token: getApp().globalData.userInfo.token}).then(res=>{
        let ret = that.data.currentItem
        let v = null;
        if(res[0].fielddata=="true"){v = true}else if(res[0].fielddata=="false"){v = false}else{v = res[0].fielddata}
        ret[res[0].fieldname] = v
        that.setData({
          currentItem: ret
        })
      })
    }

    // const key = e.currentTarget.id
    // let obj = new Object()
    // obj[key] = !that.data[key]
    // that.setData(obj)
  },
  closeManage(){
    this.setData({
      managePage: false
    })
  }
})