import type { Metadata } from "next";
import { Montserrat, Geist, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import CustomLayout from "@/custom-layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wasan Shopee",
  description: "An ecommerce shop",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        montserrat.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col font-[var(--font-montserrat)]">
        <CustomLayout>{children}</CustomLayout>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
