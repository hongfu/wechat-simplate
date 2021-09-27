// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : `0${n}`
// }

//////////////////////

const ENV = ('pro' == 'dev') ? 'http://127.0.0.1:3000/wx' : 'https://api.zhaduir.ren/wx'
const config = {
  API: ENV,
}

class net{
  static post(...params){
    const[url,data] = params
    let apiurl = config.API + url
    return new Promise((resolve,reject)=>{
      wx.request({
        method: 'POST',
        url: apiurl,
        data: data,
        complete: (res)=>{
          if(res.statusCode!=200){
            wx.showToast({
              title: '网络故障请稍后',
              icon: 'error',
              duration: 2000
            })
          }else{
            let data = res.data
            if(data.code==1){
              resolve(data.result)
            }else{
              wx.showToast({
                title: data.message,
                icon: 'none',
                duration: 2000
              })
              //reject(data)
            }
          }
        }
      })
    })
  }

  static get(...params){
    const[url,data] = params
    let apiurl = config.API + url
    return new Promise((resolve,reject)=>{
      wx.request({
        method: 'GET',
        url: apiurl,
        data: data,
        complete: (res)=>{
          if(res.statusCode!=200){
            wx.showToast({
              title: '网络故障请稍后',
              icon: 'error',
              duration: 2000
            })
          }else{
            let data = res.data
            if(data.code==1){
              resolve(data.result)
            }else{
              wx.showToast({
                title: data.message,
                icon: 'none',
                duration: 2000
              })
              //reject(data)
            }
          }
        }
      })
    })
  }

  static upload(...params){
    let[url,filepath,fieldname] = params
    fieldname = fieldname || 'imgs'
    let apiurl = config.API + url
    return new Promise((resolve,reject)=>{
        wx.uploadFile({
          url: apiurl, //仅为示例，非真实的接口地址
          filePath: filepath,
          name: fieldname,
          complete: (res)=>{
            if(res.statusCode!=200){
              wx.showToast({
                title: '网络故障请稍后',
                icon: 'error',
                duration: 2000
              })
            }else{
              let data = JSON.parse(res.data)//可能是wx.uploadfile的bug，返回的数据没有转对象
              if(data.code==1){
                resolve(data.result)
              }else{
                wx.showToast({
                  title: data.message,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          }
      })
    })
  }
}

class store{
  static set(...params){
    const [key,value] = params
    return new Promise((resolve,reject)=>{
      wx.setStorage({
        key: key,
        data: value,
        success: (res)=>{
          resolve(res.data)
        },
        fail: (err)=>{
          resolve(null)
        }
      })
    })
  }
  static get(...params){
    const [key] = params
    return new Promise((resolve,reject)=>{
      wx.getStorage({
        key: key,
        data: null,
        success: (res)=>{
          resolve(res.data)
        },
        fail: (err)=>{
          resolve(null)
        }
      })
    })
  }
  static pop(...params){
    const [key] = params
    return new Promise((resolve,reject)=>{
      wx.getStorage({
        key: key,
        data: null,
        success: (res)=>{
          wx.removeStorage({key: key})
          resolve(res.data)
        },
        fail: (err)=>{
          resolve(null)
        }
      })
    })
  }
}

class ui{

  static queren(...params){
    const [title,txt,cb] = params
    wx.showModal({
      confirmText: '确定',
      cancelText: '取消',
      title: title,
      content: txt,
      success (res) {
        if (res.confirm) {
          cb()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

  static xuanze(...params){
    const [title,txt,btn_right,right_cb,btn_left,left_cb] = params
    wx.showModal({
      confirmText: btn_right,
      cancelText: btn_left,
      title: title,
      content: txt,
      success (res) {
        if (res.confirm) {
          right_cb()
        } else if (res.cancel) {
          left_cb()
        }
      }
    })
  }
}

module.exports = {
  // formatTime,
  net,
  store,
  ui,
  config
}
