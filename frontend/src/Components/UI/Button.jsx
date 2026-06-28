import React from "react";

export default function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
  ...props
}) {
  const baseStyles =
    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/10 focus:ring-blue-500",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-300",
    danger:
      "bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/10 focus:ring-rose-500",
    outline:
      "border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
