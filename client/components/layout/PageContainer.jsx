"use client";

export default function PageContainer({ children }) {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-[1550px] px-8 py-8 lg:px-10">
        {children}
      </div>
    </div>
  );
}
