"use client";

import Link from "next/link";
import { useState } from "react";
import UniHealthLogo from "@/components/UniHealthLogo";
import { usePathname } from 'next/navigation';

export default function Navbar({ href }: { href?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const linkClass = (href: string) =>
    `text-sm font-medium transition-colors ${
      pathname === href
        ? 'text-[#4ade80]'
        : 'text-gray-300 hover:text-[#4ade80]'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-transparent">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <UniHealthLogo size="sm" showText={false} />
        <span className="text-[#4ade80] font-bold text-lg tracking-widest uppercase">
          UNIHEALTH
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          href="/"
          className={linkClass('/')}
        >
          Home
        </Link>
        <Link
          href="/hospitals"
          className={linkClass('/hospitals')}
        >
          Hospitals
        </Link>
        <Link
          href="/contact"
          className={linkClass('/contact')}
        >
          Contact
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="text-[#4ade80] hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#4ade80]/10"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="bg-[#4ade80] text-[#0a0f0a] hover:bg-[#22c55e] transition-colors text-sm font-semibold px-5 py-2.5 rounded-xl"
        >
          Sign up
        </Link>
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-[#4ade80] p-2"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0d1a0d]/95 backdrop-blur-md border-b border-[#2d4a2d] p-6 flex flex-col gap-4 md:hidden">
          <Link href="/" className="text-gray-300 hover:text-[#4ade80] text-sm font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/hospitals" className="text-gray-300 hover:text-[#4ade80] text-sm font-medium" onClick={() => setMenuOpen(false)}>Hospitals</Link>
          <Link href="/contact" className="text-gray-300 hover:text-[#4ade80] text-sm font-medium" onClick={() => setMenuOpen(false)}>Contact</Link>
          <hr className="border-[#2d4a2d]" />
          <Link href="/login" className="text-[#4ade80] text-sm font-medium" onClick={() => setMenuOpen(false)}>Log in</Link>
          <Link href="/signup" className="bg-[#4ade80] text-[#0a0f0a] text-sm font-semibold px-5 py-2.5 rounded-xl text-center" onClick={() => setMenuOpen(false)}>Sign up</Link>
        </div>
      )}
    </nav>
  );
}
