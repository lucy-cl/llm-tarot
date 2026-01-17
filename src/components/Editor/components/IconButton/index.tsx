import React, { forwardRef } from "react";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  isActive?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, isActive, className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={`w-8 h-8 rounded-[50%] box-border flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 shrink-0 ${
          isActive ? "bg-blue-50 border-blue-500 text-blue-500" : ""
        } ${className}`}
        {...props}
      >
        <div className="w-4 h-4 flex items-center justify-center">{icon}</div>
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
