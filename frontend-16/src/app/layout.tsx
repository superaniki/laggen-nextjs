import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './providers';
import Header from '@/components/header/header';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Laggen',
    description: 'Plan editor for handcrafted barrels.',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Toaster />
          <div className="flex content-start flex-wrap h-screen w-screen overflow-x-hidden">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}

/*
  <div className="main-container flex content-start flex-wrap h-screen w-screen [font-family:_helvetica] overflow-x-hidden ">
        <div className=" bg-yellow-300 w-full h-full bg-forest-gradient fixed z-[-1]" />
*/