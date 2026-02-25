import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Codebasics Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@codebasics.io' },
        accessCode: { label: 'Team Access Code', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const accessCode = credentials?.accessCode;

        // Check 1: Email must be @codebasics.io
        if (!email || !email.endsWith('@codebasics.io')) {
          throw new Error('Only @codebasics.io email addresses are allowed');
        }

        // Check 2: Access code must match
        const validCode = process.env.TEAM_ACCESS_CODE || 'sigma2026';
        if (accessCode !== validCode) {
          throw new Error('Invalid team access code');
        }

        // Return user object (stored in JWT)
        return {
          id: email,
          email: email,
          name: email.split('@')[0],
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'sigma-codebasics-secret-key-change-this',
});

export { handler as GET, handler as POST };
