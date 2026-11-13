"use client";

export default function PageContainer({ children, className = "" }) {
  return (
    <div className="w-full">
      <div className={`mx-auto w-full max-w-[1550px] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 ${className}`}>
        {children}
      </div>
    </div>
  );
}
