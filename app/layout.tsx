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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="description" content="Report and track local community issues" />
      </head>
      <body className="bg-white min-h-screen">
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
