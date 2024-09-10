import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import axios from 'axios';

const backendUrl = 'http://localhost:8000/api';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        try {
          const user = await axios.post(`${backendUrl}/auth/login/`, {
            email: credentials.email,
            password: credentials.password,
          });
          if (user.data) {
            return user.data;
          }
          return null;
        } catch (error) {
          throw new Error('Invalid email or password');
        }
      },
    }),
  ],
  session: {
    jwt: true,
  },
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.accessToken = user.token; // Assuming the token from the backend is called 'token'
      }
      return token;
    },
    async session(session, token) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
