import { LoginForm } from '@/components/auth/login-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Hospital Service Platform',
  description: 'Sign in to your hospital service account',
};

export default function LoginPage() {
  return <LoginForm />;
}
