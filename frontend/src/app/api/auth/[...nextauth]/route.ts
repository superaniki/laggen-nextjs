export { GET, POST } from "@/auth";


//export { handlers as GET, handlers as POST } from "@/auth";

/*
import { authOptions } from "@/app/utils/auth";
import NextAuth from "next-auth/next";

const handleÄr = NextAuth(authOptions);

export { handler as GET, handler as POST };
*/

/*
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing google oauth credentials");
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET
    }),
    // ...add more providers here
  ],
  // ...additional NextAuth configuration
})
*/