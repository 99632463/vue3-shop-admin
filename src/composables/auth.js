import { useCookies } from '@vueuse/integrations/useCookies'

const cookie = useCookies()
const TokenKey = 'admin-token'

export const setToken = (token) => {
  cookie.set(TokenKey, token)
}

export const getToken = () => {
  return cookie.get(TokenKey)
}

export const removeToken = () => {
  cookie.remove(TokenKey)
}