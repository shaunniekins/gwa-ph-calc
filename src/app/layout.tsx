import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GWA Calculator (Philippines)",
  description:
    "Calculate your General Weighted Average (GWA) using the Philippine grading system",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-blue-600 text-white py-4 px-8 shadow-md">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">GWA Calculator (Philippines)</h1>
            <a
              href="https://github.com/shaunniekins/gwa-ph-calc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </div>
        </header>

        <main className="min-h-screen bg-gray-50">{children}</main>

        <footer className="bg-white py-6 px-8 border-t">
          <div className="max-w-4xl mx-auto text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} GWA Calculator (Philippines)</p>
            <p className="mt-1">
              Built with Next.js for Philippine university students
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
