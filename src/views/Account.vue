<template>
  <el-card class="account-container">
    <el-form :model="passForm" :rules="rules" ref="passRef" label-width="80px" label-position="right" class="demo-ruleForm">
      <el-form-item label="登录名：" >
        <el-input style="width: 200px" v-model="username" disabled ></el-input>
      </el-form-item>
      <el-form-item label="原密码：" prop="oldpass">
        <el-input style="width: 200px" v-model="passForm.oldpass"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newpass">
        <el-input style="width: 200px" v-model="passForm.newpass"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="submitPass">确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import axios from '../api/request'
import { ElMessage } from 'element-plus'
import { localGet } from '../utils'
import { updatePassword } from '../api/user'
import Swal from 'sweetalert2'

export default {
  name: 'Account',
  setup() {
    const passRef = ref(null)
    const state = reactive({
      username: localGet('token')?.split('&')[1] || '',
      user: null,
      passForm: {
        loginName: '',
        oldpass: '',
        newpass: ''
      },
      rules: {
        loginName: [
          { required: 'true', message: '登录名不能为空', trigger: ['change'] }
        ],
        oldpass: [
          { required: 'true', message: '原密码不能为空', trigger: ['change'] }
        ],
        newpass: [
          { required: 'true', message: '新密码不能为空', trigger: ['change'] }
        ]
      },
    })
    onMounted(() => {
      
    })
    const submitPass = () => {
      passRef.value.validate(async (vaild) => {
        if (vaild) {
          // axios.put('/users/admin/password', {
          //   username: state.username,
          //   originalPassword: state.passForm.oldpass,
          //   newPassword: state.passForm.newpass
          // }).then(() => {
          //   ElMessage.success('修改成功')
          //   window.location.reload()
          // })
          const res = await updatePassword(state.username, state.passForm.oldpass, state.passForm.newpass)
          if (res.code == 200) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '修改成功！',
              showConfirmButton: false,
              timer: 1500
            })
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: '修改失败，请重试！',
              showConfirmButton: false,
              timer: 1500
            })
          }
        }
      })
    }
    return {
      ...toRefs(state),
      passRef,
      submitPass
    }
  }
}
</script>

<style>
  .account-container {
    margin-bottom: 20px;
  }
</style>