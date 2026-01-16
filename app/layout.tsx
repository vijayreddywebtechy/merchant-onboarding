import type { Metadata } from "next";
// @ts-ignore: side-effect import of global CSS without type declarations
import "./globals.css";
import { bentonSansPro } from "./fonts";
import { QueryProvider } from "@/providers/QueryProvider";
import TokenRefreshProvider from "@/components/TokenRefreshProvider";

export const metadata: Metadata = {
  title: "Merchant Onboarding",
  description: "Merchant Onboarding Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bentonSansPro.variable}>
      <body className={`${bentonSansPro.className} antialiased`}>
        <QueryProvider>
          <TokenRefreshProvider>
            {children}
          </TokenRefreshProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
