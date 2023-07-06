import axios from './request'

export function getAllCategory() {
  return axios.get(`/api/category/getAllCategory`)
}
export function addCategory(name) {
  return axios.post("/api/category/addCategory", { 
    name: name
  }, 
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  })
}
export function updateCategory(id, name) {
  return axios.put("/api/category/updateCategory", {
    id: id,
    name: name
  },
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  })
}
export function batchDelete(ids) {
  return axios.delete(`/api/category/batchDelete/${ids}`)
}