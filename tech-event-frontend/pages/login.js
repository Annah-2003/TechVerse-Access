import { signIn, useSession } from 'next-auth/client';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [session, loading] = useSession();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (session) {
    router.push('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res.error) {
      alert(res.error);
    } else {
      router.push('/');
    }
  };

  
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn('google')}>Sign in with Google</button>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
