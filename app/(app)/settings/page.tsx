"use client";

import { getApiKeys, setApiKey, removeApiKey, clearApiKeys } from "@/app/lib/storage";
import { useState, useEffect } from "react";
import Button from "@/app/components/ui/button";
import { useTheme } from "@/app/components/ThemeProvider";

const PROVIDERS = [
  { id: "openrouter", label: "OpenRouter" },
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "gemini", label: "Gemini" },
  { id: "groq", label: "Groq" },
  { id: "ollama", label: "Ollama" },
];

const THEMES = [
  { value: "dark", label: "Void Dark" },
  { value: "light", label: "Light Mode" },
  { value: "ocean", label: "Ocean Blue" },
  { value: "forest", label: "Forest Green" },
  { value: "sunset", label: "Sunset Orange" },
  { value: "system", label: "System Default" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [keys, setKeys] = useState<Record<string, string>>({});
  const [activeProvider, setActiveProvider] = useState<string>("openai");
  const [language, setLanguage] = useState<string>("en");
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  // Load stored API keys and language on mount
  useEffect(() => {
    const storedKeys = getApiKeys();
    setKeys(storedKeys);
    const savedLang = localStorage.getItem("voidai_language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Persist language selection to localStorage
  useEffect(() => {
    localStorage.setItem("voidai_language", language);
  }, [language]);

  const handleKeyChange = (provider: string, value: string) => {
    setKeys((prev) => ({ ...prev, [provider]: value }));
  };

  const handleSave = (provider: string) => {
    const key = keys[provider] ?? "";
    if (key.trim()) {
      setApiKey(provider, key.trim());
      alert(`${provider} API key saved to local storage!`);
    } else {
      alert(`Please enter a valid key for ${provider}`);
    }
  };

  const handleDelete = (provider: string) => {
    if (confirm(`Are you sure you want to delete the ${provider} API key?`)) {
      removeApiKey(provider);
      setKeys((prev) => {
        const updated = { ...prev };
        delete updated[provider];
        return updated;
      });
      alert(`${provider} API key deleted from local storage!`);
    }
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to delete all API keys?")) {
      clearApiKeys();
      setKeys({});
      alert("All API keys cleared from local storage!");
    }
  };

  const toggleShowKey = (providerId: string) => {
    setShowKey((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const copyToClipboard = async (providerId: string) => {
    const key = keys[providerId];
    if (key) {
      try {
        await navigator.clipboard.writeText(key);
        alert("API key copied to clipboard!");
      } catch {
        alert("Failed to copy API key to clipboard.");
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-void-text-muted">
            Customize your VoidAI workspace
          </p>
        </header>

        {/* API Keys Section */}
        <section className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Key Management</h2>
          <p className="text-void-text-muted mb-6">
            Store your AI provider API keys locally in your browser. Keys are never sent to our servers.
          </p>

          {/* Provider Selector */}
          <div className="mb-6">
            <label htmlFor="provider-select" className="block text-sm font-medium mb-2">
              Select Provider to Manage
            </label>
            <select
              id="provider-select"
              value={activeProvider}
              onChange={(e) => setActiveProvider(e.target.value)}
              className="input-field w-full"
            >
              {PROVIDERS.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.label} {keys[provider.id] ? "(Saved)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Active Provider Key Management */}
          <div className="space-y-4">
            {PROVIDERS.filter((p) => p.id === activeProvider).map((provider) => (
              <div key={provider.id} className="border-b border-void-lighter pb-4 last:border-0 last:pb-0">
                <label htmlFor={`${provider.id}-key`} className="block text-sm font-medium mb-2">
                  {provider.label} API Key
                </label>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <input
                    id={`${provider.id}-key`}
                    type={showKey[provider.id] ? "text" : "password"}
                    value={keys[provider.id] ?? ""}
                    onChange={(e) => handleKeyChange(provider.id, e.target.value)}
                    placeholder="Enter API key (e.g., sk-...)"
                    className="input-field flex-1 min-w-[200px]"
                  />
                  <Button
                    onClick={() => handleSave(provider.id)}
                    variant="primary"
                    className="flex-shrink-0"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => handleDelete(provider.id)}
                    variant="secondary"
                    className="flex-shrink-0"
                  >
                    Delete
                  </Button>
                </div>

                {/* Masked Key Display with Show/Hide and Copy */}
                {keys[provider.id] && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-void-text-muted">
                      Stored key:{" "}
                      <span className="font-mono">
                        {showKey[provider.id]
                          ? keys[provider.id]
                          : (keys[provider.id]?.length ?? 0) >= 4
                            ? `${keys[provider.id]!.slice(0, 4)}••••••••`
                            : "••••••••"}
                      </span>
                    </p>
                    <button
                      onClick={() => toggleShowKey(provider.id)}
                      className="text-xs text-void-accent hover:underline"
                    >
                      {showKey[provider.id] ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => copyToClipboard(provider.id)}
                      className="text-xs text-void-accent hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-2 mt-4">
              <Button onClick={handleClearAll} variant="secondary">
                Clear All API Keys
              </Button>
            </div>
          </div>
        </section>

        {/* Theme Section */}
        <section className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Theme Settings</h2>
          <p className="text-void-text-muted mb-2">
            Current theme: <span className="font-medium text-void-text">{theme}</span>
          </p>
          <div className="mb-4">
            <label htmlFor="theme-select" className="block text-sm font-medium mb-2">
              Select Theme
            </label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="input-field w-full"
            >
              {THEMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-void-text-muted text-sm">
            Or customize via the{" "}
            <a href="/onboarding" className="text-void-accent hover:underline">
              onboarding theme selection page
            </a>
          </p>
        </section>

        {/* Language Section (Placeholder) */}
        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Language Preferences</h2>
          <p className="text-void-text-muted mb-4">
            Select your preferred language (placeholder - full localization coming soon)
          </p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-field w-full"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
        </section>
      </div>
    </div>
  );
}
