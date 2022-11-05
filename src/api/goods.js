import axios from '~/axios'

export function getGoodsList(page = 1,data) {
  // return axios.get(`/admin/goods/${page}?tab=${data.tab || 'all'}&title=${data.title || ''}&category_id=${data.category_id || ''}`)
  return axios.get(`/admin/goods/${page}?tab=${data.tab || 'all'}`)
}
export function updateGoodsStatus(ids, status) {
  return axios.post(`/admin/goods/changestatus`, {ids,status})
}
export function createGoods(data) {
  return axios.post(`/admin/goods`, data)
}
export function updateGoods(id, data) {
  return axios.post(`/admin/goods/${id}`, data)
}
export function deleteGoods(ids) {
  return axios.post(`/admin/goods/delete_all`, {ids})
}