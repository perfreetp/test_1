export function isValidUrl(url) {
  if (!url || url.trim() === '') {
    return true
  }
  
  const trimmedUrl = url.trim()
  
  const urlPattern = /^(https?:\/\/)[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i
  
  const relativePattern = /^\/[\w-./?=&%#-]*$/
  
  return urlPattern.test(trimmedUrl) || relativePattern.test(trimmedUrl)
}

export function formatUrl(url) {
  if (!url || url.trim() === '') {
    return ''
  }
  
  const trimmedUrl = url.trim()
  
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }
  
  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl
  }
  
  return 'https://' + trimmedUrl
}

export function isValidImageUrl(url) {
  if (!url || url.trim() === '') {
    return true
  }
  
  const trimmedUrl = url.trim()
  
  const urlPattern = /^(https?:\/\/)[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i
  
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i
  
  if (imageExtensions.test(trimmedUrl)) {
    return urlPattern.test(trimmedUrl) || trimmedUrl.startsWith('/')
  }
  
  return urlPattern.test(trimmedUrl) || trimmedUrl.startsWith('/')
}
