<template>
  <!-- <el-dropdown>
    <el-icon><List /></el-icon>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in order.goods">
          <div class="purchase-item">
            <div>{{item.name}}</div>
            <div>x {{item.stock}}</div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown> -->
  <div class="purchase">
    <el-popconfirm
      title="确定下单吗？"
      @confirm="submitOrder"
    >
      <template #reference>
        <el-button type="primary" style="margin-top: -20px;">下单</el-button>
      </template>
    </el-popconfirm>
    
  </div>
  <div class="contain-good">
    <el-card :body-style="{ padding: '0px' }" v-for="item in goodList.message">
      <img
        :src="item.pic"
        class="image"
      />
      <div style="padding: 14px; padding-bottom: 0px;">
        <span>{{item.name}}</span>
        <div class="bottom">
          <span>{{ item.buyPrice }}￥</span>&nbsp;&nbsp;&nbsp;
          <el-button style="cursor: pointer;" type="danger" class="button" @click="handlePurchase(item)">采购</el-button>
        </div>
      </div>
    </el-card>
  </div>

  <el-dialog v-model="dialogFormVisible" title="商品采购" width="400px" style="display: flex; justify-content: center;align-items: center; flex-direction: column;"> 
    <el-form :model="currentGood">
      <el-form-item label="数量" :label-width="formLabelWidth">
        <el-input-number v-model="currentGood.stock" :min="0" :max="999999" @change="handleChange" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="purchase">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  
</template>

<script setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { localGet } from '../utils'
import { getAllGood, updateStock, getMaxBatch, addGood } from '../api/good'
import Swal from 'sweetalert2'
import { List } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'


const router = useRouter()
let maxBatch = ref(0)
const order = reactive({
  batch: '',
  goods: []
})
let currentGood = reactive({})
let dialogFormVisible = ref(false)

const goodList = reactive({message:[]})

onMounted(() => {
  getGoodList()
})

const getGoodList = async () => {
  const res = await getAllGood()
  res.data.forEach( good => {
    if (!goodList.message.find( item => item.code == good.code)) {
      goodList.message.push( good )
    } 
  })
}

const handlePurchase = async (good) => {
  const res = await getMaxBatch(good.name)
  maxBatch.value = res.data
  currentGood = good
  currentGood.stock = 0
  dialogFormVisible.value = true
}
const purchase = async () => {
  currentGood.batch = (Number(maxBatch.value) + 1) + ''
  const res = await addGood(currentGood)
  if (res.code == 200) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '采购成功！',
      showConfirmButton: false,
      timer: 1500
    })
  }
  dialogFormVisible.value = false
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
        width: 60%;
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