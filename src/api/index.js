import axios from 'axios'

const http = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

export async function getFilters() {
  const { data } = await http.get('/filters')
  return data.data
}

export async function getWallpapers(params = {}) {
  const { data } = await http.get('/wallpapers', { params })
  return data.data
}

export function getImageUrl(id, size = 'preview') {
  return `/api/images/${id}?size=${size}`
}

export function getDownloadUrl(id) {
  return `/api/images/${id}/download`
}

export async function getRandomWallpaper() {
  const { data } = await http.get('/wallpapers/random')
  return data.data
}
