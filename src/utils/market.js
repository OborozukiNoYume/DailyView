/**
 * 市场编码 → 本地化标签映射
 * 与 DailyWall 后端已验证的 11 个市场保持一致
 */
export const marketLabels = {
  'de-DE': '德国',
  'en-CA': '加拿大',
  'en-GB': '英国',
  'en-IN': '印度',
  'en-US': '美国',
  'es-ES': '西班牙',
  'fr-FR': '法国',
  'it-IT': '意大利',
  'ja-JP': '日本',
  'pt-BR': '巴西',
  'zh-CN': '中国',
}

/**
 * 格式化市场编码为本地化标签
 * 兼容字符串（"zh-CN"）和数组（["zh-CN", "en-US"]）两种返回
 */
export function formatMarkets(mkt) {
  if (!mkt) return ''
  if (Array.isArray(mkt)) {
    return mkt.map(m => marketLabels[m] || m).join('、')
  }
  return marketLabels[mkt] || mkt
}
