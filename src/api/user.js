import axios from './request'

// // 根据ID获取用户
// export function getUserById(userId: string) {
//   return axios.get(`/api/user/getUserById/${userId}`)
// }
// // 发送验证码
// export function sendEmail(email: string) {
//   return axios.post(`/api/user/sendEmail`, {
//     email: email
//   }, 
//   {
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
//   })
// }
// 根据邮箱登录
export function login(username, password) {
  return axios.post("/api/account/login", { 
    username: username, 
    password: password
  }, 
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  })
}
// 修改用户信息
export function updatePassword(username, originalPassword, newPassword) {
  return axios.put("/api/account/updatePassword", {
    username: username,
    originalPassword: originalPassword,
    newPassword: newPassword
  },
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

// // 退出登录
// export function logout() {
//   return axios.post("/api/user/logout", { 
//     token: localStorage.getItem('token') 
//   })
// }
// // 添加收款信息
// export function addAccount(account: any) {
//   return axios.post("/api/account/addAccount", { 
//     name: account.name, 
//     userId: account.userId,
//     type: account.type,
//     bankNumber: account.bankNumber,
//     alipayAccount: account.alipayAccount,
//     idNumber: account.idNumber,
//     remarks: account.remarks
//   }, 
//   {
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
//   })
// }
// // 根据账户ID获取收款信息
// export function getAccountById(id: string) {
//   return axios.get(`/api/account/getAccountById/${id}`)
// }
// // 根据用户ID获取所属收款信息
// export function getAccountList(userId: string) {
//   return axios.get(`/api/account/getAccountList/${userId}`)
// }

// // 获取部门主管
// export function getDepartmentApprovers(departmentId: any) {
//   return axios.get(`/api/user/getDepartmentApprovers/${departmentId}`)
// }

// // 获取审核财务
// export function getFinanceApprovers() {
//   return axios.get(`/api/user/getFinanceApprovers`)
// }

// export function getRoleById(roleId: number) {
//   return axios.get(`/api/role/getRoleById/${roleId}`)
// }