import "./globals.css";

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
          {props.children}
      </body>
    </html>
  );
}
