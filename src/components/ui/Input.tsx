"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  darkMode?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, darkMode = true, className = "", ...props }, ref) => {
    const inputBase =
      "w-full rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-gray-400";

    const inputStyles = darkMode
      ? "bg-[#1a2a1a] border border-[#2d4a2d] text-white focus:ring-[#4ade80] focus:border-[#4ade80]"
      : "bg-white border border-gray-200 text-gray-900 focus:ring-[#4ade80] focus:border-[#4ade80]";

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${inputBase} ${inputStyles} ${
            error ? "border-red-500 focus:ring-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
