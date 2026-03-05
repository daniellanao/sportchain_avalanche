import type { Metadata } from "next";
import { Open_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import Footer from "./components/Footer";

config.autoAddCss = false;

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-open-sans',
})

// Montserrat solo para títulos
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: {
    default: "SportChain | Plataforma de inversión en infraestructura deportiva",
    template: "%s | SportChain"
  },
  description: "Plataforma para invertir y recibir ganancias mediante la operación de instalaciones deportivas en toda Latinoamérica.",
  keywords: ["sportchain", "inversión deportiva", "complejos deportivos", "latinoamérica", "deportes", "pádel", "fútbol", "tenis", "entrenamientos", "partidos sueltos"],
  authors: [{ name: "SportChain" }],
  creator: "SportChain",
  publisher: "SportChain",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sportchain.io'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://sportchain.io',
    title: 'SportChain | Plataforma de inversión en infraestructura deportiva',
    description: 'Plataforma para invertir y recibir ganancias mediante la operación de instalaciones deportivas en toda Latinoamérica.',
    siteName: 'SportChain',
    images: [
      {
        url: '/sportchain_og.png',
        width: 1200,
        height: 630,
        alt: 'SportChain - Plataforma de inversión en infraestructura deportiva',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportChain | Plataforma de inversión en infraestructura deportiva',
    description: 'Plataforma para invertir y recibir ganancias mediante la operación de instalaciones deportivas en toda Latinoamérica.',
    images: ['/sportchain_og.png'],
    creator: '@sportchain',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} ${montserrat.variable} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
