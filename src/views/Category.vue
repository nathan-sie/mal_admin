<template>
  <el-card class="category-container">
    <template #header>
      <div class="header">
        <el-button type="primary" :icon="Plus" @click="handleAdd">增加</el-button>
        <el-popconfirm
          title="确定删除吗？"
          @confirm="handleDelete"
        >
          <template #reference>
            <el-button type="danger" :icon="Delete">批量删除</el-button>
          </template>
        </el-popconfirm>
        <div style="display: flex; position: absolute; left: 80%;">
          <el-input v-model="keyword" />
          <el-button type="primary" :icon="Search" @click="handleSearch(keyword)">搜索</el-button>
          <div style="margin-left: 5px;">
            <el-button  @click="handleClear">重置</el-button>
          </div>
        </div>
        
      </div>
    </template>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="分类名称"
      >
      </el-table-column>
      <!-- <el-table-column
        prop="categoryRank"
        label="排序值"
        width="120"
      >
      </el-table-column> -->
      <el-table-column
        prop="createTime"
        label="添加时间"
        width="240"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="220"
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
  </el-card>
  <DialogAddCategory ref='addGood' :reload="getCategory" :type="type"  />
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import DialogAddCategory from '../components/DialogAddCategory.vue'
import { getAllCategory, searchCategory } from '../api/category'
import { Plus, Delete, Search } from '@element-plus/icons-vue'
import { batchDelete } from '../api/category'
import Swal from 'sweetalert2'

export default {
  name: 'Category',
  components: {
    DialogAddCategory
  },
  setup() {
    const multipleTable = ref(null)
    const addGood = ref(null)
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      type: 'add', // 操作类型
      level: 1,
      parent_id: 0,
      keyword: ''
    })
    onMounted(() => {
      getCategory()
    })
    // 获取分类列表
    const getCategory = async () => {
      state.loading = true
      const res = await getAllCategory()
      if( res.code == 200 ){
        state.tableData = res.data
      }
      state.loading = false
    }
    // 添加分类
    const handleAdd = () => {
      state.type = 'add'
      addGood.value.open()
    }
    // 修改分类
    const handleEdit = (category) => {
      state.type = 'edit'
      addGood.value.open(category)
    }
    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
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
        getCategory()
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
        getCategory()
      }
    }
    // 搜索
    const handleSearch = async (keyword) => {
      state.loading = true
      if (keyword) {
        const res = await searchCategory(keyword)
        if( res.code == 200 ) {
          state.tableData = res.data
        } else {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: '搜索未找到！',
            showConfirmButton: false,
            timer: 1500
          })
        }
      } else {
        getCategory()
      }
      state.loading = false
    }
    // 重置
    const handleClear = () => {
      state.keyword = ''
      getCategory()
    }
    const changePage = (val) => {
      state.currentPage = val
      state.tableData = res.data
    }
    return {
      ...toRefs(state),
      multipleTable,
      handleSelectionChange,
      addGood,
      handleAdd,
      handleEdit,
      handleDelete,
      handleDeleteOne,
      getCategory,
      changePage,
      handleSearch,
      handleClear
    }
  }
}
</script>

<style scoped>
  .category-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
  .header {
    display: flex;
  }
</style>