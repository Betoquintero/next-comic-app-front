import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './context/AuthContext'
import Navbar from '../app/components/NavBar'
import Footer from '../app/components/Footer'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://houseofheroes.dev'),
  title: 'Super Heroes Legacy',
  description: 'Best guide for reading comics from Marvel, DC, and beyond!',
  keywords: 'Comics, DC Comics, Marvel, Comic Reading Guide, Reading Order, Super Heroes Legacy, Comic Events, Comic Issues, Superheroes',
  openGraph: {
    title: 'Super Heroes Legacy - Discover the World of Comics',
    description: 'Your ultimate comic reading guide for Marvel, DC, and more.',
    url: 'https://houseofheroes.dev',
    siteName: 'Super Heroes Legacy',
    images: [
      {
        url: '/img/super-heroes-legacy-logo.png',
        width: 800,
        height: 600,
        alt: 'Super Heroes Legacy Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/img/favicon.ico" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <Navbar /> 
          <div className="pt-16 flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <GoogleAnalytics gaId="G-LJ6RHS9N37" />
      </body>
    </html>
  );
}
