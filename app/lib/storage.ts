export function getApiKeys() {
    if (typeof window === "undefined") return {}
    const data = localStorage.getItem("apiKeys")
    return data ? JSON.parse(data) : {}
  }
  
  export function setApiKey(provider: string, key: string) {
    const keys = getApiKeys()
    keys[provider] = key
    localStorage.setItem("apiKeys", JSON.stringify(keys))
  }
  
  export function removeApiKey(provider: string) {
    const keys = getApiKeys()
    delete keys[provider]
    localStorage.setItem("apiKeys", JSON.stringify(keys))
  }
  
  export function clearApiKeys() {
    localStorage.removeItem("apiKeys")
  }