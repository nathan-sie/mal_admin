<template>
  <el-aside width="14%" class="aside">
		<div class="aside-logo">
			企业报销管理
		</div>


		<!-- <div class="aside-menu" v-if="user.roleId == 2">
			<el-menu
				:default-active="path"
				class="el-menu-vertical-demo"
				@open="handleOpen"
				@close="handleClose"
				@select="handleSelect"
				active-text-color="#00BFFF"
				background-color="#1D2B3D"
				text-color="#fff"
				:default-openeds="['2']"
			>
				<el-menu-item index="1">
					<template #title>
						<el-icon><HomeFilled /></el-icon>
						<span>首页</span>
					</template>
				</el-menu-item>
				<el-sub-menu index="2">
					<template #title>
						<el-icon><UserFilled /></el-icon>
						<span>我的</span>
					</template>
					<el-menu-item index="2-1">
						<template #title>
							<el-icon><Document /></el-icon>
							<span>我的单据</span>
						</template>
					</el-menu-item>
					<el-menu-item index="2-2">
						<template #title>
							<el-icon><Money /></el-icon>
							<span>我的借款</span>
						</template>
					</el-menu-item>
				</el-sub-menu>
				<el-menu-item index="3">
					<template #title>
						<el-icon><PieChart /></el-icon>
						<span>个人报表</span>
					</template>
				</el-menu-item>
			</el-menu>
		</div> -->


		<div class="aside-menu">
			<el-menu
				:default-active="path"
				class="el-menu-vertical-demo"
				@open="handleOpen"
				@close="handleClose"
				@select="handleSelect"
				active-text-color="#00BFFF"
				background-color="#1D2B3D"
				text-color="#fff"
				:default-openeds="['2']"
			>
				<!-- 首页 -->
				<el-menu-item index="1">
					<template #title>
						<el-icon><HomeFilled /></el-icon>
						<span>首页</span>
					</template>
				</el-menu-item>
				<!-- 我的单据借款等 -->
				<el-sub-menu index="2">
					<template #title>
						<el-icon><UserFilled /></el-icon>
						<span>我的</span>
					</template>
					<el-menu-item index="2-1">
						<template #title>
							<el-icon><Document /></el-icon>
							<span>我的单据</span>
						</template>
					</el-menu-item>
					<el-menu-item index="2-2">
						<template #title>
							<el-icon><Money /></el-icon>
							<span>我的借款</span>
						</template>
					</el-menu-item>
				</el-sub-menu>
				<!-- 个人报表 -->
				<el-menu-item index="3">
					<template #title>
						<el-icon><PieChart /></el-icon>
						<span>个人报表</span>
					</template>
				</el-menu-item>

			</el-menu>
		</div>
	</el-aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import {
	HomeFilled,
	UserFilled,
	Document,
	Money,
	PieChart,
	Operation,
	WalletFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const path = ref('')
onMounted(() => {
	if (route.meta.index) {
		path.value = route.meta.index as string
	}
})
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleSelect = (key: string, keyPath: string[]) => {
	switch (key) {
		case '1':
			router.push('/')
			break
		case '2-1':
			router.push('/reimbursement')
			break
		case '2-2':
			router.push('/loan')
			break
		case '3':
			router.push('/personal-statement')
			break
		case '4-1':
			router.push('/approve_reimbursement')
			break
		case '4-2':
			router.push('/approve_repayment')
			break
		case '5':
			router.push('/unpaid')
			break
		default:
			break
	}
}
</script>

<style scoped lang="less">
.aside {
	display: flex;
	flex-direction: column;
	overflow: hidden;
	.aside-logo {
		height: 100px;
		background-color: rgb(29,43,61);
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-size: 25px;
		font-family:Arial, Helvetica, sans-serif;
	}

	.aside-menu {
		flex: 1;
		.el-menu {
			height: 100%;
			width: 262px;
			border-right: none;
		}
	}
}
</style>