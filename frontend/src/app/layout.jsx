import "./globals.css";
import Navbar from "../components/navbar/headernav";

import { Mali } from "next/font/google";
const mali = Mali({
  subsets: ["latin"],
  weight: ["400", "700"], // Add available weights
  display: "swap",
});

export const metadata = {
  title: "Petgoda_Project",
  description: "Find Hotel For Your Lovely Pet",
};

export default function RootLayout(props) {
  return (
    <html lang="en">
      <body className={mali.className}>
        <Navbar />
          {props.children}
      </body>
    </html>
  );
}
