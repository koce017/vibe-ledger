import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <h1>Vibe Starter — it works 🎉</h1>
      <p style={{marginTop: 8}}>Next.js + Clerk + Prisma + Neon</p>

      <div style={{marginTop: 16}}>
        <SignedOut>
          <SignInButton mode="modal">
            <button>Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </main>
  );
}
