import NextAuth, { Session, JWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;  // Access token property (optional)
    idToken?: string;      // ID token property (optional)
    accountProvider?: string; // Account provider (optional)
    providerAccountId?: string; // Provider Account Id (optional)
  }

  interface JWT {
    accessToken?: string;  // Access token property (optional)
    idToken?: string;      // ID token property (optional)
    accountProvider?: string; // Account provider (optional)
    providerAccountId?: string; // Provider Account Id (optional)
  }
}