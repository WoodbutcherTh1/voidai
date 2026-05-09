export type ApiKeys = Record<string, string>;

const STORAGE_KEY = "apiKeys";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getApiKeys(): ApiKeys {
  if (!isBrowser()) return {};
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as ApiKeys) : {};
  } catch {
    return {};
  }
}

export function setApiKey(provider: string, key: string): void {
  if (!isBrowser()) return;
  const keys = getApiKeys();
  keys[provider] = key;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function removeApiKey(provider: string): void {
  if (!isBrowser()) return;
  const keys = getApiKeys();
  delete keys[provider];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function clearApiKeys(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}
