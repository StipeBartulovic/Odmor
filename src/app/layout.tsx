import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono'; // geist/font/mono is not installed
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const geistSans = GeistSans;
// const geistMono = GeistMono; // geist/font/mono is not installed

export const metadata: Metadata = {
  title: 'Stibar - Your Personal Travel Assistant',
  description: 'Generate personalized travel itineraries with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
