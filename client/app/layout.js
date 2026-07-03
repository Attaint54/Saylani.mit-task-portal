import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Toaster } from 'react-hot-toast';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Saylani Mass IT Hub',
  description: 'Campus Portal for Saylani Mass IT Training Program',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '0.9rem',
            },
          }}
        />
      </body>
    </html>
  );
}
