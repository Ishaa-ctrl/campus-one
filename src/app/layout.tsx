import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'CampusOne - Your College, One Platform',
  description: 'CampusOne brings common student needs into one platform: Academic Notes, Student Marketplace, Lost & Found, Student Profiles, and College Community.',
  keywords: ['campus', 'college', 'students', 'notes', 'marketplace', 'lost and found'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#171923',
              color: '#fff',
              borderRadius: '14px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: 500,
            },
            success: {
              iconTheme: {
                primary: '#2E9B68',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#D9534F',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
