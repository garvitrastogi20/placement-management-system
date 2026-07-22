"use client";

export default function PageContainer({ children }) {

    return (

        <main className="ml-72 min-h-screen bg-slate-950">

            <div className="mx-auto max-w-7xl px-10 py-8">

                {children}

            </div>

        </main>

    );

}