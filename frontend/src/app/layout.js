import "./globals.css";

export const metadata = {
  title: "Petgoda_Project",
  description: "Find Hotel For Your Lovely Pet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
