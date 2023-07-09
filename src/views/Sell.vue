<template>
    <div>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="goodList.message"
        tooltip-effect="dark"
        row-key="id"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="code"
          label="商品编号"
          width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名"
          width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="type"
          label="商品类别"
        >
        </el-table-column>
        <el-table-column
          prop="batch"
          label="商品批次 "
          width="150px"
        >
          <template #default="scope">
            <el-tag>{{ scope.row.batch }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="商品图片"
          width="150px"
        >
          <template #default="scope">
            <img style="width: 100px; height: 100px;" :key="scope.row.id" :src="scope.row.pic" alt="商品主图">
          </template>
        </el-table-column>
        <el-table-column
          prop="currentPrice"
          label="商品售价(元)"
          width="140px"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="商品生产日期"
          width="240px"
        >
        </el-table-column>
        <el-table-column
          prop="deadline"
          label="商品保质期"
          width="240px"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
        >
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px" @click="handlePurchase(scope.row)">售卖</a>
          </template>
        </el-table-column>
      </el-table>
  </div>

  <el-dialog v-model="dialogFormVisible" title="商品购买" width="400px" style="display: flex; justify-content: center;align-items: center; flex-direction: column;"> 
    <el-form :model="currentGood">
      <el-form-item label="数量" :label-width="formLabelWidth">
        <el-input-number v-model="currentGood.stock" :min="0" :max="999999" @change="handleChange" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="buy">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  
</template>

<script setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { getAllCategory } from '../api/category'
import { getAllGood, updateStock, reduceStock } from '../api/good'
import Swal from 'sweetalert2'
import { List } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import  { getPrice } from '../utils'

const router = useRouter()
const order = reactive({
  batch: '',
  goods: []
})
let currentGood = reactive({})
let dialogFormVisible = ref(false)

const goodList = reactive({message:[]})
const allTypes = new Map()
onMounted(() => {
  getCategory()
  getGoodList()
})
// 获取分类列表
const getCategory = async () => {
  const res = await getAllCategory()
  if( res.code == 200 ){
    res.data.map( item => {
      allTypes.set(item.id, item.name)
    })
  }
}
// 获取商品列表
const getGoodList = async () => {
  const res = await getAllGood()
  res.data.forEach( item => {
    item.type = allTypes.get(item.type)
    item.currentPrice = getPrice(item.characteristic, item.standardPrice, item.createDate, item.deadline)
    item.children = []
    if( !goodList.message.find( i => i.code == item.code ) ) {
      goodList.message.push( item )
    } else {
      goodList.message.forEach( i => {
        if ( i.code == item.code ) {
          i.children = [...i.children, item]
        }
      })
    }
  })
}

const handlePurchase = (good) => {
  dialogFormVisible.value = true
  currentGood = good
  currentGood.stock = 0
}
const buy = async () => {
  console.log(currentGood);
  if ( currentGood.stock > 0 ) {
    const res = await reduceStock(currentGood.id, currentGood.stock)
    if ( res.code == 200 ) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: '正在模拟支付流程！',
        showConfirmButton: false,
        timer: 3500
      })
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: '库存不足，请选择其他批次',
        showConfirmButton: false,
        timer: 1500
      })
    }
    currentGood = {}
    dialogFormVisible.value = false
  }
  // if (order.goods.find(item => item.id == currentGood.id)) {
  //   order.goods.forEach(item => {
  //     if (item.id == currentGood.id) {
  //       item.stock = currentGood.stock
  //     }
  //   })
  // } else {
  //   order.goods.push({
  //     id: currentGood.id,
  //     name: currentGood.name,
  //     stock: currentGood.stock
  //   })
  // }
  // currentGood.id = ''
  // currentGood.name = ''
  // currentGood.stock = 0
  // dialogFormVisible.value = false
}
const handleChange = (value) => {
  currentGood.stock = value
}

const submitOrder = () => {

  //采购库存处理
  order.goods.forEach(async item => {
    await updateStock(item.id, item.stock)
  })
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: '正在模拟采购其他流程！',
    showConfirmButton: false,
    timer: 3500
  })
  setTimeout(() => {
    //跳转到商品管理
    router.push('/good')
  }, 3500)
}
</script>

<style lang="less" scoped>
  .account-container {
    margin-bottom: 20px;
  }
  .el-icon {
    position: absolute;
    right: -415px;
    font-size: 32px;
    color: orange;
    margin-right: 10px;
  }
  .purchase-item {
    width: 100px;
    display: flex;
    justify-content: space-between;
  }
  .purchase {
    position: absolute;
    right: 20px;
  }
  .contain-good {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    .el-card {
      padding: 0;
      width: 30%;
      height: 360px;
      margin-right: 20px;
      margin-top: 20px;
      .image {
        width: 100%;
      }
    }
    .bottom {
      position: relative;
      bottom: -10px;
      span {
        font-weight: 600;
      }
    }

  }
  .example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
</style>