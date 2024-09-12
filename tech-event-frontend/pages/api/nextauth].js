import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const backendUrl = 'http://localhost:8000/api';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        try {
          const response = await axios.post(`${backendUrl}/auth/login/`, {
            email: credentials.email,
            password: credentials.password,
          });

          const user = response.data;

          if (user && user.token) { 
            return user; 
          }
          // If no user data or token is found
          return null;
        } catch (error) {
          // Provide detailed error messages if needed
          throw new Error(error.response?.data?.message || 'Invalid email or password');
        }
      },
    }),
  ],
  session: {
    jwt: true, // Use JWT to manage session
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token; // Store access token in the JWT token
        token.user = user; // Store the user object in the token if needed
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // Attach the access token to the session
      session.user = token.user; // Make user info available in the session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return '/communities'; // Redirect to the communities page after login
    },
  },
  pages: {
    signIn: '/login', // Custom sign-in page
    error: '/auth/error', // Error redirect page (optional)
  },
});
