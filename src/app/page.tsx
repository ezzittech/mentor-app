"use client";

/**
 * Root index page — renders the homepage directly.
 * In static export mode, redirect() doesn't work at build time,
 * so we render the homepage content here directly.
 */

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import HomePage from "./(public)/page";

export default function RootPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}
