import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://gwaphcalc.shaunniekins.com"),
  title: {
    default: "GWA Calculator Philippines | Compute Your General Weighted Average",
    template: "%s | GWA Calculator"
  },
  description:
    "The most accurate General Weighted Average (GWA) calculator for Philippine university students. Instantly compute your GWA, manage subjects, and save your data.",
  keywords: ["GWA calculator", "GWA Philippines", "General Weighted Average", "college grade calculator", "UP grading system", "calculate GWA", "academic grading"],
  authors: [{ name: "Shaunniekins", url: "https://shaunniekins.com" }],
  creator: "Shaunniekins",
  applicationName: "GWA Calculator Philippines",
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "GWA Calculator Philippines",
    description: "Instantly compute your General Weighted Average (GWA). Built for Philippine university students.",
    url: "https://gwaphcalc.shaunniekins.com",
    siteName: "GWA Calculator",
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GWA Calculator Philippines",
    description: "Instantly compute your General Weighted Average (GWA). Built for Philippine university students.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "/",
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "GWA Calculator Philippines",
      "url": "https://gwaphcalc.shaunniekins.com",
      "author": { "@type": "Person", "name": "Shaunniekins", "url": "https://shaunniekins.com", "sameAs": ["https://github.com/shaunniekins"] },
      "description": "Calculate your General Weighted Average (GWA) effortlessly for Philippine universities.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "PHP"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How is GWA calculated in the Philippines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "General Weighted Average (GWA) is calculated by multiplying the grade of each subject by its corresponding units, summing these products, and then dividing the total by the total number of units. The formula is GWA = Σ (Grade × Units) / Σ Units."
          }
        },
        {
          "@type": "Question",
          "name": "What is a passing GWA in the Philippines?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "In the standard Philippine grading system (1.0 to 5.0), a grade of 3.0 is usually the passing mark, while 1.0 is the highest possible grade (Excellent). A grade of 5.0 indicates a failure."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen md:h-[100svh] flex flex-col md:overflow-hidden`}
      >
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-3 px-4 md:px-8 shrink-0 relative z-30">
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                GWA
              </div>
              <h1 className="text-lg font-bold text-gray-800 hidden sm:block">GWA Calculator <span className="text-gray-400 font-normal">| PH</span></h1>
            </div>
            <a
              href="https://github.com/shaunniekins/gwa-ph-calc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 py-1.5 px-3 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
              </svg>
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </div>
        </header>

        <div className="flex-1 flex md:overflow-hidden bg-gray-50 w-full">{children}</div>

        <footer className="bg-white py-3 px-4 md:px-8 border-t border-gray-200 shrink-0 relative z-30">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center text-gray-500 text-xs gap-2">
            <p>© {new Date().getFullYear()} GWA Calculator</p>
            <p>
              Built with Next.js for Philippine university students
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
