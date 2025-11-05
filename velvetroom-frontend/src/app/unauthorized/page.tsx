'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ErrorPortal() {
  const params = useSearchParams();
  const type = params.get('type') || '403';

  const getMessage = () => {
    switch (type) {
      case '401':
        return {
          title: 'La puerta está cerrada...',
          text: 'No posees una llave válida para entrar a esta sala de la Velvet Room.',
          suggestion: (
            <>
              <p>
                Intenta <Link href="/login" className="vr-btn">iniciar sesión</Link> o crear una nueva llave celestial.
              </p>
            </>
          ),
        };
      case '404':
        return {
          title: 'La sala se desvanece...',
          text: 'El lugar que buscas no existe dentro de los dominios de la Velvet Room.',
          suggestion: (
            <p>
              Tal vez tu destino se encuentra en otro camino. <Link href="/" className="vr-btn">Regresa al inicio</Link>
            </p>
          ),
        };
      default:
        return {
          title: 'Entrada prohibida',
          text: 'El guardián Igor te observa: no estás autorizado para entrar aquí.',
          suggestion: (
            <p>
              Puedes volver a una zona segura. <Link href="/" className="vr-btn">Regresar</Link>
            </p>
          ),
        };
    }
  };

  const { title, text, suggestion } = getMessage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="vr-card"
      style={{
        textAlign: 'center',
        margin: '15vh auto',
        maxWidth: 520,
        padding: '32px 24px',
      }}
    >
      <motion.h1
        className="vr-title"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h1>
      <p style={{ marginTop: 12, color: 'var(--vr-muted)', fontSize: '1.1em' }}>{text}</p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {suggestion}
      </motion.div>
    </motion.div>
  );
}
