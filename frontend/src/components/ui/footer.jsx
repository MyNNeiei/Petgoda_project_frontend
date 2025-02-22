import Image from "next/image";
export default function Footer() {
    return (
        <footer className="bg-[#2A1D16] rounded-sm shadow-sm w-full">
            <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                        <Image src="/logo-petloga-lightmodel.svg" width={500} height={300} alt="light logo" className="h-36" />
                    </a>
                    <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white sm:mb-0">
                        <li>
                            <a href="/" className="hover:underline me-4 md:me-6">About</a>
                        </li>
                        <li>
                            <a href="/hotels" className="hover:underline me-4 md:me-6">Hotels</a>
                        </li>
                        <li>
                            <a href="/" className="hover:underline me-4 md:me-6">Licensing</a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:underline">Contact</a>
                        </li>
                    </ul>
                </div>
                <hr className="my-6 border-white sm:mx-auto lg:my-8" />
                <span className="block text-sm text-white sm:text-center">© 2025 <a href="/" className="hover:underline">Petgoda™</a>. All Rights Reserved.</span>
            </div>
        </footer>
    )
}