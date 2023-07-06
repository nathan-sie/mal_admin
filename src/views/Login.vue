<template>
  <div class="login-body">
    <div class="login-container">
      <div class="head">
        <div class="name">
          <div class="title">商品管理后台系统</div>
        </div>
      </div>
      <el-form label-position="top" :rules="rules" :model="ruleForm" ref="loginForm" class="login-form">
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model.trim="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model.trim="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verify">
          <el-input 
            placeholder="输入验证码"
            v-model="verify"
          >
          </el-input>
          <VueImageVerify class="image-verify" ref="verifyRef" />
        </el-form-item>
        <el-form-item>
          <div style="color: #333">登录表示您已同意<a>《服务条款》</a></div>
          <el-button style="width: 100%" type="primary" @click="submitForm">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from '../api/request'
import { reactive, ref, toRefs } from 'vue'
import { localSet } from '../utils'
import VueImageVerify from '../components/VueImageVerify.vue'
import Swal from 'sweetalert2'
import  { login }  from '../api/user'

export default {
  name: 'login',
  components: {
    VueImageVerify
  },
  setup() {
    const verifyRef = ref(null)
    const loginForm = ref(null)
    const state = reactive({
      imgCode: '',
      verify: '',
      ruleForm: {
        username: '',
        password: '',
      },
      checked: true,
      rules: {
        username: [
          { required: 'true', message: '账户不能为空', trigger: 'blur' }
        ],
        password: [
          { required: 'true', message: '密码不能为空', trigger: 'blur' }
        ]
      }
    })
    const submitForm = async () => {
      loginForm.value.validate(async (valid) => {
        if (valid) {
          state.imgCode = verifyRef.value.imgCode || ''
          if (state.verify.toLowerCase() != state.imgCode.toLowerCase()) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: '验证码错误，请重试！',
              showConfirmButton: false,
              timer: 1500
            })
            return
          }
          // axios.post('/users/admin/login', {
          //   userName: state.ruleForm.username || '',
          //   password: state.ruleForm.password
          // }).then(res => {
          //   localSet('token', res)
          //   window.location.href = '/'
          // })
          const res = await login(state.ruleForm.username, state.ruleForm.password)
          if (res.code == 200) {
            localSet('token', res.data)
            window.location.href = '/'
          }
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    }
    const resetForm = () => {
      loginForm.value.resetFields();
    }
    return {
      ...toRefs(state),
      loginForm,
      verifyRef,
      submitForm,
      resetForm,
    }
  }
}
</script>

<style scoped>
  .login-body {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    background-image: linear-gradient(25deg, #077f7c, #3aa693, #5ecfaa, #7ffac2);
  }
  .login-container {
    width: 420px;
    height: 520px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
  }
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
  }
  .head img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  .head .title {
    font-size: 28px;
    color: #1BAEAE;
    font-weight: bold;
  }
  .head .tips {
    font-size: 12px;
    color: #999;
  }
  .login-form {
    width: 70%;
    margin: 0 auto;
  }
  .image-verify {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
<style>
  .el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .login-form .el-form-item {
    margin-bottom: 12px;
  }
</style>