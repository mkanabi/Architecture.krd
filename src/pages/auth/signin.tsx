import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

interface SignInFormData {
  email: string;
  password: string;
}

const SignInPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/admin/buildings');
      }
    } catch (error) {
      setError('An error occurred during sign in');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 border-4 border-black">
        <h1 className="text-3xl font-mono mb-8 text-center">Admin Sign In</h1>

        {error && (
          <div className="bg-black text-white p-4 mb-6 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block font-mono mb-2">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border-2 border-black p-3 font-mono"
            />
            {errors.email && (
              <span className="text-sm text-black font-mono">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block font-mono mb-2">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full border-2 border-black p-3 font-mono"
            />
            {errors.password && (
              <span className="text-sm text-black font-mono">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 font-mono hover:bg-white hover:text-black border-2 border-black transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;