import { config } from "@/config";
import { CreateDefaultData } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import NextAuth, { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

interface Props {
  user: User | AdapterUser;
}

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
    }),
    // ...add more providers here
  ],
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
