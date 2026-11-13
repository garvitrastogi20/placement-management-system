"use client";

import Background from "./Background";

export default function PageContainer({ children }) {
  return (
    <Background>
      <div
        className="
                    mx-auto
                    max-w-7xl
                    px-8
                    py-8
                "
      >
        {children}
      </div>
    </Background>
  );
}
