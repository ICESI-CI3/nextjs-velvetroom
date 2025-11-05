/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { register: reg, handleSubmit } = useForm();
  const { register: registerUser } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address, // ✅ se envía al backend
      });
      toast.success('Cuenta creada. Inicia sesión.');
      router.push('/login');
    } catch (err) {
      toast.error('No se pudo registrar. Verifica tus datos.');
      console.error(err);
    }
  };

  return (
    <div className="vr-card" style={{ maxWidth: 480, margin: '40px auto' }}>
      <h1 className="vr-title" style={{ textAlign: 'center', marginBottom: 10 }}>Registrar usuario</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12 }}>
        <input className="vr-input" placeholder="Nombre completo" {...reg('name', { required: true })} />
        <input className="vr-input" type="email" placeholder="Correo electrónico" {...reg('email', { required: true })} />
        <input className="vr-input" type="password" placeholder="Contraseña (mínimo 8 caracteres)" {...reg('password', { required: true, minLength: 8 })} />
        <input className="vr-input" placeholder="Dirección" {...reg('address', { required: true })} />
        <button className="vr-btn" type="submit">Registrar</button>
      </form>
    </div>
  );
}
