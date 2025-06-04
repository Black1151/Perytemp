import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";

const handler = NextAuth({
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      authorization: {
        params: {
          authorizationUrl: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`,
          tokenUrl: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
          scope: "openid profile email User.Read",
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/azure-ad`,
        },
      },
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,

      async profile(profile, tokens) {

        const decodedToken = tokens.id_token
            ? JSON.parse(Buffer.from(tokens.id_token.split(".")[1], "base64").toString())
            : null;

        return {
          id: profile.sub,
          name: profile.name || decodedToken?.name || null,
          email: profile.email || decodedToken?.email || decodedToken?.preferred_username || decodedToken?.upn || null,
          image: profile.picture || null,
          tenantId: decodedToken?.tid || null,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ["none"],
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID!,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email" } },
    }),
  ],
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        httpOnly: false,
        sameSite: "none",
        path: "/",
        secure: true,
      },
    },
  },
  session: {
    strategy: "jwt",
  },
  events: {
    async signOut() {},
  },
  pages: {
    signIn: "auth/sign-in",
    signOut: "auth/sign-out",
    error: '/not-found'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith("/") ? new URL(url, baseUrl).toString() : url;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.accountProvider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }
      if (token && typeof token.idToken === "string") {
        session.idToken = token.idToken;
      }
      if (token && typeof token.accountProvider === "string") {
        session.accountProvider = token.accountProvider;
      }
      if (token && typeof token.providerAccountId === "string") {
        session.providerAccountId = token.providerAccountId;
      }

      // Return the modified session object
      return session;
    },
  },
});

export { handler as GET, handler as POST };
