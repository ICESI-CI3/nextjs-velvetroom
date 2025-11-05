// src/app/layout.tsx
'use client';
import './globals.css';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';

// ✅ Declaramos AppContent como componente CLIENTE explícitamente
import { useAuth } from '@/contexts/AuthContext';
function AppContent({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading)
    return (
      <div style={{ textAlign: 'center', marginTop: '20vh' }}>
        Cargando Velvet Room...
      </div>
    );

  return (
    <>
      <Navbar />
      <main style={{ padding: 16 }}>{children}</main>
      <Toaster richColors position="top-right" />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      {/* 👇 suprime diferencias entre SSR y cliente */}
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}
