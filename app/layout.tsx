import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimationProvider from "./providers/AnimationProvider";
import ErrorBoundary from "./providers/ErrorBoundary";

const montserrat = Montserrat({ 
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "КРАН-МОНТАЖ - Грузоподъемное оборудование",
  description: "Изготовление и обслуживание грузоподъемного оборудования",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="overflow-x-hidden">
      <body className={`${montserrat.variable} ${playfair.variable} font-montserrat overflow-x-hidden`}>
        <ErrorBoundary>
          <AnimationProvider>
            <div className="overflow-x-hidden w-full">
              <Navbar />
              <main className="pt-[120px] md:pt-[130px]">{children}</main>
              <Footer />
            </div>
          </AnimationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
