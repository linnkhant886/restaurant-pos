import { config } from "@/config";
import { CreateDefaultData } from "@/lib/actions/action";
import { prisma } from "@/lib/prisma";
import NextAuth, { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

interface Props {
  user: User | AdapterUser;
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === "admin@foodiepos.com" &&
          credentials?.password === "password123"
        ) {
          return {
            id: "demo-admin",
            name: "Demo Admin",
            email: "admin@foodiepos.com",
            image: "",
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user }: Props) {
      const { email } = user;
      const dbuser = await prisma.users.findFirst({
        where: {
          email: email as string,
        },
      });
      if (!dbuser) {
        await CreateDefaultData(user);
      }
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

