import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/authcalendar.events",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token; // eslint-disable-line no-param-reassign
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken; // eslint-disable-line no-param-reassign
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
