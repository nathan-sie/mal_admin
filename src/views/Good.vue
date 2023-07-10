<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <!-- <el-button type="primary" @click="handleAdd">新增商品</el-button> -->
        <el-popconfirm
          title="确定删除吗？"
          @confirm="handleDelete"
        >
          <template #reference>
            <el-button type="danger" :icon="Delete">批量删除</el-button>
          </template>
        </el-popconfirm>
        <el-button type="info" @click="exportToExcel">导出商品</el-button>

        <div style="display: flex; position: absolute; left: 65%;">
          <el-input v-model="keyword" placeholder="关键词" />
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        </div>
        <el-select v-model="value" clearable placeholder="分类选择" style="position: absolute; right: 20px;" @change="handleSelectChange">
          <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          />
        </el-select>
      </div>
    </template>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      row-key="id"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="code"
        label="商品编号"
        width="140px"
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
        prop="characteristic"
        label="商品特性 "
      >
      </el-table-column>
      <el-table-column
        prop="batch"
        label="商品批次 "
        width="150px"
      >
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
        prop="stock"
        label="商品库存"
      >
      </el-table-column>
      <el-table-column
        prop="buyPrice"
        label="商品进价(元)"
        width="140px"
      >
      </el-table-column>
      <el-table-column
        prop="standardPrice"
        label="商品标价(元)"
        width="140px"
      >
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
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row)">修改</a>
          <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDeleteOne(scope.row.id)"
          >
            <template #reference>
              <a style="cursor: pointer">删除</a>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--总数超过一页，再展示分页器-->
    <!-- <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    /> -->

    <el-dialog v-model="editGoodVisible" title="维护商品价格"  width="500px">
      进货价 <el-input-number v-model="buyPrice" :min="0" :max="999999" @change="handleChange" /><br /><br /><br />
      标准价 <el-input-number v-model="standardPrice" :min="0" :max="999999" @change="handleChange" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editGoodVisible = false">取消</el-button>
          <el-button type="primary" @click="editPrice(buyPrice, standardPrice)">确定</el-button>
        </span>
      </template>
    </el-dialog>

  </el-card>

</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getAllGood } from '../api/good'
import Swal from 'sweetalert2'
import { getAllCategory } from '../api/category'
import { useCharacteristicMap, getPrice } from '../utils'
import { updatePrice, getSeletedGood, search, batchDelete } from '../api/good'
import { Search } from '@element-plus/icons-vue'
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'


