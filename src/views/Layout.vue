<template>
	<div class="common-layout">
    <el-container>
      <el-aside width="15%" >
        <h5 class="mb-2">商品后台管理系统</h5>
        <el-menu
          style="height: calc(100% - 50px);"
          active-text-color="#ffd04b"
          background-color="#545c64"
          class="el-menu-vertical-demo"
          :default-active="path"
          text-color="#fff"
          @select="handleSelect"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="1">
            <el-icon><Grid /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="2">
            <el-icon><Shop /></el-icon>
            <span>商品管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <el-icon><Shop /></el-icon>
            <span>商品采购</span>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon><Money /></el-icon>
            <span>商品售卖</span>
          </el-menu-item>
          <el-menu-item index="5">
            <el-icon><Lock /></el-icon>
            <span>修改密码</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container width="80%">
        <el-header><Header /></el-header>
        <el-main><RouterView /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup >
import { ref, onMounted } from 'vue'
import { Lock, Grid, Shop, Money } from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../components/Header.vue';

const router = useRouter()
const route = useRoute()

const path = ref('')
onMounted(() => {
	if (route.meta.index) {
		path.value = route.meta.index
	}
})
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleSelect = (key, keyPath) => {
	switch (key) {
    case '1':
      router.push('/category')
      break
    case '2':
			router.push('/good')
			break
		case '3':
			router.push('/purchase')
			break
		case '4':
			router.push('/sell')
			break
		case '5':
			router.push('/account')
			break
		default:
			break
	}
}
</script>

<style lang="less">
.common-layout {
	height: 100vh;

  .el-aside {
    .mb-2{
      width: calc(100% - 1px);
      height: 50px;
      background-color: #545c64;
      color: white;
      font-size: 24px;
      line-height: 50px;
    }
  }
	.el-container {
		height: 100%;
	}
}
</style>