import React from "react";
import { FieldError } from "@/lib/apiClient";

interface FormErrorBannerProps {
  message?: string;
  errors?: FieldError[];
}

// ෆෝම් එක උඩින් සාමාන්‍ය එරර් මැසේජ් හෝ ෆීල්ඩ් එරර්ස් ලැයිස්තුව පෙන්වීමට
export function FormErrorBanner({ message, errors }: FormErrorBannerProps) {
  if (!message && (!errors || errors.length === 0)) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg shadow-sm">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          {message && (
            <p className="text-sm text-red-800 font-medium">{message}</p>
          )}
          {errors && errors.length > 0 && (
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
              {errors.map((err, index) => (
                <li key={index}>
                  <span className="font-semibold capitalize">{err.field}:</span>{" "}
                  {err.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

interface FieldErrorMessageProps {
  message?: string;
}

// තනි ඉන්පුට් ෆීල්ඩ් එකක් යටින් රතු පාටින් එරර් එක පෙන්වීමට
export function FieldErrorMessage({ message }: FieldErrorMessageProps) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600 font-medium">{message}</p>;
}
