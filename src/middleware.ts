import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  // Protect everything EXCEPT the login page, API auth routes, and static assets
  matcher: [
    '/((?!login|api/auth|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
