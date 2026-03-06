const DEFAULT_WECHAT_SERVICE_URL = 'https://work.weixin.qq.com/';

export function getSupportUrl() {
  const fromEnv = import.meta.env.VITE_WECHAT_SERVICE_URL;
  if (typeof fromEnv === 'string' && fromEnv.trim()) {
    return fromEnv.trim();
  }
  return DEFAULT_WECHAT_SERVICE_URL;
}

export function openCustomerSupport() {
  const url = getSupportUrl();
  window.open(url, '_blank', 'noopener,noreferrer');
  return url;
}
