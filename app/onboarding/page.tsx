"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "../components/ThemeProvider";
import Button from "@/app/components/ui/button";

const themes = [
  {
    name: "Void Dark",
    value: "dark",
    bg: "bg-void-bg",
    light: "bg-void-light",
    accent: "text-void-accent",
    description: "Default dark theme with deep purples and dark backgrounds"
  },
  {
    name: "Light Mode",
    value: "light",
    bg: "bg-white",
    light: "bg-gray-100",
    accent: "text-indigo-600",
    description: "Clean light theme for daytime use"
  },
  {
    name: "Ocean Blue",
    value: "ocean",
    bg: "bg-blue-900",
    light: "bg-blue-800",
    accent: "text-blue-400",
    description: "Calm blue theme reminiscent of deep ocean waters"
  },
  {
    name: "Forest Green",
    value: "forest",
    bg: "bg-green-900",
    light: "bg-green-800",
    accent: "text-green-400",
    description: "Natural green theme inspired by forest landscapes"
  },
  {
    name: "Sunset Orange",
    value: "sunset",
    bg: "bg-orange-900",
    light: "bg-orange-800",
    accent: "text-orange-400",
    description: "Warm orange theme like a beautiful sunset"
  },
  {
    name: "System Default",
    value: "system",
    bg: "bg-gray-100",
    light: "bg-gray-200",
    accent: "text-gray-700",
    description: "Follow your device's theme settings"
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setTheme } = useTheme();

  const handleThemeSelect = (themeValue: string) => {
    setTheme(themeValue);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-2 text-center">Choose Your Theme</h1>
        <p className="text-lg text-center mb-8 text-[var(--void-text-muted)]">
          Select a theme that suits your style
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.value}
              className={`rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                theme.value === "dark" 
                  ? "border-[var(--void-accent)]" 
                  : "border-gray-300 dark:border-gray-600"
              } hover:shadow-lg`}
            >
              <div className={`h-32 ${theme.bg} flex items-center justify-center`}>
                <span className={`text-xl font-bold ${theme.accent}`}>
                  {theme.name}
                </span>
              </div>
              <div className="p-4 bg-[var(--void-light)]">
                <h3 className="font-semibold mb-1">{theme.name}</h3>
                <p className="text-sm text-[var(--void-text-muted)] mb-4">
                  {theme.description}
                </p>
                <Button
                  onClick={() => handleThemeSelect(theme.value)}
                  className="w-full"
                  variant="primary"
                >
                  Select Theme
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
