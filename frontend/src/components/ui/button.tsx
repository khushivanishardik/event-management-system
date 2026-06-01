// FILE: src/components/ui/button.tsx

"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm",
  secondary:
    "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 hover:border-gray-400",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  danger:
    "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-medium
        transition-all duration-200 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
