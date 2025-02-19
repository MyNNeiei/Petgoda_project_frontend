import "./globals.css";
import HeaderNavbar from "@/components/navbar/header_nav"

import { Mali } from "next/font/google"
const mali = Mali({ 
  subsets: ["latin"], 
  weight: ["400", "700"], // Add available weights
  display: "swap" 
});
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export const metadata = {
  title: "Petgoda_Project",
  description: "Find Hotel For Your Lovely Pet",
};

export default function RootLayout(props) {
  return (
    <html lang="en">
      <body className={mali.className}>
        <HeaderNavbar />
        <AppRouterCacheProvider options={{ key: 'css' }}>
          {props.children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}