import { Metadata, Viewport } from 'next';
import Script from 'next/script';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F7C63',
};

export const metadata: Metadata = {
  // The root layout's title template appends "| Asif Bhuiyan Shawon".
  title: 'AI-Powered CGPA Calculator',
  description: 'Calculate your CGPA instantly with our AI-powered tool. Upload your grade sheet and let advanced AI extract courses automatically. Get detailed insights with grade point calculations, export to PDF, and manage your academic performance efficiently.',
  keywords: [
    'CGPA calculator',
    'GPA calculator', 
    'AI grade extraction',
    'academic calculator',
    'grade point average',
    'university calculator',
    'college GPA',
    'grade sheet analyzer',
    'academic performance',
    'transcript analyzer',
    'WithShawon tools'
  ],
  authors: [{ name: 'Asif Bhuiyan Shawon', url: 'https://withshawon.vercel.app' }],
  creator: 'Asif Bhuiyan Shawon',
  publisher: 'WithShawon',
  openGraph: {
    title: 'AI-Powered CGPA Calculator | WithShawon',
    description: 'Calculate your CGPA instantly with our AI-powered tool. Upload your grade sheet and let advanced AI extract courses automatically. Get detailed insights with grade point calculations.',
    url: 'https://withshawon.vercel.app/hello/tools/calculate-cgpa',
    siteName: 'WithShawon',
    images: [
      {
        url: 'https://withshawon.vercel.app/assets/cgpa-calculator-preview.svg',
        width: 1200,
        height: 630,
        alt: 'AI-Powered CGPA Calculator - Upload grade sheets and calculate CGPA automatically',
        type: 'image/svg+xml',
      },
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'CGPA Calculator - Academic Performance Tool',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI-Powered CGPA Calculator | WithShawon',
    description: 'Calculate your CGPA instantly with AI. Upload grade sheets, get automatic course extraction, and detailed performance insights.',
    images: [
      'https://withshawon.vercel.app/assets/cgpa-calculator-preview.svg',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop&q=80'
    ],
    creator: '@AsifShawon',
    site: '@WithShawon',
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
  alternates: {
    canonical: 'https://withshawon.vercel.app/hello/tools/calculate-cgpa',
  },
  category: 'education',
  classification: 'Educational Tool',
  other: {
    'application-name': 'CGPA Calculator',
    'msapplication-TileColor': '#0F7C63',
    'msapplication-config': '/assets/browserconfig.xml',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI-Powered CGPA Calculator',
  description: 'Calculate your CGPA instantly with our AI-powered tool. Upload your grade sheet and let advanced AI extract courses automatically.',
  url: 'https://withshawon.vercel.app/hello/tools/calculate-cgpa',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Asif Shawon',
    url: 'https://withshawon.vercel.app',
  },
  publisher: {
    '@type': 'Organization',
    name: 'WithShawon',
    url: 'https://withshawon.vercel.app',
  },
  featureList: [
    'AI-powered course extraction from grade sheets',
    'Real-time CGPA calculations',
    'Support for PDF, PNG, JPG uploads',
    'Manual course entry with modal interface',
    'Course search and filtering',
    'PDF report export',
    'Mobile responsive design',
    'Grade point visualization'
  ],
  screenshot: 'https://withshawon.vercel.app/assets/cgpa-calculator-preview.svg',
  softwareVersion: '1.0',
  dateCreated: '2025-01-15',
  dateModified: '2025-01-15',
};

export default function CgpaCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="cgpa-calculator-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
