import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimationProvider from "./providers/AnimationProvider";
import ErrorBoundary from "./providers/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="ru">
      <body className={inter.className}>
        <ErrorBoundary>
          <AnimationProvider>
            <Navbar />
            <main className="pt-[80px] md:pt-[90px]">{children}</main>
            <Footer />
          </AnimationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
