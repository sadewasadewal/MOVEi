import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomTabBar from '../components/BottomTabBar';

export const metadata: Metadata = {
  title: 'MOVEI 🎬 | Cinema Ticketing Platform',
  description: 'Unified cinema ticketing experience with live seat reservations, Apple Wallet passes, and fast gate scanning.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-black text-gray-900 antialiased">
      <body className="min-h-full flex flex-col bg-black">
        <Navbar />
        <main className="flex-1 w-full pb-20 md:pb-0">
          {children}
        </main>
        <div className="hidden md:block">
          <Footer />
        </div>
        <BottomTabBar />
      </body>
    </html>
  );
}
