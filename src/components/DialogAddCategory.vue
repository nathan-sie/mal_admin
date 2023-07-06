<template>
  <el-dialog
    :title="type == 'add' ? '添加分类' : '修改分类'"
    v-model="visible"
    width="400px"
    @close="handleClose"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="分类名称" prop="name">
        <el-input type="text" v-model="ruleForm.name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { addCategory, updateCategory } from '../api/category'
import Swal from 'sweetalert2'

export default {
  name: 'DialogAddCategory',
  props: {
    type: String,
    reload: Function
  },
  setup(props) {
    const formRef = ref(null)
    const route = useRoute()
    const state = reactive({
      visible: false,
      ruleForm: {
        name: '',
      },
      rules: {
        name: [
          { required: 'true', message: '名称不能为空', trigger: ['change'] }
        ],
      },
      id: ''
    })
    // 开启弹窗
    const open = (category) => {
      state.visible = true
      if (category) {
        state.id = category.id
        state.ruleForm.name = category.name
      } else {
        handleClose()
      }
    }
    // 关闭弹窗
    const close = () => {
      state.visible = false
    }
    const handleClose = () => {
      formRef.value.resetFields()
    }
    const submitForm = () => {
      formRef.value.validate(async (valid) => {
        if (valid) {
          if (state.ruleForm.name.length > 16) {
            ElMessage.error('名称不能超过16个字符')
            return
          }
          if (props.type == 'add') {
            const res = await addCategory(state.ruleForm.name)
            if (res.code == 200) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '添加成功！',
                showConfirmButton: false,
                timer: 1500
              })
            }
            state.visible = false
            if (props.reload) props.reload()
          } else {
            const res = await updateCategory(state.id, state.ruleForm.name)
            if (res.code == 200) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '修改成功！',
                showConfirmButton: false,
                timer: 1500
              })
            }
            state.visible = false
            if (props.reload) props.reload()
          }
        }
      })
    }
    return {
      ...toRefs(state),
      open,
      close,
      formRef,
      submitForm,
      handleClose
    }
  }
}
</script>