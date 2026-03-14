import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Outlet } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
}

/**
 * Main layout wrapper that includes Navbar and Footer
 * All pages use this layout for consistent navigation
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-full">
      <Navbar />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
