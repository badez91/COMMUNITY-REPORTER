import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Providers from "@/app/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
          <Navbar />
          <main className="pt-4 max-w-7xl mx-auto px-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
