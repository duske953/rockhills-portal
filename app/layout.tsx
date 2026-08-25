import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Syne } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});
export const metadata: Metadata = {
  title: 'Rockhills portal',
  description: 'Welcome to Rockhills portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${syne.className} antialiased`}>
        <NextTopLoader />
        <Toaster
          className="pointer-events-auto"
          style={{ fontFamily: 'inherit' }}
        />
        {children}
      </body>
    </html>
  );
}
