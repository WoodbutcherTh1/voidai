"use client";

import {
  getApiKeys,
  setApiKey,
  removeApiKey,
  clearApiKeys,
} from "@/app/lib/storage";
import {
  getPreferredLanguage,
  setPreferredLanguage,
  LANGUAGE_LABELS,
  type LanguageCode,
} from "@/app/lib/preferences";
import { useState, useEffect, useMemo } from "react";
import Button from "@/app/components/ui/button";
import {
  AVAILABLE_THEMES,
  useTheme,
  type ThemeName,
} from "@/app/components/ThemeProvider";
import { useToast } from "@/app/components/Toast";

const PROVIDERS = [
  { id: "openrouter", label: "OpenRouter" },
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "gemini", label: "Gemini" },
  { id: "groq", label: "Groq" },
  { id: "ollama", label: "Ollama" },
];

const THEME_PREVIEWS: Record<ThemeName, string> = {
  dark: "linear-gradient(135deg, #0b1220, #7c3aed)",
  light: "linear-gradient(135deg, #f8fafc, #a855f7)",
  ocean: "linear-gradient(135deg, #082f49, #38bdf8)",
  forest: "linear-gradient(135deg, #064e3b, #34d399)",
  sunset: "linear-gradient(135deg, #7c2d12, #fb923c)",
  system: "linear-gradient(135deg, #0b1220, #f8fafc)",
};

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { showToast } = useToast();

  const [keys, setKeys] = useState<Record<string, string>>({});
  const [savedKeys, setSavedKeys] = useState<Record<string, string>>({});
  const [activeProvider, setActiveProvider] = useState<string>("openrouter");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  // Load stored values on mount.
  useEffect(() => {
    const storedKeys = getApiKeys();
    setKeys(storedKeys);
    setSavedKeys(storedKeys);
    setLanguage(getPreferredLanguage());
  }, []);

  const currentKey = keys[activeProvider] ?? "";
  const savedKey = savedKeys[activeProvider] ?? "";
  const isDirty = currentKey.trim() !== savedKey;
  const canSave = currentKey.trim().length > 0 && isDirty;

  const provider = useMemo(
    () => PROVIDERS.find((p) => p.id === activeProvider)!,
    [activeProvider]
  );

  const handleKeyChange = (value: string) => {
    setKeys((prev) => ({ ...prev, [activeProvider]: value }));
  };

  const handleSave = () => {
    const key = (keys[activeProvider] ?? "").trim();
    if (!key) {
      showToast("Please enter a valid key.", "error");
      return;
    }
    setApiKey(activeProvider, key);
    setSavedKeys((prev) => ({ ...prev, [activeProvider]: key }));
    showToast(`${provider.label} API key saved.`, "success");
  };

  const handleDelete = () => {
    if (!savedKeys[activeProvider]) return;
    removeApiKey(activeProvider);
    setSavedKeys((prev) => {
      const u = { ...prev };
      delete u[activeProvider];
      return u;
    });
    setKeys((prev) => {
      const u = { ...prev };
      delete u[activeProvider];
      return u;
    });
    showToast(`${provider.label} API key removed.`, "info");
  };

  const handleClearAll = () => {
    clearApiKeys();
    setKeys({});
    setSavedKeys({});
    showToast("All API keys cleared.", "info");
  };

  const toggleShowKey = () => {
    setShowKey((prev) => ({
      ...prev,
      [activeProvider]: !prev[activeProvider],
    }));
  };

  const copyToClipboard = async () => {
    const key = savedKeys[activeProvider];
    if (!key) return;
    try {
      await navigator.clipboard.writeText(key);
      showToast("API key copied to clipboard.", "success");
    } catch {
      showToast("Failed to copy to clipboard.", "error");
    }
  };

  const handleThemeChange = (next: ThemeName) => {
    setTheme(next);
    showToast(`Theme set to ${next}.`, "success");
  };

  const handleLanguageChange = (next: LanguageCode) => {
    setLanguage(next);
    setPreferredLanguage(next);
    showToast(`Language preference saved: ${LANGUAGE_LABELS[next]}.`, "success");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Settings
          </h1>
          <p className="mt-1 text-sm text-void-text-muted">
            Customize your VoidAI workspace
          </p>
        </header>

        {/* Theme Section */}
        <section className="glass rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-semibold">Appearance</h2>
              <p className="text-sm text-void-text-muted mt-1">
                Active theme:{" "}
                <span className="font-medium text-void-text">{theme}</span>
                {theme === "system" && (
                  <span className="text-void-text-muted">
                    {" "}
                    (resolved: {resolvedTheme})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AVAILABLE_THEMES.map((t) => {
              const active = theme === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => handleThemeChange(t.value)}
                  className={`group relative rounded-xl p-3 text-left border transition-all ${
                    active
                      ? "border-void-accent ring-2 ring-void-accent/40"
                      : "border-void-border hover:border-void-accent/50"
                  }`}
                  aria-pressed={active}
                >
                  <div
                    className="h-16 w-full rounded-lg mb-2 shadow-inner"
                    style={{ background: THEME_PREVIEWS[t.value] }}
                    aria-hidden="true"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t.label}</span>
                    {active && (
                      <span className="text-[10px] uppercase tracking-wide text-void-accent-glow font-semibold">
                        Active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* API Keys Section */}
        <section className="glass rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-1">API Key Management</h2>
          <p className="text-void-text-muted mb-6 text-sm">
            Keys are stored only in your browser&apos;s local storage and are
            never sent to our servers.
          </p>

          {/* Provider Selector */}
          <div className="mb-6">
            <label
              htmlFor="provider-select"
              className="block text-sm font-medium mb-2"
            >
              Provider
            </label>
            <select
              id="provider-select"
              value={activeProvider}
              onChange={(e) => setActiveProvider(e.target.value)}
              className="input-field"
            >
              {PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label} {savedKeys[p.id] ? "✓" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Active Provider Key Management */}
          <div>
            <label
              htmlFor={`${provider.id}-key`}
              className="block text-sm font-medium mb-2"
            >
              {provider.label} API Key
            </label>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input
                id={`${provider.id}-key`}
                type={showKey[activeProvider] ? "text" : "password"}
                value={currentKey}
                onChange={(e) => handleKeyChange(e.target.value)}
                placeholder="sk-..."
                className="input-field flex-1 min-w-[200px] font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
              />
              <Button
                onClick={handleSave}
                variant="primary"
                disabled={!canSave}
              >
                {savedKey ? "Update" : "Save"}
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                disabled={!savedKey}
              >
                Delete
              </Button>
            </div>

            {savedKey && (
              <div className="mt-3 flex items-center gap-3 flex-wrap text-xs text-void-text-muted">
                <span>
                  Stored:{" "}
                  <span className="font-mono">
                    {showKey[activeProvider]
                      ? savedKey
                      : `${savedKey.slice(0, 4)}••••${savedKey.slice(-2)}`}
                  </span>
                </span>
                <button
                  onClick={toggleShowKey}
                  className="text-void-accent-glow hover:underline"
                >
                  {showKey[activeProvider] ? "Hide" : "Show"}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="text-void-accent-glow hover:underline"
                >
                  Copy
                </button>
              </div>
            )}
          </div>

          {Object.keys(savedKeys).length > 0 && (
            <div className="mt-6 pt-4 border-t border-void-border">
              <Button onClick={handleClearAll} variant="outline" size="sm">
                Clear all API keys
              </Button>
            </div>
          )}
        </section>

        {/* Language Section */}
        <section className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-1">Language Preference</h2>
          <p className="text-void-text-muted mb-4 text-sm">
            VoidAI auto-detects your language, but will fall back to this when
            the message is ambiguous.
          </p>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
            className="input-field"
          >
            {(Object.keys(LANGUAGE_LABELS) as LanguageCode[]).map((code) => (
              <option key={code} value={code}>
                {LANGUAGE_LABELS[code]}
              </option>
            ))}
          </select>
        </section>
      </div>
    </div>
  );
}
