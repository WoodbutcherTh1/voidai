"use client";

import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses =
    variant === "primary"
      ? "bg-void-accent hover:bg-void-accent/90 text-white focus:ring-void-accent"
      : "bg-void-light hover:bg-void-lighter text-void-text focus:ring-void-accent";

  const sizeClasses =
    size === "sm"
      ? "px-3 py-1 text-sm"
      : size === "lg"
      ? "px-6 py-3 text-lg"
      : "px-4 py-2 text-base";

  return (
    <button
      className={`${base} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
