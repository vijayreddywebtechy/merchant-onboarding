import Footer from "@/components/ui/layout/Footer";
import Header from "@/components/ui/layout/Header";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50">
        <Header />
      </header>

      <main className="flex-1 bg-gray-100">{children}</main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
