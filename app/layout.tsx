import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'DevPulse - DevOps & AI Project Workspace',
  description: 'Smart project management platform tailored for Junior DevOps and AI Developers featuring IaC tracking, CI/CD pipelines, MLOps experiment runs, GPU cluster compute management, and intelligent automation.',
  openGraph: {
    title: 'DevPulse - DevOps & AI Project Workspace',
    description: 'Smart project management platform tailored for Junior DevOps and AI Developers featuring IaC tracking, CI/CD pipelines, MLOps experiment runs, GPU cluster compute management, and intelligent automation.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevPulse - DevOps & AI Project Workspace',
    description: 'Smart project management platform tailored for Junior DevOps and AI Developers.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
