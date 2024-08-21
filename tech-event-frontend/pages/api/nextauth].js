// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import axios from 'axios';

const backendUrl = 'http://localhost:8000/api';

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      authorize: async (credentials) => {
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
    Providers.Google({
      clientId: 'your_google_client_id',
      clientSecret: 'your_google_client_secret',
    }),
  ],
  session: {
    jwt: true,
  },
  jwt: {},
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.accessToken = user.key;
      }
      return token;
    },
    async session(session, token) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
