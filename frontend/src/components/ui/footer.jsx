import Image from "next/image";
export default function Footer() {
    return (
      <footer className="bg-[#2A1D16] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Logo */}
            <a href="/" className="flex items-center">
              <Image 
                src="/logo-petloga-lightmodel.svg" 
                width={150} 
                height={50} 
                alt="Petgoda Logo" 
                className="h-auto w-auto"
              />
            </a>
  
            {/* Navigation Links */}
            <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <a href="/" className="hover:underline transition">About</a>
              <a href="/hotels" className="hover:underline transition">Hotels</a>
              <a href="/" className="hover:underline transition">Licensing</a>
              <a href="/contact" className="hover:underline transition">Contact</a>
            </nav>
          </div>
  
          {/* Divider */}
          <hr className="my-6 border-gray-600" />
  
          {/* Copyright */}
          <p className="text-center text-sm">
            © 2025 <a href="/" className="hover:underline font-semibold">Petgoda™</a>. All Rights Reserved.
          </p>
        </div>
      </footer>
    );
  }