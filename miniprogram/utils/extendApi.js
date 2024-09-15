// 在使用toast方法时，可以传入参数，也可以不传入参数
const toast=({title='数据加载中...',icon="none",duration=2000,mask=true})=>{
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}

const modal=(options={})=>{
  return new Promise((resolve)=>{
    const defaultOpt={
      title:'提示',
      content:'您确定执行该操作吗？',
      cofirmColor:'#f3514f'
    }
    // 通过Object.assign方法将参数进行合并
    const opts=Object.assign({},defaultOpt,options)
    wx.showModal({
      ...opts,
      complete({confirm,cancel}){
        confirm&&resolve(true)
        cancel&&resolve(false)
      }
    })
  })
}
wx.modal=modal
wx.toast=toast