export default {
  name: 'Good',
  setup() {
    const editGoodVisible = ref(false)
    const multipleTable = ref(null)
    const router = useRouter()
    const keyword = ref('')
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      allTypes: new Map(),
      characteristicMap: useCharacteristicMap(),
      multipleSelection: [], // 选中项
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      currentId: 0, 
      buyPrice: 0,
      standardPrice: 0,
    })
    const value = ref('')
    const options = reactive([])
    onMounted(() => {
      getCategory()
      getGoodList()
    })
    // 获取分类列表
    const getCategory = async () => {
      const res = await getAllCategory()
      if( res.code == 200 ){
        res.data.map( item => {
          state.allTypes.set(item.id, item.name)
          options.push({
            value: item.id,
            label: item.name
          })
        })
      }
    }
    // 获取商品列表
    const getGoodList = async () => {
      state.loading = true
      state.tableData = []
      const res = await getAllGood()
      // state.tableData = res.data
      // state.tableData.forEach( item => {
      //   item.type = state.allTypes.get(item.type)
      //   item.currentPrice = getPrice(item.characteristic, item.standardPrice, item.createDate, item.deadline)
      //   item.characteristic = state.characteristicMap.get(item.characteristic)
      // })
      res.data.forEach( item => {
        item.type = state.allTypes.get(item.type)
        if( item.characteristic == 2 ) {
          item.stock = '~'
        }
        item.currentPrice = getPrice(item.characteristic, item.standardPrice, item.createDate, item.deadline)
        item.children = []
        if( !state.tableData.find( i => i.code == item.code ) ) {
          state.tableData.push( item )
        } else {
          state.tableData.forEach( i => {
            if ( i.code == item.code ) {
              if (i.children != undefined ) {
                i.children = [...i.children, item]
              } else {
                i.children = [item]
              }
            }
          })
        }
      })
      state.tableData = state.tableData.sort( (a, b) => a.code - b.code )
      state.loading = false
      // axios.get('/goods/admin/list', {
      //   params: {
      //     pageNumber: state.currentPage,
      //     pageSize: state.pageSize
      //   }
      // }).then(res => {
      //   state.tableData = res.list
      //   state.total = res.totalCount
      //   state.currentPage = res.currPage
      //   state.loading = false
      // })
    }
    const handleAdd = () => {
      router.push({ path: '/add' })
    }
    const handleEdit = (good) => {
      editGoodVisible.value = true
      state.currentId = good.id
      state.buyPrice = good.buyPrice
      state.standardPrice = good.standardPrice
      // router.push({ path: '/add', query: { id } })
    }
    const editPrice = async (buyPrice, standardPrice) => {
      const res = await updatePrice(state.currentId, buyPrice, standardPrice)
      if (res.code == 200 ) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '修改成功！',
          showConfirmButton: false,
          timer: 1500
        })
        getGoodList()
      }
      editGoodVisible.value = false
    }
    // 批量删除
    const handleDelete = async () => {
      if (!state.multipleSelection.length) {
        ElMessage.error('请选择项')
        return
      }
      let ids = state.multipleSelection.map(i => i.id)
      const res = await batchDelete(ids.join('&'))
      if( res.code == 200 ) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '删除成功！',
          showConfirmButton: false,
          timer: 1500
        })
        getGoodList()
      }
    }
    // 单个删除
    const handleDeleteOne = async (id) => {
      const res = await batchDelete(id)
      if( res.code == 200 ) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '删除成功！',
          showConfirmButton: false,
          timer: 1500
        })
        getGoodList()
      }
    }
    const handleSelectChange = (val) => { // 类别的ID
      if( val == '' ) {
        getGoodList()
      } else {
        getGoodListByType(val)
      }
    }
    const getGoodListByType = async (typeId) => {
      state.loading = true
      state.tableData = []
      const res = await getSeletedGood(typeId)
      // state.tableData = res.data
      // state.tableData.forEach( item => {
      //   item.type = state.allTypes.get(item.type)
      //   item.currentPrice = getPrice(item.characteristic, item.standardPrice, item.createDate, item.deadline)
      //   item.characteristic = state.characteristicMap.get(item.characteristic)
      // })
      res.data.forEach( item => {
        item.type = state.allTypes.get(item.type)
        item.currentPrice = getPrice(item.characteristic, item.standardPrice, item.createDate, item.deadline)
        item.children = []
        if( !state.tableData.find( i => i.code == item.code ) ) {
          state.tableData.push( item )
        } else {
          state.tableData.forEach( i => {
            if ( i.code == item.code ) {
              if (i.children != undefined ) {
                i.children = [...i.children, item]
              } else {
                i.children = [item]
              }
            }
          })
        }
      })
      state.loading = false
    }
    const handleSearch = async () => {
      if (keyword.value == '') {
        getGoodList()
      }
      const res = await search(keyword.value)
      if (res.code == 200) {
        state.tableData = res.data
        state.tableData.forEach( item => {
          item.type = state.allTypes.get(item.type)
          item.currentPrice = getPrice(item.characteristic, item.standardPrice, item.createDate, item.deadline)
          item.characteristic = state.characteristicMap.get(item.characteristic)
        })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: '搜索失败，请重新尝试！',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
    //导出商品信息
    const exportToExcel = () => {
      const arr = []
      state.tableData.forEach( item => {
        if (item.children.length > 0) {
          item.children.forEach( i => arr.push(i) )
        } 
        arr.push(item)
      }) 
      // 创建工作簿
      const workbook = XLSX.utils.book_new();

      // 创建工作表
      const worksheet = XLSX.utils.json_to_sheet(arr);

      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, '商品信息');

      // 将工作簿转换为二进制文件
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

      // 将二进制文件转换为 Blob 对象
      const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

      // 使用 file-saver 库将 Blob 对象保存为文件
      saveAs(blob, 'products.xlsx');
    }
    // 将字符串转换为 ArrayBuffer 对象
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }
    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    const changePage = (val) => {
      state.currentPage = val
      getGoodList()
    }
    const handleStatus = (id, status) => {
      // axios.put(`/goods/admin/updateStatus/${status}`, {
      //   ids: id ? [id] : []
      // }).then(() => {
      //   ElMessage.success('修改成功')
      //   getGoodList()
      // })
    }
    return {
      ...toRefs(state),
      editGoodVisible,
      multipleTable,
      handleSelectionChange,
      handleAdd,
      handleEdit,
      getGoodList,
      changePage,
      handleStatus,
      handleDelete,
      handleDeleteOne,
      editPrice,
      value,
      options,
      handleSelectChange,
      keyword,
      handleSearch,
      exportToExcel
    }
  }
}
</script>

<style scoped>
  .good-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
  .header {
    display: flex;
  }
</style>