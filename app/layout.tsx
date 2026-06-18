import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'SDI Command Center', description: 'Operational intelligence platform for SDI' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
