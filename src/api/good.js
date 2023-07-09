import axios from './request'

export function getAllGood() {
  return axios.get(`/api/good/getAllGood`)
}
export function getMaxBatch(name) {
  return axios.get(`/api/good/getMaxBatch/${name}`)
}
export function getSeletedGood(typeId) {
  return axios.get(`/api/good/getSeletedGood/${typeId}`)
}
export function search(keyword) {
  return axios.get(`/api/good/search/${keyword}`)
}
export function addGood(good) {
  console.log(good);
  return axios.post("/api/good/addGood", { 
    code: good.code,
    name: good.name,
    type: good.type,
    characteristic: good.characteristic,
    batch: good.batch,
    pic: good.pic,
    stock: good.stock,
    buyPrice: good.buyPrice,
    standardPrice: good.standardPrice,
    currentPrice: good.currentPrice,
    createDate: good.createDate || '',
    deadline: good.deadline || ''
  }, 
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  })
}
export function updatePrice(id, buyPrice, standardPrice) {
  return axios.put(`/api/good/updatePrice/${id}`, {
    buyPrice: buyPrice,
    standardPrice: standardPrice
  },
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  })
}
export function updateStock(id, stock) {
  return axios.put(`/api/good/updateStock/${id}`, {
    stock: stock
  },
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  })
}
export function reduceStock(id, stock) {
  return axios.put(`/api/good/reduceStock/${id}`, {
    stock: stock
  },
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

export function batchDelete(ids) {
  return axios.delete(`/api/good/batchDelete/${ids}`)
}
