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