import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { NotificationProvider } from '@/contexts/NotificationContext';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/toaster';

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <NotificationProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Component {...pageProps} />
          <Toaster />
        </ThemeProvider>
      </NotificationProvider>
    </SessionProvider>
  );
}