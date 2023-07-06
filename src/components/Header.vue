<template>
	<div class="header">
		<div class="userinfo">
			<el-avatar
				:size="32"
				class="mr-3"
				src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
			/>
			<el-dropdown>
				<span class="el-dropdown-link">
					aaaa<el-icon class="el-icon--right"><arrow-down /></el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item ><router-link to="/userinfo">个人信息</router-link></el-dropdown-item>
						<el-dropdown-item ><router-link to="/recycled">回收站</router-link></el-dropdown-item>
						<el-dropdown-item ><router-link to="/security">安全设置</router-link></el-dropdown-item>
						<el-dropdown-item ><router-link	to="/login" @click="logout()">退出登录</router-link></el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
		<div class="icons-group">
			<el-icon><BellFilled /></el-icon>
			<el-icon><Tools /></el-icon>
			<el-icon><Search /></el-icon>
		</div>
	</div>
</template>

<script setup>
import {
	ArrowDown,
	BellFilled,
	Tools,
	Search,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const logout = () => {
	localStorage.removeItem('token')
	router.push('/login')
}
</script>

<style lang="less" scoped>
.header {
	height: 100%;
	display: flex;
	flex-direction: row-reverse;

	.userinfo {
		height: 100%;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.icons-group {
		color: #999;
		height: 100%;
		font-size: 25px;
		line-height: 70px;
		margin-right: 10px;
		.el-icon {
			margin-left: 10px;
		}
	}
}
</style>