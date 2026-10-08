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
  title: 'House of Heroes',
  description: 'Best guide for reading comics from Marvel, DC, and beyond!',
  keywords: 'Comics, DC Comics, Marvel, Comic Reading Guide, Reading Order, House of Heroes, Comic Events, Comic Issues, Superheroes',
  openGraph: {
    title: 'House of Heroes - Discover the World of Comics',
    description: 'Your ultimate comic reading guide for Marvel, DC, and more.',
    url: 'https://houseofheroes.dev',
    siteName: 'House of Heroes',
    images: [
      {
        url: '/img/marvel-dc-home.png',
        width: 1798,
        height: 291,
        alt: 'House of Heroes - DC and Marvel reading orders',
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
