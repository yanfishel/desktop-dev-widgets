
export function setStorageItem(key: string, value: string) {
  const storage = window.localStorage
  storage.setItem(key, value)
}

export function getStorageItem(key: string) {
  const item = window.localStorage.getItem(key) || window.sessionStorage.getItem(key)

  return item ? item : null
}

export function removeStorageItem(key: string, session = false) {
  const storage = session ? window.sessionStorage : window.localStorage
  storage.removeItem(key)
}