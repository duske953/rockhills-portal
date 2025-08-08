import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { Ubuntu } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
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
      <body className={`${ubuntu.className} antialiased`}>
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
