/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RoleGate from '@/components/RoleGate';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch {
      toast.error('Credenciales inválidas');
    }
  };

  return (
    <RoleGate public>
    <div className="vr-card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1 className="vr-title">Ingresar</h1>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <input className="vr-input" placeholder="Email" {...register('email', { required: true })} />
        <input className="vr-input" type="password" placeholder="Contraseña" {...register('password', { required: true, minLength: 8 })} />
        <button className="vr-btn" type="submit">Entrar</button>
      </form>
    </div>
    </RoleGate>
  );
}
