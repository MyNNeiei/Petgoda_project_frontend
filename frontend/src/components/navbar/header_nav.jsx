"use client";

import Link from "next/link";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { useState } from "react";

export default function HeaderNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white drop-shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo-petloga1.svg" alt="Petgoda Logo" width={220} height={100} priority
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:block">
            <div className="flex space-x-12">
              <Link href="/" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                About
              </Link>
              <Link href="/hotels" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                Hotels
              </Link>
              <Link href="/contact" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>

          {/* User Icon */}
          <div className="flex items-center">
            <Link href="/login/" passHref>
              <button type="button" className="p-1 rounded-full text-gray-900 hover:text-gray-600 focus:outline-none">
                <span className="sr-only">View profile</span>
                <UserCircle className="h-6 w-6" />
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-gray-600 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-600">
                Home
              </Link>
              <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-600">
                About
              </Link>
              <Link
                href="/hotels"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-600"
              >
                Hotel
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-gray-600">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}