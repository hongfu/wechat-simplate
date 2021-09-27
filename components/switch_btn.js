Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    value: {
      type: Boolean,
      value: false
    },
    activeColor: {
      type: String,
      value: "#09BB07"
    }
  },
  data: {
  },
  methods: {
    // 这里是一个自定义方法
    // change: function (e) { 
    //   console.log(e)
    //   const stateChangeDetail = {
    //     mvalue: this.data.value
    //   }
    //   this.triggerEvent('stateChange',stateChangeDetail,{})
    // }
  }
})