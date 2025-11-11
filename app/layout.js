import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "Vibe Starter",
  description: "Next.js + Clerk + Prisma + Neon starter",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ fontFamily: 'system-ui, sans-serif', padding: '24px' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
