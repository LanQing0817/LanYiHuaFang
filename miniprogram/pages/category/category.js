// 导入封装的接口api
import {reqCategoryData} from '../../api/category'
Page({
  data:{
    categoryList:[],
    activeIndex:0
  },
  onLoad(){
    this.getCategoryData()
  },
  // 获取分类数据
  async getCategoryData(){
    // 调用接口获取分类数据
    const res=await reqCategoryData()
    this.setData({
      categoryList:res.data
    })
  },
  updateActive(e){
    this.setData({
      activeIndex:e.currentTarget.dataset.index
    })
  }
})
