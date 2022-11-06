import { ElNotification } from 'element-plus'
import nProgress from 'nprogress'

export const toast = (message, type = 'success') => {
  ElNotification({
    type,
    message,
    duration: 3000,
  })
}

export const showFullLoading = () => {
  nProgress.start()
}

export const hideFullLoading = () => {
  nProgress.done()
}

export function queryParams(query) {
  let q = []
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`)
    }
  }
  let r = q.join('&')
  r = r ? ('?' + r) : ''
  return r
}

export function useArrayMoveUp(arr, index) {
  return swapArray(arr, index, index - 1)
}

export function useArrayMoveDown(arr, index) {
  return swapArray(arr, index, index + 1)
}

function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  return arr
}