
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OpeningExperience from "@/components/OpeningExperience";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://desakaduagung.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Desa Kadu Agung | Kecamatan Gunungsari, Kabupaten Serang",
    template: "%s | Desa Kadu Agung",
  },

  description:
    "Website resmi Desa Kadu Agung, Kecamatan Gunungsari, Kabupaten Serang, Banten. Dapatkan informasi terbaru mengenai pemerintahan desa, berita, kegiatan, pelayanan publik, potensi desa, dan informasi masyarakat.",

  keywords: [
    "Desa Kadu Agung",
    "Kadu Agung",
    "Desa Kadu Agung Gunungsari",
    "Kadu Agung Gunungsari",
    "Desa Kadu Agung Serang",
    "Gunungsari Serang",
    "Kabupaten Serang",
    "Pemerintah Desa Kadu Agung",
    "website Desa Kadu Agung",
    "berita Desa Kadu Agung",
    "informasi Desa Kadu Agung",
  ],

  authors: [
    {
      name: "Pemerintah Desa Kadu Agung",
    },
  ],

  creator: "Pemerintah Desa Kadu Agung",
  publisher: "Pemerintah Desa Kadu Agung",

  applicationName: "Website Desa Kadu Agung",

  category: "government",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Desa Kadu Agung",
    title: "Desa Kadu Agung | Kecamatan Gunungsari, Kabupaten Serang",
    description:
      "Website resmi Desa Kadu Agung, Kecamatan Gunungsari, Kabupaten Serang, Banten. Informasi pemerintahan, berita, kegiatan, pelayanan publik, dan potensi desa.",
    images: [
      {
        url: "/images/og-desa-kadu-agung.jpg",
        width: 1200,
        height: 630,
        alt: "Desa Kadu Agung - Kecamatan Gunungsari, Kabupaten Serang",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Desa Kadu Agung | Gunungsari, Serang",
    description:
      "Website resmi Desa Kadu Agung, Kecamatan Gunungsari, Kabupaten Serang, Banten.",
    images: ["/images/og-desa-kadu-agung.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OpeningExperience>{children}</OpeningExperience>
      </body>
    </html>
  );
}