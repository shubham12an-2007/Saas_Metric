import React from "react";

export default function Card({ children, title, className = "", ...props }) {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm flex flex-col justify-between ${className}`}
      {...props}
    >
      {title && (
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
            {title}
          </h3>
        </div>
      )}
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
